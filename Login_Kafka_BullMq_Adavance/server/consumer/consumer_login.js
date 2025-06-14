const kafka = require("../client/client");
const connectDB = require("../db/conn");
const Register = require("../module/student");
const bcrypt = require("bcrypt");
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
        try {
          const { email, password } = JSON.parse(message.value.toString());

          if (!email || !password) {
            await producer.send({
              topic: "login_failed",
              messages: [{ value: JSON.stringify({ email, reason: "Missing credentials" }) }],
            });
            return;
          }

          const userValid = await Register.findOne({ email });
          if (!userValid) {
            await producer.send({
              topic: "login_failed",
              messages: [{ value: JSON.stringify({ email, reason: "User not found" }) }],
            });
            return;
          }

          const isMatch = await bcrypt.compare(password, userValid.password);
          if (!isMatch) {
            await producer.send({
              topic: "login_failed",
              messages: [{ value: JSON.stringify({ email, reason: "Incorrect password" }) }],
            });
            return;
          }

          const token = await userValid.generateAuthtokens();

  

          await producer.send({
            topic: "login_success",
            messages: [
              {
                value: JSON.stringify({
                  email,
                  userId: userValid._id,
                  token,
                  message: "Login successful",
                }),
              },
            ],
          });

        } catch (err) {
          console.error("❌ Error processing login message:", err.message);
        }
      },
    });
  } catch (err) {
    console.error("❌ Kafka Consumer init failed:", err);
  }
}

(async () => {
  await connectDB();
  await initConsumer();
})();



        
        // res.cookie("jwttoken", token, { 
        //     expires: new Date(Date.now() + 9000000),
        //     httpOnly: true, // Set HTTP only to prevent JavaScript access
        //     // Other cookie options if needed
        // });