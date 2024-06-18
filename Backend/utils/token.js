import jwt from "jsonwebtoken";

const generateJsonWebToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
expiresIn: process.env.JWT_EXPIRES_IN,
});
};

const createSendToken = (user, message, statusCode, res) => {
  const token = generateJsonWebToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only set secure in production
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Adjust based on environment
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    message,
    user,
  });
};

export default createSendToken;
