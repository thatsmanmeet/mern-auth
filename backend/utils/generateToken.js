import jwt from 'jsonwebtoken';
import { APIError } from './ApiError.js';

export const generateToken = (res, userId, email) => {
  try {
    const payload = { id: userId, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      samesite: 'strict',
    };
    res.cookie('token', token, cookieOptions);
    return token;
  } catch (error) {
    throw new APIError(500, 'Unable to generate token');
  }
};
