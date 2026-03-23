const express = require("express");
const {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experience.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getExperience);

router.post("/", protect, createExperience);
router.put("/:id", protect, updateExperience);
router.delete("/:id", protect, deleteExperience);

module.exports = router;