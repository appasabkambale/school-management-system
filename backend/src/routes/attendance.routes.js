// attendance.routes.js
const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  markAttendance,
  getClassAttendance,
  getMyAttendance,
  getStudentAttendance,
} = require("../controllers/attendance.controller");

router.post(
  "/",
  authenticate,
  authorizeRoles("TEACHER"),
  markAttendance
);

// Teacher + Admin
router.get(
  "/class/:classId",
  authenticate,
  authorizeRoles("TEACHER", "ADMIN"),
  getClassAttendance
);

// Student (self)
router.get(
  "/student/me",
  authenticate,
  authorizeRoles("STUDENT"),
  getMyAttendance
);

// Admin (any student)
router.get(
  "/student/:studentId",
  authenticate,
  authorizeRoles("ADMIN"),
  getStudentAttendance
);


module.exports = router;
