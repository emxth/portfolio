const { v4: uuidv4 } = require("uuid");
const { readJson, writeJson } = require("../utils/jsonDb");

const FILE = "projects.json";

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
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

// Create a new project
async function createProject(req, res, next) {
  try {
    const { title, description, techStack, githubUrl, liveUrl, image, featured, visible } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const projects = await readJson(FILE, []);
    const newProject = {
      id: uuidv4(),
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : [],
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      image: image || "",
      featured: Boolean(featured),
      visible: visible !== undefined ? Boolean(visible) : true,
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

// Update an existing project
async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const projects = await readJson(FILE, []);
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) return res.status(404).json({ message: "Project not found" });

    projects[index] = {
      ...projects[index],
      ...updates,
      id: projects[index].id,
      updatedAt: new Date().toISOString(),
    };

    await writeJson(FILE, projects);
    res.json(projects[index]);
  } catch (err) {
    next(err);
  }
}

// Delete a project
async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const projects = await readJson(FILE, []);
    const exists = projects.some((p) => p.id === id);

    if (!exists) return res.status(404).json({ message: "Project not found" });

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