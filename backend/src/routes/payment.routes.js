// backend/src/routes/payment.routes.js
const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const {
  getMyFeeDues,
  createPaymentOrder,
  verifyPayment,
  getMyPayments,
  getPaymentSummary,
} = require("../controllers/payment.controller");

/* =====================================================
   STUDENT
===================================================== */

// Student → fee dues
router.get(
  "/dues",
  authenticate,
  authorizeRoles("STUDENT"),
  getMyFeeDues
);

// Create Razorpay order
router.post(
  "/create-order",
  authenticate,
  authorizeRoles("STUDENT"),
  createPaymentOrder
);

// Verify Razorpay payment
router.post(
  "/verify",
  authenticate,
  authorizeRoles("STUDENT"),
  verifyPayment
);

// Student payment history
router.get(
  "/my",
  authenticate,
  authorizeRoles("STUDENT"),
  getMyPayments
);

/* =====================================================
   ADMIN + TEACHER
===================================================== */

// Payment summary report
router.get(
  "/report/summary",
  authenticate,
  authorizeRoles("ADMIN", "TEACHER"),
  getPaymentSummary
);

module.exports = router;
