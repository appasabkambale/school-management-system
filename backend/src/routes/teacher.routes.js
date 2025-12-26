// backend/src/routes/teacher.routes.js
const express = require("express");
const prisma = require("../config/prisma");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

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

const router = express.Router();

/* =====================================================
   ADMIN ROUTES (Teacher Management)
===================================================== */

// Create teacher
router.post("/", authenticate, authorizeRoles("ADMIN"), createTeacher);

// Get all teachers
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllTeachers);

// Get teacher by ID
router.get("/:id", authenticate, authorizeRoles("ADMIN"), getTeacherById);

// Update teacher
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateTeacher);

// Delete teacher
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteTeacher);

// Assign subjects to teacher
router.post("/:id/subjects", authenticate, authorizeRoles("ADMIN"), assignSubjects);

// Assign classes to teacher
router.post("/:id/classes", authenticate, authorizeRoles("ADMIN"), assignClasses);

// Unassign subjects
router.delete("/:id/subjects", authenticate, authorizeRoles("ADMIN"), unassignSubjects);

// Unassign classes
router.delete("/:id/classes", authenticate, authorizeRoles("ADMIN"), unassignClasses);

/* =====================================================
   TEACHER SELF ROUTES (Logged-in Teacher)
===================================================== */

// GET /api/teachers/me/classes
router.get(
  "/me/classes",
  authenticate,
  authorizeRoles("TEACHER"),
  async (req, res, next) => {
    try {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: req.user.id },
        include: {
          classes: {
            include: { class: true },
          },
        },
      });

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher profile not found",
        });
      }

      res.json({
        success: true,
        data: teacher.classes.map((c) => c.class),
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/teachers/me/subjects?classId=
router.get(
  "/me/subjects",
  authenticate,
  authorizeRoles("TEACHER"),
  async (req, res, next) => {
    try {
      const { classId } = req.query;

      const teacher = await prisma.teacher.findUnique({
        where: { userId: req.user.id },
        include: {
          subjects: {
            include: { subject: true },
          },
        },
      });

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher profile not found",
        });
      }

      res.json({
        success: true,
        data: teacher.subjects.map((s) => s.subject),
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
