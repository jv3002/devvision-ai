import prisma from "../../config/prisma.js";

/* ===============================
   CREATE ORGANIZATION
================================= */
export const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Organization name is required"
      });
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        memberships: {
          create: {
            userId: req.user.userId,
            role: "OWNER"
          }
        }
      }
    });

    res.status(201).json(organization);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating organization"
    });
  }
};

/* ===============================
   GET MY ORGANIZATIONS
================================= */
export const getMyOrganizations = async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        memberships: {
          some: {
            userId: req.user.userId
          }
        }
      }
    });

    res.json(organizations);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching organizations"
    });
  }
};

/* ===============================
   INVITE MEMBER
================================= */
export const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        message: "Email and role are required"
      });
    }

    if (req.user.role !== "OWNER") {
      return res.status(403).json({
        message: "Only OWNER can invite members"
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        organizationId: req.user.organizationId
      }
    });

    if (existingMembership) {
      return res.status(400).json({
        message: "User is already a member"
      });
    }

    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: req.user.organizationId,
        role
      }
    });

    res.status(201).json(membership);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error inviting member"
    });
  }
};