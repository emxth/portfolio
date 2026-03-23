const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");

const filePath = (fileName) => path.join(DATA_DIR, fileName);

// Ensure the file exists, if not create it with default data
async function ensureFile(fileName, defaultData = []) {
  const fullPath = filePath(fileName);
  try {
    await fs.access(fullPath);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(fullPath, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

// Read JSON data from a file, if the file doesn't exist or is invalid, return default data
async function readJson(fileName, defaultData = []) {
  await ensureFile(fileName, defaultData);
  const fullPath = filePath(fileName);
  const raw = await fs.readFile(fullPath, "utf-8");
  try {
    return JSON.parse(raw || JSON.stringify(defaultData));
  } catch {
    return defaultData;
  }
}

// Write JSON data to a file, ensuring the file exists first
async function writeJson(fileName, data) {
  await ensureFile(fileName, Array.isArray(data) ? [] : {});
  const fullPath = filePath(fileName);
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

module.exports = {
  readJson,
  writeJson,
};