import prisma from "../config/prisma.js";

export const injectTenant = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const membership = await prisma.membership.findFirst({
      where: { userId },
      include: { organization: true },
    });

    if (!membership) {
      return res.status(403).json({
        message: "User does not belong to any organization",
      });
    }

    req.organizationId = membership.organizationId;
    req.organization = membership.organization;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Tenant resolution failed",
    });
  }
};