import prisma from "../config/prisma.js";

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const organizationId = req.organizationId;

      const membership = await prisma.membership.findFirst({
        where: {
          userId,
          organizationId,
        },
      });

      if (!membership) {
        return res.status(403).json({
          message: "Access denied - no membership",
        });
      }

      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          message: "Access denied - insufficient role",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Role validation failed",
      });
    }
  };
};