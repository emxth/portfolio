# Portfolio CMS Platform

A production-ready **full-stack portfolio and admin CMS** built to showcase software engineering projects, skills, and experience with dynamic content management.

This platform includes:

- Public portfolio website (projects, skills, about, contact)
- Secure admin dashboard to manage all content
- File uploads for project images and CV
- Contact form email delivery via Nodemailer
- Deployment-ready configuration for Azure

---

## 🚀 Live Demo

- **Frontend (Public Site):** https://nice-mushroom-0dda2d500.2.azurestaticapps.net
- **Repository:** https://github.com/emxth/portfolio.git

---

## ✨ Features

### Public Website
- Dynamic Hero, About, Projects, Skills, Contact sections
- Search + filter projects by tech stack
- Responsive UI with smooth animations (Framer Motion)
- External links for GitHub, LinkedIn, Live Project URLs
- Download/View CV from uploaded file path

### Admin Dashboard
- JWT-based admin authentication
- Full CRUD for:
  - Projects
  - Skills
  - Experience
  - Profile details (name, role, intro, about, social links, contact)
- Upload project images and CV from dashboard
- Toggle visibility of records without deleting
- Clean modular structure for maintainability

### Backend/API
- RESTful endpoints for all entities
- Protected admin routes
- File upload handling via Multer
- Email sending endpoint (`/api/contact`) using Nodemailer + Gmail App Password
- Security headers via Helmet + CORS support

---

## 🧱 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- Lucide Icons

### Backend
- Node.js
- Express
- JWT (authentication)
- Multer (uploads)
- Nodemailer (email)
- Helmet, CORS, Morgan
- dotenv

### Deployment
- Azure Static Web Apps (frontend)
- Azure App Service (backend)

---

## 📁 Project Structure

```text
portfolio/
├─ client/
│  ├─ public/
│  └─ src/
│     ├─ api/
│     ├─ components/
│     │  └─ sections/
│     └─ pages/
│
├─ server/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ routes/
│  ├─ uploads/
│  ├─ app.js
│  └─ server.js
│
├─ data/
│  ├─ experience.json
│  ├─ profile.json
│  ├─ projects.json
│  ├─ skills.json
│  └─ users.json
|
├─ uploads/
│
└─ .github/workflows/
```

---

## ⚙️ Environment Variables

### `client/.env`
```env
VITE_API_URL=https://emithrandiv.azurewebsites.net/api
```

For local development:
```env
VITE_API_URL=http://localhost:5000/api
```

### `server/.env`
```env
PORT=5000
JWT_SECRET=your_jwt_secret

MAIL_USER=yourgmail@gmail.com
MAIL_APP_PASSWORD=your_16_char_google_app_password
CONTACT_TO=yourgmail@gmail.com
```

> Use **Google App Password**, not normal Gmail password.

---

## 🛠️ Local Development

### 1) Install dependencies
From root:
```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 2) Run frontend + backend together
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 📬 Contact Form Setup (Nodemailer + Gmail)

1. Enable 2-Step Verification on your Google account  
2. Generate App Password (Google Account → Security → App Passwords)
3. Set `MAIL_USER` and `MAIL_APP_PASSWORD` in `server/.env`
4. Restart backend server

---

## 🔐 Security Notes

- Keep all secrets in environment variables (never commit `.env`)
- Use HTTPS in production
- Restrict CORS origins for production domains
- Rotate JWT secret and email credentials periodically

---

## 📈 Engineering Highlights

- Modularized admin architecture for long-term maintainability
- Deployment-friendly URL handling (`VITE_API_URL` + shared asset URL helper)
- Robust fallback logic for API data and UI resilience
- Production-aware middleware setup (Helmet/CORS)

---

## 🧪 Future Improvements

- Role-based access control for admin users
- Rich-text editor for profile/about sections
- Pagination + sorting in admin tables
- Image optimization pipeline
- Rate limiting + anti-spam protection on contact API

---

## 👨‍💻 Author

**Emith Arachchi**  
Software Engineer (Full-Stack)

- GitHub: https://github.com/emxth
- LinkedIn: https://linkedin.com/in/emithr

---
If this project helped you, consider giving it a ⭐ on GitHub.