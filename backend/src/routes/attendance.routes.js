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
  getStudentReport,
  getClassReport,
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

router.get(
  "/report/student/:studentId",
  authenticate,
  authorizeRoles("ADMIN", "STUDENT"),
  getStudentReport
);

// Admin (any student)
router.get(
  "/student/:studentId",
  authenticate,
  authorizeRoles("ADMIN"),
  getStudentAttendance
);

router.get(
  "/report/class/:classId",
  authenticate,
  authorizeRoles("ADMIN"),
  getClassReport
);


module.exports = router;
