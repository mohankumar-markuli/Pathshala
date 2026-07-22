const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true
        },
        username: {
            type: String,
            trim: true,
            sparse: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["SUPERADMIN", "SCHOOL_OWNER", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "STAFF", "GUARDIAN"],
            default: "STUDENT"
        },
        roles: [{
            type: String,
            enum: ["admin", "teacher", "principal", "vice_principal", "librarian", "accountant", "counselor", "coordinator"]
        }],
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        schoolIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "School"
        }],
        profilePictureUrl: {
            type: String,
            default: ""
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date
        }
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

module.exports = mongoose.model("User", userSchema);
