import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import jwt from "jsonwebtoken"
import { CatchAsync } from '../utils/catchAsync.js';

const protect = CatchAsync(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if(!token) {
        return next(new AppError("Please log in to get access", 400));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    let user = await User.findByPk(decodedToken.id);

    if (!user) {
        return next(
          new AppError('The user belonging to this token no longer exists.', 401)
        );
        
    }

    req.user = user;
    next();
});

export default protect;