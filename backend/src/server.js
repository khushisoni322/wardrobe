const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const familyRoutes = require("./routes/family.routes");
const invitationRoutes = require("./routes/invitation.routes");
const clothingRoutes = require("./routes/clothing.routes");

const app = express();

const PORT = process.env.PORT || 5001;

// ========================================
// CORS CONFIGURATION
// ========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

// If FRONTEND_URL is provided in .env,
// add it to the allowed origins.
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin(origin, callback) {
    // Requests such as curl/Postman may not contain an Origin header.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: false,

  optionsSuccessStatus: 204,
};

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors(corsOptions));

// Explicitly handle browser preflight requests.
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "2mb" }));

// ========================================
// BASIC ROUTE
// ========================================

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Wardrobe API! ❤️");
});

// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Wardrobe backend is running successfully!",
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// AUTHENTICATION ROUTES
// ========================================

// Register, login and get logged-in user
app.use("/api/auth", authRoutes);

// ========================================
// FAMILY ROUTES
// ========================================

// Create family and get user's families
app.use("/api/families", familyRoutes);

// ========================================
// FAMILY INVITATION ROUTES
// ========================================

// Get, accept and decline invitations
app.use("/api/invitations", invitationRoutes);

// ========================================
// CLOTHING ROUTES
// ========================================

// Add/list family clothes
// Update/delete/favorite individual clothing items
app.use("/api", clothingRoutes);

// ========================================
// UNKNOWN ROUTE HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  // Give CORS errors a proper response instead of
  // converting them into a generic 500 response.
  if (err.message && err.message.startsWith("CORS blocked origin:")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ========================================
// START SERVER
// ========================================

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log("===================================");
  console.log("Wardrobe backend started successfully!");
  console.log(`Local URL: http://127.0.0.1:${PORT}`);
  console.log(`Health API: http://127.0.0.1:${PORT}/api/health`);

  console.log("-----------------------------------");
  console.log("ALLOWED FRONTEND ORIGINS");
  allowedOrigins.forEach((origin) => {
    console.log(`✓ ${origin}`);
  });

  console.log("-----------------------------------");
  console.log("AUTHENTICATION");
  console.log("POST /api/auth/register");
  console.log("POST /api/auth/login");
  console.log("GET  /api/auth/me");

  console.log("-----------------------------------");
  console.log("FAMILY MANAGEMENT");
  console.log("POST /api/families");
  console.log("GET  /api/families");

  console.log("-----------------------------------");
  console.log("FAMILY INVITATIONS");
  console.log("POST /api/families/:familyId/invitations");
  console.log("GET  /api/invitations");
  console.log("POST /api/invitations/:invitationId/accept");
  console.log("POST /api/invitations/:invitationId/decline");

  console.log("-----------------------------------");
  console.log("CLOTHING MANAGEMENT");
  console.log("POST   /api/families/:familyId/clothes");
  console.log("GET    /api/families/:familyId/clothes");
  console.log("PATCH  /api/clothes/:id");
  console.log("DELETE /api/clothes/:id");
  console.log("PATCH  /api/clothes/:id/favorite");

  console.log("===================================");
});

// ========================================
// SERVER ERROR HANDLING
// ========================================

server.on("error", (error) => {
  console.error("Failed to start server:", error.message);
  process.exitCode = 1;
});

module.exports = app;