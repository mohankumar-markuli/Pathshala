const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        slug: {
            type: String,
            lowercase: true,
            trim: true
        },
        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "approved"
        },
        rejectionReason: {
            type: String,
            default: ""
        },
        logoUrl: {
            type: String,
            default: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80"
        },
        board: {
            type: String,
            default: "CBSE"
        },
        city: {
            type: String,
            default: "Bengaluru"
        },
        owners: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        contactDetails: {
            email: String,
            phone: String,
            address: String,
            website: String
        },
        settings: {
            academicYear: {
                type: String,
                default: "2025-2026"
            },
            currency: {
                type: String,
                default: "INR"
            },
            timezone: {
                type: String,
                default: "Asia/Kolkata"
            }
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

schoolSchema.index({ code: 1 });
schoolSchema.index({ approvalStatus: 1 });

module.exports = mongoose.model("School", schoolSchema);
