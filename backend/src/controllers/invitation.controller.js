const crypto = require("crypto");

const prisma = require("../config/prisma");

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const INVITATION_DAYS = 7;

// Generate a cryptographically secure invitation token.
const generateInvitationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Store only the hash in PostgreSQL.
const hashInvitationToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Create a shareable family invitation link.
const createInvitation = async (req, res, next) => {
  try {
    const { familyId } = req.params;

    // Only the family admin can create a join link.
    const adminMembership = await prisma.familyMember.findUnique({
      where: {
        userId_familyId: {
          userId: req.user.id,
          familyId,
        },
      },
      select: {
        id: true,
        role: true,
        familyId: true,
      },
    });

    if (!adminMembership || adminMembership.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only a family admin can create a family invite link.",
      });
    }

    const family = await prisma.family.findUnique({
      where: {
        id: familyId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found.",
      });
    }

    // Expire older pending links for this family.
    await prisma.familyInvitation.updateMany({
      where: {
        familyId,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        status: "REPLACED",
      },
    });

    const rawToken = generateInvitationToken();
    const tokenHash = hashInvitationToken(rawToken);

    const expiresAt = new Date(
      Date.now() + INVITATION_DAYS * 24 * 60 * 60 * 1000
    );

    const invitation = await prisma.familyInvitation.create({
      data: {
        familyId,
        inviterId: req.user.id,
        recipientId: null,
        tokenHash,
        status: "PENDING",
        expiresAt,
      },
      select: {
        id: true,
        familyId: true,
        inviterId: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    const inviteLink =
      `${FRONTEND_URL}/join-family/${rawToken}`;

    return res.status(201).json({
      success: true,
      message: "Family invite link created successfully.",
      family,
      invitation,
      inviteLink,
      invitationToken: rawToken,
      expiresAt,
    });
  } catch (error) {
    next(error);
  }
};

// Get pending invitations assigned directly to the current user.
// This is retained for compatibility with the existing invitation system.
const getMyInvitations = async (req, res, next) => {
  try {
    const invitations = await prisma.familyInvitation.findMany({
      where: {
        recipientId: req.user.id,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        family: {
          select: {
            id: true,
            name: true,
          },
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: invitations.length,
      invitations,
    });
  } catch (error) {
    next(error);
  }
};

// Validate a public family invitation token.
// Authentication is NOT required for this endpoint.
const previewInvitation = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (typeof token !== "string" || token.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Invalid family invite link.",
      });
    }

    const tokenHash = hashInvitationToken(token);

    const invitation = await prisma.familyInvitation.findUnique({
      where: {
        tokenHash,
      },
      include: {
        family: {
          select: {
            id: true,
            name: true,
          },
        },
        inviter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "This family invite link is invalid.",
      });
    }

    if (invitation.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message: "This family invite link is no longer active.",
      });
    }

    if (invitation.expiresAt <= new Date()) {
      await prisma.familyInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "EXPIRED",
        },
      });

      return res.status(410).json({
        success: false,
        message: "This family invite link has expired.",
      });
    }

    return res.status(200).json({
      success: true,
      invitation: {
        id: invitation.id,
        familyId: invitation.familyId,
        familyName: invitation.family.name,
        inviterName: invitation.inviter.name,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Join a family using a shareable invitation token.
// User must already be authenticated when this endpoint is called.
const acceptInvitationByToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (typeof token !== "string" || token.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Invalid family invite link.",
      });
    }

    const tokenHash = hashInvitationToken(token);

    const result = await prisma.$transaction(async (tx) => {
      const invitation = await tx.familyInvitation.findUnique({
        where: {
          tokenHash,
        },
        include: {
          family: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!invitation) {
        return {
          error: "NOT_FOUND",
        };
      }

      if (invitation.status !== "PENDING") {
        return {
          error: "NOT_PENDING",
        };
      }

      if (invitation.expiresAt <= new Date()) {
        await tx.familyInvitation.update({
          where: {
            id: invitation.id,
          },
          data: {
            status: "EXPIRED",
          },
        });

        return {
          error: "EXPIRED",
        };
      }

      const existingMembership = await tx.familyMember.findUnique({
        where: {
          userId_familyId: {
            userId: req.user.id,
            familyId: invitation.familyId,
          },
        },
      });

      if (existingMembership) {
        return {
          error: "ALREADY_MEMBER",
          familyId: invitation.familyId,
          familyName: invitation.family.name,
          role: existingMembership.role,
        };
      }

      const membership = await tx.familyMember.create({
        data: {
          userId: req.user.id,
          familyId: invitation.familyId,
          role: "MEMBER",
        },
      });

      await tx.familyInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "ACCEPTED",
          recipientId: req.user.id,
          acceptedAt: new Date(),
        },
      });

      return {
        invitationId: invitation.id,
        familyId: invitation.familyId,
        familyName: invitation.family.name,
        membershipId: membership.id,
        role: membership.role,
      };
    });

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "This family invite link is invalid.",
      });
    }

    if (result.error === "NOT_PENDING") {
      return res.status(409).json({
        success: false,
        message: "This family invite link is no longer active.",
      });
    }

    if (result.error === "EXPIRED") {
      return res.status(410).json({
        success: false,
        message: "This family invite link has expired.",
      });
    }

    if (result.error === "ALREADY_MEMBER") {
      return res.status(200).json({
        success: true,
        alreadyMember: true,
        message: "You are already a member of this family.",
        familyId: result.familyId,
        familyName: result.familyName,
        role: result.role,
      });
    }

    return res.status(200).json({
      success: true,
      alreadyMember: false,
      message: "You have joined the family successfully!",
      invitationId: result.invitationId,
      familyId: result.familyId,
      familyName: result.familyName,
      membershipId: result.membershipId,
      role: result.role,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "You are already a member of this family.",
      });
    }

    next(error);
  }
};

// Legacy invitation acceptance by invitation ID.
const acceptInvitation = async (req, res, next) => {
  try {
    const { invitationId } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const invitation = await tx.familyInvitation.findFirst({
        where: {
          id: invitationId,
          recipientId: req.user.id,
        },
      });

      if (!invitation) {
        return {
          error: "NOT_FOUND",
        };
      }

      if (invitation.status !== "PENDING") {
        return {
          error: "NOT_PENDING",
        };
      }

      if (invitation.expiresAt <= new Date()) {
        await tx.familyInvitation.update({
          where: {
            id: invitation.id,
          },
          data: {
            status: "EXPIRED",
          },
        });

        return {
          error: "EXPIRED",
        };
      }

      const existingMembership = await tx.familyMember.findUnique({
        where: {
          userId_familyId: {
            userId: req.user.id,
            familyId: invitation.familyId,
          },
        },
      });

      if (existingMembership) {
        return {
          error: "ALREADY_MEMBER",
          familyId: invitation.familyId,
          role: existingMembership.role,
        };
      }

      await tx.familyMember.create({
        data: {
          userId: req.user.id,
          familyId: invitation.familyId,
          role: "MEMBER",
        },
      });

      await tx.familyInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      return {
        invitationId: invitation.id,
        familyId: invitation.familyId,
      };
    });

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Invitation not found.",
      });
    }

    if (result.error === "NOT_PENDING") {
      return res.status(409).json({
        success: false,
        message: "This invitation has already been processed.",
      });
    }

    if (result.error === "EXPIRED") {
      return res.status(410).json({
        success: false,
        message: "This invitation has expired.",
      });
    }

    if (result.error === "ALREADY_MEMBER") {
      return res.status(200).json({
        success: true,
        alreadyMember: true,
        message: "You are already a member of this family.",
        familyId: result.familyId,
        role: result.role,
      });
    }

    return res.status(200).json({
      success: true,
      message: "You have joined the family successfully!",
      invitationId: result.invitationId,
      familyId: result.familyId,
      role: "MEMBER",
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "You are already a member of this family.",
      });
    }

    next(error);
  }
};

// Decline a legacy invitation.
const declineInvitation = async (req, res, next) => {
  try {
    const { invitationId } = req.params;

    const invitation = await prisma.familyInvitation.findFirst({
      where: {
        id: invitationId,
        recipientId: req.user.id,
      },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found.",
      });
    }

    if (invitation.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message: "This invitation has already been processed.",
      });
    }

    if (invitation.expiresAt <= new Date()) {
      await prisma.familyInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "EXPIRED",
        },
      });

      return res.status(410).json({
        success: false,
        message: "This invitation has expired.",
      });
    }

    await prisma.familyInvitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: "DECLINED",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Invitation declined successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvitation,
  getMyInvitations,
  previewInvitation,
  acceptInvitationByToken,
  acceptInvitation,
  declineInvitation,
};