const prisma = require("../config/prisma");

exports.createExam = async (req, res, next) => {
  try {
    const {
      name,
      classId,
      subjectId,
      examDate,
      maxMarks,
      passMarks,
    } = req.body;

    if (
      !name ||
      !classId ||
      !subjectId ||
      !examDate ||
      maxMarks == null ||
      passMarks == null
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (passMarks > maxMarks) {
      return res.status(400).json({
        success: false,
        message: "Pass marks cannot exceed max marks",
      });
    }

    // Validate class
    const classExists = await prisma.class.findUnique({
      where: { id: classId },
    });
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Validate subject
    const subjectExists = await prisma.subject.findUnique({
      where: { id: subjectId },
    });
    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        classId,
        subjectId,
        examDate: new Date(examDate),
        maxMarks,
        passMarks,
      },
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllExams = async (req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        class: { select: { name: true, section: true } },
        subject: { select: { name: true } },
      },
      orderBy: { examDate: "desc" },
    });

    res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (exam.isPublished) {
      return res.status(403).json({
        success: false,
        message: "Cannot edit a published exam",
      });
    }

    if (
      data.passMarks != null &&
      data.maxMarks != null &&
      data.passMarks > data.maxMarks
    ) {
      return res.status(400).json({
        success: false,
        message: "Pass marks cannot exceed max marks",
      });
    }

    const updated = await prisma.exam.update({
      where: { id },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.publishExam = async (req, res, next) => {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (exam.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Exam already published",
      });
    }

    await prisma.exam.update({
      where: { id },
      data: { isPublished: true },
    });

    res.status(200).json({
      success: true,
      message: "Exam published successfully",
    });
  } catch (error) {
    next(error);
  }
};
