const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  createFeeStructure,
  getAllFeeStructures,
  assignFeeToClass,
} = require("../controllers/fee.controller");

// Admin only
router.post("/", authenticate, authorizeRoles("ADMIN"), createFeeStructure);
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllFeeStructures);
router.post(
  "/assign/:classId",
  authenticate,
  authorizeRoles("ADMIN"),
  assignFeeToClass
);

module.exports = router;
