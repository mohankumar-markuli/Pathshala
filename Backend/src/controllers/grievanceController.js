const Grievance = require("../models/grievance");

const getGrievances = async (req, res, next) => {
    try {
        const { schoolId, status, category } = req.query;
        let query = {};

        if (schoolId) query.schoolId = schoolId;
        if (status) query.status = status;
        if (category) query.category = category;

        const grievances = await Grievance.find(query).sort({ createdAt: -1 });

        return res.json({
            success: true,
            data: grievances
        });
    } catch (err) {
        next(err);
    }
};

const createGrievance = async (req, res, next) => {
    try {
        const { schoolId, title, description, category, priority } = req.body;

        if (!schoolId || !title || !description) {
            return res.status(400).json({
                success: false,
                message: "schoolId, title, and description are required",
                error: "BAD_REQUEST"
            });
        }

        const grievance = await Grievance.create({
            schoolId,
            title,
            description,
            category: category || "OTHER",
            priority: priority || "MEDIUM",
            status: "OPEN"
        });

        return res.status(201).json({
            success: true,
            message: "Anonymous grievance report submitted safely",
            data: grievance
        });
    } catch (err) {
        next(err);
    }
};

const updateGrievanceStatus = async (req, res, next) => {
    try {
        const { grievanceId } = req.params;
        const { status, resolutionNotes } = req.body;

        const grievance = await Grievance.findByIdAndUpdate(
            grievanceId,
            {
                status,
                resolutionNotes: resolutionNotes || ""
            },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Grievance status updated",
            data: grievance
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getGrievances,
    createGrievance,
    updateGrievanceStatus
};
