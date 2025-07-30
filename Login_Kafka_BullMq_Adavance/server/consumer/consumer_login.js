const kafka = require("../client/client");
const connectDB = require("../db/conn");
const Register = require("../module/student");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "user-login" });
  const producer = kafka.producer();

  try {
    await consumer.connect();
    await producer.connect();
    console.log("✅ Kafka Consumer and Producer connected");

    await consumer.subscribe({ topic: "login_user", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        let email = "unknown";
        try {
          // Parse incoming login request
          const { email: incomingEmail, password } = JSON.parse(message.value.toString());
          email = incomingEmail;

          // Check required fields
          if (!email || !password) {
            await producer.send({
              topic: "login_failed",
              messages: [
                {
                  value: JSON.stringify({
                    email,
                    reason: "Missing email or password",
                    timestamp: new Date(),
                  }),
                },
              ],
            });
            return;
          }

          // Validate user
          const userValid = await Register.findOne({ email });
          if (!userValid) {
            await producer.send({
              topic: "login_failed",
              messages: [
                {
                  value: JSON.stringify({
                    email,
                    reason: "User not found",
                    timestamp: new Date(),
                  }),
                },
              ],
            });
            return;
          }

          // Validate password
          const isMatch = await argon2.verify(userValid.password, password);
          if (!isMatch) {
            await producer.send({
              topic: "login_failed",
              messages: [
                {
                  value: JSON.stringify({
                    email,
                    reason: "Incorrect password",
                    timestamp: new Date(),
                  }),
                },
              ],
            });
            return;
          }

          // Retrieve existing token
          const existingToken = userValid?.tokens?.[0]?.token || null;

          if (!existingToken) {
            await producer.send({
              topic: "login_failed",
              messages: [
                {
                  value: JSON.stringify({
                    email,
                    reason: "JWT not found in tokens array",
                    timestamp: new Date(),
                  }),
                },
              ],
            });
            return;
          }

       console.log("sucssfull")
          // Send success message with token
          await producer.send({
            topic: "login_success",
            messages: [
              {
                value: JSON.stringify({
                  email,
                  userId: userValid._id,
                  token: existingToken,
                  message: "✅ Login successful",
                  timestamp: new Date(),
                }),
              },
            ],
          });
        } catch (err) {
          console.error("❌ Error processing login message:", err.message);
          await producer.send({
            topic: "login_failed",
            messages: [
              {
                value: JSON.stringify({
                  email,
                  reason: "Internal server error",
                  error: err.message,
                  timestamp: new Date(),
                }),
              },
            ],
          });
        }
      },
    });
  } catch (err) {
    console.error("❌ Kafka Consumer init failed:", err.message);
    console.log(err);
  }
}

// Connect to DB and start consumer
(async () => {
  await connectDB();
  await initConsumer();
})();
