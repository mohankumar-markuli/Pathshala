const mongoose = require("mongoose");

const connectDb = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (MONGODB_URI) {
        try {
            console.log("Attempting connection to configured MongoDB URI...");
            await mongoose.connect(MONGODB_URI, {
                serverSelectionTimeoutMS: 4000
            });
            console.log("Connected to MongoDB Atlas / Primary Cluster");
            return;
        } catch (err) {
            console.warn("Primary MongoDB connection failed (Atlas IP whitelist or network restriction):", err.message);
        }
    }

    try {
        console.log("Attempting connection to local MongoDB (mongodb://127.0.0.1:27017/pathshala)...");
        await mongoose.connect("mongodb://127.0.0.1:27017/pathshala", {
            serverSelectionTimeoutMS: 3000
        });
        console.log("Connected to local MongoDB");
        return;
    } catch (localErr) {
        console.warn("Local MongoDB not available. Launching MongoMemoryServer in-memory instance...");
    }

    try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        console.log(`Connected to In-Memory Mongo Server at ${mongoUri}`);
    } catch (memErr) {
        console.error("Fatal: Could not initialize any MongoDB instance.", memErr.message);
        throw memErr;
    }
};

module.exports = connectDb;