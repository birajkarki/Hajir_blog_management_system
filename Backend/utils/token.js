import jwt from "jsonwebtoken";

const generateJsonWebToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, message, statusCode, res) => {
  const token = generateJsonWebToken(user.id);
<<<<<<< HEAD
=======

>>>>>>> b778e9fe03a3dd69e4632fbe8d51fbe22e59296e
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
<<<<<<< HEAD
  };

  res.cookie("jwt", token, cookieOptions);
  // console.log(res.get("Set-Cookie"));
=======
    secure: true,
    overwrite: true,
    sameSite: "none"
  };

  res.cookie("jwt", token, cookieOptions);
>>>>>>> b778e9fe03a3dd69e4632fbe8d51fbe22e59296e
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    message,
    user,
  });
};

export default createSendToken;
