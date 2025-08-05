import jwt from "jsonwebtoken";

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
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token.");
  }
};
