const { v4: uuidv4 } = require("uuid");
const { readJson, writeJson } = require("../utils/jsonDb");

const FILE = "experience.json";

// Get all experience entries
async function getExperience(req, res, next) {
  try {
    const experience = await readJson(FILE, []);
    res.json(experience);
  } catch (err) {
    next(err);
  }
}

// Create a new experience entry
async function createExperience(req, res, next) {
  try {
    const { role, company, duration, description, visible } = req.body;

    if (!role || !company) {
      return res.status(400).json({ message: "role and company are required" });
    }

    const experience = await readJson(FILE, []);
    const newItem = {
      id: uuidv4(),
      role,
      company,
      duration: duration || "",
      description: description || "",
      visible: visible !== undefined ? Boolean(visible) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    experience.push(newItem);
    await writeJson(FILE, experience);
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
}

// Update an existing experience entry
async function updateExperience(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const experience = await readJson(FILE, []);
    const index = experience.findIndex((e) => e.id === id);
    if (index === -1) return res.status(404).json({ message: "Experience not found" });

    experience[index] = {
      ...experience[index],
      ...updates,
      id: experience[index].id,
      updatedAt: new Date().toISOString(),
    };

    await writeJson(FILE, experience);
    res.json(experience[index]);
  } catch (err) {
    next(err);
  }
}

// Delete an experience entry
async function deleteExperience(req, res, next) {
  try {
    const { id } = req.params;
    const experience = await readJson(FILE, []);
    const exists = experience.some((e) => e.id === id);
    if (!exists) return res.status(404).json({ message: "Experience not found" });

    await writeJson(FILE, experience.filter((e) => e.id !== id));
    res.json({ message: "Experience deleted successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
};