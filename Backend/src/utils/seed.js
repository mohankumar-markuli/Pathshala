const bcrypt = require("bcryptjs");
const User = require("../models/user");
const School = require("../models/school");
const Class = require("../models/class");
const Student = require("../models/student");
const Notification = require("../models/notification");
const Grievance = require("../models/grievance");

async function seedDatabase() {
    try {
        const existingUsers = await User.countDocuments();
        if (existingUsers > 0) {
            console.log("Database already seeded. Skipping initial seed.");
            return;
        }

        console.log("Seeding Pathshala database with demo environment data...");

        const hashedPassword = await bcrypt.hash("password123", 10);

        // 1. SuperAdmin
        const superAdmin = await User.create({
            email: "superadmin@pathshala.io",
            passwordHash: hashedPassword,
            role: "SUPERADMIN",
            firstName: "System",
            lastName: "Administrator",
            phone: "+91 9876543210"
        });

        // 2. School Owner
        const owner = await User.create({
            email: "owner@greenwood.edu",
            passwordHash: hashedPassword,
            role: "SCHOOL_OWNER",
            firstName: "Vikram",
            lastName: "Aditya",
            phone: "+91 9811223344"
        });

        // 3. Schools
        const school1 = await School.create({
            name: "Greenwood High International",
            code: "PSH-BLR-01",
            slug: "greenwood-high",
            approvalStatus: "approved",
            logoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80",
            board: "CBSE",
            city: "Bengaluru",
            owners: [owner._id],
            contactDetails: {
                email: "info@greenwood.edu",
                phone: "+91 80 2345 6789",
                address: "Sarjapur Road, Bengaluru, Karnataka",
                website: "https://greenwood.edu"
            }
        });

        const school2 = await School.create({
            name: "St. Mary's Public School",
            code: "PSH-MYS-02",
            slug: "st-marys",
            approvalStatus: "pending",
            logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80",
            board: "ICSE",
            city: "Mysuru",
            owners: [owner._id],
            contactDetails: {
                email: "contact@stmarys.edu",
                phone: "+91 821 9876 543",
                address: "Jayalakshmipuram, Mysuru",
                website: "https://stmarys.edu"
            }
        });

        owner.schoolIds = [school1._id, school2._id];
        await owner.save();

        // 4. Principal / Admin
        const principal = await User.create({
            email: "principal@greenwood.edu",
            passwordHash: hashedPassword,
            role: "SCHOOL_ADMIN",
            roles: ["principal"],
            firstName: "Dr. Rajesh",
            lastName: "Kumar",
            phone: "+91 9900112233",
            schoolIds: [school1._id]
        });

        // 5. Teachers
        const teacher1 = await User.create({
            email: "ravi.maths@greenwood.edu",
            username: "ravi.maths",
            passwordHash: hashedPassword,
            role: "TEACHER",
            roles: ["teacher"],
            firstName: "Ravi",
            lastName: "Shankar",
            phone: "+91 9448812345",
            schoolIds: [school1._id]
        });

        const teacher2 = await User.create({
            email: "anita.science@greenwood.edu",
            username: "anita.science",
            passwordHash: hashedPassword,
            role: "TEACHER",
            roles: ["teacher"],
            firstName: "Anita",
            lastName: "Deshmukh",
            phone: "+91 9448854321",
            schoolIds: [school1._id]
        });

        // 6. Guardian / Parent
        const guardianUser = await User.create({
            email: "parent.arjun@gmail.com",
            passwordHash: hashedPassword,
            role: "GUARDIAN",
            firstName: "Suresh",
            lastName: "Sharma",
            phone: "+91 9123456789",
            schoolIds: [school1._id]
        });

        // 7. Class & Timetable
        const class5A = await Class.create({
            schoolId: school1._id,
            name: "Grade 5",
            section: "A",
            academicYear: "2025-2026",
            homeroomTeacherId: teacher1._id,
            capacity: 35,
            subjects: [
                { name: "Mathematics", teacherId: teacher1._id },
                { name: "Science", teacherId: teacher2._id },
                { name: "English", teacherId: teacher1._id },
                { name: "Hindi", teacherId: teacher2._id }
            ],
            timetable: [
                { day: "Monday", period: 1, startTime: "08:30", endTime: "09:15", subject: "Mathematics", teacherId: teacher1._id },
                { day: "Monday", period: 2, startTime: "09:15", endTime: "10:00", subject: "Science", teacherId: teacher2._id },
                { day: "Monday", period: 3, startTime: "10:15", endTime: "11:00", subject: "English", teacherId: teacher1._id },
                { day: "Tuesday", period: 1, startTime: "08:30", endTime: "09:15", subject: "Science", teacherId: teacher2._id },
                { day: "Tuesday", period: 2, startTime: "09:15", endTime: "10:00", subject: "Mathematics", teacherId: teacher1._id },
                { day: "Wednesday", period: 1, startTime: "08:30", endTime: "09:15", subject: "Hindi", teacherId: teacher2._id }
            ]
        });

        // 8. Student
        const student = await Student.create({
            schoolId: school1._id,
            classId: class5A._id,
            admissionNo: "ADM-2025-501",
            firstName: "Arjun",
            lastName: "Sharma",
            dob: new Date("2015-05-14"),
            gender: "Male",
            bloodGroup: "O+",
            status: "active",
            guardians: [
                {
                    userId: guardianUser._id,
                    name: "Suresh Sharma",
                    phone: "+91 9123456789",
                    email: "parent.arjun@gmail.com",
                    relation: "father",
                    accessLevel: "full",
                    isPrimary: true,
                    occupation: "Software Engineer"
                }
            ],
            classHistory: [
                {
                    classId: class5A._id,
                    className: "Grade 5",
                    section: "A",
                    academicYear: "2025-2026"
                }
            ]
        });

        // 9. Notifications
        await Notification.create([
            {
                schoolId: school1._id,
                title: "Annual Sports Day Registration",
                body: "Registration for the Annual Sports Meet 2026 is now open. All students from Grade 1 to 10 can participate.",
                authorId: principal._id,
                targetAudience: "ALL"
            },
            {
                schoolId: school1._id,
                classId: class5A._id,
                title: "Grade 5 Science Fair Project Submission",
                body: "Please ensure models for the solar system project are submitted by Friday morning.",
                authorId: teacher2._id,
                targetAudience: "PARENTS"
            }
        ]);

        // 10. Grievance
        await Grievance.create({
            schoolId: school1._id,
            title: "Water dispenser maintenance needed in 2nd floor block",
            description: "The drinking water cooler on the second floor near Grade 5 section is leaking.",
            category: "FACILITY_ISSUE",
            status: "OPEN",
            priority: "MEDIUM"
        });

        console.log("Database successfully seeded with demo accounts & records!");
    } catch (err) {
        console.error("Error seeding database:", err);
    }
}

module.exports = { seedDatabase };
