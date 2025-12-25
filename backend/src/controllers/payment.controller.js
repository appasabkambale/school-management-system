const prisma = require("../config/prisma");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

exports.getMyFeeDues = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const dues = await prisma.feeDue.findMany({
      where: {
        studentId,
        status: "PENDING",
      },
      include: {
        feeStructure: {
          select: {
            title: true,
            academicYear: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    res.status(200).json({
      success: true,
      data: dues,
    });
  } catch (error) {
    next(error);
  }
};

exports.createPaymentOrder = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { feeDueId } = req.body;

    if (!feeDueId) {
      return res.status(400).json({
        success: false,
        message: "feeDueId is required",
      });
    }

    // 1️⃣ Validate fee due
    const feeDue = await prisma.feeDue.findUnique({
      where: { id: feeDueId },
    });

    if (!feeDue || feeDue.studentId !== studentId) {
      return res.status(404).json({
        success: false,
        message: "Fee due not found",
      });
    }

    if (feeDue.status === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Fee already paid",
      });
    }

    // 2️⃣ Create Razorpay order
    const order = await razorpay.orders.create({
      amount: feeDue.amount * 100, // paise
      currency: "INR",
      receipt: `fee_${feeDue.id}`,
    });

    // 3️⃣ Store payment intent
    await prisma.payment.create({
      data: {
        studentId,
        feeDueId,
        razorpayOrderId: order.id,
        amount: feeDue.amount,
        status: "CREATED",
      },
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment details",
      });
    }

    // 1️⃣ Find payment record
    const payment = await prisma.payment.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        studentId,
      },
      include: {
        feeDue: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // 2️⃣ Prevent double verification
    if (payment.status === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    // 3️⃣ Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Mark failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // 4️⃣ Mark payment PAID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });

    // 5️⃣ Mark fee as PAID
    await prisma.feeDue.update({
      where: { id: payment.feeDueId },
      data: { status: "PAID" },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      receipt: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: payment.amount,
        status: "PAID",
        paidAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};
