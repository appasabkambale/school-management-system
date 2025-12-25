const prisma = require("../config/prisma");

exports.createFeeStructure = async (req, res, next) => {
  try {
    const { title, amount, dueDate, academicYear, classId } = req.body;

    if (!title || !amount || !dueDate || !academicYear || !classId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const classExists = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const fee = await prisma.feeStructure.create({
      data: {
        title,
        amount,
        dueDate: new Date(dueDate),
        academicYear,
        classId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Fee structure created successfully",
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllFeeStructures = async (req, res, next) => {
  try {
    const fees = await prisma.feeStructure.findMany({
      include: {
        class: { select: { name: true, section: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: fees,
    });
  } catch (error) {
    next(error);
  }
};

exports.assignFeeToClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { feeStructureId } = req.body;

    if (!feeStructureId) {
      return res.status(400).json({
        success: false,
        message: "feeStructureId is required",
      });
    }

    // Validate fee structure
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    // Validate class
    if (feeStructure.classId !== classId) {
      return res.status(400).json({
        success: false,
        message: "Fee structure does not belong to this class",
      });
    }

    // Get students of the class
    const students = await prisma.student.findMany({
      where: { classId },
      select: { id: true },
    });

    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students found for this class",
      });
    }

    // Prepare fee dues
    const feeDuesData = students.map((s) => ({
      studentId: s.id,
      feeStructureId,
      amount: feeStructure.amount,
      dueDate: feeStructure.dueDate,
    }));

    // Create fee dues safely (skip duplicates)
    await prisma.feeDue.createMany({
      data: feeDuesData,
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message: "Fee assigned and dues generated successfully",
    });
  } catch (error) {
    next(error);
  }
};
