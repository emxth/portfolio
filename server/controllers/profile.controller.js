const fs = require("fs");
const path = require("path");
const { readJson, writeJson } = require("../utils/jsonDb");

const FILE = "profile.json";

function removeUploadedFile(filePathFromDb) {
  try {
    if (!filePathFromDb || !filePathFromDb.startsWith("/uploads/")) return;
    const full = path.join(__dirname, "../../", filePathFromDb);
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (e) {
    console.warn("Failed to remove old CV:", e.message);
  }
}

async function getProfile(req, res, next) {
  try {
    const profile = await readJson(FILE, {});
    res.json(profile || {});
  } catch (err) {
    next(err);
  }
}

async function upsertProfile(req, res, next) {
  try {
    const existing = await readJson(FILE, {});
    const {
      name,
      role,
      intro,
      about,
      linkedin,
      github,
      contactNo,
      email,
    } = req.body;

    const updated = {
      ...existing,
      name: name ?? existing.name ?? "",
      role: role ?? existing.role ?? "",
      intro: intro ?? existing.intro ?? "",
      about: about ?? existing.about ?? "",
      linkedin: linkedin ?? existing.linkedin ?? "",
      github: github ?? existing.github ?? "",
      contactNo: contactNo ?? existing.contactNo ?? "",
      email: email ?? existing.email ?? "",
      updatedAt: new Date().toISOString(),
      createdAt: existing.createdAt || new Date().toISOString(),
    };

    await writeJson(FILE, updated);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function uploadCv(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "CV file is required" });

    const profile = await readJson(FILE, {});
    if (profile.cvUrl) removeUploadedFile(profile.cvUrl);

    const updated = {
      ...profile,
      cvUrl: `/uploads/${req.file.filename}`,
      updatedAt: new Date().toISOString(),
      createdAt: profile.createdAt || new Date().toISOString(),
    };

    await writeJson(FILE, updated);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  upsertProfile,
  uploadCv,
};