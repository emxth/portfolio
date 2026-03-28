const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { uploadCv } = require("../middleware/upload.middleware");
const {
  getProfile,
  upsertProfile,
  uploadCv: uploadCvController,
} = require("../controllers/profile.controller");

const router = express.Router();

router.get("/", getProfile); // public
router.put("/", protect, upsertProfile); // admin
router.put("/cv", protect, uploadCv.single("cv"), uploadCvController); // admin

module.exports = router;