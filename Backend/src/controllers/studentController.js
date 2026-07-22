const Student = require("../models/student");
const User = require("../models/user");
const mongoose = require("mongoose");

const getAllStudents = async (req, res, next) => {
    try {
        const { schoolId, classId, status, search } = req.query;
        let query = {};

        if (schoolId) query.schoolId = schoolId;
        if (classId) query.classId = classId;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { firstName: new RegExp(search, "i") },
                { lastName: new RegExp(search, "i") },
                { admissionNo: new RegExp(search, "i") }
            ];
        }

        const students = await Student.find(query)
            .populate("schoolId", "name code logoUrl")
            .populate("classId", "name section academicYear")
            .populate("guardians.userId", "firstName lastName email phone");

        return res.json({
            success: true,
            data: students
        });
    } catch (err) {
        next(err);
    }
};

const enrollStudent = async (req, res, next) => {
    try {
        const { schoolId, classId, admissionNo, firstName, lastName, dob, gender, bloodGroup, guardianName, guardianPhone, guardianEmail, relation } = req.body;

        if (!schoolId || !classId || !admissionNo || !firstName || !guardianName || !guardianPhone) {
            return res.status(400).json({
                success: false,
                message: "Missing required enrollment fields (schoolId, classId, admissionNo, firstName, guardian details)",
                error: "BAD_REQUEST"
            });
        }

        let guardianUser = await User.findOne({ phone: guardianPhone });
        if (!guardianUser && guardianEmail) {
            guardianUser = await User.findOne({ email: guardianEmail.toLowerCase() });
        }

        const newStudent = await Student.create({
            personId: new mongoose.Types.ObjectId(),
            schoolId,
            classId,
            admissionNo,
            firstName,
            lastName: lastName || "",
            dob: dob ? new Date(dob) : null,
            gender: gender || "Male",
            bloodGroup: bloodGroup || "O+",
            status: "active",
            guardians: [
                {
                    userId: guardianUser ? guardianUser._id : null,
                    name: guardianName,
                    phone: guardianPhone,
                    email: guardianEmail || "",
                    relation: relation || "father",
                    accessLevel: "full",
                    isPrimary: true
                }
            ],
            classHistory: [
                {
                    classId,
                    className: "Enrolled Class",
                    assignedAt: new Date()
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Student enrolled successfully",
            data: newStudent
        });
    } catch (err) {
        next(err);
    }
};

const updateStudentStatus = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const { status, reason, note } = req.body;

        if (!["active", "transferred", "left", "alumni"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
                error: "BAD_REQUEST"
            });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student record not found",
                error: "NOT_FOUND"
            });
        }

        student.status = status;
        if (reason || note) {
            student.exitInfo = {
                reason: reason || "",
                note: note || "",
                exitDate: new Date()
            };
        }

        await student.save();

        return res.json({
            success: true,
            message: `Student status updated to ${status}`,
            data: student
        });
    } catch (err) {
        next(err);
    }
};

const getGuardianChildren = async (req, res, next) => {
    try {
        const { studentId } = req.query;
        let query = { "guardians.userId": req.user._id };

        if (studentId) query._id = studentId;

        const children = await Student.find(query)
            .populate("schoolId", "name code logoUrl contactDetails")
            .populate("classId", "name section homeroomTeacherId timetable subjects");

        return res.json({
            success: true,
            data: children
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllStudents,
    enrollStudent,
    updateStudentStatus,
    getGuardianChildren
};
