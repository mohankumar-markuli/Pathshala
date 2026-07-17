# Entity Relationship & Data Model (MongoDB)

Since Pathshala is a **White-Label SaaS** using **MongoDB**, the data model focuses on document collections with appropriate referencing and embedding where necessary to optimize for read-heavy operations (e.g., fetching a student's profile and attendance).

## 1. Core Entities (Collections)

### `Institution`
The root entity for the white-label platform. Every other record in the system will tie back to an Institution ID to ensure data isolation (multi-tenancy).
- **Fields:** `_id`, `name`, `logoUrl`, `address`, `contactEmail`, `contactPhone`, `createdAt`, `updatedAt`

### `User`
The central authentication entity. Stores shared login details for all user types.
- **Fields:** `_id`, `institutionId`, `email`, `passwordHash`, `role` (Admin, Teacher, Student, Parent), `isActive`

### `Profile` (Student / Staff / Parent)
Since different roles have vastly different metadata, specific profile data is linked to the base `User`.
- **Student Profile:** `userId`, `enrollmentNumber`, `dateOfBirth`, `bloodGroup`, `parentId`
- **Staff Profile:** `userId`, `employeeId`, `department`, `joiningDate`, `qualification`
- **Parent Profile:** `userId`, `contactNumber`, `occupation`, `address`

### `Class` & `Section`
Represents the academic structure of the institution.
- **Class:** `_id`, `institutionId`, `name` (e.g., "Grade 10")
- **Section:** `_id`, `classId`, `name` (e.g., "A", "B"), `classTeacherId` (refs Staff)

### `Subject`
Subjects taught in specific classes.
- **Fields:** `_id`, `classId`, `name`, `code`, `teacherId`

### `Attendance`
Daily tracking of presence.
- **Fields:** `_id`, `institutionId`, `sectionId`, `date`, `records` (Array of `{ studentId, status: Present/Absent/Late }`)

### `Exam` & `Grade`
- **Exam:** `_id`, `institutionId`, `name` (e.g., "Mid-Terms"), `startDate`, `endDate`
- **Grade:** `_id`, `examId`, `studentId`, `subjectId`, `marksObtained`, `totalMarks`, `remarks`

### `Fee`
- **Fields:** `_id`, `institutionId`, `studentId`, `amount`, `dueDate`, `status` (Paid, Pending, Overdue), `paymentDate`

### `Announcement`
- **Fields:** `_id`, `institutionId`, `title`, `content`, `authorId`, `targetAudience` (All, Teachers, Students, Parents), `datePosted`

---

## 2. ER Diagram (Conceptual)

Below is the conceptual Entity-Relationship diagram illustrating how collections reference each other within a single Institution's tenant context.

```mermaid
erDiagram
    INSTITUTION ||--o{ USER : "has"
    INSTITUTION ||--o{ CLASS : "manages"
    INSTITUTION ||--o{ EXAM : "conducts"
    INSTITUTION ||--o{ ANNOUNCEMENT : "broadcasts"

    USER ||--o| STUDENT_PROFILE : "has profile"
    USER ||--o| STAFF_PROFILE : "has profile"
    USER ||--o| PARENT_PROFILE : "has profile"
    
    STUDENT_PROFILE }|--|| PARENT_PROFILE : "belongs to"
    STUDENT_PROFILE }o--|| SECTION : "enrolled in"

    CLASS ||--o{ SECTION : "contains"
    CLASS ||--o{ SUBJECT : "teaches"
    
    SECTION ||--o{ ATTENDANCE : "records"
    SECTION }o--|| STAFF_PROFILE : "class teacher"
    
    SUBJECT }o--|| STAFF_PROFILE : "taught by"

    EXAM ||--o{ GRADE : "generates"
    GRADE }|--|| STUDENT_PROFILE : "awarded to"
    GRADE }|--|| SUBJECT : "evaluated for"

    STUDENT_PROFILE ||--o{ FEE : "billed for"
```

## 3. Data Modeling Strategy (MongoDB specifics)

- **Multi-Tenancy:** Every collection (except perhaps the base `Institution` list) must include an `institutionId` index to enforce strict tenant isolation.
- **Embedding vs. Referencing:** 
  - *Embed* small, bounded data: e.g., the array of student attendance statuses directly inside the daily `Attendance` document for a specific section.
  - *Reference* unbounded or shared data: e.g., `studentId` references inside the `Attendance` array.
- **Polymorphic Users:** Rather than having separate collections for logins, a single `User` collection manages auth, with references to role-specific `Profile` collections.
