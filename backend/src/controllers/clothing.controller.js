const prisma = require("../config/prisma");

// Allowed clothing fields that users can edit.
const EDITABLE_FIELDS = [
  "name",
  "category",
  "color",
  "occasion",
  "imageUrl",
];

const MAX_TEXT_LENGTH = 200;
const MAX_IMAGE_URL_LENGTH = 120000;

// Validate optional text fields.
const validateOptionalText = (
  value,
  fieldName,
  maxLength = MAX_TEXT_LENGTH
) => {
  if (value === undefined || value === null) {
    return { valid: true };
  }

  if (typeof value !== "string") {
    return {
      valid: false,
      message: `${fieldName} must be a string or null.`,
    };
  }

  if (value.length > maxLength) {
    return {
      valid: false,
      message: `${fieldName} must be ${maxLength} characters or fewer.`,
    };
  }

  return { valid: true };
};

// Check whether the logged-in user belongs to a family.
const isFamilyMember = async (familyId, userId) => {
  const membership = await prisma.familyMember.findUnique({
    where: {
      userId_familyId: {
        userId,
        familyId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(membership);
};

// Find clothing that the logged-in user is allowed to access.
//
// Personal clothing:
//   familyId = null AND ownerId = current user
//
// Family clothing:
//   familyId is set AND current user belongs to that family
const findAccessibleClothing = async (clothingId, userId) => {
  return prisma.clothingItem.findFirst({
    where: {
      id: clothingId,
      OR: [
        {
          familyId: null,
          ownerId: userId,
        },
        {
          familyId: {
            not: null,
          },
          family: {
            members: {
              some: {
                userId,
              },
            },
          },
        },
      ],
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
      photos: true,
    },
  });
};

// POST /api/clothes
//
// Creates a personal clothing item.
// Personal clothes always have:
//   familyId = null
//   ownerId = logged-in user
const createPersonalClothing = async (req, res, next) => {
  try {
    const {
      name,
      category,
      color,
      occasion,
      imageUrl,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Clothing name and category are required.",
      });
    }

    if (name.trim().length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Name must be ${MAX_TEXT_LENGTH} characters or fewer.`,
      });
    }

    if (category.trim().length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Category must be ${MAX_TEXT_LENGTH} characters or fewer.`,
      });
    }

    for (const [fieldName, value] of [
      ["color", color],
      ["occasion", occasion],
    ]) {
      const validation = validateOptionalText(value, fieldName);

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }
    }

    const imageValidation = validateOptionalText(
      imageUrl,
      "imageUrl",
      MAX_IMAGE_URL_LENGTH
    );

    if (!imageValidation.valid) {
      return res.status(400).json({
        success: false,
        message: imageValidation.message,
      });
    }

    const clothing = await prisma.clothingItem.create({
      data: {
        familyId: null,
        ownerId: req.user.id,
        name: name.trim(),
        category: category.trim(),
        color:
          typeof color === "string" ? color.trim() || null : null,
        occasion:
          typeof occasion === "string"
            ? occasion.trim() || null
            : null,
        imageUrl:
          typeof imageUrl === "string"
            ? imageUrl.trim() || null
            : null,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        photos: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Personal clothing item added successfully.",
      clothing,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/clothes
//
// Returns only the logged-in user's personal clothes.
const getPersonalClothes = async (req, res, next) => {
  try {
    const clothes = await prisma.clothingItem.findMany({
      where: {
        familyId: null,
        ownerId: req.user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        photos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: clothes.length,
      clothes,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/families/:familyId/clothes
const createFamilyClothing = async (req, res, next) => {
  try {
    const { familyId } = req.params;
    const {
      name,
      category,
      color,
      occasion,
      imageUrl,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Clothing name and category are required.",
      });
    }

    if (name.trim().length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Name must be ${MAX_TEXT_LENGTH} characters or fewer.`,
      });
    }

    if (category.trim().length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Category must be ${MAX_TEXT_LENGTH} characters or fewer.`,
      });
    }

    for (const [fieldName, value] of [
      ["color", color],
      ["occasion", occasion],
    ]) {
      const validation = validateOptionalText(value, fieldName);

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }
    }

    const imageValidation = validateOptionalText(
      imageUrl,
      "imageUrl",
      MAX_IMAGE_URL_LENGTH
    );

    if (!imageValidation.valid) {
      return res.status(400).json({
        success: false,
        message: imageValidation.message,
      });
    }

    const belongsToFamily = await isFamilyMember(
      familyId,
      req.user.id
    );

    if (!belongsToFamily) {
      return res.status(404).json({
        success: false,
        message: "Family not found.",
      });
    }

    const clothing = await prisma.clothingItem.create({
      data: {
        familyId,
        ownerId: req.user.id,
        name: name.trim(),
        category: category.trim(),
        color:
          typeof color === "string" ? color.trim() || null : null,
        occasion:
          typeof occasion === "string"
            ? occasion.trim() || null
            : null,
        imageUrl:
          typeof imageUrl === "string"
            ? imageUrl.trim() || null
            : null,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        photos: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Family clothing item added successfully.",
      clothing,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/families/:familyId/clothes
const getFamilyClothes = async (req, res, next) => {
  try {
    const { familyId } = req.params;

    const belongsToFamily = await isFamilyMember(
      familyId,
      req.user.id
    );

    if (!belongsToFamily) {
      return res.status(404).json({
        success: false,
        message: "Family not found.",
      });
    }

    const clothes = await prisma.clothingItem.findMany({
      where: {
        familyId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        photos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: clothes.length,
      clothes,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/clothes/:id
const updateClothing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hasEditableField = EDITABLE_FIELDS.some((field) =>
      Object.prototype.hasOwnProperty.call(req.body, field)
    );

    if (!hasEditableField) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update.",
      });
    }

    const data = {};

    for (const field of EDITABLE_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(req.body, field)) {
        continue;
      }

      const value = req.body[field];

      if (field === "name" || field === "category") {
        if (
          typeof value !== "string" ||
          !value.trim() ||
          value.trim().length > MAX_TEXT_LENGTH
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a non-empty string of at most ${MAX_TEXT_LENGTH} characters.`,
          });
        }

        data[field] = value.trim();
        continue;
      }

      const maxLength =
        field === "imageUrl"
          ? MAX_IMAGE_URL_LENGTH
          : MAX_TEXT_LENGTH;

      const validation = validateOptionalText(
        value,
        field,
        maxLength
      );

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }

      data[field] =
        typeof value === "string"
          ? value.trim() || null
          : null;
    }

    const existingClothing = await findAccessibleClothing(
      id,
      req.user.id
    );

    if (!existingClothing) {
      return res.status(404).json({
        success: false,
        message: "Clothing item not found.",
      });
    }

    // Personal clothing can only be edited by its owner.
    // Family clothing can be edited by a family member.
    if (
      existingClothing.familyId === null &&
      existingClothing.ownerId !== req.user.id
    ) {
      return res.status(404).json({
        success: false,
        message: "Clothing item not found.",
      });
    }

    const clothing = await prisma.clothingItem.update({
      where: {
        id,
      },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        photos: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Clothing item updated successfully.",
      clothing,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/clothes/:id
const deleteClothing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingClothing = await findAccessibleClothing(
      id,
      req.user.id
    );

    if (!existingClothing) {
      return res.status(404).json({
        success: false,
        message: "Clothing item not found.",
      });
    }

    // Personal items are owner-only.
    if (
      existingClothing.familyId === null &&
      existingClothing.ownerId !== req.user.id
    ) {
      return res.status(404).json({
        success: false,
        message: "Clothing item not found.",
      });
    }

    await prisma.clothingItem.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Clothing item deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/clothes/:id/favorite
const toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingClothing = await findAccessibleClothing(
      id,
      req.user.id
    );

    if (!existingClothing) {
      return res.status(404).json({
        success: false,
        message: "Clothing item not found.",
      });
    }

    // Personal items are owner-only.
    if (
      existingClothing.familyId === null &&
      existingClothing.ownerId !== req.user.id
    ) {
      return res.status(404).json({
        success: false,
        message: "Clothing item not found.",
      });
    }

    const clothing = await prisma.clothingItem.update({
      where: {
        id,
      },
      data: {
        favorite: !existingClothing.favorite,
      },
      select: {
        id: true,
        familyId: true,
        ownerId: true,
        name: true,
        favorite: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: clothing.favorite
        ? "Clothing item added to favorites."
        : "Clothing item removed from favorites.",
      clothing,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPersonalClothing,
  getPersonalClothes,
  createFamilyClothing,
  getFamilyClothes,
  updateClothing,
  deleteClothing,
  toggleFavorite,
};