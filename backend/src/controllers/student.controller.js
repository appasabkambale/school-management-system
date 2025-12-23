const prisma = require("../config/prisma");

exports.createStudent = async (req, res, next) => {
  try {
    const { name, email, rollNumber, classId } = req.body;

    // 1. Basic validation
    if (!name || !email || !rollNumber || !classId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Check class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // 3. Check duplicate student email
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    // 4. Create student
    const student = await prisma.student.create({
      data: {
        name,
        email,
        rollNumber,
        classId,
      },
      include: {
        class: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};
