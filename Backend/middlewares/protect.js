import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import { CatchAsync } from '../utils/catchAsync.js';
import jwt from "jsonwebtoken";

const protect = CatchAsync(async (req, res, next) => {
  let token;

<<<<<<< HEAD
  token = req.cookies.jwt;
 
=======
  
    token = req.cookies.jwt;
  

  console.log("token", token)
>>>>>>> b778e9fe03a3dd69e4632fbe8d51fbe22e59296e

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
