import { User } from '../models/user.models.js';
import { APIError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import jwt from 'jsonwebtoken';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new APIError(401, 'Token not found! Login again');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken) {
      throw new APIError(401, 'Invalid Token');
    }

    const user = await User.findById(decodedToken.id).select('-password');

    if (!user) {
      throw new APIError(401, 'User not found with received token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new APIError(401, 'Unauthorized Access. No Token');
  }
});
