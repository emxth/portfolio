const express = require("express");
const { sendContact } = require("../controllers/contact.controller");

const router = express.Router();

router.post("/", sendContact);

module.exports = router;