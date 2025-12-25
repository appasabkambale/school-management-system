const prisma = require("../config/prisma");
const razorpay = require("../config/razorpay");

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

