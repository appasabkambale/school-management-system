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
  assignSubjects,
  assignClasses,
  unassignSubjects,
  unassignClasses,
} = require("../controllers/teacher.controller");

// Admin only
router.post("/", authenticate, authorizeRoles("ADMIN"), createTeacher);
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllTeachers);
router.get("/:id", authenticate, authorizeRoles("ADMIN"), getTeacherById);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateTeacher);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteTeacher);
router.post("/:id/subjects", authenticate, authorizeRoles("ADMIN"), assignSubjects);
router.post("/:id/classes", authenticate, authorizeRoles("ADMIN"), assignClasses);
router.delete("/:id/subjects", authenticate, authorizeRoles("ADMIN"), unassignSubjects);
router.delete("/:id/classes", authenticate, authorizeRoles("ADMIN"), unassignClasses);

module.exports = router;
