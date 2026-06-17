import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user not found",
      });
    }

    // 🔥 Aquí definimos los datos que usará todo el sistema
    req.user = {
      userId: user.id,
      role: user.memberships[0]?.role,
      organizationId: user.memberships[0]?.organizationId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};

export default protect;