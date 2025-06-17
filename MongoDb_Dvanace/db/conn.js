const mongoose = require("mongoose");
require("dotenv").config();

const DB = process.env.DATABASE;

if (!DB) {
  throw new Error("❌ DATABASE URL is missing. Please check your .env file.");
}

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,           // How long to wait for server selection
      socketTimeoutMS: 45000,                    // How long a socket stays open
      maxPoolSize: parseInt(process.env.DB_POOL_SIZE) || 10, // Connections in pool
      minPoolSize: 2,
      maxIdleTimeMS: 30000,                      // Close idle connections after 30s
      connectTimeoutMS: 10000,                   // Timeout for initial connection
      family: 4,                                  // Force IPv4
      heartbeatFrequencyMS: 10000,               // Heartbeat interval
      retryWrites: true,
      retryReads: true,
      appName: process.env.APP_NAME || "URL-Shortener",
      compressors: "zlib",
      zlibCompressionLevel: 7,
      autoIndex: process.env.NODE_ENV !== "production", // Only create indexes in dev
    });

    console.log("✅ MongoDB connected successfully");

    mongoose.connection.on("connected", () => {
      console.log("📡 Mongoose is connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔌 Mongoose connection closed due to app termination");
      process.exit(0);
    });
    
  } catch (error) {
    console.error("❌ Initial MongoDB connection error:", error.message);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

module.exports = connectDB;
