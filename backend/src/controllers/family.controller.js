const prisma = require("../config/prisma");

// Create a new family
const createFamily = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Validate family name
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Family name is required.",
      });
    }

    const familyName = name.trim();

    if (familyName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Family name must be 100 characters or fewer.",
      });
    }

    // Create family and its ADMIN membership in one transaction
    const result = await prisma.$transaction(async (tx) => {
      const family = await tx.family.create({
        data: {
          name: familyName,
        },
      });

      const membership = await tx.familyMember.create({
        data: {
          userId: req.user.id,
          familyId: family.id,
          role: "ADMIN",
        },
      });

      return {
        family,
        membership,
      };
    });

    return res.status(201).json({
      success: true,
      message: "Family created successfully!",
      family: result.family,
      membership: {
        id: result.membership.id,
        userId: result.membership.userId,
        familyId: result.membership.familyId,
        role: result.membership.role,
        createdAt: result.membership.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get families belonging to the authenticated user
const getMyFamilies = async (req, res, next) => {
  try {
    const memberships = await prisma.familyMember.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        family: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const families = memberships.map((membership) => ({
      id: membership.family.id,
      name: membership.family.name,
      createdAt: membership.family.createdAt,
      role: membership.role,
      membershipId: membership.id,
    }));

    return res.status(200).json({
      success: true,
      count: families.length,
      families,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFamily,
  getMyFamilies,
};