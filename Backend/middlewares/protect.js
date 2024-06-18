import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import { CatchAsync } from '../utils/catchAsync.js';
import jwt from "jsonwebtoken";

const protect = CatchAsync(async (req, res, next) => {
  let token;

  // Extract token from authorization header or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Not Authorized", 401));
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findByPk(decodedToken.id);

  if (!user) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }

  req.user = user;
  next();
});

export default protect;
