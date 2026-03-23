const express = require("express");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projects.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);

router.post("/", protect, upload.single("image"), createProject);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;