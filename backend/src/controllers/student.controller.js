const prisma = require("../config/prisma");

exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, rollNumber, classId } = req.body;

    // 1. Check student exists
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 2. If classId provided, validate class
    if (classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: classId },
      });

      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
        });
      }
    }

    // 3. If email updated, ensure uniqueness
    if (email && email !== student.email) {
      const emailExists = await prisma.student.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // 4. Update student
    const updatedStudent = await prisma.student.update({
      where: { id },
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

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await prisma.student.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const skip = (page - 1) * limit;

    const { classId, search } = req.query;

    const where = {
      ...(classId && { classId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          class: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.student.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

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
