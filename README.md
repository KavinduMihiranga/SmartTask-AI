<div align="center">

# ⚡ SmartTask AI

**AI-powered task management that thinks ahead.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Playwright](https://img.shields.io/badge/Tested-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

[Live Demo](#) · [Report Bug](https://github.com/KavinduMihiranga/SmartTask-AI/issues) · [Request Feature](https://github.com/KavinduMihiranga/SmartTask-AI/issues)

</div>

---

## 🧠 What is SmartTask AI?

SmartTask AI is a full-stack productivity app that uses the **Gemini AI** to automatically break down any task into 3 actionable sub-steps — so you always know exactly what to do next.

Just type a task like *"Build a REST API"* and the AI instantly generates a structured plan for you.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Sub-tasks** | Gemini AI breaks any task into 3 actionable steps automatically |
| 🔐 **Secure Auth** | JWT-based authentication with bcrypt password hashing |
| ✅ **Task CRUD** | Create, read, update, and delete tasks with full persistence |
| 💾 **State Persistence** | Sub-task completion status survives page reloads |
| 🧪 **Tested** | E2E coverage with Playwright + API coverage with Jest/Supertest |

---

## 🛠 Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- Axios + React Router

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- Google Gemini AI (`@google/genai`)

**Testing**
- Playwright (E2E)
- Jest + Supertest (API)

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [Atlas](https://cloud.mongodb.com))
- A [Gemini API key](https://ai.google.dev)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/KavinduMihiranga/SmartTask-AI.git
cd SmartTask-AI

# 2. Install backend dependencies
cd backend && npm install

# 3. Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

### Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

Make sure both the backend and frontend are running before executing E2E tests.

```bash
# API tests (Jest + Supertest)
cd backend
npm test

# E2E tests (Playwright)
npx playwright test

# View Playwright HTML report
npx playwright show-report
```

> **Note:** Before running E2E tests, register a test account with `playwright@test.com` / `test123` via the app's register page.

---

## 📁 Project Structure

```
SmartTask-AI/
├── backend/
│   ├── controllers/       # Auth, Task, AI logic
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── tests/             # Jest/Supertest API tests
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar
│   │   ├── context/       # Auth context
│   │   └── pages/         # Login, Register, Dashboard
│   └── index.html
└── tests/
    └── e2e.test.js        # Playwright E2E tests
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/KavinduMihiranga">Kavindu Mihiranga</a>
</div>
