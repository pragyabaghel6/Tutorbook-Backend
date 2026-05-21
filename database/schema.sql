-- =============================================================================
-- TutorBook — PostgreSQL Schema
-- Run this file once against your Neon.tech database to set up all tables.
-- =============================================================================


-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE plan_type        AS ENUM ('free', 'pro');
CREATE TYPE fee_status       AS ENUM ('unpaid', 'partial', 'paid');
CREATE TYPE payment_method   AS ENUM ('cash', 'online');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE reminder_type    AS ENUM ('fee_due', 'fee_overdue', 'attendance');
CREATE TYPE reminder_status  AS ENUM ('sent', 'failed');
CREATE TYPE day_of_week      AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');


-- =============================================================================
-- 1. TUTORS
-- Primary account table. One row = one tutor who owns the account.
-- =============================================================================

CREATE TABLE tutors (
    id            SERIAL          PRIMARY KEY,
    first_name    VARCHAR(100)    NOT NULL,
    last_name     VARCHAR(100),
    email         VARCHAR(255)    NOT NULL UNIQUE,
    password_hash TEXT            NOT NULL,
    phone         VARCHAR(15),
    plan          plan_type       NOT NULL DEFAULT 'free',
    is_active     BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tutors_email ON tutors (email);


-- =============================================================================
-- 2. SUBJECTS
-- Each tutor defines their own subject list. Not shared globally.
-- e.g. Tutor A: Maths, Physics | Tutor B: English, Hindi
-- =============================================================================

CREATE TABLE subjects (
    id         SERIAL        PRIMARY KEY,
    tutor_id   INTEGER       NOT NULL REFERENCES tutors (id) ON DELETE CASCADE,
    name       VARCHAR(100)  NOT NULL,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_subject_per_tutor UNIQUE (tutor_id, name)
);

CREATE INDEX idx_subjects_tutor_id ON subjects (tutor_id);


-- =============================================================================
-- 3. STUDENTS
-- Students are independent — no tutor_id here.
-- One student can be taught by multiple tutors (linked via tutor_students).
-- =============================================================================

CREATE TABLE students (
    id          SERIAL        PRIMARY KEY,
    first_name  VARCHAR(100)  NOT NULL,
    last_name   VARCHAR(100),
    email       VARCHAR(255),
    contact_no  VARCHAR(15),
    age         SMALLINT      CHECK (age > 0 AND age < 100),
    class       VARCHAR(50),
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- =============================================================================
-- 4. PARENTS
-- One student can have one parent record (father + mother stored together).
-- =============================================================================

CREATE TABLE parents (
    id                   SERIAL        PRIMARY KEY,
    student_id           INTEGER       NOT NULL UNIQUE REFERENCES students (id) ON DELETE CASCADE,
    father_full_name     VARCHAR(200),
    mother_name          VARCHAR(200),
    contact_no           VARCHAR(15),
    alternate_contact_no VARCHAR(15),
    email                VARCHAR(255)
);

CREATE INDEX idx_parents_student_id ON parents (student_id);


-- =============================================================================
-- 5. TUTOR_STUDENTS  (pivot / junction table)
-- Links a tutor → student → subject as one "connection".
-- This is the central FK used by fees, attendance, schedules, and reminders.
-- A tutor teaching the same student two subjects = two rows.
-- =============================================================================

CREATE TABLE tutor_students (
    id           SERIAL          PRIMARY KEY,
    tutor_id     INTEGER         NOT NULL REFERENCES tutors   (id) ON DELETE CASCADE,
    student_id   INTEGER         NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    subject_id   INTEGER         NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    monthly_fee  NUMERIC(10, 2)  NOT NULL CHECK (monthly_fee >= 0),
    start_date   DATE            NOT NULL DEFAULT CURRENT_DATE,
    is_active    BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_tutor_student_subject UNIQUE (tutor_id, student_id, subject_id)
);

CREATE INDEX idx_ts_tutor_id   ON tutor_students (tutor_id);
CREATE INDEX idx_ts_student_id ON tutor_students (student_id);
CREATE INDEX idx_ts_active     ON tutor_students (tutor_id, is_active);


-- =============================================================================
-- 6. SCHEDULES
-- Weekly recurring time slots per tutor-student connection.
-- e.g. Rahul / Maths → Mon 17:00, Wed 17:00
-- =============================================================================

CREATE TABLE schedules (
    id                SERIAL       PRIMARY KEY,
    tutor_student_id  INTEGER      NOT NULL REFERENCES tutor_students (id) ON DELETE CASCADE,
    day               day_of_week  NOT NULL,
    time              TIME         NOT NULL,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schedules_ts_id ON schedules (tutor_student_id);
CREATE INDEX idx_schedules_day   ON schedules (day);


-- =============================================================================
-- 7. FEES
-- One fee record per (tutor_student_id, month).
-- month format: 'YYYY-MM'  e.g. '2024-01'
-- UNIQUE constraint prevents creating two records for the same month.
-- =============================================================================

CREATE TABLE fees (
    id                SERIAL          PRIMARY KEY,
    tutor_student_id  INTEGER         NOT NULL REFERENCES tutor_students (id) ON DELETE CASCADE,
    amount            NUMERIC(10, 2)  NOT NULL CHECK (amount >= 0),
    month             VARCHAR(7)      NOT NULL CHECK (month ~ '^\d{4}-\d{2}$'),
    due_date          DATE,
    paid_date         DATE,
    status            fee_status      NOT NULL DEFAULT 'unpaid',
    payment_method    payment_method,
    note              TEXT,
    created_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_fee_per_month UNIQUE (tutor_student_id, month),
    CONSTRAINT chk_paid_date CHECK (
        (status = 'paid' AND paid_date IS NOT NULL) OR status != 'paid'
    )
);

CREATE INDEX idx_fees_ts_id  ON fees (tutor_student_id);
CREATE INDEX idx_fees_month  ON fees (month);
CREATE INDEX idx_fees_status ON fees (status);


-- =============================================================================
-- 8. ATTENDANCE
-- One row per (tutor_student_id, date).
-- Uses ON CONFLICT DO UPDATE (upsert) in the application layer.
-- =============================================================================

CREATE TABLE attendance (
    id                SERIAL             PRIMARY KEY,
    tutor_student_id  INTEGER            NOT NULL REFERENCES tutor_students (id) ON DELETE CASCADE,
    date              DATE               NOT NULL,
    status            attendance_status  NOT NULL,
    created_at        TIMESTAMPTZ        NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_attendance_per_day UNIQUE (tutor_student_id, date)
);

CREATE INDEX idx_attendance_ts_id ON attendance (tutor_student_id);
CREATE INDEX idx_attendance_date  ON attendance (date);


-- =============================================================================
-- 9. WHATSAPP_REMINDERS
-- Log of every WhatsApp message sent via Twilio or Meta Cloud API.
-- =============================================================================

CREATE TABLE whatsapp_reminders (
    id                SERIAL           PRIMARY KEY,
    tutor_student_id  INTEGER          NOT NULL REFERENCES tutor_students (id) ON DELETE CASCADE,
    reminder_type     reminder_type    NOT NULL,
    message           TEXT             NOT NULL,
    sent_at           TIMESTAMPTZ,
    status            reminder_status  NOT NULL,
    created_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reminders_ts_id   ON whatsapp_reminders (tutor_student_id);
CREATE INDEX idx_reminders_sent_at ON whatsapp_reminders (sent_at DESC);


-- =============================================================================
-- SUMMARY
-- =============================================================================
--
--  tutors
--    └── subjects            (tutor_id → tutors.id)
--    └── tutor_students      (tutor_id → tutors.id)
--          └── schedules         (tutor_student_id → tutor_students.id)
--          └── fees              (tutor_student_id → tutor_students.id)
--          └── attendance        (tutor_student_id → tutor_students.id)
--          └── whatsapp_reminders(tutor_student_id → tutor_students.id)
--
--  students
--    └── parents             (student_id → students.id)
--    └── tutor_students      (student_id → students.id)
--
-- =============================================================================
