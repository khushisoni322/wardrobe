const express = require("express");

const {
  createFamily,
  getMyFamilies,
} = require("../controllers/family.controller");

const {
  createInvitation,
} = require("../controllers/invitation.controller");

const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

// All family routes require authentication.
router.use(authenticateToken);

// POST /api/families — create a family
router.post("/", createFamily);

// GET /api/families — list the logged-in user's families
router.get("/", getMyFamilies);

// POST /api/families/:familyId/invitations — invite a registered user
router.post("/:familyId/invitations", createInvitation);

module.exports = router;