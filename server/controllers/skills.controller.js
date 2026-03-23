const { v4: uuidv4 } = require("uuid");
const { readJson, writeJson } = require("../utils/jsonDb");

const FILE = "skills.json";

// Get all skills
async function getSkills(req, res, next) {
  try {
    const skills = await readJson(FILE, []);
    res.json(skills);
  } catch (err) {
    next(err);
  }
}

// Create a new skill
async function createSkill(req, res, next) {
  try {
    const { name, level, category, visible } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const skills = await readJson(FILE, []);
    const newSkill = {
      id: uuidv4(),
      name,
      level: level || "",
      category: category || "General",
      visible: visible !== undefined ? Boolean(visible) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    skills.push(newSkill);
    await writeJson(FILE, skills);
    res.status(201).json(newSkill);
  } catch (err) {
    next(err);
  }
}

// Update an existing skill
async function updateSkill(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const skills = await readJson(FILE, []);
    const index = skills.findIndex((s) => s.id === id);
    if (index === -1) return res.status(404).json({ message: "Skill not found" });

    skills[index] = {
      ...skills[index],
      ...updates,
      id: skills[index].id,
      updatedAt: new Date().toISOString(),
    };

    await writeJson(FILE, skills);
    res.json(skills[index]);
  } catch (err) {
    next(err);
  }
}

// Delete a skill
async function deleteSkill(req, res, next) {
  try {
    const { id } = req.params;
    const skills = await readJson(FILE, []);
    const exists = skills.some((s) => s.id === id);
    if (!exists) return res.status(404).json({ message: "Skill not found" });

    await writeJson(FILE, skills.filter((s) => s.id !== id));
    res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};