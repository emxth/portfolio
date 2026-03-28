const express = require("express");
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skills.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getSkills);

router.post("/", protect, createSkill);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

module.exports = router;