// backend/src/routes/admin.routes.js
const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { getAdminStats } = require("../controllers/admin.controller");

const router = express.Router();

router.get(
  "/stats",
  authenticate,
  authorizeRoles("ADMIN"),
  getAdminStats
);

module.exports = router;
