const { v4: uuidv4 } = require("uuid");
const { readJson, writeJson } = require("../utils/jsonDb");

const FILE = "skills.json";

function toBool(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
  }
  return Boolean(value);
}

function normalizeText(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

// Get all skills
async function getSkills(req, res, next) {
  try {
    const skills = await readJson(FILE, []);
    res.json(Array.isArray(skills) ? skills : []);
  } catch (err) {
    next(err);
  }
}

// Create a new skill
async function createSkill(req, res, next) {
  try {
    const { name, icon, level, category, visible } = req.body;

    const normalizedName = normalizeText(name);
    if (!normalizedName) {
      return res.status(400).json({ message: "name is required" });
    }

    const skills = await readJson(FILE, []);
    const now = new Date().toISOString();

    const newSkill = {
      id: uuidv4(),
      name: normalizedName,
      icon: normalizeText(icon, ""),
      level: normalizeText(level, ""),
      category: normalizeText(category, "General") || "General",
      visible: toBool(visible, true),
      createdAt: now,
      updatedAt: now,
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
    const updates = req.body || {};

    const skills = await readJson(FILE, []);
    const index = skills.findIndex((s) => s.id === id);
    if (index === -1) return res.status(404).json({ message: "Skill not found" });

    const current = skills[index];

    const nextSkill = {
      ...current,
      ...(updates.name !== undefined ? { name: normalizeText(updates.name) } : {}),
      ...(updates.icon !== undefined ? { icon: normalizeText(updates.icon, "") } : {}),
      ...(updates.level !== undefined ? { level: normalizeText(updates.level, "") } : {}),
      ...(updates.category !== undefined
        ? { category: normalizeText(updates.category, "General") || "General" }
        : {}),
      ...(updates.visible !== undefined
        ? { visible: toBool(updates.visible, current.visible !== false) }
        : {}),
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };

    if (!nextSkill.name) {
      return res.status(400).json({ message: "name is required" });
    }

    skills[index] = nextSkill;
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