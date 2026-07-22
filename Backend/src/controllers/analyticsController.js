const School = require("../models/school");
const User = require("../models/user");
const Class = require("../models/class");
const Student = require("../models/student");
const Grievance = require("../models/grievance");
const Notification = require("../models/notification");

const getDashboardAnalytics = async (req, res, next) => {
    try {
        const user = req.user;
        let metrics = {};

        if (user.role === "SUPERADMIN") {
            const totalSchools = await School.countDocuments();
            const pendingSchools = await School.countDocuments({ approvalStatus: "pending" });
            const approvedSchools = await School.countDocuments({ approvalStatus: "approved" });
            const totalUsers = await User.countDocuments();
            const totalStudents = await Student.countDocuments({ status: "active" });

            metrics = {
                role: "SUPERADMIN",
                totalSchools,
                pendingSchools,
                approvedSchools,
                totalUsers,
                totalStudents
            };
        } else if (user.role === "SCHOOL_OWNER") {
            const ownedSchools = await School.find({ owners: user._id });
            const schoolIds = ownedSchools.map(s => s._id);

            const totalStudents = await Student.countDocuments({ schoolId: { $in: schoolIds }, status: "active" });
            const totalEmployees = await User.countDocuments({ schoolIds: { $in: schoolIds }, role: { $ne: "SUPERADMIN" } });
            const totalClasses = await Class.countDocuments({ schoolId: { $in: schoolIds } });

            metrics = {
                role: "SCHOOL_OWNER",
                ownedSchoolsCount: ownedSchools.length,
                totalStudents,
                totalEmployees,
                totalClasses,
                schools: ownedSchools.map(s => ({
                    id: s._id,
                    name: s.name,
                    code: s.code,
                    approvalStatus: s.approvalStatus,
                    city: s.city
                }))
            };
        } else if (user.role === "SCHOOL_ADMIN" || user.role === "TEACHER") {
            const schoolId = user.schoolIds && user.schoolIds.length > 0 ? user.schoolIds[0] : null;

            const totalStudents = schoolId ? await Student.countDocuments({ schoolId, status: "active" }) : 0;
            const totalClasses = schoolId ? await Class.countDocuments({ schoolId }) : 0;
            const totalTeachers = schoolId ? await User.countDocuments({ schoolIds: schoolId, role: "TEACHER" }) : 0;
            const openGrievances = schoolId ? await Grievance.countDocuments({ schoolId, status: "OPEN" }) : 0;
            const notificationsCount = schoolId ? await Notification.countDocuments({ schoolId }) : 0;

            let myClasses = [];
            if (user.role === "TEACHER") {
                myClasses = await Class.find({
                    $or: [
                        { homeroomTeacherId: user._id },
                        { "subjects.teacherId": user._id }
                    ]
                });
            }

            metrics = {
                role: user.role,
                totalStudents,
                totalClasses,
                totalTeachers,
                openGrievances,
                notificationsCount,
                myClassesCount: myClasses.length
            };
        } else if (user.role === "GUARDIAN") {
            const children = await Student.find({ "guardians.userId": user._id })
                .populate("schoolId", "name code logoUrl")
                .populate("classId", "name section");

            metrics = {
                role: "GUARDIAN",
                childrenCount: children.length,
                children: children.map(c => ({
                    id: c._id,
                    name: `${c.firstName} ${c.lastName}`,
                    school: c.schoolId ? c.schoolId.name : "N/A",
                    class: c.classId ? `${c.classId.name}-${c.classId.section}` : "N/A",
                    status: c.status
                }))
            };
        }

        return res.json({
            success: true,
            data: metrics
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getDashboardAnalytics };
