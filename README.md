# Pathshala 
Multi-Tenant School Management Platform — HLD & LLD
 
## 1. Client requirement summary
 
A white-label, web-based platform for private K-10 schools in Karnataka, replacing paper diaries with digital attendance, report cards, fees, notices, assignments, and complaints. One school owner can run multiple schools; one parent can have children across multiple schools. Branding (logo, name) is customizable per school; the underlying UI and workflow stay identical. Revenue comes from platform subscription plus a paid monthly printed-report delivery service.
 
Login roles: **Parent**, **Teacher**, **Principal/Admin**. Students do not get independent logins — all student-linked actions (including raising concerns to a teacher) route through the parent.
 
---
 
## 2. High-Level Design (HLD)
 
### 2.1 Architecture style
Modular monolith to start, structured so individual modules (fees, academics, comms, ops) can be split into services later without a rewrite. This matches a one-month solo build timeline — a full microservices setup adds deployment and networking overhead you don't need yet, but keeping service boundaries clean in code means splitting later is a refactor, not a rebuild.
 
### 2.2 Multi-tenancy model
Single database, shared schema, `schoolId` as a tenant discriminator on every collection. Every query is scoped by `schoolId` at the service layer, never left to the client. This is the standard approach for a SaaS product at this stage — it's far cheaper to operate than database-per-tenant, and Mongo's indexing handles the scoped queries well.
 
- A **school owner** account can be linked to N `School` documents.
- A **parent** account can be linked to N `Student` documents across different `schoolId`s. The parent's dashboard aggregates across schools; every write still resolves to a single school's data.
### 2.3 Core components
- **API gateway / Express app** — single entry point, resolves tenant from the JWT or subdomain, routes to controllers.
- **Auth service** — JWT-based, role claim (`parent`, `teacher`, `admin`) plus `schoolId` claim(s). Refresh tokens for persistent mobile/web sessions.
- **Academics module** — attendance, report cards, assignments, timetables.
- **Fees module** — dues, payment records, receipt generation.
- **Comms module** — notices, notifications (push/SMS/email), complaints/concerns.
- **Ops module** — transportation, class/section/teacher allocation (the drag-and-drop assignment feature).
- **MongoDB** — single cluster, tenant-scoped collections, indexes on `schoolId` + entity-specific fields.
- **External integrations** — SMS/push provider (e.g. MSG91, Firebase Cloud Messaging), print-and-post fulfillment for monthly physical reports.
### 2.4 Non-functional requirements
- **Scalability**: stateless API layer behind a load balancer: horizontal scaling as school count grows. Mongo can start single-node, move to replica set once you have paying schools.
- **Security**: role-based access control enforced server-side on every route; `schoolId` scoping enforced in the service layer, never trusted from client input; passwords hashed (bcrypt), JWTs short-lived with refresh rotation.
- **Data isolation**: a parent's query for their kids' data must never leak another tenant's records — this is the single most important invariant in a multi-tenant system and should have dedicated test coverage.
- **Auditability**: fee payments, complaints, and report card edits should be append-only or versioned, since parents and schools will dispute these.
---
 
## 3. Low-Level Design (LLD)
 
### 3.1 Entities and relationships
See the ERD above. Key points:
- `School` is the tenant root; `Class`, `Section`, `Teacher`, `Notice` all carry `schoolId`.
- `Section` links `Class` to a `Teacher` (the drag-and-drop assignment writes this relationship).
- `Student` belongs to one `Section` and one `Parent` (a student could have two parent accounts linked for separated families — model this as a join table `ParentStudentLink` if needed later, not a single FK).
- `Attendance`, `ReportCard`, `AssignmentSubmission` all key off `Student`.
- `FeePayment` and `Complaint` key off `Parent`, since those are parent-initiated actions.
### 3.2 Module-by-module API design
 
**Auth module**
- `POST /auth/register` — parent/teacher/admin registration (admin-invited for teacher/admin roles)
- `POST /auth/login` — returns JWT + refresh token
- `POST /auth/refresh`
- `GET /auth/me` — resolves role + linked schools/students
**Academics module**
- `GET /schools/:schoolId/attendance?date=&sectionId=` — teacher marks attendance
- `GET /students/:studentId/attendance` — parent view
- `POST /schools/:schoolId/report-cards` — teacher/admin creates
- `GET /students/:studentId/report-cards`
- `POST /schools/:schoolId/assignments` — teacher creates
- `POST /assignments/:id/submissions` — recorded on behalf of student by parent, or teacher marks status
**Fees module**
- `GET /students/:studentId/fees` — dues and history
- `POST /students/:studentId/fees/pay` — payment intent, integrates with a payment gateway later
- `GET /schools/:schoolId/fees/report` — admin analytics
**Comms module**
- `POST /schools/:schoolId/notices` — admin/teacher publishes
- `GET /parents/:parentId/notices` — aggregated across schools
- `POST /complaints` — parent raises concern to a teacher
- `PATCH /complaints/:id` — teacher/admin responds, status update
- Notification dispatch is async — write to a `Notification` queue collection, a background worker (cron or job queue) sends via SMS/push provider
**Ops module**
- `POST /schools/:schoolId/sections/:id/assign-teacher` — backend endpoint the drag-and-drop UI calls; validates the teacher isn't double-booked for that timeslot before committing
- `POST /schools/:schoolId/transport/routes`
- `GET /students/:studentId/transport`
### 3.3 Suggested build order (maps to your 1-month plan)
1. Auth + multi-tenant scoping (foundation everything else depends on)
2. School/Class/Section/Teacher/Student CRUD + the drag-and-drop assignment endpoint
3. Attendance + report cards (core parent-facing value)
4. Notices + complaints (comms loop)
5. Fees (revenue-critical, but fine to build after core academics work)
6. Transportation + polish
### 3.4 Open decisions to make before coding
- Payment gateway for fees (Razorpay is the standard choice for Indian schools)
- SMS/push provider — cost matters at scale since notifications are high-volume
- Whether `ParentStudentLink` needs to support two parents per student now or later (affects the schema from day one, cheaper to model correctly upfront)
