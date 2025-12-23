const prisma = require("../config/prisma");

exports.createTeacher = async (req, res, next) => {
  try {
    const { name, email, phone, employeeId } = req.body;

    if (!name || !email || !phone || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailExists = await prisma.teacher.findUnique({
      where: { email },
    });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    const empExists = await prisma.teacher.findUnique({
      where: { employeeId },
    });
    if (empExists) {
      return res.status(409).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    const teacher = await prisma.teacher.create({
      data: { name, email, phone, employeeId },
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        subjects: {
          include: { subject: true },
        },
        classes: {
          include: { class: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        subjects: { include: { subject: true } },
        classes: { include: { class: true } },
      },
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, employeeId } = req.body;

    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (email && email !== teacher.email) {
      const emailExists = await prisma.teacher.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    if (employeeId && employeeId !== teacher.employeeId) {
      const empExists = await prisma.teacher.findUnique({
        where: { employeeId },
      });
      if (empExists) {
        return res.status(409).json({
          success: false,
          message: "Employee ID already exists",
        });
      }
    }

    const updated = await prisma.teacher.update({
      where: { id },
      data: { name, email, phone, employeeId },
    });

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    await prisma.teacher.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.assignSubjects = async (req, res, next) => {
  try {
    const { id: teacherId } = req.params;
    const { ids: subjectIds } = req.body;

    if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subject IDs array is required",
      });
    }

    // validate teacher
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    // validate subjects
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true },
    });
    if (subjects.length !== subjectIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more subjects not found",
      });
    }

    // create junction rows (skip duplicates)
    await prisma.teacherSubject.createMany({
      data: subjectIds.map((sid) => ({ teacherId, subjectId: sid })),
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message: "Subjects assigned successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.assignClasses = async (req, res, next) => {
  try {
    const { id: teacherId } = req.params;
    const { ids: classIds } = req.body;

    if (!Array.isArray(classIds) || classIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Class IDs array is required",
      });
    }

    // validate teacher
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    // validate classes
    const classes = await prisma.class.findMany({
      where: { id: { in: classIds } },
      select: { id: true },
    });
    if (classes.length !== classIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more classes not found",
      });
    }

    // create junction rows (skip duplicates)
    await prisma.teacherClass.createMany({
      data: classIds.map((cid) => ({ teacherId, classId: cid })),
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message: "Classes assigned successfully",
    });
  } catch (error) {
    next(error);
  }
};
