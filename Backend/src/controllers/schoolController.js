const School = require("../models/school");
const User = require("../models/user");

const getAllSchools = async (req, res, next) => {
    try {
        const { approvalStatus, city, search } = req.query;
        let query = { isActive: true };

        if (approvalStatus) query.approvalStatus = approvalStatus;
        if (city) query.city = new RegExp(city, "i");
        if (search) {
            query.$or = [
                { name: new RegExp(search, "i") },
                { code: new RegExp(search, "i") }
            ];
        }

        const schools = await School.find(query).populate("owners", "firstName lastName email phone");
        return res.json({
            success: true,
            data: schools
        });
    } catch (err) {
        next(err);
    }
};

const createSchool = async (req, res, next) => {
    try {
        const { name, code, board, city, contactEmail, contactPhone, address } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "School name and code are required",
                error: "BAD_REQUEST"
            });
        }

        const existing = await School.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `School code '${code}' is already registered`,
                error: "DUPLICATE_CODE"
            });
        }

        const newSchool = await School.create({
            name,
            code: code.toUpperCase(),
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            board: board || "CBSE",
            city: city || "Bengaluru",
            approvalStatus: req.user.role === "SUPERADMIN" ? "approved" : "pending",
            owners: req.user.role === "SCHOOL_OWNER" ? [req.user._id] : [],
            contactDetails: {
                email: contactEmail || req.user.email,
                phone: contactPhone || req.user.phone,
                address: address || ""
            }
        });

        if (req.user.role === "SCHOOL_OWNER") {
            await User.findByIdAndUpdate(req.user._id, {
                $addToSet: { schoolIds: newSchool._id }
            });
        }

        return res.status(201).json({
            success: true,
            message: "School registered successfully",
            data: newSchool
        });
    } catch (err) {
        next(err);
    }
};

const getSchoolById = async (req, res, next) => {
    try {
        const school = await School.findById(req.params.id).populate("owners", "firstName lastName email phone");
        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found",
                error: "NOT_FOUND"
            });
        }
        return res.json({
            success: true,
            data: school
        });
    } catch (err) {
        next(err);
    }
};

const updateApprovalStatus = async (req, res, next) => {
    try {
        const { approvalStatus, rejectionReason } = req.body;
        if (!["approved", "rejected", "pending"].includes(approvalStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid approval status",
                error: "BAD_REQUEST"
            });
        }

        const school = await School.findByIdAndUpdate(
            req.params.id,
            {
                approvalStatus,
                rejectionReason: rejectionReason || ""
            },
            { new: true }
        );

        return res.json({
            success: true,
            message: `School ${approvalStatus} successfully`,
            data: school
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllSchools,
    createSchool,
    getSchoolById,
    updateApprovalStatus
};
