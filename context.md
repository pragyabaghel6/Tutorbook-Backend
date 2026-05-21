# Tutorbook Backend — Codebase Context

A reference for understanding how the codebase is organized and how the core concepts fit together.

---

## Domain Model

The central entity is **`tutor_students`** — a junction record that links a tutor, a student, and a subject, with a monthly fee. Almost everything else hangs off this record.

```
tutors
  └── subjects              (each tutor owns their own subject list)
  └── tutor_students        (one row per tutor × student × subject)
        └── schedules       (weekly recurring slots for this connection)
        └── fees            (one record per calendar month)
        └── attendance      (one record per class date)
        └── whatsapp_reminders  (log of messages sent)

students
  └── parents               (one parent record per student)
  └── tutor_students        (links back to tutor connections)
```

**Key rule:** A tutor teaching the same student two subjects creates *two* `tutor_students` rows. All downstream records (fees, attendance, schedules) reference `tutor_student_id`, not `student_id` or `tutor_id` directly.

---

## Database Enums

| Enum | Values |
|------|--------|
| `plan_type` | `free`, `pro` |
| `fee_status` | `unpaid`, `partial`, `paid` |
| `payment_method` | `cash`, `online` |
| `attendance_status` | `present`, `absent`, `late` |
| `reminder_type` | `fee_due`, `fee_overdue`, `attendance` |
| `reminder_status` | `sent`, `failed` |
| `day_of_week` | `Mon`–`Sun` |

---

## Request Lifecycle

```
Request
  → routes/           (defines HTTP method + path, applies verifyJWT)
  → controllers/      (validates input, calls service or query, sends response)
  → services/         (business logic, orchestrates multiple queries)
  → queries/          (parameterized SQL against the pg pool)
  → PostgreSQL
```

Controllers that need only simple CRUD skip the service layer and call queries directly.

---

## Authentication

- Tutors register and log in via `/api/auth`. Passwords are hashed with bcrypt.
- Login returns a signed JWT containing `{ tutor_id }`.
- `middleware/auth.js` (`verifyJWT`) validates the token on every protected route and attaches the full tutor row to `req.tutor`.
- All routes except `POST /api/auth/register` and `POST /api/auth/login` are protected.

---

## Key Files

| File | Purpose |
|------|---------|
| `index.js` | App bootstrap — mounts all routers, serves React build in prod |
| `config/db.js` | Single shared `pg.Pool` instance, used by all query files |
| `database/schema.sql` | Full PostgreSQL schema — run once to set up tables |
| `middleware/auth.js` | JWT verification; populates `req.tutor` |
| `utils/whatsapp.js` | Sends WhatsApp messages via Twilio or Meta Cloud API (env-driven) |
| `utils/razorpay.js` | Razorpay SDK instance |
| `constants/messages.js` | Centralised response/error message strings |

---

## Fee Tracking

- `fees` has one row per `(tutor_student_id, month)` where `month` is `'YYYY-MM'`.
- The `UNIQUE` constraint prevents duplicate month entries.
- A `chk_paid_date` constraint enforces that `paid_date` must be set when `status = 'paid'`.
- Fee records are created manually by the tutor or auto-generated at enrollment.

---

## Attendance

- `attendance` has one row per `(tutor_student_id, date)`.
- The application layer uses an upsert (`ON CONFLICT DO UPDATE`) so marking attendance twice on the same day updates rather than errors.

---

## Payments (Razorpay)

- `POST /api/payments/create-order` — creates a Razorpay order and returns the `order_id` to the client.
- `POST /api/payments/verify` — verifies the Razorpay signature after client-side payment and updates the relevant fee record.

---

## WhatsApp Reminders

`utils/whatsapp.js` supports two providers, selected by which env vars are set:

1. **Twilio** — if `TWILIO_ACCOUNT_SID` is present.
2. **Meta Cloud API** — if `META_WHATSAPP_TOKEN` is present.

Phone numbers are normalised to Indian format (`+91XXXXXXXXXX`). Every sent message is logged to `whatsapp_reminders`.

---

## Environment Boundaries

| ENV | Behaviour |
|-----|-----------|
| `development` | CORS allows `http://localhost:3000` |
| `production` | CORS allows `https://tutorbook.in`; serves React build from `../client/dist` |

---

## Adding a New Feature — Checklist

1. Add/alter tables in `database/schema.sql`.
2. Write SQL helpers in `queries/<feature>Queries.js`.
3. Add business logic in `services/<feature>Service.js` (if needed).
4. Write the controller in `controllers/<feature>Controller.js`.
5. Add input validation in `validations/<feature>Validation.js`.
6. Mount the router in `routes/<feature>.js` and register it in `index.js`.
