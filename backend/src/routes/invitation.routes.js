const express = require("express");

const {
  getMyInvitations,
  acceptInvitation,
  declineInvitation,
} = require("../controllers/invitation.controller");

const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

// All invitation routes require authentication.
router.use(authenticateToken);

// GET /api/invitations — list my pending invitations
router.get("/", getMyInvitations);

// POST /api/invitations/:invitationId/accept
router.post("/:invitationId/accept", acceptInvitation);

// POST /api/invitations/:invitationId/decline
router.post("/:invitationId/decline", declineInvitation);

module.exports = router;