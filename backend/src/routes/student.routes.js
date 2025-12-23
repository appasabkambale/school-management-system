const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { createStudent } = require("../controllers/student.controller");

// Admin only
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  createStudent
);

module.exports = router;
