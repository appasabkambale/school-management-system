const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");

// Admin only
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  createStudent
);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateStudent);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteStudent);

// Admin + Teacher
router.get("/", authenticate, authorizeRoles("ADMIN", "TEACHER"), getAllStudents);
router.get("/:id", authenticate, authorizeRoles("ADMIN", "TEACHER"), getStudentById);

module.exports = router;
