import { asyncHandler } from '../utils/AsyncHandler.js';
import { User } from '../models/user.models.js';
import { APIError } from '../utils/ApiError.js';
import validator from 'validator';
import { APIResponse } from '../utils/ApiResponse.js';
import { generateToken } from '../utils/generateToken.js';

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new APIError(400, 'All fields are required');
  }

  if (!validator.isEmail(email)) {
    throw new APIError(400, 'Invalid email address');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new APIError(401, 'User already exists!');
  }

  const user = await User.create({ name, email, password });

  if (!user) {
    throw new APIError(500, 'Something went wrong creating new account');
  }

  return res
    .status(201)
    .json(new APIResponse(201, 'User created successfully', user));
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIError(400, 'All fields are required.');
  }

  if (!validator.isEmail(email)) {
    throw new APIError(400, 'Email is invalid');
  }

  // check if the user exists or not
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new APIError(401, "User doesn't exist.");
  }

  const isPasswordValid = await existingUser.matchPassword(password);

  if (!isPasswordValid) {
    throw new APIError(403, 'Invalid Email or Password.');
  }

  // now user is valid generate token and send response
  const token = generateToken(res, existingUser._id, existingUser.email);
  const user = {
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    token,
  };

  return res
    .status(200)
    .json(new APIResponse(200, 'User logged in successfully', user));
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json(new APIResponse(200, 'User Logged Out'));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new APIError(401, 'Unauthorized. Login Again');
  }
  return res
    .status(200)
    .json(new APIResponse(200, 'Profile fetched successfully', user));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new APIError(404, 'User not found');
  }

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  if (password) {
    user.password = password;
  }

  const saved = await user.save();

  return res.status(200).json(
    new APIResponse(200, 'User updated successfully', {
      _id: saved._id,
      name: saved.name,
      email: saved.email,
    })
  );
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
