const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacher.controller");

// Admin only
router.post("/", authenticate, authorizeRoles("ADMIN"), createTeacher);
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllTeachers);
router.get("/:id", authenticate, authorizeRoles("ADMIN"), getTeacherById);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateTeacher);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteTeacher);

module.exports = router;
