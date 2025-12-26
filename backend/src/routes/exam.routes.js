// backend/src/routes/exam.routes.js
const express = require("express");
const router = express.Router();

const prisma = require("../config/prisma");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const {
  createExam,
  getAllExams,
  updateExam,
  publishExam,
} = require("../controllers/exam.controller");

/* =====================================================
   ADMIN
===================================================== */

router.post("/", authenticate, authorizeRoles("ADMIN"), createExam);
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllExams);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateExam);
router.post("/:id/publish", authenticate, authorizeRoles("ADMIN"), publishExam);

/* =====================================================
   TEACHER
===================================================== */

// GET /api/exams/teacher
router.get(
  "/teacher",
  authenticate,
  authorizeRoles("TEACHER"),
  async (req, res, next) => {
    try {
      // Resolve teacher from logged-in user
      const teacher = await prisma.teacher.findUnique({
        where: { userId: req.user.id },
      });

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher profile not found",
        });
      }

      // Get exams where teacher is assigned to subject
      const exams = await prisma.exam.findMany({
        where: {
          subject: {
            teachers: {
              some: {
                teacherId: teacher.id,
              },
            },
          },
        },
        include: {
          subject: true,
          class: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json({
        success: true,
        data: exams,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
