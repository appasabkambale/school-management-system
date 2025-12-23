const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  createStudent,
  getAllStudents,
  getStudentById,
} = require("../controllers/student.controller");

// Admin only
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  createStudent
);

// Admin + Teacher
router.get("/", authenticate, authorizeRoles("ADMIN", "TEACHER"), getAllStudents);
router.get("/:id", authenticate, authorizeRoles("ADMIN", "TEACHER"), getStudentById);

module.exports = router;
