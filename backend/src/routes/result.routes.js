const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  getMyResults,
  getClassResults,
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

module.exports = router;
