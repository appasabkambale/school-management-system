const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { enterMarks } = require("../controllers/marks.controller");

router.post(
  "/",
  authenticate,
  authorizeRoles("TEACHER"),
  enterMarks
);

module.exports = router;
