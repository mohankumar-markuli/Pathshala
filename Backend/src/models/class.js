const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { _id: true });

const timetableSlotSchema = new mongoose.Schema({
    day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], required: true },
    period: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { _id: true });

const classSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true
        },
        section: {
            type: String,
            required: true
        },
        academicYear: {
            type: String,
            default: "2025-2026"
        },
        homeroomTeacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        capacity: {
            type: Number,
            default: 40
        },
        subjects: [subjectSchema],
        timetable: [timetableSlotSchema]
    },
    { timestamps: true }
);

classSchema.index({ schoolId: 1, name: 1, section: 1, academicYear: 1 });

module.exports = mongoose.model("Class", classSchema);
