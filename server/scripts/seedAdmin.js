require("dotenv").config();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { readJson, writeJson } = require("../utils/jsonDb");

const USERS_FILE = "users.json";

async function seedAdmin() {
  const users = await readJson(USERS_FILE, []);

  const existingAdmin = users.find((u) => u.role === "admin");
  if (existingAdmin) {
    console.log("Admin already exists:");
    console.log({
      username: existingAdmin.username,
      email: existingAdmin.email,
      id: existingAdmin.id,
    });
    process.exit(0);
  }

  // Change these once after first seed if needed
  const plainPassword = "Admin@12345";
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const admin = {
    id: uuidv4(),
    username: "admin",
    email: "admin@portfolio.local",
    passwordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(admin);
  await writeJson(USERS_FILE, users);

  console.log("Admin created successfully:");
  console.log({
    username: admin.username,
    email: admin.email,
    password: plainPassword,
  });
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Failed to seed admin:", err);
  process.exit(1);
});