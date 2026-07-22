const Notification = require("../models/notification");

const getNotifications = async (req, res, next) => {
    try {
        const { schoolId, classId } = req.query;
        let query = {};

        if (schoolId) query.schoolId = schoolId;
        if (classId) {
            query.$or = [{ classId: null }, { classId }];
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .populate("authorId", "firstName lastName role");

        return res.json({
            success: true,
            data: notifications
        });
    } catch (err) {
        next(err);
    }
};

const createNotification = async (req, res, next) => {
    try {
        const { schoolId, classId, title, body, targetAudience } = req.body;

        if (!schoolId || !title || !body) {
            return res.status(400).json({
                success: false,
                message: "schoolId, title, and body are required",
                error: "BAD_REQUEST"
            });
        }

        const notification = await Notification.create({
            schoolId,
            classId: classId || null,
            title,
            body,
            authorId: req.user._id,
            targetAudience: targetAudience || "ALL"
        });

        return res.status(201).json({
            success: true,
            message: "Notification published successfully",
            data: notification
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getNotifications,
    createNotification
};
