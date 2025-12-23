const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { requireFields } = require("../utils/validate");

// =======================
// REGISTER
// =======================
exports.register = async (req, res, next) => {
  try {
    requireFields(["name", "email", "password", "role"], req.body);

    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...safeUser } = user;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// LOGIN
// =======================
exports.login = async (req, res, next) => {
  try {
    requireFields(["email", "password"], req.body);

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: safeUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// GET LOGGED-IN USER
// =======================
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};
