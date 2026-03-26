const express = require("express");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projects.controller");
const { protect } = require("../middleware/auth.middleware");
const { uploadImage } = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);

router.post("/", protect, uploadImage.single("image"), createProject);
router.put("/:id", protect, uploadImage.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;