const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: true,
            index: true
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            default: null
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        body: {
            type: String,
            required: true
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        targetAudience: {
            type: String,
            enum: ["ALL", "PARENTS", "TEACHERS", "STUDENTS"],
            default: "ALL"
        },
        readBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
