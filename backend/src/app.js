const express = require("express");
const cors = require("cors");
const prisma = require("./config/prisma");

const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const classRoutes = require("./routes/class.routes");
const studentRoutes = require("./routes/student.routes");
const subjectRoutes = require("./routes/subject.routes");
const teacherRoutes = require("./routes/teacher.routes");

const { errorHandler } = require("./middlewares/error.middleware");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/teachers", teacherRoutes);

app.get("/", (req, res) => {
  res.send("School Management API running");
});

app.get("/test-db", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use(errorHandler);

module.exports = app;
