const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "pathshala_super_secret_jwt_key_2026";

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required",
                error: "UNAUTHORIZED"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-passwordHash");

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "User account inactive or not found",
                error: "UNAUTHORIZED"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
            error: "FORBIDDEN"
        });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Requires one of roles: ${roles.join(", ")}`,
                error: "FORBIDDEN"
            });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    JWT_SECRET
};
