// backend/src/routes/fee.routes.js
const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const {
  createFeeStructure,
  getAllFeeStructures,
  assignFeeToClass,
} = require("../controllers/fee.controller");

/* =====================================================
   ADMIN
===================================================== */

// Create fee structure
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  createFeeStructure
);

// Get all fee structures
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "TEACHER"),
  getAllFeeStructures
);

// Assign fee to class
router.post(
  "/assign/:classId",
  authenticate,
  authorizeRoles("ADMIN"),
  assignFeeToClass
);

module.exports = router;
