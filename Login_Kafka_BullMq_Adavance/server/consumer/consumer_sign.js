



// / --- > simple Code Line 

const kafka = require("../client/client");
const connectDB = require("../db/conn");
const Register = require("../module/student");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const emailQueue = require('../queues/noticationQueu');

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "user-signUp-group" });

  try {
    console.log("🔄 Connecting Kafka Consumer...");
    await consumer.connect();
    console.log("✅ Consumer connected successfully");

    await consumer.subscribe({ topic: "signUp_user", fromBeginning: true });
    console.log("✅ Subscribed to topic 'signUp_user'");

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const userData = JSON.parse(message.value.toString());
          console.log(`📥 Received message: ${JSON.stringify(userData)}`);

           const { name, email, password,  reqMeta } = userData;

          if (!name || !email || !password) {
            console.error("❌ Missing required fields in message");
            return;
          }

          const existingUser = await Register.findOne({ email });
          if (existingUser) {
            console.log("⚠️ Email already in use");
            return;
          }

          // const hashedPassword = await bcrypt.hash(password, 10);
          const shortId = shortid.generate();

          const newUser = new Register({
            name,
            email,
            password,
            shortId,
          });

          const savedUser = await newUser.save();
          console.log("✅ User registered:", savedUser.email);

     

              // Generate JWT token and store in MongoDB
    const tokenJwt = await savedUser.generateAuthtokens(); // <-- Here, result is the new user

    console.log(tokenJwt)

    // 4. Session token using simulated req
     
     const fakeReq = {
      headers: {
        "x-forwarded-for": reqMeta.ip,
        "user-agent": reqMeta.headers.userAgent
      },
      socket: { remoteAddress: reqMeta.ip }
    };

    await savedUser.generateSessionToken(fakeReq);

    await savedUser.generateUserInfomration(
      reqMeta.referer,
      reqMeta.ip,
      reqMeta.hostname,
      reqMeta.originalUrl,
      reqMeta.protocol,
      reqMeta.headers.connection,
      reqMeta.headers.host,
      reqMeta.headers.secChUaPlatform || "Unknown",
      reqMeta.headers.acceptLanguage || "Unknown",
      reqMeta.headers.secChUa || "Unknown"
    );

          await emailQueue.add("send-welcome-email", {
            name,
            email,
            shortId,
          });

        } catch (err) {
          console.log(err)
          console.error("❌ Error processing message:", err.message);
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
