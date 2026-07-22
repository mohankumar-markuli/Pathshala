const mongoose = require("mongoose");

const guardianSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    relation: {
        type: String,
        enum: ["father", "mother", "guardian", "uncle", "aunt", "grandfather", "grandmother", "other"],
        default: "father"
    },
    relationNote: { type: String, default: "" },
    accessLevel: {
        type: String,
        enum: ["full", "view_only", "emergency_only"],
        default: "full"
    },
    isPrimary: { type: Boolean, default: false },
    occupation: { type: String, default: "" }
}, { _id: true });

const studentSchema = new mongoose.Schema(
    {
        personId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            default: () => new mongoose.Types.ObjectId(),
            index: true
        },
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: true,
            index: true
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        admissionNo: {
            type: String,
            required: true,
            trim: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        dob: {
            type: Date
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            default: "Male"
        },
        bloodGroup: {
            type: String,
            default: "O+"
        },
        status: {
            type: String,
            enum: ["active", "transferred", "left", "alumni"],
            default: "active",
            index: true
        },
        exitInfo: {
            reason: String,
            note: String,
            exitDate: Date,
            destinationSchoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
            destinationStudentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }
        },
        guardians: [guardianSchema],
        classHistory: [{
            classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
            className: String,
            section: String,
            academicYear: String,
            assignedAt: { type: Date, default: Date.now }
        }],
        previousSchools: [{
            schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
            exitYear: Number
        }],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

studentSchema.index({ schoolId: 1, admissionNo: 1 }, { unique: true });
studentSchema.index({ "guardians.phone": 1 });
studentSchema.index({ "guardians.userId": 1 });

module.exports = mongoose.model("Student", studentSchema);
