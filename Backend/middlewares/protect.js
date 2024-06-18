import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import { CatchAsync } from '../utils/catchAsync.js';
import jwt from "jsonwebtoken";

const protect = CatchAsync(async (req, res, next) => {
  let token;

  
    token = req.cookies.jwt;
  

  console.log("token", token)

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
