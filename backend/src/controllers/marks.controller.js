const prisma = require("../config/prisma");

exports.enterMarks = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { examId, records } = req.body;

    if (!examId || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "examId and records are required",
      });
    }

    // 1️⃣ Get exam
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // 2️⃣ Block if published
    if (exam.isPublished) {
      return res.status(403).json({
        success: false,
        message: "Marks cannot be entered after exam is published",
      });
    }

    // 3️⃣ Validate teacher ↔ class
    const classAssigned = await prisma.teacherClass.findUnique({
      where: {
        teacherId_classId: {
          teacherId,
          classId: exam.classId,
        },
      },
    });

    if (!classAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this class",
      });
    }

    // 4️⃣ Validate teacher ↔ subject
    const subjectAssigned = await prisma.teacherSubject.findUnique({
      where: {
        teacherId_subjectId: {
          teacherId,
          subjectId: exam.subjectId,
        },
      },
    });

    if (!subjectAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this subject",
      });
    }

    // 5️⃣ Validate students belong to class
    const studentIds = records.map(r => r.studentId);

    const students = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
        classId: exam.classId,
      },
      select: { id: true },
    });

    if (students.length !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more students do not belong to this class",
      });
    }

    // 6️⃣ Validate marks range
    for (const r of records) {
      if (r.marks < 0 || r.marks > exam.maxMarks) {
        return res.status(400).json({
          success: false,
          message: `Marks must be between 0 and ${exam.maxMarks}`,
        });
      }
    }

    // 7️⃣ Prepare marks data
    const marksData = records.map(r => ({
      examId,
      studentId: r.studentId,
      marks: r.marks,
    }));

    // 8️⃣ Insert marks (skip duplicates)
    await prisma.marks.createMany({
      data: marksData,
      skipDuplicates: true,
    });

    res.status(201).json({
      success: true,
      message: "Marks entered successfully",
    });
  } catch (error) {
    next(error);
  }
};
