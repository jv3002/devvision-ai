import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

/* ================================
   PROTECT - Verify JWT Token
================================ */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }
    console.log("AUTH HEADER:", req.headers.authorization);

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        organization: true, // ✅ correcto con tu schema
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
      organizationId: user.organizationId,
    };

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};
/* ================================
   ROLE AUTHORIZATION
================================ */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden - insufficient role",
      });
    }
    next();
  };
};