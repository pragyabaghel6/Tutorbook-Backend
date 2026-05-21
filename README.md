# Tutorbook Backend

REST API server for the Tutorbook platform — a tutor management app for tracking students, schedules, fees, attendance, and payments.

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** PostgreSQL (Neon.tech)
- **Auth:** JWT (Bearer tokens)
- **Payments:** Razorpay
- **Notifications:** WhatsApp via Twilio or Meta Cloud API

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (Neon.tech recommended)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=5432

# Auth
JWT_SECRET=

# Razorpay (optional)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# WhatsApp — Twilio (pick one provider)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=

# WhatsApp — Meta Cloud API (pick one provider)
META_WHATSAPP_TOKEN=
META_PHONE_NUMBER_ID=

# App
PORT=8000
NODE_ENV=development
```

### Database Setup

Run the schema once against your database:

```bash
node database/runSchema.js
```

### Run

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:8000` by default.

## API Overview

All routes except `/api/auth/register` and `/api/auth/login` require a `Authorization: Bearer <token>` header.

| Prefix               | Description                            |
|----------------------|----------------------------------------|
| `POST /api/auth`     | Register, login, get current tutor     |
| `GET/POST /api/students` | Manage student records             |
| `GET/POST /api/subjects` | Manage subjects per tutor          |
| `GET/POST /api/enrollments` | Link students to tutor+subject  |
| `GET/POST /api/schedules`   | Weekly recurring class slots    |
| `GET/POST /api/fees`        | Monthly fee records             |
| `GET/POST /api/attendance`  | Mark and view attendance        |
| `POST /api/reminders/send`  | Send WhatsApp fee/attendance reminders |
| `POST /api/payments`        | Razorpay order creation and verification |
| `GET /api/dashboard/summary` | Aggregated stats for the tutor dashboard |

## Project Structure

```
├── config/         # Database connection pool
├── constants/      # Shared message strings
├── controllers/    # Request handlers (thin layer, calls services)
├── database/       # schema.sql and runSchema.js
├── middleware/      # JWT auth middleware
├── queries/        # Raw SQL query functions
├── routes/         # Express routers
├── services/       # Business logic
├── utils/          # Razorpay and WhatsApp helpers
├── validations/    # Request body validators
└── index.js        # App entry point
```

## Production

In production (`NODE_ENV=production`), the server serves the React frontend build from `../client/dist` and allows requests only from `https://tutorbook.in`.
