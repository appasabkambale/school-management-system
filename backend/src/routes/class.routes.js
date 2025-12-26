// backend/src/routes/class.routes.js
const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const {
  createClass,
  getAllClasses,
} = require("../controllers/class.controller");

// Admin only
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  createClass
);

// Admin + Teacher
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "TEACHER"),
  getAllClasses
);

module.exports = router;
