const app = require("./app");
const connectDb = require("./config/database");
const { seedDatabase } = require("./utils/seed");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log("Starting Pathshala Backend API...");

        // Start HTTP listener immediately so server is accessible right away
        const server = app.listen(PORT, () => {
            console.log(`Pathshala REST API running on http://localhost:${PORT}`);
        });

        // Connect to DB asynchronously
        connectDb().then(async () => {
            console.log("Database connected successfully");
            await seedDatabase();
        }).catch(err => {
            console.warn("Database connection background notice:", err.message);
        });

    } catch (err) {
        console.error("Startup failed:", err.message);
        process.exit(1);
    }
}

startServer();