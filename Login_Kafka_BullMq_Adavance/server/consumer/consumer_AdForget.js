const kafka = require("../client/client");
const connectDB = require("../db/conn");
const Register = require("../module/student");
const bcrypt = require("bcrypt");
const argon2 = require('argon2');
require("dotenv").config();

const { sendMessage, initProducer } = require("../producer/producer_forget");

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "user-forget" });

  try {
    console.log("🔄 Connecting Kafka Consumer...");
    await consumer.connect();
    await initProducer(); // Initialize Kafka producer once
    console.log("✅ Kafka Consumer connected");

    await consumer.subscribe({ topic: "forget_user", fromBeginning: true });
    console.log("✅ Subscribed to topic 'forget_user'");

    await consumer.run({
      eachMessage: async ({ message }) => {
        const userData = JSON.parse(message.value.toString());
        const { id, email, password } = userData;

        try {
          console.log("📨 Received forget request for:", email);

          // Basic validation
          if (!id || !email || !password) {
            console.log("❌ Missing credentials");
            await sendMessage("forget_failed", {
              email: email || "unknown",
              reason: "Missing id, email, or password",
              timestamp: new Date(),
            });
            return;
          }

          // Find user by ID and email
          const user = await Register.findOne({ _id: id, email });

          if (!user) {
            console.log("❌ User not found for email or ID mismatch:", email);
            await sendMessage("forget_failed", {
              id,
              email,
              reason: "User not found or email mismatch",
              timestamp: new Date(),
            });
            return;
          }

          // Prevent using same password
          const isSamePassword = await bcrypt.compare(password, user.password);
          if (isSamePassword) {
            console.log("⚠️ New password is the same as the old password");
            await sendMessage("forget_failed", {
              email,
              reason: "New password cannot be same as old password",
              timestamp: new Date(),
            });
            return;
          }

          // Hash new password
          const hashedPassword = await argon2.hash(password);

          // Update user
          const updatedUser = await Register.findOneAndUpdate(
            { _id: id, email },
            { password: hashedPassword },
            { new: true }
          );

          if (!updatedUser) {
            console.log("❌ Update failed");
            await sendMessage("forget_failed", {
              id,
              email,
              reason: "Failed to update password",
              timestamp: new Date(),
            });
            return;
          }

          console.log("✅ Password updated for:", email);
          await sendMessage("forget_success", {
            email,
            userId: updatedUser._id,
            status: "Password reset successfully",
            timestamp: new Date(),
          });

        } catch (err) {
          console.error("❌ Error in forget consumer:", err.message);
          await sendMessage("forget_failed", {
            email: email || "unknown",
            error: err.message,
            timestamp: new Date(),
          });
        }
      },
    });
  } catch (error) {
    console.error("❌ Kafka Consumer Error:", error.message);
  }
}

// Start the consumer after DB connection
(async () => {
  await connectDB();
  await initConsumer();
})();
