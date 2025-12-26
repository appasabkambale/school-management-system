// backend/src/routes/marks.routes.js
const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { enterMarks } = require("../controllers/marks.controller");
const prisma = require("../config/prisma");

/* =====================================================
   TEACHER
===================================================== */

// Enter / update marks
router.post(
  "/",
  authenticate,
  authorizeRoles("TEACHER"),
  enterMarks
);

// Get marks by exam (for teacher view)
router.get(
  "/exam/:examId",
  authenticate,
  authorizeRoles("TEACHER"),
  async (req, res, next) => {
    try {
      const marks = await prisma.marks.findMany({
        where: { examId: req.params.examId },
        include: {
          student: true,
        },
        orderBy: {
          student: { rollNumber: "asc" },
        },
      });

      res.json({
        success: true,
        data: marks,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
