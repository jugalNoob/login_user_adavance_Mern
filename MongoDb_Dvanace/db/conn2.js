const mongoose = require("mongoose");
require("dotenv").config();
const retry = require("async-retry");
const { MongoMemoryServer } = require("mongodb-memory-server"); // For testing
const logger = require("./logger"); // Assume you have a custom logger

class Database {
  constructor() {
    this.DB = process.env.DATABASE;
    this.isTestEnv = process.env.NODE_ENV === "test";
    this.memoryServer = null;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds

    if (!this.DB && !this.isTestEnv) {
      throw new Error("❌ DATABASE URL is missing. Please check your .env file.");
    }

    this.configureEventListeners();
  }

  async connect() {
    try {
      await retry(
        async (bail) => {
          try {
            const dbUrl = this.isTestEnv
              ? await this.setupMemoryServer()
              : this.DB;

            const options = this.getConnectionOptions();

            await mongoose.connect(dbUrl, options);
            this.connectionAttempts = 0; // Reset on success

            logger.info("✅ MongoDB connected successfully");
            logger.debug(`Connected to: ${this.getObfuscatedUrl(dbUrl)}`);

            if (this.isTestEnv) {
              logger.warn("⚠️ Using in-memory MongoDB for testing");
            }
          } catch (error) {
            this.connectionAttempts++;
            logger.warn(
              `Connection attempt ${this.connectionAttempts}/${this.maxRetries} failed`
            );
            if (this.connectionAttempts >= this.maxRetries) {
              bail(new Error("Max connection retries reached"));
              return;
            }
            throw error;
          }
        },
        {
          retries: this.maxRetries,
          minTimeout: this.retryDelay,
          maxTimeout: this.retryDelay * 2,
        }
      );
    } catch (error) {
      logger.error("❌ Initial DB connection error:", error.message);
      if (!this.isTestEnv) {
        setTimeout(() => this.connect(), this.retryDelay);
      }
    }
  }

  async setupMemoryServer() {
    this.memoryServer = await MongoMemoryServer.create();
    return this.memoryServer.getUri();
  }

  getConnectionOptions() {
    return {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000,
      family: 4, // Force IPv4
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
      appName: process.env.APP_NAME || "URL-Shortener",
      compressors: "zlib",
      zlibCompressionLevel: 7,
      autoIndex: process.env.NODE_ENV !== "production", // Auto create indexes in dev
    };
  }

  configureEventListeners() {
    mongoose.connection.on("connected", () => {
      logger.info("📡 Mongoose is connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("❌ Mongoose connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ Mongoose disconnected");
      if (!this.isTestEnv) {
        setTimeout(() => this.connect(), this.retryDelay);
      }
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("♻️ Mongoose reconnected");
    });

    mongoose.connection.on("open", () => {
      logger.debug("🔓 Mongoose connection is open");
    });

    mongoose.connection.on("close", () => {
      logger.warn("🔌 Mongoose connection closed");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await this.gracefulShutdown();
    });

    process.on("SIGTERM", async () => {
      await this.gracefulShutdown();
    });
  }

  async gracefulShutdown() {
    try {
      await mongoose.connection.close();
      if (this.isTestEnv && this.memoryServer) {
        await this.memoryServer.stop();
      }
      logger.info("🔌 Mongoose connection closed due to app termination");
      process.exit(0);
    } catch (error) {
      logger.error("❌ Error during shutdown:", error.message);
      process.exit(1);
    }
  }

  getObfuscatedUrl(url) {
    if (!url) return "unknown";
    if (this.isTestEnv) return "in-memory-db";
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}:*****@${urlObj.pathname}`;
    } catch {
      return "invalid-url";
    }
  }

  async healthCheck() {
    try {
      await mongoose.connection.db.admin().ping();
      return {
        status: "healthy",
        db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        ping: "ok",
      };
    } catch (error) {
      return {
        status: "unhealthy",
        error: error.message,
      };
    }
  }
}

// Singleton instance
const database = new Database();

module.exports = {
  connectDB: () => database.connect(),
  disconnectDB: () => mongoose.connection.close(),
  healthCheck: () => database.healthCheck(),
  getConnection: () => mongoose.connection,
};




Key Advanced Features Added:
Retry Mechanism:

Uses async-retry for robust connection attempts with configurable retries

Exponential backoff for retry delays

Testing Support:

Integrated mongodb-memory-server for in-memory testing

Automatic detection of test environment

Connection Pool Optimization:

Configurable pool sizes (min/max)

Connection timeouts and keep-alive settings

Compression options

Enhanced Monitoring:

Comprehensive event listeners for all connection states

Health check endpoint capability

Obfuscated URL logging for security

Graceful Shutdown:

Handles both SIGINT and SIGTERM signals

Proper cleanup of in-memory server in test environment

Logging Integration:

Designed to work with a custom logger

Different log levels for various events

Singleton Pattern:

Ensures single database instance

Clean exports for common operations

Configuration Options:

Environment-specific settings (autoIndex in dev)

App name identification in MongoDB logs

IPv4/IPv6 configuration

Additional Setup Needed: