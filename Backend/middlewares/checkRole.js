export const checkRole = (req, res, next) => {
  console.log("inside checkrole", req.user.roles);
  if (!req.user || req.user.roles !== "superadmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  next();
};
