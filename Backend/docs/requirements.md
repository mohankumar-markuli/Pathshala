# Pathshala — Requirements Gathering

> **Project**: Pathshala School Management System
> **Type**: Backend REST API
> **Stack**: Node.js · Express · MongoDB (Mongoose)
> **Last Updated**: July 2026

---

## Document Status

| Status | Meaning |
|---|---|
| 🟡 **DRAFT** | Section is being written / under discussion |
| 🔵 **IN REVIEW** | Section is complete and awaiting stakeholder approval |
| ✅ **APPROVED** | Section is signed off — locked for development |
| 🔴 **BLOCKED** | Section has open questions that must be resolved before approval |

### Section Approval Tracker

| Section | Status | Approved By | Approved On | Notes |
|---|---|---|---|---|
| Project Overview | ✅ APPROVED | Mohankumar | July 2026 | — |
| Stakeholders | ✅ APPROVED | Mohankumar | July 2026 | — |
| Platform Access | ✅ APPROVED | Mohankumar | July 2026 | — |
| User Roles & Personas | ✅ APPROVED | Mohankumar | July 2026 | — |
| Auth & Authorization | ✅ APPROVED | Mohankumar | July 2026 | — |
| Platform System Admin | ✅ APPROVED | Mohankumar | July 2026 | — |
| School Management | ✅ APPROVED | Mohankumar | July 2026 | — |
| Owner Management | ✅ APPROVED | Mohankumar | July 2026 | — |
| Self-Service OTP Registration | ✅ APPROVED | Mohankumar | July 2026 | — |
| Employee Management | ✅ APPROVED | Mohankumar | July 2026 | — |
| Teacher Subject Assignment | ✅ APPROVED | Mohankumar | July 2026 | — |
| Student Profile & Guardian Access | ✅ APPROVED | Mohankumar | July 2026 | — |
| Student Management & Lifecycle | ✅ APPROVED | Mohankumar | July 2026 | — |
| Class Management | ✅ APPROVED | Mohankumar | July 2026 | — |
| Timetable Management | ✅ APPROVED | Mohankumar | July 2026 | — |
| Alumni Network | ✅ APPROVED | Mohankumar | July 2026 | — |
| School Notifications | ✅ APPROVED | Mohankumar | July 2026 | — |
| Analytics & Reporting | 🔵 IN REVIEW | — | — | Newly added — pending approval |
| Non-Functional Requirements | ✅ APPROVED | Mohankumar | July 2026 | — |
| API Design Principles | ✅ APPROVED | Mohankumar | July 2026 | — |
| Constraints & Assumptions | ✅ APPROVED | Mohankumar | July 2026 | — |
| Out of Scope (v1) | 🔵 IN REVIEW | — | — | Pending final confirmation |
| Open Questions | ✅ APPROVED | Mohankumar | July 2026 | All Q1–Q6 resolved |

> **Overall Document Status**: 🔵 **IN REVIEW**
> Ready for final stakeholder sign-off before development begins.
> Update the tracker above and the footer status when all sections are approved.

---

## Approval Workflow

Before development begins, this document must pass through the following stages:

```
[1] DRAFT        → Author writes / updates each section
[2] IN REVIEW    → Shared with stakeholders for comment
[3] APPROVED     → Stakeholder signs off, section locked
[4] DEVELOPMENT  → Approved sections handed to dev team
```

**Rules:**
- No code may be written for a section still in DRAFT or BLOCKED state.
- Any change after APPROVED status must go through a new review cycle and be logged in the Changelog below.
- Open Questions must all be resolved before the document can be marked fully APPROVED.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Stakeholders](#stakeholders)
3. [Platform Access](#platform-access)
4. [User Roles & Personas](#user-roles--personas)
5. [Functional Requirements](#functional-requirements)
   - [1. Authentication & Authorization](#1-authentication--authorization)
   - [1a. Platform System Admin](#1a-platform-system-admin)
   - [2. School Management](#2-school-management)
   - [3. Owner Management](#3-owner-management)
   - [3a. Self-Service OTP Registration](#3a-self-service-otp-registration)
   - [4. Employee Management](#4-employee-management)
   - [4a. Teacher Subject Assignment](#4a-teacher-subject-assignment)
   - [5. Student Profile & Guardian Access](#5-student-profile--guardian-access)
   - [6. Student Management & Lifecycle](#6-student-management--lifecycle)
   - [7. Class Management](#7-class-management)
   - [8. Timetable Management](#8-timetable-management)
   - [9. Alumni Network](#9-alumni-network)
   - [10. School Notifications](#10-school-notifications)
   - [11. Analytics & Reporting](#11-analytics--reporting)
6. [Non-Functional Requirements](#non-functional-requirements)
7. [API Design Principles](#api-design-principles)
8. [Constraints & Assumptions](#constraints--assumptions)
9. [Out of Scope (v1)](#out-of-scope-v1)
10. [Open Questions](#open-questions)
11. [Changelog](#changelog)

---

## Project Overview

**Pathshala** is a multi-tenant school management backend that allows:
- Multiple school owners to manage one or more schools
- School staff (teachers, admins, principals, etc.) to manage day-to-day operations
- Guardians (parents, relatives, legal guardians) to access their children's information
- Students to be enrolled across schools with cross-school guardian access

The system is a **REST API** consumed by **two client surfaces**:

| Client | Who Has Access |
|---|---|
| **Web Application** | All end users — Owner, Employee, Student, Guardian, Alumni, Platform Admin |
| **Mobile App** | Students, Employees, and Owners only |

---

## Stakeholders

| Stakeholder | Role in System | Primary Concern |
|---|---|---|
| School Owner | Creates & manages school accounts | Multi-school access, ownership transfer |
| Principal / VP | Senior admin of a school | Staff & academic management |
| Admin Staff | Day-to-day school operations | Student enrolment, timetables, notifications |
| Teacher | Teaches subjects, marks grades | Subject roster, grades |
| Guardian | Monitors child's progress via student profile | Grades, attendance, fees, timetable |
| Alumni | Former student, stays on platform | Alumni network, school connection |
| System Admin | Platform-level administration | School onboarding, user management |

---

## Platform Access

Pathshala is available on **two client surfaces**. Access is determined by user type, not role.

| User Type | Web App | Mobile App | Notes |
|---|---|---|---|
| **Owner** | ✅ | ✅ | Full management access on both |
| **Employee** (all roles) | ✅ | ✅ | All roles: teacher, admin, principal, etc. |
| **Student** | ✅ | ✅ | Own profile, timetable, notices |
| **Guardian** | ✅ | ❌ | Web portal only — child progress, notices |
| **Alumni** | ✅ | ❌ | Web portal only — alumni profile, history |
| **Platform Admin** | ✅ | ❌ | Web admin panel only |

> **Design implication**: The REST API is identical for both surfaces. Client type is communicated via a request header (`X-Client: web` or `X-Client: mobile`). The backend does **not** enforce access by client surface — client apps are responsible for showing/hiding the mobile UI to the appropriate user types. In v1, no server-side enforcement is needed.

---

## User Roles & Personas

### Owner
- Can own **multiple schools**
- A school can have **multiple owners**
- Has full administrative access to their schools
- Can appoint other owners or revoke ownership

### Employee
- Belongs to **one school**
- Can have **multiple roles** simultaneously:
  ```
  admin | teacher | principal | vice_principal |
  librarian | accountant | counselor | coordinator
  ```
- Role determines which features they can access

#### Admin (role)
The Admin employee role has broad day-to-day powers within a school:
- Manage teachers (add, deactivate, update roles)
- Assign subjects to teachers in classes
- Manage timetables (create, edit class timetables)
- Enroll students into the school and classes
- Send school-level notifications to guardians (parents portal)

#### Principal (role)
The Principal has all admin powers **plus**:
- Final authority on subject-teacher assignment
- Manage timetables
- View all reports

### Guardian Access (via Student Profile)
- Guardian is **not a separate entity** — guardian info is embedded inside the student's profile
- When a student is enrolled, their guardian(s) are added as part of the student record
- Each guardian can be given a **user login** (optional) to access the portal
- A guardian's portal login shows a **"My Children" switcher** if they are linked to multiple students across different schools

> **Dual-Role Rule (Q1 Decision)**: An employee (e.g. a teacher) whose child studies at the same school **can also be a guardian**. They log in with their **staff credentials** (username + password). The system additionally checks if the logged-in `userId` appears in any `student.guardians[].userId` and grants guardian context for those children. No separate guardian account is created — the employee's existing `userId` is stored in `guardians[].userId`. Their credentials remain those of an employee; they simply get access to guardian portal routes for their own children.
- Guardian access level controls what they see:
  - `full` — attendance, grades, timetable, fees, notices
  - `view_only` — read-only attendance & grades
  - `emergency_only` — no login, just a contact record
- Relation can be any of 13 defined types (father, uncle, legal guardian, etc.)
- **Login method**: Phone OTP or Email OTP — no password required initially
- Guardian can **later set or update** their email and password at any time with re-verification
- Once email + password is set, they can use either login method

### Student
- Enrolled in **one school** at a time
- Has guardian(s) embedded in their profile
- Assigned to one class per academic year
- **Never hard-deleted** — record is permanent
- On leaving/transfer: status changes with a reason & exit info
- **Class history is preserved** — every class a student has ever been in is stored in `classHistory[]` on their record (Q6 Decision)
- On graduation or transfer: full academic history (class history, grades, etc.) is carried forward as part of their **Alumni** profile
- Alumni data is accessible on the **mobile app** as a "memories" view for the student

### Alumni
- A former student whose profile has been converted to alumni status
- Stays in the same application, visible in the school's **Alumni Network**
- Their school connection and academic history is preserved
- Alumni can optionally have a login to access their alumni profile

---

## Functional Requirements

### 1. Authentication & Authorization

Pathshala uses **two distinct login paths** depending on who is logging in:

#### Path A — Owner & Employee Login (Username + Password)

School staff accounts are created by the school. They log in with a **username and password**.

| ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | Owner/Employee accounts created with a username and password | Must |
| AUTH-02 | Username must be unique within the platform | Must |
| AUTH-03 | Passwords must be hashed using bcrypt | Must |
| AUTH-04 | Login returns a signed JWT token | Must |
| AUTH-05 | JWT expiry is **client-surface-aware**: **1 day** for web (`X-Client: web`), **7 days** for mobile (`X-Client: mobile`) | Must |
| AUTH-06 | Role-based access control (RBAC) enforced by middleware | Must |
| AUTH-07 | Password reset via email OTP for staff | Should |
| AUTH-08 | Account deactivation (`isActive: false`, no data loss) | Must |

#### Path B — Guardian Login (OTP-based, no password required)

Guardian accounts are created when a student is enrolled. They log in using **Phone OTP or Email OTP**. No password is required initially.

| ID | Requirement | Priority |
|---|---|---|
| AUTH-09 | Guardian login via **Phone OTP** (SMS to registered mobile) | Must |
| AUTH-10 | Guardian login via **Email OTP** (to registered email) | Must |
| AUTH-11 | OTP is 6 digits, expires in 5 minutes, single-use | Must |
| AUTH-12 | Guardian login returns a JWT token (same pattern as staff) | Must |
| AUTH-13 | Guardian can **add or update email + password** at any time | Must |
| AUTH-14 | Updating email or password requires re-verification via OTP | Must |
| AUTH-15 | Once email + password is set, guardian can log in via either method | Should |
| AUTH-16 | Guardian account linked by phone number stored in `student.guardians[]` | Must |

#### Login Method Summary

| User Type | Default Login | Can Switch To |
|---|---|---|
| Owner | Username + Password | — |
| Principal / Employee | Username + Password | — |
| Guardian | Phone OTP or Email OTP | Email + Password (optional, set later) |
| Alumni | Email OTP or Email + Password | Both |


**Access Matrix:**

| Action | Owner | Principal | Admin | Teacher | Guardian |
|---|---|---|---|---|---|
| Create school | Yes | No | No | No | No |
| Manage employees | Yes | Yes | Yes | No | No |
| Enroll student | Yes | Yes | Yes | No | No |
| Add/edit student guardian | Yes | Yes | Yes | No | No |
| View attendance | Yes | Yes | Yes | Yes | Yes (own child) |
| Mark attendance | Yes | Yes | Yes | Yes | No |
| View grades | Yes | Yes | Yes | Yes (all subjects) | Yes (own child) |
| Mark grades | Yes | Yes | Yes | Yes (own subjects only) | No |
| Assign subjects to teachers | Yes | Yes | Yes | No | No |
| Manage timetable | Yes | Yes | Yes | No | No |
| View timetable | Yes | Yes | Yes | Yes (own class) | Yes (own child) |
| Send school notifications | Yes | Yes | Yes | No | No |
| Mark student as transferred/left | Yes | Yes | Yes | No | No |
| Convert student to alumni | Yes | Yes | No | No | No |
| Approve school registration | No | No | No | No | No — Platform Admin only |
| Approve ownership | No | No | No | No | No — Platform Admin only |
| Approve employee | Yes | Yes | Yes | No | No — School Admin |
| Approve student enrolment | Yes | Yes | Yes | No | No — School Admin |

---

### 1a. Platform System Admin

A separate super-admin role that operates **outside** of any school. Manages the platform itself.

| ID | Requirement | Priority |
|---|---|---|
| SYS-01 | Platform Admin can view all schools registered on the platform | Must |
| SYS-02 | Platform Admin approves or rejects new school registrations | Must |
| SYS-03 | Platform Admin approves or rejects owner registration requests | Must |
| SYS-04 | Platform Admin can deactivate a school or owner | Must |
| SYS-05 | A school in `pending` state cannot be used until approved | Must |
| SYS-06 | An owner in `pending` state cannot manage schools until approved | Must |
| SYS-07 | Platform Admin receives notification when a new school or owner registers | Should |
| SYS-08 | Platform Admin can add rejection reason when rejecting | Must |

#### Approval Status Enum (platform-level)
```
pending | approved | rejected
```

---

### 2. School Management

| ID | Requirement | Priority |
|---|---|---|
| SCH-01 | Owner submits a new school registration request | Must |
| SCH-02 | School starts in `approvalStatus: "pending"` — not usable until approved | Must |
| SCH-03 | Platform Admin approves or rejects the school (SYS-02) | Must |
| SCH-04 | Update school details (name, logo, contact info) | Must |
| SCH-05 | Soft-delete a school (`isActive: false`) | Must |
| SCH-06 | List all schools (with pagination & filters) | Must |
| SCH-07 | Get school by ID with populated owners | Must |
| SCH-08 | Filter schools by city, board, approval status | Should |
| SCH-09 | Upload school logo (URL stored) | Should |

---

### 3. Owner Management

| ID | Requirement | Priority |
|---|---|---|
| OWN-01 | Register as an owner — starts in `approvalStatus: "pending"` | Must |
| OWN-02 | Platform Admin approves or rejects owner registration (SYS-03) | Must |
| OWN-03 | Approved owner can create and manage their school(s) | Must |
| OWN-04 | Owner can appoint additional co-owners for a school | Should |
| OWN-05 | Owner can revoke co-ownership from another owner | Should |
| OWN-06 | Owner profile linked to a `users` login (username + password) | Must |
| OWN-07 | Deactivate an owner account (`isActive: false` on `users`) | Must |
| OWN-08 | Get owner profile with list of owned schools | Must |

---

### 3a. Self-Service OTP Registration

There is **no manual token generation**. The admin team simply pre-creates the student or employee record with their email and phone number. When the person is ready to register, they initiate it themselves.

**Trigger**: User goes to the registration page and enters their **email + school code**.
**Verification**: System checks the email exists in that school's records, then sends an OTP.
**Confirmation**: User enters the OTP (valid 10 minutes) → account created.

| ID | Requirement | Priority |
|---|---|---|
| REG-01 | Admin pre-creates student/employee record with `email` and `phone` | Must |
| REG-02 | User initiates registration by entering their **email** + **school code** | Must |
| REG-03 | System looks up the email in that school's `students` or `employees` records | Must |
| REG-04 | If no match found — registration is denied (no account exists for that email at that school) | Must |
| REG-05 | On match, system generates a 6-digit OTP and sends it to **both email and phone** | Must |
| REG-06 | OTP is valid for **10 minutes** only | Must |
| REG-07 | OTP is single-use — consumed once confirmed | Must |
| REG-08 | User must confirm OTP to complete registration | Must |
| REG-09 | On OTP confirmation — `users` account is created and linked to the student/employee record | Must |
| REG-10 | User can request OTP to be **resent** (rate limited: max 3 per hour) | Must |
| REG-11 | Each school has a unique **school code** (short alphanumeric, e.g. `PSH-BLR-01`) used to identify the school at registration | Must |
| REG-12 | School code is shown on the school's dashboard for admins to share with staff/parents | Must |

#### Registration Flow

```
Admin pre-creates record
  +----------------------------------------+
  |  Student:  name, email, phone, class   |
  |  Employee: name, email, phone, roles   |
  +----------------------------------------+
           (no notification sent yet)

When user is ready to register:

Step 1 — User enters on registration page:
  |  email:       ravi@example.com
  |  school code: PSH-BLR-01
  |
  V  Backend:
  +- Find school by code → schoolId
  +- Look up email in students[] or employees[] for that school
      +- Not found → "No record found for this email at this school"
      +- Found → Generate 6-digit OTP
                    Send OTP to email + phone
                    Return: { entityType, entityId, otpSentTo }

Step 2 — User enters OTP:
  |  otp: 482916
  |
  V  Backend:
  +- OTP expired (>10 min) → "OTP expired. Request a new one."
  +- OTP wrong → "Invalid OTP"
  +- OTP valid → Create users account
                   Link profileId to student/employee record
                   Mark OTP as used
                   Return: JWT token (logged in)
```

#### `registrationOtps` Schema

```js
// Temporary collection — documents expire automatically after 10 min (TTL index)
{
  _id:         ObjectId,
  email:       String,         // Email entered by user
  schoolId:    ObjectId,       // → schools._id (found by school code)
  entityType:  String,         // "student" | "employee"
  entityId:    ObjectId,       // → students._id | employees._id
  otpHash:     String,         // bcrypt hash of the 6-digit OTP
  expiresAt:   Date,           // 10 minutes from generation (TTL)
  isUsed:      Boolean,        // true once confirmed
  attempts:    Number,         // Wrong OTP attempt count (max 5, then block)
  createdAt:   Date
}
```

#### Key API Endpoints

```
// Step 1: User submits email + school code
POST /api/v1/register/request-otp
Body: { email: "ravi@example.com", schoolCode: "PSH-BLR-01" }
→ Looks up email in school records
→ Sends OTP to email + phone
→ Returns: { otpId, expiresAt, maskedPhone: "+91 ****3210" }

// Resend OTP (rate limited)
POST /api/v1/register/resend-otp
Body: { otpId: "..." }

// Step 2: User submits OTP + completes profile
POST /api/v1/register/verify-otp
Body: {
  otpId:    "...",
  otp:      "482916",
  password: "...",          // Optional — only if user wants password login too
  username: "ravi.kumar"    // For employees only
}
→ Creates users account
→ Returns: { token: "<JWT>", profileType, redirectTo }
```

---

### 4. Employee Management

> **Registration**: Employee self-registers using their **email + school code** and OTP verification (see section 3a). Admin must pre-create the employee record with the correct email and phone before registration is possible.

| ID | Requirement | Priority |
|---|---|---|
| EMP-01 | Add an employee to a school | Must |
| EMP-02 | Assign one or more roles to an employee | Must |
| EMP-03 | Update employee roles (add/remove individual roles) | Must |
| EMP-04 | Deactivate an employee (`isActive: false`) | Must |
| EMP-05 | List all employees in a school with role filter | Must |
| EMP-06 | Get employee details by ID or employee code | Must |
| EMP-07 | Assign an employee as homeroom teacher for a class | Must |
| EMP-08 | Search employees by name, department, or role | Should |
| EMP-09 | Assign a teacher to one or more subjects in a class | Must |
| EMP-10 | A teacher can only mark grades for their assigned subjects | Must |

---

### 4a. Teacher Subject Assignment

Teachers must be **assigned to specific subjects within a class** before they can mark grades. A teacher has no access to grade a subject they don't teach, even if they are a teacher in the same school.

#### Model Implication

The `classes` document gets a `subjects[]` embedded array:

```js
// Inside the classes collection
{
  _id:      ObjectId,
  schoolId: ObjectId,
  name:     "Grade 5",
  section:  "A",
  subjects: [
    { name: "Mathematics",        teacherId: ObjectId },  // → employees._id
    { name: "Science",            teacherId: ObjectId },
    { name: "English",            teacherId: ObjectId },
    { name: "Social Studies",     teacherId: ObjectId },
    { name: "Hindi",              teacherId: ObjectId },
  ]
}
```

> - Each subject has exactly **one assigned teacher**.
> - One teacher can teach **multiple subjects** in the same or different classes.
> - This is the **source of truth** for grade-marking authorization.

#### Authorization Rule

```
When a teacher submits grades for studentId + subject:
  1. Find the student's class  →  class = student.classId
  2. Find the subject in       →  class.subjects[]
  3. Check                     →  subject.teacherId === req.employee._id
  4. If match → allow | If no match → 403 Forbidden
```

#### Key API Endpoints

```
// Assign teacher to subject in a class (admin / principal only)
PATCH /api/v1/classes/:classId/subjects
Body: { subjectName: "Mathematics", teacherId: "emp_id" }

// Get subjects taught by a teacher
GET /api/v1/employees/:employeeId/subjects
→ Returns: [{ classId, className, section, subjectName }]

// Mark grades (teacher scoped)
POST /api/v1/grades
Body: { studentId, subjectName, marks, maxMarks, term }
→ Backend validates: teacher is assigned to this subject in student's class
```

#### Example: Who teaches what in Grade 5-A

| Subject | Teacher |
|---|---|
| Mathematics | Mr. Ravi (emp_001) |
| Science | Ms. Anita (emp_002) |
| English | Mr. James (emp_003) |
| Hindi | Ms. Priya (emp_001) — same teacher, two subjects |

---

### 5. Student Profile & Guardian Access

Guardian is **not a separate collection**. Guardian info is embedded inside the `students` document. A guardian can optionally be given a `users` login to access the portal.

#### Guardian Embedded in Student Profile

| ID | Requirement | Priority |
|---|---|---|
| GRD-01 | Guardian details added when enrolling a student | Must |
| GRD-02 | Guardian has relation type from enum list | Must |
| GRD-03 | Use `relationNote` free text when relation = `other` | Must |
| GRD-04 | Set guardian access level: `full` / `view_only` / `emergency_only` | Must |
| GRD-05 | `emergency_only` guardians have no portal login | Must |
| GRD-06 | Exactly one guardian per student marked `isPrimary: true` | Must |
| GRD-07 | A guardian with `full` or `view_only` access gets a `users` login | Must |
| GRD-08 | Guardian login links to all students (across schools) via their email/phone | Must |
| GRD-09 | Guardian portal shows child-switcher if linked to multiple students | Must |
| GRD-10 | Guardian can switch active child context without re-login (same JWT) | Must |
| GRD-11 | All guardian-facing APIs accept `?studentId=` query param | Must |
| GRD-12 | Backend validates guardian owns the requested `studentId` | Must |
| GRD-13 | Update guardian access level or relation for a student | Must |
| GRD-14 | Remove a guardian entry from a student's profile | Must |

#### Guardian Embedded Schema (inside student document)

```js
student.guardians: [
  {
    userId:       ObjectId,   // → users._id (null if emergency_only)
    name:         String,
    phone:        String,
    email:        String,
    relation:     String,     // Enum — father | mother | uncle | ... | other
    relationNote: String,     // Free text when relation = "other"
    accessLevel:  String,     // "full" | "view_only" | "emergency_only"
    isPrimary:    Boolean,
    occupation:   String,
    address: { street, city, pincode }
  }
]
```

> A guardian's `userId` is the **link** back to a `users` login. If a guardian is linked to multiple students (across schools), the **same `userId`** appears in each student's `guardians[]`. The portal uses `userId` to find all associated students.

#### Child Switcher API Endpoints

```
GET /api/v1/guardian/children
  → Finds all students where guardians[].userId = req.user._id
  → Returns: [{ studentId, name, school, class, photo }]

GET /api/v1/guardian/dashboard?studentId=<id>
GET /api/v1/guardian/timetable?studentId=<id>
GET /api/v1/guardian/notices?studentId=<id>
```

---

### 6. Student Management & Lifecycle

> **Key Rule**: Students are **never deleted** from the database. Once enrolled, a student record is permanent.
> **Registration**: Guardian completes student enrolment using a **school-issued invite token** (see section 3a).

| ID | Requirement | Priority |
|---|---|---|
| STU-01 | Enroll a student in a school (admin/principal) | Must |
| STU-02 | Assign a student to a class | Must |
| STU-03 | Add guardian(s) to student profile at enrolment | Must |
| STU-04 | Update student details (name, photo, blood group, etc.) | Must |
| STU-05 | Search students by name or admission number | Must |
| STU-06 | List all **active** students in a class | Must |
| STU-07 | List all active students in a school | Must |
| STU-08 | Get student profile with embedded guardian info | Must |
| STU-09 | Transfer a student to a different class (same school) | Should |
| STU-10 | Mark student as **transferred** to another school (with reason & destination) | Must |
| STU-11 | Mark student as **left** the school (with reason) | Must |
| STU-12 | Student status change requires a mandatory reason/note | Must |
| STU-13 | **Convert** an active/left student to **Alumni** of the school | Must |
| STU-14 | Alumni profile visible in school's Alumni Network section | Must |
| STU-15 | View list of all transferred/left students with reasons | Should |
| STU-16 | When transferring to a school **already on Pathshala**, detect and link automatically | Must |
| STU-17 | Cross-platform transfer: old school record auto-becomes **alumni**, new record created at new school | Must |
| STU-18 | Both records (old alumni + new active) are linked via a shared `personId` | Must |
| STU-19 | Guardian portal shows **both** schools: active child at School B + alumni at School A | Must |
| STU-20 | Student/Guardian can view their full school history (all schools on platform) | Should |

#### Student Status Flow

```
                    Enroll
                      |
                      V
                   [active]  -- class transfer --> [active, new class]
                      |
           +----------+-----------+
           |                      |
           V                      V
    [transferred]              [left]
    (to another school)    (dropped out etc.)
           |
     +-----+------------------------------+
     | destination school NOT on         | destination school IS on
     | Pathshala                         | Pathshala
     V                                   V
  [alumni]              [alumni] at School A  +  [active] at School B
  (manual              (auto-promoted)             (new record, linked
   conversion)                                      via personId)
     |                               |
     +-------------------------------+
     School A Alumni Network shows the student
     Guardian portal shows BOTH: School A (alumni) + School B (active)
```

#### Cross-Platform Transfer (Both Schools on Pathshala)

When a transfer destination is an existing Pathshala school, the platform handles everything automatically:

| Step | What Happens |
|---|---|
| 1 | Admin marks student as `transferred` with destination = School B (Pathshala) |
| 2 | School A record: `status` → `alumni`, `exitInfo` filled, `personId` set |
| 3 | New student record created in School B with the same `personId` |
| 4 | School B admin receives a **"Incoming Transfer"** notification to complete enrollment |
| 5 | Guardian portal now shows **School A (Alumni)** + **School B (Active)** under same child |
| 6 | Student's academic history from School A is visible (read-only) in School B |

#### `personId` — Cross-School Identity

A `personId` is a shared identifier across all student records for the **same physical person**. It is generated on first enrollment and copied to all subsequent school records.

```js
// School A record (after transfer out)
{
  _id:      ObjectId,       // School A's student record
  personId: ObjectId,       // shared identity key
  schoolId: SchoolA._id,
  status:   "alumni",
  exitInfo: {
    reason:              "transfer",
    note:                "Family relocated to Mysore",
    exitDate:            Date,
    destinationSchoolId: SchoolB._id,        // null if off-platform
    destinationStudentId: ObjectId           // School B's new student._id (null if off-platform)
  }
}

// School B record (new enrollment)
{
  _id:      ObjectId,       // School B's student record
  personId: ObjectId,       // same personId as School A
  schoolId: SchoolB._id,
  status:   "active",
  previousSchools: [
    { schoolId: SchoolA._id, studentId: SchoolA_student._id, exitYear: 2025 }
  ]
}
```

> - **`personId`** is the cross-school identity. Query all records for a person: `Student.find({ personId })`
> - **`previousSchools[]`** on the new record gives quick access to history
> - If destination school is **off-platform**, `destinationStudentId` is `null` and alumni conversion is manual

#### Guardian Portal — Combined View

```
Guardian opens app
       |
       V
  "My Children" screen
  +----------------------------------------------+
  |  Arjun — Pathshala High (Grade 5-B)  [ACTIVE]|
  |  Arjun — St. Mary's CBSE (2022-2024) [ALUMNI]|
  +----------------------------------------------+

  Active school  → full dashboard (attendance, grades, timetable)
  Alumni school  → read-only history (grades, report cards)
```

#### Key API Endpoints

```
// Admin: Mark transfer to an on-platform school
POST /api/v1/students/:studentId/transfer
Body: {
  destinationSchoolId: "sch002",   // on Pathshala → triggers auto-link
  reason: "family_relocation",
  note: "Moving to Mysore",
  exitDate: "2025-06-30"
}
→ Creates new student record at School B
→ Sets School A status = alumni
→ Links via personId

// Guardian: Get all school records for a child (active + alumni)
GET /api/v1/guardian/child-history?personId=<id>
→ Returns all school records for that personId
```

---

### 7. Class Management

| ID | Requirement | Priority |
|---|---|---|
| CLS-01 | Create a class (grade + section + academic year) | Must |
| CLS-02 | Assign a homeroom teacher to a class | Must |
| CLS-03 | List all classes in a school | Must |
| CLS-04 | Get all students in a class | Must |
| CLS-05 | Update class details | Must |
| CLS-06 | Duplicate classes for a new academic year | Should |
| CLS-07 | Set class capacity limit | Nice to have |

---

### 8. Timetable Management

The **Principal and Admin** can create and manage the timetable for each class. Teachers and Guardians can **view** timetables but cannot modify them.

#### Who Can Do What

| Action | Owner | Principal | Admin | Teacher | Guardian |
|---|---|---|---|---|---|
| Create/edit timetable | Yes | Yes | Yes | No | No |
| View timetable (own class) | Yes | Yes | Yes | Yes | No |
| View timetable (own child) | Yes | Yes | Yes | Yes | Yes |

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| TT-01 | Principal can create a timetable for a class | Must |
| TT-02 | Timetable is per class per academic year | Must |
| TT-03 | Each timetable slot has: day, period/time, subject, teacher | Must |
| TT-04 | Teacher assigned to a timetable slot must teach that subject in that class | Must |
| TT-05 | Principal can update or delete any timetable slot | Must |
| TT-06 | Teachers can view their own timetable (which classes they teach and when) | Must |
| TT-07 | Guardians can view their child's class timetable | Must |
| TT-08 | Detect slot conflicts (same teacher, same time, different class) | Should |

#### Model Implication

Timetable entries stored as embedded array on the `classes` document:

```js
// Inside the classes collection
{
  _id:       ObjectId,
  schoolId:  ObjectId,
  name:      "Grade 5",
  section:   "A",
  subjects:  [ { name: "Maths", teacherId: ObjectId } ],  // subject assignments
  timetable: [
    {
      day:       "Monday",          // Mon | Tue | Wed | Thu | Fri | Sat
      period:    1,                  // Period number
      startTime: "08:00",
      endTime:   "08:45",
      subject:   "Mathematics",
      teacherId: ObjectId            // → employees._id
    },
    {
      day:       "Monday",
      period:    2,
      startTime: "08:45",
      endTime:   "09:30",
      subject:   "Science",
      teacherId: ObjectId
    }
    // ...
  ]
}
```

#### Key API Endpoints

```
// Principal / Admin: Create/replace full timetable for a class
PUT  /api/v1/classes/:classId/timetable
Body: { slots: [{ day, period, startTime, endTime, subject, teacherId }] }

// Principal / Admin: Update a single slot
PATCH /api/v1/classes/:classId/timetable/:slotId

// Anyone with school access: View class timetable
GET  /api/v1/classes/:classId/timetable

// Teacher: View own weekly timetable (across all classes)
GET  /api/v1/employees/:employeeId/timetable

// Guardian: View child's timetable
GET  /api/v1/guardian/timetable?studentId=<id>
```

---

### 9. Alumni Network

When a student leaves a school (graduated, transferred, or otherwise), a Principal or Owner can convert their profile to **Alumni** status. The student remains in the system, visible under the school's Alumni Network.

| ID | Requirement | Priority |
|---|---|---|
| ALM-01 | Principal/Owner can convert a student profile to Alumni | Must |
| ALM-02 | Alumni status is school-specific (alumni of School A stays in School A's network) | Must |
| ALM-03 | Alumni profile retains all academic history (grades, class, enrolment year) | Must |
| ALM-04 | School's Alumni Network page lists all alumni with graduation year and class | Must |
| ALM-05 | Alumni can optionally be given a portal login (alumni access level) | Should |
| ALM-06 | Alumni cannot be re-enrolled as active student without a new admission | Must |
| ALM-07 | Search alumni by name, year, or class | Should |

#### Student Status Enum
```
active | transferred | left | alumni
```

---

### 10. School Notifications

Admins and Principals can send school-level notifications visible to all guardians of students in that school.

| ID | Requirement | Priority |
|---|---|---|
| NOT-01 | Admin/Principal can create a school-wide notification | Must |
| NOT-02 | Notifications are scoped to a school (`schoolId`) | Must |
| NOT-03 | Guardians see notifications for their child's school only | Must |
| NOT-04 | Notification has: title, body, date, author | Must |
| NOT-05 | Notifications can be optionally targeted to a specific class | Should |
| NOT-06 | Guardians can mark a notification as read | Should |
| NOT-07 | List notifications for a school (paginated) | Must |

#### Notification Schema

```js
{
  _id:       ObjectId,
  schoolId:  ObjectId,     // → schools._id
  classId:   ObjectId,     // null = school-wide; set = class-specific
  title:     String,
  body:      String,
  authorId:  ObjectId,     // → employees._id (admin/principal who sent)
  createdAt: Date
}
```

---

### 11. Analytics & Reporting

Pathshala exposes **read-only analytics endpoints** that aggregate existing v1 data to give each user role a meaningful summary dashboard. Analytics are derived from data already collected by the system — no new data models are required for v1.

> **v1 Scope**: Analytics cover only data that exists in v1 — schools, owners, employees, students, classes, timetables, notifications, and alumni. Attendance, grades, fees, and exam analytics will be added in v2 when those modules are built.

#### Analytics Access Matrix

| Analytics View | Platform Admin | Owner | Principal | Admin | Teacher | Guardian | Alumni |
|---|---|---|---|---|---|---|---|
| Platform-level summary | Yes | No | No | No | No | No | No |
| Cross-school owner summary | No | Yes | No | No | No | No | No |
| School-level operational summary | No | Yes | Yes | Yes | No | No | No |
| Class & student breakdown | No | Yes | Yes | Yes | Yes (own class) | No | No |
| Employee roster summary | No | Yes | Yes | Yes | No | No | No |
| Timetable coverage report | No | No | Yes | Yes | Yes (own) | No | No |
| Notification reach | No | No | Yes | Yes | No | No | No |
| Child summary (guardian) | No | No | No | No | No | Yes | No |
| Own alumni profile summary | No | No | No | No | No | No | Yes |

---

#### 11a. Platform Admin Analytics

| ID | Metric / Report | Description | Priority |
|---|---|---|---|
| ANA-P-01 | Total schools on platform | Count of all schools by approval status: pending / approved / rejected | Must |
| ANA-P-02 | Total registered owners | Count by approval status: pending / approved / rejected | Must |
| ANA-P-03 | Total students on platform | Aggregate student count across all schools | Must |
| ANA-P-04 | Total employees on platform | Aggregate employee count across all schools | Must |
| ANA-P-05 | New school registrations over time | Count of schools registered per month (last 12 months) | Should |
| ANA-P-06 | School approval funnel | Breakdown: how many are pending / approved / rejected in the last 30 days | Should |
| ANA-P-07 | Schools by city / board | Distribution of approved schools grouped by city and education board | Should |
| ANA-P-08 | Top schools by student count | Ranked list of schools by total active student enrollment | Nice |

##### Key API Endpoints (Platform Admin)

```
GET /api/v1/admin/analytics/summary
→ Returns: { totalSchools, byStatus, totalOwners, totalStudents, totalEmployees }

GET /api/v1/admin/analytics/school-registrations?period=12m
→ Returns: [{ month, year, count }]

GET /api/v1/admin/analytics/schools-by-location
→ Returns: [{ city, board, count }]
```

---

#### 11b. Owner Analytics

Owner sees aggregated data across **all schools they own**.

> **Performance Monitoring Note**: Subject-wise analytics (ANA-O-07 onwards) depend on the **Grades module (v2)**. Requirements are documented here now so the data model and API design account for them from day one.

| ID | Metric / Report | Description | Priority |
|---|---|---|---|
| ANA-O-01 | My schools summary | List of owned schools with: active students, employee count, pending approvals | Must |
| ANA-O-02 | Total students across my schools | Sum of active students across all owned schools | Must |
| ANA-O-03 | Total employees across my schools | Sum of active employees across all owned schools, grouped by role | Must |
| ANA-O-04 | Student lifecycle summary | Per-school breakdown: active / transferred / left / alumni counts | Must |
| ANA-O-05 | Alumni count per school | How many alumni each owned school has | Should |
| ANA-O-06 | Class utilization | Per-school: number of classes, total students, average class size | Should |

**Subject & Student Performance (v2 — requires Grades module)**

| ID | Metric / Report | Description | Priority |
|---|---|---|---|
| ANA-O-07 | Subject pass rate across schools | Per-subject: what % of students scored above passing marks, aggregated by school | Must |
| ANA-O-08 | Top-performing schools by subject | Rank owned schools by average subject scores to identify strong vs weak performers | Must |
| ANA-O-09 | Class-level performance summary | Per-class average marks by subject across all owned schools | Must |
| ANA-O-10 | Weakest subjects across schools | Subjects with consistently low averages across all owned schools | Should |
| ANA-O-11 | Term-on-term improvement trend | Compare average marks per school / class across terms (Term 1 vs Term 2 vs Term 3) | Should |
| ANA-O-12 | At-risk student count | Count of students scoring below threshold (configurable, e.g. <35%) in any subject, per school | Should |

##### Key API Endpoints (Owner)

```
// v1 Endpoints
GET /api/v1/owner/analytics/summary
→ Returns: { schools: [{ schoolId, name, activeStudents, employees, classes }] }

GET /api/v1/owner/analytics/student-lifecycle
→ Returns: [{ schoolId, name, active, transferred, left, alumni }]

GET /api/v1/owner/analytics/class-utilization
→ Returns: [{ schoolId, className, section, studentCount }]

// v2 Endpoints (grades module required)
GET /api/v1/owner/analytics/performance/summary?term=<term>&academicYear=<year>
→ Returns: [
    {
      schoolId, schoolName,
      subjects: [{ name, avgMarks, passRate, studentCount }]
    }
  ]

GET /api/v1/owner/analytics/performance/class-breakdown?schoolId=<id>&term=<term>
→ Returns: [{ classId, className, section, subjects: [{ name, avgMarks, passRate }] }]

GET /api/v1/owner/analytics/performance/at-risk?threshold=35
→ Returns: [{ schoolId, schoolName, atRiskCount, bySubject: [{ name, count }] }]

GET /api/v1/owner/analytics/performance/trends?schoolId=<id>&subject=<name>
→ Returns: [{ term, academicYear, avgMarks, passRate }]  // ordered chronologically
```

---

#### 11c. Principal & Admin Analytics

Scoped to **their own school** (`schoolId` from JWT).

> **Performance Monitoring Note**: Subject-wise analytics (ANA-S-13 onwards) depend on the **Grades module (v2)**. Requirements are documented here now so the data model and API design account for them from day one.

**Operational Analytics (v1)**

| ID | Metric / Report | Description | Priority |
|---|---|---|---|
| ANA-S-01 | School enrollment summary | Total active students, broken down by class and section | Must |
| ANA-S-02 | Student lifecycle counts | Count of active / transferred / left / alumni students in the school | Must |
| ANA-S-03 | New enrollments this academic year | Students enrolled since academic year start | Must |
| ANA-S-04 | Employee roster summary | Total employees by role (teacher, admin, principal, etc.) | Must |
| ANA-S-05 | Active vs inactive employees | Count of active vs deactivated employees | Must |
| ANA-S-06 | Class-wise student count | List of classes with student count + homeroom teacher | Must |
| ANA-S-07 | Unassigned subjects | Classes that have subjects with no teacher assigned | Must |
| ANA-S-08 | Timetable coverage | Per-class: how many timetable slots are filled vs expected total slots | Should |
| ANA-S-09 | Notifications sent | Count of school-wide notifications sent (last 30 days) | Should |
| ANA-S-10 | Incoming transfer requests | Count of students transferred in or out (current academic year) | Should |
| ANA-S-11 | Alumni network size | Total alumni count for the school | Should |
| ANA-S-12 | Guardian login coverage | How many students have at least one guardian with a portal login | Nice |

**Subject & Student Performance Monitoring (v2 — requires Grades module)**

| ID | Metric / Report | Description | Priority |
|---|---|---|---|
| ANA-S-13 | School-wide subject performance | Average marks and pass rate per subject across all classes in the school | Must |
| ANA-S-14 | Class-wise subject performance | Per-class, per-subject: average marks, highest, lowest, pass rate | Must |
| ANA-S-15 | Student performance report | Per-student: marks per subject per term, overall percentage, rank in class | Must |
| ANA-S-16 | Top performers per class | Top N students by overall marks, filterable by class and term | Must |
| ANA-S-17 | At-risk students | Students scoring below a set threshold (e.g. <35%) in one or more subjects | Must |
| ANA-S-18 | Subject failure distribution | For each subject: how many students failed, borderline, passed, excelled | Must |
| ANA-S-19 | Teacher-wise performance comparison | Compare average class marks per subject across teachers teaching the same subject | Should |
| ANA-S-20 | Term-on-term progress per student | Individual student's marks trend across Term 1, 2, 3 — improving / declining / stable | Should |
| ANA-S-21 | Class rank list | Full ranked list of students in a class by total marks for a given term | Should |

#### Performance Monitoring — Data Model Note

```
Grades stored per student per subject per term:
{
  studentId:  ObjectId,      // → students._id
  classId:    ObjectId,      // → classes._id
  schoolId:   ObjectId,
  subject:    String,        // must match class.subjects[].name
  teacherId:  ObjectId,      // → employees._id (who entered the grade)
  term:       String,        // "Term 1" | "Term 2" | "Term 3" | "Final"
  academicYear: String,      // e.g. "2025-26"
  marks:      Number,        // marks obtained
  maxMarks:   Number,        // marks available (e.g. 100)
  percentage: Number,        // computed: (marks / maxMarks) * 100
  grade:      String         // computed: A+ | A | B | C | D | F
}
```

> This schema must be designed in v1 planning even though the data entry module is v2, so analytics queries work correctly without migration.

##### Key API Endpoints (Principal / Admin)

```
// v1 Endpoints
GET /api/v1/schools/:schoolId/analytics/summary
→ Returns: {
    students: { active, transferred, left, alumni, newThisYear },
    employees: { total, byRole: { teacher, admin, principal, ... }, inactive },
    classes: { total, avgStudentsPerClass }
  }

GET /api/v1/schools/:schoolId/analytics/class-breakdown
→ Returns: [{ classId, name, section, studentCount, homeroomTeacher, timetableSlotsFilled }]

GET /api/v1/schools/:schoolId/analytics/unassigned-subjects
→ Returns: [{ classId, className, section, subject }]  // subjects with no teacher

GET /api/v1/schools/:schoolId/analytics/notifications
→ Returns: { sentLast30Days, schoolWide, classSpecific }

// v2 Endpoints (grades module required)
GET /api/v1/schools/:schoolId/analytics/performance/subjects?term=<term>&academicYear=<year>
→ Returns: [{ subject, avgMarks, passRate, failCount, topMark, lowestMark }]

GET /api/v1/schools/:schoolId/analytics/performance/class?classId=<id>&term=<term>
→ Returns: {
    classId, className, section,
    subjects: [{ name, avgMarks, passRate, teacherId, teacherName }],
    students: [{ rank, studentId, name, totalMarks, percentage }]
  }

GET /api/v1/schools/:schoolId/analytics/performance/student/:studentId
→ Returns: [
    { term, subjects: [{ name, marks, maxMarks, percentage, grade }], rank, classAvg }
  ]

GET /api/v1/schools/:schoolId/analytics/performance/at-risk?threshold=35&term=<term>
→ Returns: [{ studentId, name, className, section, failingSubjects: [{ name, marks }] }]

GET /api/v1/schools/:schoolId/analytics/performance/top-performers?classId=<id>&term=<term>&limit=10
→ Returns: [{ rank, studentId, name, totalMarks, percentage }]

GET /api/v1/schools/:schoolId/analytics/performance/teacher-comparison?subject=<name>&term=<term>
→ Returns: [
    { teacherId, teacherName, classes: [{ classId, name }], avgMarks, passRate }
  ]

GET /api/v1/schools/:schoolId/analytics/performance/student-trend/:studentId
→ Returns: [{ term, academicYear, subjects: [{ name, marks, percentage }], overall }]
```

---

#### 11d. Teacher Analytics

Scoped to the **classes and subjects the teacher is assigned to**.

| ID | Metric / Report | Description | Priority |
|---|---|---|---|
| ANA-T-01 | My classes summary | List of classes the teacher is assigned to (as homeroom or subject teacher) | Must |
| ANA-T-02 | Student count per class | Number of active students in each assigned class | Must |
| ANA-T-03 | My subjects | List of subjects the teacher teaches, grouped by class | Must |
| ANA-T-04 | Timetable load | Number of teaching periods per week across all classes | Should |
| ANA-T-05 | My homeroom class | If homeroom teacher — details and student list of their homeroom class | Should |

##### Key API Endpoints (Teacher)

```
GET /api/v1/employees/:employeeId/analytics/summary
→ Returns: {
    classes: [{ classId, name, section, studentCount, isHomeroom }],
    subjects: [{ classId, className, section, subjectName }],
    weeklyPeriods: 24
  }
```

---

#### 11e. Guardian Analytics

Scoped to **their linked children**. A guardian can have children in multiple schools.

| ID | Metric / Report | Description | Priority |
|---|---|---|---|
| ANA-G-01 | My children summary | List of all linked children with: school, class, current status (active / alumni) | Must |
| ANA-G-02 | Child's class details | Current class name, section, homeroom teacher, and class size | Must |
| ANA-G-03 | School notification count | Number of unread notifications for each active child's school | Must |
| ANA-G-04 | Child's timetable preview | Today's schedule for the active child (from timetable) | Should |
| ANA-G-05 | Child school history count | How many schools the child has been enrolled in (active + alumni) | Should |

> **Note**: Attendance, grade, and fee analytics for guardians are deferred to v2 when those modules are built.

##### Key API Endpoints (Guardian)

```
GET /api/v1/guardian/analytics/summary
→ Returns: [
    {
      studentId, name, status,
      school: { name, schoolId },
      class: { name, section, homeroomTeacher },
      unreadNotifications: 3,
      schoolHistory: 2
    }
  ]

GET /api/v1/guardian/analytics/timetable-today?studentId=<id>
→ Returns: [{ period, startTime, endTime, subject, teacherName }]
```

---

#### 11f. Alumni Analytics

Alumni see a **read-only summary** of their own academic history across schools they attended.

| ID | Metric / Report | Description | Priority |
|---|---|---|---|
| ANA-A-01 | My school history | List of all schools attended with enrolment and exit years | Must |
| ANA-A-02 | Classes attended | All classes the alumni was enrolled in, per school | Must |
| ANA-A-03 | Years on platform | Total academic years recorded across all school records | Should |

##### Key API Endpoints (Alumni)

```
GET /api/v1/alumni/:personId/analytics/history
→ Returns: [
    {
      schoolId, schoolName,
      enrolledYear, exitYear, exitReason,
      classes: [{ name, section, academicYear }]
    }
  ]
```

---

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | All routes (except login/register) protected by JWT middleware |
| **Security** | Passwords never returned in API responses |
| **Security** | Role-based middleware on sensitive routes |
| **Security** | Both `email` and `phone` are **mandatory** for all users (phone must match government ID records) |
| **Performance** | Paginated responses for all list endpoints |
| **Performance** | MongoDB indexes on all foreign key fields |
| **Reliability** | Soft deletes — no hard deletes on student/guardian data |
| **Consistency** | Consistent error response format across all routes |
| **Validation** | Request body validated with Joi or express-validator |
| **Logging** | HTTP request logging via middleware (already implemented) |
| **Audit** | Audit logs recorded for all create/update/delete actions performed by **admin** and **employee** roles (v1 scope) |
| **Env Config** | All secrets in `.env`, never hardcoded |
| **Scalability** | Multi-tenant — one DB, school-scoped data via `schoolId` |

---

## API Design Principles

- **RESTful** resource-based URLs
- Versioned: `/api/v1/...`
- JSON request & response bodies
- Standard HTTP status codes
- Consistent error shape:
  ```json
  {
    "success": false,
    "message": "Descriptive error message",
    "error": "ERROR_CODE"
  }
  ```
- Consistent success shape:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Optional message"
  }
  ```
- Paginated list shape:
  ```json
  {
    "success": true,
    "data": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
  ```

---

## Constraints & Assumptions

| # | Constraint / Assumption |
|---|---|
| C1 | A student belongs to **one school** at a time |
| C2 | An employee works at **one school** — no cross-school employment in v1 |
| C3 | A guardian can have children in **multiple schools** |
| C4 | A school can have **multiple owners** |
| C5 | An owner can own **multiple schools** |
| C6 | `emergency_only` guardians do **not** get a login (no `users` record required) |
| C7 | Only one guardian per student should be `isPrimary: true` (enforced at app level) |
| C8 | No hard deletes — all records use `isActive: false` for deactivation |
| C9 | Academic year is a string (e.g. `"2025-26"`) — no separate AY collection in v1 |
| C10 | Images (logo, photo) stored as URLs — file upload/storage is a separate service |
| C11 | **Web app**: all user types (owner, employee, student, guardian, alumni, platform admin) have access |
| C12 | **Mobile app**: only owners, employees, and students have access — guardians and alumni are web-only |
| C13 | Both `email` and `phone` are **mandatory** for all users — phone must match government-registered number |
| C14 | `admissionNo` is **manually entered** from the school's existing physical/digital records — not auto-generated |
| C15 | JWT expiry: **1 day** for web clients, **7 days** for mobile clients — determined by `X-Client` request header |
| C16 | An employee can simultaneously be a guardian — they use **one account** (staff credentials) to access both staff and guardian features |
| C17 | Student `classHistory[]` is **always preserved** — every class assignment is retained and becomes part of the alumni record |

---

## Out of Scope (v1)

The following features are **not** part of v1 and should not be built yet.
Update this list as scope decisions are made — move items to a functional requirement section if they become in-scope.

| Feature | Decision | Status |
|---|---|---|
| Attendance marking & tracking | Deferred to v2 | Confirmed Out |
| Grade / marks entry | Deferred to v2 | Confirmed Out |
| Fee management & payment integration | Deferred to v2 | Confirmed Out |
| Notifications (push / email / SMS) | Deferred to v2 | Confirmed Out |
| In-app messaging (guardian to teacher) | Deferred to v2 | Confirmed Out |
| Report card generation | Deferred to v2 | Confirmed Out |
| Exam scheduling | Deferred to v2 | Confirmed Out |
| Library management | Deferred to v2 | Confirmed Out |
| Transport / bus route tracking | Deferred to v2 | Confirmed Out |
| Mobile app full specification | Mobile spec TBD after web | In Progress |
| Multi-language (i18n) support | Deferred to v2 | Confirmed Out |

---

## Open Questions

All resolved decisions are logged here for traceability. New questions are added as they arise during review.

| # | Question | Decision | Status |
|---|---|---|---|
| Q1 | Can a person be both an employee AND a guardian? | **Yes.** Same `userId` used for both roles. Employee logs in with staff credentials; system grants guardian access for their own children. No separate guardian account needed. See C16 and User Roles section. | Resolved |
| Q2 | Should `admissionNo` be auto-generated or manually entered? | **Manual.** Entered from school's existing records. System validates uniqueness within the school. See C14. | Resolved |
| Q3 | What is the JWT expiry duration? | **1 day** for web, **7 days** for mobile. Set based on `X-Client` request header at login. See C15 and AUTH-05. | Resolved |
| Q4 | Do we need audit logs? | **Yes**, for admin and employee actions in v1 (create / update / delete on core resources). See NFR Audit row, `auditLogs` collection in model architecture. | Resolved |
| Q5 | Is `email` always required or phone only? | **Both are required.** Phone must match government-registered number. See C13 and NFR Security. | Resolved |
| Q6 | Should previous class history be preserved on transfer? | **Yes.** All class assignments stored in `classHistory[]` on the student record. This data becomes part of the alumni profile and is accessible on mobile as a "memories" view. See C17 and Student model. | Resolved |
| Q7 | What payment gateway will be used for fee management (v2)? | Razorpay is the preferred choice for Indian schools — to be confirmed at v2 planning. | Deferred |
| Q8 | Which SMS / push notification provider? | Cost-sensitive at scale. Candidates: MSG91, Firebase Cloud Messaging — to be confirmed at v2 planning. | Deferred |
| Q9 | Should `ParentStudentLink` support two parents per student from day one? | Already handled — guardian is an embedded array (`student.guardians[]`) supporting unlimited guardians with role/access distinctions. | Resolved |

---

## Changelog

All changes to this document after initial draft must be logged here with date, author, and description.

| Version | Date | Author | Change |
|---|---|---|---|
| v0.1 | July 2026 | Mohankumar | Initial draft — project overview, roles, auth, school, owner, employee, student, class, timetable, alumni, notifications, NFRs |
| v0.2 | July 2026 | Mohankumar | Added Self-Service OTP Registration (3a), Teacher Subject Assignment (4a), Cross-platform student transfer (STU-16 to STU-19), personId design, Guardian dual-role rule |
| v0.3 | July 2026 | Antigravity | Consolidated into single file. Added Document Status tracker, Approval Workflow section, Section Approval Tracker, Out of Scope tracker table, Open Questions Q7 to Q9, Changelog. |
| v0.4 | July 2026 | Antigravity | Added Section 11 — Analytics & Reporting. Covers role-based analytics for Platform Admin (ANA-P-01 to 08), Owner (ANA-O-01 to 06), Principal/Admin (ANA-S-01 to 12), Teacher (ANA-T-01 to 05), Guardian (ANA-G-01 to 05), and Alumni (ANA-A-01 to 03). All scoped to v1 data only. |
| v0.5 | July 2026 | Antigravity | Extended Owner analytics (ANA-O-07 to ANA-O-12) and Principal/Admin analytics (ANA-S-13 to ANA-S-21) with subject-wise student performance monitoring. Includes grades data model note, per-student performance, at-risk detection, teacher-comparison, term trends, and class ranking. Marked v2-dependent (grades module). |

---

*Document Status: **IN REVIEW — Pending Final Approval***
*Single source of truth — do not create additional `.md` files in `docs/`. All requirement updates go directly into this file.*
*Maintained by: Pathshala Backend Team*
