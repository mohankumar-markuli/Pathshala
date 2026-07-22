# Pathshala — Step-by-Step Execution Guide

This document provides clear, step-by-step instructions to set up, run, and evaluate both the **Backend REST API** and the **Frontend Web Application** for the Pathshala Multi-Tenant School Management Platform.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**: (Optional, for cloning repository)

---

## 🛠️ Step 1: Set Up & Start the Backend REST API Server

1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Pathshala/Backend
   ```

2. Install all required dependencies:
   ```bash
   npm install
   ```

3. Start the Express REST API backend server:
   ```bash
   npm run dev
   ```
   *(Alternatively, you can run `node src/server.js`)*

4. **Database & Connection Note**:
   - The backend server will automatically connect to MongoDB.
   - If a MongoDB Atlas URI is configured in `.env`, it will attempt connection.
   - If Atlas is unreachable or restricted by IP whitelist, the backend seamlessly falls back to **Local MongoDB** (`mongodb://127.0.0.1:27017/pathshala`) or spins up an **In-Memory Mongo Server** automatically.
   - The server will automatically populate the database with realistic sample demo data on first launch!

5. Verify backend health check by visiting:
   [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

---

## 🎨 Step 2: Set Up & Start the Frontend Web Application

1. Open a second terminal window and navigate to the `Frontend` directory:
   ```bash
   cd Pathshala/Frontend
   ```

2. Install all required frontend packages:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   [http://localhost:5173/](http://localhost:5173/)

---

## 🎭 Step 3: Testing & Evaluating User Personas

The frontend features a top **Interactive Demo Persona Switcher** bar allowing you to switch user roles with a single click:

| Role Persona | Demo Email | Password | Features to Test |
|---|---|---|---|
| **Platform Admin** | `superadmin@pathshala.io` | `password123` | Approve/reject registered schools, view platform-wide metrics |
| **School Owner** | `owner@greenwood.edu` | `password123` | Multi-school dashboard, active student counts across owned institutions |
| **Principal / Admin** | `principal@greenwood.edu` | `password123` | Manage classes, assign homeroom & subject teachers, timetable generator, student enrollment, resolve safety tickets |
| **Teacher** | `ravi.maths@greenwood.edu` | `password123` | View assigned subjects, class roster, and weekly teaching timetable |
| **Guardian (Parent)** | `parent.arjun@gmail.com` | `password123` | View linked children across schools, child class timetable, school notices |

---

## 🔍 Step 4: Key Modules to Explore

1. **Multi-Tenant School Management**:
   - Register new school instances with custom short codes (e.g. `PSH-BLR-03`).
   - Switch to `Platform Admin` persona to approve pending school registrations.

2. **Class & Weekly Timetable Planner**:
   - View weekly period schedules (Monday to Saturday, periods 1–6).
   - Assign homeroom teachers and map subject faculty.

3. **Student Directory & Embedded Guardians**:
   - Enroll new students with manual admission numbers.
   - Track status flow (`active`, `transferred`, `alumni`).
   - View embedded guardian contact information.

4. **Notices & Announcements Hub**:
   - Publish school-wide or class-targeted announcements.

5. **Anonymous Safety & Grievance Box**:
   - Submit confidential safety reports (ragging, bullying, facility issues) without storing submitter user credentials.
   - Switch to Admin persona to review and resolve reported tickets.

---

## ⚙️ Quick Command Reference

```bash
# Terminal 1: Backend
cd Backend
npm install
npm run dev

# Terminal 2: Frontend
cd Frontend
npm install
npm run dev
```
