const express = require("express");

const authenticateToken = require("../middleware/auth.middleware");

const {
  createPersonalClothing,
  getPersonalClothes,
  createFamilyClothing,
  getFamilyClothes,
  updateClothing,
  deleteClothing,
  toggleFavorite,
} = require("../controllers/clothing.controller");

const router = express.Router();

// All clothing endpoints require authentication.
router.use(authenticateToken);

// --------------------------------------------------
// PERSONAL WARDROBE
// --------------------------------------------------

// Add a personal clothing item.
router.post("/clothes", createPersonalClothing);

// Get only the logged-in user's personal clothes.
router.get("/clothes", getPersonalClothes);

// --------------------------------------------------
// FAMILY WARDROBE
// --------------------------------------------------

// Add a clothing item to a family.
router.post(
  "/families/:familyId/clothes",
  createFamilyClothing
);

// Get clothes shared inside a family.
router.get(
  "/families/:familyId/clothes",
  getFamilyClothes
);

// --------------------------------------------------
// COMMON CLOTHING ACTIONS
// --------------------------------------------------

// Update a clothing item.
router.patch(
  "/clothes/:id",
  updateClothing
);

// Delete a clothing item.
router.delete(
  "/clothes/:id",
  deleteClothing
);

// Toggle favorite.
router.patch(
  "/clothes/:id/favorite",
  toggleFavorite
);

module.exports = router;