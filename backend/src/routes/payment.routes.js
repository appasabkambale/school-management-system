const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  getMyFeeDues,
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/payment.controller");

// Student only
router.get(
  "/dues",
  authenticate,
  authorizeRoles("STUDENT"),
  getMyFeeDues
);

router.post(
  "/create-order",
  authenticate,
  authorizeRoles("STUDENT"),
  createPaymentOrder
);

router.post(
  "/verify",
  authenticate,
  authorizeRoles("STUDENT"),
  verifyPayment
);

module.exports = router;
