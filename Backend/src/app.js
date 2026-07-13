require("dotenv").config();
const express = require("express");
const app = express();

const { logger } = require('./middlewares/logger');
const { errorHandler } = require("./middlewares/errorHandler");

app.use(logger);
app.use(express.json());

// health
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// error handler
app.use(errorHandler);

module.exports = app;