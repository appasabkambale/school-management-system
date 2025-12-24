const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { markAttendance } = require("../controllers/attendance.controller");

router.post(
  "/",
  authenticate,
  authorizeRoles("TEACHER"),
  markAttendance
);

module.exports = router;
