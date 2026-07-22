require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const { logger } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/errorHandler");

// Route imports
const authRoutes = require("./routes/authRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const classRoutes = require("./routes/classRoutes");
const studentRoutes = require("./routes/studentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const grievanceRoutes = require("./routes/grievanceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// DNS config
const dns = require("dns");
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    // Ignore DNS error in restricted environments
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Health check
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Pathshala White-Label API is operational",
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/schools", schoolRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/grievances", grievanceRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;