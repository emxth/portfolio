const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { readJson } = require("../utils/jsonDb");

const USERS_FILE = "users.json";

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

async function login(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({
        message: "Provide username (or email) and password",
      });
    }

    const users = await readJson(USERS_FILE, []);
    const user = users.find((u) =>
      username
        ? u.username?.toLowerCase() === username.toLowerCase()
        : u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: user.id,
      username: user.username,
      role: user.role || "admin",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email || "",
        role: user.role || "admin",
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
};