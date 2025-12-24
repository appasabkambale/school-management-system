const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  createExam,
  getAllExams,
  updateExam,
  publishExam,
} = require("../controllers/exam.controller");

// Admin only
router.post("/", authenticate, authorizeRoles("ADMIN"), createExam);
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllExams);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateExam);
router.post("/:id/publish", authenticate, authorizeRoles("ADMIN"), publishExam);

module.exports = router;
