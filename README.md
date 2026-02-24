# 🏫 School Management System (ERP)

A full-stack School ERP application with role-based dashboards for **Admins**, **Teachers**, and **Students**. Built with modern web technologies and integrated with Razorpay for online fee payments.

---

## 📦 Project Structure

```
school-management-system/
├── backend/                # Express.js REST API
│   ├── prisma/             # Prisma schema & migrations
│   └── src/
│       ├── controllers/    # Route handlers
│       ├── routes/         # API routes
│       ├── middlewares/    # Auth & RBAC middleware
│       ├── config/         # DB & env config
│       └── utils/          # Helper utilities
│
├── school-erp-frontend/    # React SPA
│   └── src/
│       ├── app/pages/      # Role-based pages (admin, teacher, student)
│       ├── components/     # Shared UI components
│       └── services/       # API service layer (Axios)
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express 5, Prisma ORM, PostgreSQL (NeonDB) |
| **Frontend** | React 19, Vite 7, TailwindCSS 4, React Router v6 |
| **Auth** | JWT with bcrypt password hashing |
| **Payments** | Razorpay (order creation + verification) |
| **API Client** | Axios with auth interceptors |

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based login with role detection (Admin / Teacher / Student)
- Protected routes with role-based access control (RBAC)
- Bcrypt password hashing

### 👨‍💼 Admin Dashboard
- **Student Management** — Add, view, and manage students by class
- **Teacher Management** — Add teachers, assign classes and subjects
- **Fee Management** — Create fee structures per class/academic year, track due status
- **Reports** — View attendance and academic reports

### 👩‍🏫 Teacher Dashboard
- **Attendance** — Mark daily attendance per class/subject with present/absent toggle
- **Attendance Summary** — View attendance reports and statistics
- **Marks Entry** — Enter exam marks for students in assigned classes
- **Marks Summary** — Review marks data across exams

### 🎓 Student Dashboard
- **Attendance** — View personal attendance records
- **Results** — View exam results and marks
- **Fee Status** — Check pending and paid fees
- **Online Payments** — Pay fees online via Razorpay

---

## 📊 Database Schema

```mermaid
erDiagram
    User ||--o| Student : "has"
    User ||--o| Teacher : "has"
    Student }o--|| Classroom : "belongs to"
    Teacher }o--o{ Classroom : "teaches"
    Teacher }o--o{ Subject : "teaches"
    Classroom ||--o{ Exam : "has"
    Subject ||--o{ Exam : "has"
    Exam ||--o{ Marks : "has"
    Student ||--o{ Marks : "scored"
    Student ||--o{ Attendance : "has"
    Classroom ||--o{ FeeStructure : "has"
    FeeStructure ||--o{ FeeDue : "generates"
    Student ||--o{ FeeDue : "owes"
    FeeDue ||--o{ Payment : "paid via"
```

**Roles:** `ADMIN` · `TEACHER` · `STUDENT` · `PARENT`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** database (or [NeonDB](https://neon.tech) account)
- **Razorpay** account (for fee payments)

### 1. Clone the repository

```bash
git clone https://github.com/appasabkambale/school-management-system.git
cd school-management-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your credentials
# DATABASE_URL=postgresql://user:pass@host:5432/dbname
# JWT_SECRET=your_jwt_secret
# RAZORPAY_KEY_ID=rzp_test_xxx
# RAZORPAY_KEY_SECRET=xxx

# Generate Prisma client & run migrations
npx prisma generate
npx prisma migrate dev

# Start the server (default: http://localhost:5000)
npm run dev
```

### 3. Frontend Setup

```bash
cd school-erp-frontend

# Install dependencies
npm install

# Start dev server (default: http://localhost:5173)
npm run dev
```

---

## 📡 API Endpoints

| Module | Method | Endpoint | Auth |
|--------|--------|----------|------|
| **Auth** | POST | `/api/auth/login` | Public |
| **Auth** | POST | `/api/auth/register` | Admin |
| **Students** | GET | `/api/students` | Admin |
| **Students** | POST | `/api/students` | Admin |
| **Teachers** | GET | `/api/teachers` | Admin |
| **Teachers** | POST | `/api/teachers` | Admin |
| **Classes** | GET/POST | `/api/classes` | Admin |
| **Subjects** | GET/POST | `/api/subjects` | Admin |
| **Attendance** | POST | `/api/attendance` | Teacher |
| **Attendance** | GET | `/api/attendance/student/:id` | Student |
| **Exams** | GET/POST | `/api/exams` | Admin/Teacher |
| **Marks** | POST | `/api/marks` | Teacher |
| **Results** | GET | `/api/results/student/:id` | Student |
| **Fees** | GET/POST | `/api/fees` | Admin |
| **Payments** | POST | `/api/payments/create` | Student |
| **Payments** | POST | `/api/payments/verify` | Student |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `PORT` | Server port (default: 5000) |

---

## 📄 License

This project is private and not licensed for public use.
