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

exports.getStudentReport = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { from, to } = req.query;

    // Student can view only own report
    if (req.user.role === "STUDENT" && req.user.id !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const where = {
      studentId,
      ...(from && to && {
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      }),
    };

    const records = await prisma.attendance.findMany({
      where,
      include: {
        subject: { select: { id: true, name: true } },
      },
    });

    const total = records.length;
    const present = records.filter(r => r.status === "PRESENT").length;
    const percentage = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    // Subject-wise breakdown
    const bySubject = {};
    records.forEach(r => {
      if (!bySubject[r.subject.name]) {
        bySubject[r.subject.name] = { total: 0, present: 0 };
      }
      bySubject[r.subject.name].total++;
      if (r.status === "PRESENT") bySubject[r.subject.name].present++;
    });

    res.status(200).json({
      success: true,
      data: {
        totalClasses: total,
        present,
        percentage,
        subjectWise: bySubject,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getClassReport = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { from, to, subjectId } = req.query;

    const where = {
      classId,
      ...(subjectId && { subjectId }),
      ...(from && to && {
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      }),
    };

    const records = await prisma.attendance.findMany({
      where,
      select: {
        date: true,
        status: true,
        studentId: true,
      },
    });

    const daily = {};
    records.forEach(r => {
      const d = r.date.toISOString().split("T")[0];
      if (!daily[d]) {
        daily[d] = { present: 0, absent: 0 };
      }
      r.status === "PRESENT" ? daily[d].present++ : daily[d].absent++;
    });

    res.status(200).json({
      success: true,
      data: {
        classId,
        days: daily,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAttendance = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { classId, subjectId, date, records } = req.body;

    const today = new Date().toISOString().split("T")[0];

    if (date !== today) {
      return res.status(403).json({
        success: false,
        message: "Attendance can only be edited on the same day",
      });
    }

    // Validate teacher-class assignment
    const classAssigned = await prisma.teacherClass.findUnique({
      where: {
        teacherId_classId: { teacherId, classId },
      },
    });
    if (!classAssigned) {
      return res.status(403).json({
        success: false,
        message: "Not assigned to this class",
      });
    }

    // Validate teacher-subject assignment
    const subjectAssigned = await prisma.teacherSubject.findUnique({
      where: {
        teacherId_subjectId: { teacherId, subjectId },
      },
    });
    if (!subjectAssigned) {
      return res.status(403).json({
        success: false,
        message: "Not assigned to this subject",
      });
    }

    // Update records one by one (safe)
    for (const r of records) {
      await prisma.attendance.updateMany({
        where: {
          studentId: r.studentId,
          classId,
          subjectId,
          date: new Date(date),
        },
        data: {
          status: r.status,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
