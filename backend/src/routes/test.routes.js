const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

// Admin only
router.get(
  "/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
  }
);

// Admin + Teacher
router.get(
  "/teacher",
  authenticate,
  authorizeRoles("ADMIN", "TEACHER"),
  (req, res) => {
    res.json({ message: "Welcome Teacher 👩‍🏫" });
  }
);

// All logged-in users
router.get(
  "/all",
  authenticate,
  (req, res) => {
    res.json({
      message: "Welcome user",
      user: req.user,
    });
  }
);

module.exports = router;
