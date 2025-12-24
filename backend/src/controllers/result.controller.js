const getGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

const prisma = require("../config/prisma");

exports.getMyResults = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const marks = await prisma.marks.findMany({
      where: {
        studentId,
        exam: { isPublished: true },
      },
      include: {
        exam: {
          include: {
            subject: { select: { name: true } },
            class: { select: { name: true, section: true } },
          },
        },
      },
    });

    const results = marks.map(m => {
      const percentage = ((m.marks / m.exam.maxMarks) * 100).toFixed(2);
      return {
        exam: m.exam.name,
        subject: m.exam.subject.name,
        class: `${m.exam.class.name}-${m.exam.class.section}`,
        marks: m.marks,
        maxMarks: m.exam.maxMarks,
        passMarks: m.exam.passMarks,
        status: m.marks >= m.exam.passMarks ? "PASS" : "FAIL",
        percentage,
        grade: getGrade(percentage),
      };
    });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

exports.getClassResults = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { examId } = req.query;

    const where = {
      exam: {
        classId,
        isPublished: true,
        ...(examId && { id: examId }),
      },
    };

    const marks = await prisma.marks.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, rollNumber: true } },
        exam: {
          include: {
            subject: { select: { name: true } },
          },
        },
      },
      orderBy: {
        student: { rollNumber: "asc" },
      },
    });

    const results = marks.map(m => {
      const percentage = ((m.marks / m.exam.maxMarks) * 100).toFixed(2);
      return {
        student: m.student,
        subject: m.exam.subject.name,
        marks: m.marks,
        maxMarks: m.exam.maxMarks,
        status: m.marks >= m.exam.passMarks ? "PASS" : "FAIL",
        percentage,
        grade: getGrade(percentage),
      };
    });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

