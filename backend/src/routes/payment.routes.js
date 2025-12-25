const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  getMyFeeDues,
  createPaymentOrder,
  verifyPayment,
  getMyPayments,
  getPaymentSummary,
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

router.get(
  "/my",
  authenticate,
  authorizeRoles("STUDENT"),
  getMyPayments
);

router.get(
  "/report/summary",
  authenticate,
  authorizeRoles("ADMIN"),
  getPaymentSummary
);

module.exports = router;
