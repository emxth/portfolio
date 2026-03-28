const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { readJson, writeJson } = require("../utils/jsonDb");

const FILE = "projects.json";

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

function normalizeTechStack(techStack) {
  if (Array.isArray(techStack)) return techStack.map((t) => String(t).trim()).filter(Boolean);

  if (typeof techStack === "string") {
    const trimmed = techStack.trim();
    if (!trimmed) return [];

    // Try JSON parse first
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((t) => String(t).trim()).filter(Boolean);
      }
    } catch (_) {
      // ignore parse error -> fallback to comma split
    }

    return trimmed.split(",").map((t) => t.trim()).filter(Boolean);
  }

  return [];
}

function removeUploadedFile(imagePath) {
  try {
    if (!imagePath || !imagePath.startsWith("/uploads/")) return;
    const fullPath = path.join(__dirname, "../../", imagePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (err) {
    console.warn("Failed to remove old image:", err.message);
  }
}

// Get all projects
async function getProjects(req, res, next) {
  try {
    const projects = await readJson(FILE, []);
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

// Get a single project by ID
async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;
    const projects = await readJson(FILE, []);
    const project = projects.find((p) => p.id === id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
}

// Create a new project (multipart-safe)
async function createProject(req, res, next) {
  try {
    const { title, description, techStack, githubUrl, liveUrl, featured, visible } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const projects = await readJson(FILE, []);

    const newProject = {
      id: uuidv4(),
      title: String(title).trim(),
      description: String(description).trim(),
      techStack: normalizeTechStack(techStack),
      githubUrl: githubUrl ? String(githubUrl).trim() : "",
      liveUrl: liveUrl ? String(liveUrl).trim() : "",
      image: req.file ? `/uploads/${req.file.filename}` : "",
      featured: toBoolean(featured, false),
      visible: toBoolean(visible, true),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);
    await writeJson(FILE, projects);

    res.status(201).json(newProject);
  } catch (err) {
    next(err);
  }
}

// Update an existing project (multipart-safe)
async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const projects = await readJson(FILE, []);
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      // If a new file was uploaded for non-existing project, clean it
      if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
      return res.status(404).json({ message: "Project not found" });
    }

    const current = projects[index];
    const updates = req.body || {};

    const nextProject = {
      ...current,
      title: updates.title !== undefined ? String(updates.title).trim() : current.title,
      description:
        updates.description !== undefined ? String(updates.description).trim() : current.description,
      techStack:
        updates.techStack !== undefined ? normalizeTechStack(updates.techStack) : current.techStack,
      githubUrl: updates.githubUrl !== undefined ? String(updates.githubUrl).trim() : current.githubUrl,
      liveUrl: updates.liveUrl !== undefined ? String(updates.liveUrl).trim() : current.liveUrl,
      featured:
        updates.featured !== undefined ? toBoolean(updates.featured, current.featured) : current.featured,
      visible:
        updates.visible !== undefined ? toBoolean(updates.visible, current.visible) : current.visible,
      image: req.file ? `/uploads/${req.file.filename}` : current.image,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };

    // remove old image if replaced
    if (req.file && current.image && current.image !== nextProject.image) {
      removeUploadedFile(current.image);
    }

    projects[index] = nextProject;
    await writeJson(FILE, projects);

    res.json(nextProject);
  } catch (err) {
    next(err);
  }
}

// Delete a project (also delete local image file)
async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const projects = await readJson(FILE, []);
    const project = projects.find((p) => p.id === id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.image) {
      removeUploadedFile(project.image);
    }

    const filtered = projects.filter((p) => p.id !== id);
    await writeJson(FILE, filtered);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};