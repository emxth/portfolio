const path = require("path");
const dotenv = require("dotenv");

const envFile =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, ".env.production")
    : path.join(__dirname, ".env");

dotenv.config({ path: envFile });

const app = require("./app");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} (${process.env.NODE_ENV || "development"})`);
});