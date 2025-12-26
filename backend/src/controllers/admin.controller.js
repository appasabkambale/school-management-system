const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAdminStats = async (req, res) => {
  try {
    const [students, teachers, classes, pendingFees] =
      await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.class.count(),
        prisma.feeDue.count({
          where: { status: "PENDING" },
        }),
      ]);

    res.json({
      success: true,
      data: {
        students,
        teachers,
        classes,
        pendingFees,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load admin stats",
    });
  }
};

module.exports = { getAdminStats };
