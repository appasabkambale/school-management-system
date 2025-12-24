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

exports.getClassSummary = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { examId } = req.query;

    if (!examId) {
      return res.status(400).json({
        success: false,
        message: "examId is required",
      });
    }

    const marks = await prisma.marks.findMany({
      where: {
        examId,
        exam: {
          classId,
          isPublished: true,
        },
      },
      include: {
        student: { select: { id: true, name: true, rollNumber: true } },
        exam: true,
      },
    });

    if (marks.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          average: 0,
          topper: null,
          passPercentage: 0,
        },
      });
    }

    const totalMarks = marks.reduce((sum, m) => sum + m.marks, 0);
    const average = (totalMarks / marks.length).toFixed(2);

    const topper = marks.reduce((max, curr) =>
      curr.marks > max.marks ? curr : max
    );

    const passCount = marks.filter(
      m => m.marks >= m.exam.passMarks
    ).length;

    const passPercentage = (
      (passCount / marks.length) *
      100
    ).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        average,
        topper: {
          student: topper.student,
          marks: topper.marks,
        },
        passPercentage,
      },
    });
  } catch (error) {
    next(error);
  }
};


