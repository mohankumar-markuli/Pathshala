const Class = require("../models/class");

const getAllClasses = async (req, res, next) => {
    try {
        const { schoolId } = req.query;
        let query = {};
        if (schoolId) query.schoolId = schoolId;

        const classes = await Class.find(query)
            .populate("homeroomTeacherId", "firstName lastName email phone")
            .populate("subjects.teacherId", "firstName lastName email")
            .populate("timetable.teacherId", "firstName lastName");

        return res.json({
            success: true,
            data: classes
        });
    } catch (err) {
        next(err);
    }
};

const createClass = async (req, res, next) => {
    try {
        const { schoolId, name, section, capacity, homeroomTeacherId, subjects } = req.body;

        if (!schoolId || !name || !section) {
            return res.status(400).json({
                success: false,
                message: "schoolId, class name, and section are required",
                error: "BAD_REQUEST"
            });
        }

        const newClass = await Class.create({
            schoolId,
            name,
            section,
            capacity: capacity || 40,
            homeroomTeacherId: homeroomTeacherId || null,
            subjects: subjects || [
                { name: "Mathematics" },
                { name: "Science" },
                { name: "English" },
                { name: "Social Studies" }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Class created successfully",
            data: newClass
        });
    } catch (err) {
        next(err);
    }
};

const updateSubjectTeacher = async (req, res, next) => {
    try {
        const { classId } = req.params;
        const { subjectName, teacherId } = req.body;

        const targetClass = await Class.findById(classId);
        if (!targetClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found",
                error: "NOT_FOUND"
            });
        }

        const subject = targetClass.subjects.find(s => s.name === subjectName);
        if (subject) {
            subject.teacherId = teacherId;
        } else {
            targetClass.subjects.push({ name: subjectName, teacherId });
        }

        await targetClass.save();

        return res.json({
            success: true,
            message: `Assigned teacher to ${subjectName}`,
            data: targetClass
        });
    } catch (err) {
        next(err);
    }
};

const updateTimetable = async (req, res, next) => {
    try {
        const { classId } = req.params;
        const { timetable } = req.body;

        const targetClass = await Class.findByIdAndUpdate(
            classId,
            { timetable },
            { new: true }
        ).populate("timetable.teacherId", "firstName lastName");

        return res.json({
            success: true,
            message: "Timetable updated successfully",
            data: targetClass
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllClasses,
    createClass,
    updateSubjectTeacher,
    updateTimetable
};
