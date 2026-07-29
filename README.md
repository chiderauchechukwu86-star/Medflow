# MedFlow — Hospital Management System (MVP)

Smarter Healthcare. Better Patient Care.

A full-stack hospital management MVP built from the MedFlow SDD: authentication & RBAC,
patient/doctor management, appointment booking, consultations, prescriptions, lab requests,
billing, and role-specific dashboards.

## Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React + Vite + TypeScript + Tailwind |
| Backend    | Node.js + Express                    |
| Database   | MongoDB (Mongoose)                   |
| Auth       | JWT + bcrypt                         |
| Data/state | TanStack Query                       |
| Charts     | Recharts                             |

## Project structure

```
medflow/
├── backend/     Express API (auth, patients, doctors, appointments, records,
│                prescriptions, lab tests, bills, admin)
└── frontend/    React app with role-based dashboards
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — a MongoDB Atlas (or local) connection string
- `JWT_SECRET` — any long random string

Then seed demo accounts and start the API:

```bash
npm run seed   # creates admin/doctor/patient demo accounts (password: password123)
npm run dev    # starts on http://localhost:5000
```

Demo accounts after seeding:
- `admin@medflow.dev`
- `doctor@medflow.dev`
- `patient@medflow.dev`
- password for all: `password123`

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api
npm run dev             # starts on http://localhost:5173
```

Open `http://localhost:5173`, log in with a demo account (or register as a new patient),
and you'll land on the dashboard for your role.

## What's implemented

- JWT auth with role-based access control (patient, doctor, nurse, receptionist,
  lab_technician, admin)
- Patient registration (self-service + receptionist-created)
- Doctor profiles with specialization and availability
- Appointment booking with double-booking prevention, status workflow
  (pending → confirmed → completed / cancelled)
- Consultations: doctors record vitals, diagnosis, and treatment as medical records
- Prescriptions with multiple medications per prescription
- Lab test requests with a status pipeline (requested → sample collected → in
  progress → completed)
- Billing: line-item invoices, payment tracking, status
- Admin dashboard: patient/doctor counts, today's appointments, revenue, user
  management (activate/deactivate)
- Dark/light theme toggle, glassmorphism cards, responsive layout — per the SDD's
  UI/UX direction

## Known simplifications (MVP scope, per the SDD's "Deferred for V2")

- No file/image storage (e.g., lab result attachments are text-only)
- No email/SMS notifications
- No cloud deployment config included — deploy the backend (e.g. Render, Railway,
  Fly.io) and frontend (e.g. Vercel, Netlify) separately, pointing `VITE_API_URL`
  at your deployed backend
- The admin analytics page currently reuses the dashboard's stat cards and revenue
  chart; a real weekly-revenue breakdown would need a small aggregation endpoint
- Default password for staff/patients created by an admin or receptionist is
  `changeme123` — wire up a "reset password on first login" flow before using
  this in production

## Security notes before going to production

- Rotate `JWT_SECRET` and store it outside source control
- Add rate limiting and input validation (the SDD lists `express-validator` as a
  dependency — hook it into the routes)
- Restrict CORS `CLIENT_URL` to your real frontend origin
- Put the API behind HTTPS

## Auth/role hardening (2026-07-17)

If your MongoDB Atlas cluster was reused from an earlier project or a different
schema, it can contain `users` documents shaped differently than this app expects
(e.g. `firstName`/`lastName` instead of `name`, or a `role` value like `"user"`
that isn't one of the six roles this app supports). Mongoose does **not**
re-validate documents on read — only on save — so a stale document like that
would previously pass straight through login/register and crash the frontend
nav (`Cannot read properties of undefined (reading 'map')`) the moment it hit
`navByRole[user.role]` with an unrecognized key.

This is now fixed on both ends:

- **Backend** — `User.toSafeObject()` explicitly whitelists the fields it returns
  and normalizes `role` through `backend/src/config/roles.js`, so any stale role
  value is coerced to a valid one (`"patient"` by default) before it ever reaches
  the API response. Run `npm run migrate:legacy-users` once to repair any
  malformed documents already sitting in your Atlas database.
- **Frontend** — `AuthContext` normalizes every user object (fresh login/register
  response, or a cached one from localStorage) through
  `frontend/src/utils/role.ts` before it's stored in state, so `user.role` is
  guaranteed to be one of the six valid roles everywhere else in the app.
  `DashboardLayout` and `DashboardRouter` also have fallback paths so an
  unrecognized role can never blank-screen the app again — worst case, it shows
  a "contact an administrator" message instead of crashing.

Run `npm run migrate:legacy-users` from `backend/` against your Atlas cluster to
clean up any documents this affected.
