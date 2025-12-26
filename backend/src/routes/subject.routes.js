// backend/src/routes/subject.routes.js
const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subject.controller");

// Admin only
router.post("/", authenticate, authorizeRoles("ADMIN"), createSubject);
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllSubjects);
router.get("/:id", authenticate, authorizeRoles("ADMIN"), getSubjectById);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateSubject);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteSubject);

module.exports = router;
