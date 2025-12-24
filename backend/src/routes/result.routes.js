const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  getMyResults,
  getClassResults,
  getClassSummary,
} = require("../controllers/result.controller");

router.get(
  "/me",
  authenticate,
  authorizeRoles("STUDENT"),
  getMyResults
);

router.get(
  "/class/:classId",
  authenticate,
  authorizeRoles("ADMIN"),
  getClassResults
);

router.get(
  "/summary/class/:classId",
  authenticate,
  authorizeRoles("ADMIN"),
  getClassSummary
);

module.exports = router;
