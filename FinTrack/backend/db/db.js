const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URL;
        if (!uri) {
            throw new Error("MONGO_URI is not defined. Check your .env file.");
        }

        await mongoose.connect(uri); // No need for extra options

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
