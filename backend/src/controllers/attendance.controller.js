// attendance.controller.js
const prisma = require("../config/prisma");

exports.markAttendance = async (req, res, next) => {
  try {
    // 🔥 FIX 1: Resolve Teacher from logged-in User
    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.user.id },
    });

    if (!teacher) {
      return res.status(403).json({
        success: false,
        message: "Teacher profile not linked to this user",
      });
    }

    const teacherId = teacher.id; // ✅ CORRECT teacherId

    const { classId, subjectId, date, records } = req.body;

    // 1️⃣ Validate input
    if (!classId || !subjectId || !date || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: "classId, subjectId, date and records are required",
      });
    }

    if (records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance records cannot be empty",
      });
    }

    // 2️⃣ Validate teacher ↔ class assignment
    const classAssigned = await prisma.teacherClass.findUnique({
      where: {
        teacherId_classId: {
          teacherId,
          classId,
        },
      },
    });

    if (!classAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this class",
      });
    }

    // 3️⃣ Validate teacher ↔ subject assignment
    const subjectAssigned = await prisma.teacherSubject.findUnique({
      where: {
        teacherId_subjectId: {
          teacherId,
          subjectId,
        },
      },
    });

    if (!subjectAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this subject",
      });
    }

    // 4️⃣ Validate students belong to class
    const studentIds = records.map((r) => r.studentId);

    const students = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
        classId,
      },
      select: { id: true },
    });

    if (students.length !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more students do not belong to this class",
      });
    }

    // 5️⃣ Prepare bulk attendance data
    const attendanceData = records.map((r) => ({
      studentId: r.studentId,
      classId,
      subjectId,
      teacherId,              // ✅ FIXED
      date: new Date(date),
      status: r.status,
    }));

    // 6️⃣ Insert attendance (skip duplicates)
    await prisma.attendance.createMany({
      data: attendanceData,
      skipDuplicates: true,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getClassAttendance = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { subjectId, date } = req.query;
    const user = req.user;

    if (!subjectId || !date) {
      return res.status(400).json({
        success: false,
        message: "subjectId and date are required",
      });
    }

    // 🔥 FIX: Resolve Teacher from User
    if (user.role === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: user.id },
      });

      if (!teacher) {
        return res.status(403).json({
          success: false,
          message: "Teacher profile not linked to this user",
        });
      }

      const assigned = await prisma.teacherClass.findUnique({
        where: {
          teacherId_classId: {
            teacherId: teacher.id, // ✅ CORRECT
            classId,
          },
        },
      });

      if (!assigned) {
        return res.status(403).json({
          success: false,
          message: "Not authorized for this class",
        });
      }
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        classId,
        subjectId,
        date: new Date(date),
      },
      include: {
        student: {
          select: { id: true, name: true, rollNumber: true },
        },
      },
      orderBy: {
        student: { rollNumber: "asc" },
      },
    });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyAttendance = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Student profile not linked to this user",
      });
    }

    const attendance = await prisma.attendance.findMany({
      where: { studentId: student.id },
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true, section: true } },
      },
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const attendance = await prisma.attendance.findMany({
      where: { studentId },
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true, section: true } },
      },
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};
