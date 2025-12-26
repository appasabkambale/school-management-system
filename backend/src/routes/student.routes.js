// backend/src/routes/student.routes.js
const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");

const prisma = require("../config/prisma");

/* =====================================================
   ADMIN ONLY
===================================================== */

// Create student
router.post("/", authenticate, authorizeRoles("ADMIN"), createStudent);

// Update student
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateStudent);

// Delete student
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteStudent);

/* =====================================================
   ADMIN + TEACHER
===================================================== */

// Get students by class (USED BY TEACHER)
router.get(
  "/class/:classId",
  authenticate,
  authorizeRoles("ADMIN", "TEACHER"),
  async (req, res, next) => {
    try {
      const students = await prisma.student.findMany({
        where: { classId: req.params.classId },
        orderBy: { rollNumber: "asc" },
      });

      res.json({
        success: true,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all students
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "TEACHER"),
  getAllStudents
);

// Get student by ID
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "TEACHER"),
  getStudentById
);

module.exports = router;
