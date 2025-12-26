// backend/src/routes/result.routes.js
const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const {
  getMyResults,
  getClassResults,
  getClassSummary,
} = require("../controllers/result.controller");

/* =====================================================
   STUDENT
===================================================== */

// Student → own results
router.get(
  "/me",
  authenticate,
  authorizeRoles("STUDENT"),
  getMyResults
);

/* =====================================================
   ADMIN + TEACHER
===================================================== */

// Class-wise detailed results
router.get(
  "/class/:classId",
  authenticate,
  authorizeRoles("ADMIN", "TEACHER"),
  getClassResults
);

// Class result summary
router.get(
  "/summary/class/:classId",
  authenticate,
  authorizeRoles("ADMIN", "TEACHER"),
  getClassSummary
);

module.exports = router;
