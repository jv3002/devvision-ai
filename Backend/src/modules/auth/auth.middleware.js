import jwt from "jsonwebtoken";

console.log("VERIFY SECRET:", process.env.JWT_SECRET);

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 MUY IMPORTANTE
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};