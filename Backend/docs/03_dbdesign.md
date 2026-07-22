# Database Design (MongoDB Schemas)

This document outlines the detailed schema designs for the core collections in the Pathshala platform, including the `User` (with roles), `School` (Institution), and other recommended collections for a robust white-label SaaS product.

## 1. School (Institution) Schema

The `School` collection represents the tenant in our white-label architecture. Every other record in the system belongs to a `schoolId`.

```json
{
  "_id": "ObjectId",
  "name": "String",                 // e.g., "Greenwood High"
  "slug": "String",                 // Unique identifier for URL routing (e.g., "greenwood-high")
  "domain": "String",               // Custom domain for white-labeling (optional)
  "logoUrl": "String",              // URL to the school's logo
  "theme": {
    "primaryColor": "String",       // Hex code for UI customization
    "secondaryColor": "String"
  },
  "contactDetails": {
    "email": "String",
    "phone": "String",
    "address": "String",
    "website": "String"
  },
  "settings": {
    "academicYear": "String",       // e.g., "2023-2024"
    "currency": "String",           // e.g., "USD", "INR"
    "timezone": "String"
  },
  "subscription": {
    "planId": "ObjectId",           // Reference to a SaaS subscription plan
    "status": "Enum",               // [ACTIVE, SUSPENDED, CANCELLED]
    "validUntil": "Date"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 2. User Schema (Core Identity)

The `User` collection handles authentication and core identity. We use a `role` Enum to differentiate user permissions and determine which detailed profile (Student, Staff) they map to.

```json
{
  "_id": "ObjectId",
  "schoolIds": ["ObjectId"],        // Array of references to School collection (Supports multiple schools for Owners and Students. Teachers typically have one)
  "email": "String",                // Must be unique across the platform or per tenant
  "passwordHash": "String",         // Bcrypt hashed password
  "role": "Enum",                   // [SUPERADMIN, SCHOOL_OWNER, SCHOOL_ADMIN, TEACHER, STUDENT, STAFF]
  "profilePictureUrl": "String",
  "firstName": "String",
  "lastName": "String",
  "phone": "String",
  "isActive": "Boolean",            // Soft delete / account suspension flag
  "lastLogin": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
*Note: `SUPERADMIN` manages the SaaS platform itself, while `SCHOOL_ADMIN` manages a specific school instance.*

## 3. Recommended Feature Schemas

Based on modern school management requirements (including recent additions like Leave Requests), here are recommended schemas to support these features:

### 3.1 Leave Request Schema (New Feature)
Handles leave requests and approvals for students and staff.

```json
{
  "_id": "ObjectId",
  "schoolId": "ObjectId",
  "requesterId": "ObjectId",        // Reference to User (Student or Staff)
  "leaveType": "Enum",              // [SICK, CASUAL, VACATION, OTHER]
  "startDate": "Date",
  "endDate": "Date",
  "reason": "String",
  "attachmentUrl": "String",        // Optional medical certificate, etc.
  "status": "Enum",                 // [PENDING, APPROVED, REJECTED]
  "approvedBy": "ObjectId",         // Reference to User (Admin or Class Teacher)
  "reviewerComments": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.2 Notification Schema
A central collection to manage in-app notifications and alerts.

```json
{
  "_id": "ObjectId",
  "schoolId": "ObjectId",
  "recipientId": "ObjectId",        // Reference to User
  "title": "String",
  "message": "String",
  "type": "Enum",                   // [ALERT, REMINDER, ANNOUNCEMENT, SYSTEM]
  "isRead": "Boolean",              // Default: false
  "actionUrl": "String",            // Deep link for the notification action
  "createdAt": "Date"
}
```

### 3.3 Academic Year / Term Schema
Schools operate in academic cycles. Hardcoding dates in every record is bad practice. This collection defines the active terms.

```json
{
  "_id": "ObjectId",
  "schoolId": "ObjectId",
  "name": "String",                 // e.g., "2023-2024" or "Fall 2023"
  "startDate": "Date",
  "endDate": "Date",
  "isCurrent": "Boolean",           // Only one can be true per school
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.5 Anonymous Ticket (Grievance) Schema
Allows students or staff to report sensitive issues (like ragging, bullying, or other concerns) to the administration completely anonymously.

```json
{
  "_id": "ObjectId",
  "schoolId": "ObjectId",
  "title": "String",                // Short summary of the report
  "description": "String",          // Detailed explanation of the incident or issue
  "category": "Enum",               // [RAGGING, BULLYING, HARASSMENT, FACILITY_ISSUE, OTHER]
  "status": "Enum",                 // [OPEN, IN_PROGRESS, RESOLVED, CLOSED]
  "priority": "Enum",               // [LOW, MEDIUM, HIGH, CRITICAL]
  "resolutionNotes": "String",      // Admin's notes on how the ticket was addressed
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
*Note: This schema intentionally omits any `userId` or `requesterId` to ensure the report remains strictly anonymous.*

## 4. Design Guidelines

1. **Schema Validation:** Use Mongoose (or similar ODM) to enforce the Enums, Data Types, and Required fields at the application level.
2. **Indexing:** 
   - Compound index on `{ schoolIds: 1, email: 1 }` in the `User` collection for fast login lookups while allowing the same email across different schools (e.g., if a student attends multiple Pathshala-powered schools).
   - Index `schoolId` (or `schoolIds` where applicable) on all tenant collections.
3. **Soft Deletes:** Use `isActive: false` instead of deleting users to maintain referential integrity in past records (e.g., old attendance or grades).
