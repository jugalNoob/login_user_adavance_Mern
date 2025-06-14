const kafka = require("../client/client");
const connectDB = require("../db/conn");
const Register = require("../module/student");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { sendMessage, initProducer } = require("../producer/producer_forget");

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "user-forget" });

  try {
    console.log("🔄 Connecting Kafka Consumer...");
    await consumer.connect();
    await initProducer(); // Initialize the Kafka producer once
    console.log("✅ Kafka Consumer connected");

    await consumer.subscribe({ topic: "forget_user", fromBeginning: true });
    console.log("✅ Subscribed to topic 'forget_user'");

    await consumer.run({
      eachMessage: async ({ message }) => {
        const userData = JSON.parse(message.value.toString());
        const { email, password } = userData;

        try {
          console.log("📨 Received forget request for:", email);

          if (!email || !password) {
            console.log("❌ Missing credentials");
            await sendMessage("forget_failed", {
              email: email || "unknown",
              reason: "Missing credentials",
              timestamp: new Date(),
            });
            return;
          }

          const user = await Register.findOne({ email });

          if (!user) {
            console.log("❌ User not found for email:", email);
            await sendMessage("forget_failed", {
              email,
              reason: "User not found",
              timestamp: new Date(),
            });
            return;
          }

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

          const hashedPassword = await bcrypt.hash(password, 12);
          const updatedUser = await Register.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
          );

          console.log("✅ Password updated for:", email);
          await sendMessage("forget_success", {
            email,
            status: "Password reset successfully",
            userId: updatedUser._id,
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
    console.error("❌ Kafka Consumer Error:", error);
  }
}

(async () => {
  await connectDB();
  await initConsumer();
})();
