import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Make sure req.user.id exists
    if (!decoded.id) {
      return res.status(401).send("User ID missing from token.");
    }
    req.user = decoded; // decoded should contain id
    console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token.");
  }
};
