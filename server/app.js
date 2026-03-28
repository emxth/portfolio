const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/projects.routes");
const skillRoutes = require("./routes/skills.routes");
const experienceRoutes = require("./routes/experience.routes");
const profileRoutes = require("./routes/profile.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/profile", profileRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;