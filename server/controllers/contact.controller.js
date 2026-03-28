const nodemailer = require("nodemailer");

function validateEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendContact(req, res, next) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "name, email and message are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_APP_PASSWORD;
    const to = process.env.CONTACT_TO || user;

    if (!user || !pass) {
      return res.status(500).json({ message: "Mail server not configured" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    res.json({ ok: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Mail error:", err);
    return res.status(500).json({
      message: "Failed to send email",
      error: err?.message,
    });
  }
}

module.exports = { sendContact };