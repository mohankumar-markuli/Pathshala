const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Student = require("../models/student");
const School = require("../models/school");
const { JWT_SECRET } = require("../middlewares/authMiddleware");
const { seedDatabase } = require("../utils/seed");

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
                error: "BAD_REQUEST"
            });
        }

        const user = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: email }]
        }).populate("schoolIds", "name code logoUrl approvalStatus");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                error: "UNAUTHORIZED"
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                error: "UNAUTHORIZED"
            });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    roles: user.roles,
                    phone: user.phone,
                    schools: user.schoolIds
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        let children = [];

        if (user.role === "GUARDIAN" || user.roles.includes("guardian")) {
            children = await Student.find({
                "guardians.userId": user._id
            }).populate("schoolId", "name code logoUrl").populate("classId", "name section");
        }

        return res.json({
            success: true,
            data: {
                user,
                children
            }
        });
    } catch (err) {
        next(err);
    }
};

const seedData = async (req, res, next) => {
    try {
        await seedDatabase();
        return res.json({
            success: true,
            message: "Database seed operation complete"
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    login,
    getMe,
    seedData
};
