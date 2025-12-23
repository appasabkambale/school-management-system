const prisma = require("../config/prisma");

// CREATE CLASS
exports.createClass = async (req, res, next) => {
  try {
    const { name, section } = req.body;

    if (!name || !section) {
      return res.status(400).json({
        success: false,
        message: "Class name and section are required",
      });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        section,
      },
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL CLASSES
exports.getAllClasses = async (req, res, next) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        students: true, // shows relationship
      },
    });

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    next(error);
  }
};
