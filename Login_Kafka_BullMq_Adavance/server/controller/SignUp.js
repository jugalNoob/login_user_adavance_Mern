const { initProducer, sendMessage } = require("../producer/producer_sig");
const shortid = require('shortid'); // Import shortid library
exports.signUP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.warn("⚠️ Missing required fields. Skipping Kafka send.");
      return res.status(400).json({ error: "❌ Missing required fields" });
    }

    // --> Simple ------>>
    // const user = { name, email, password };


    // // Send message to Kafka
    // await sendMessage("signUp_user", user);


    const shortId = shortid.generate();
    console.log(shortId)

      const payload = {
      name,
      email,
      password,
      shortId,
      reqMeta: {
        referer: req.headers.referer || req.originalUrl,
        ip: req.headers['x-forwarded-for']?.split(",")[0] || req.socket.remoteAddress,
        hostname: req.hostname,
        originalUrl: req.originalUrl,
        protocol: req.protocol,
        headers: {
          connection: req.headers['connection'],
          host: req.headers['host'],
          secChUaPlatform: req.headers['sec-ch-ua-platform'],
          acceptLanguage: req.headers['accept-language'],
          secChUa: req.headers['sec-ch-ua'],
          userAgent: req.headers['user-agent']
        }
      }
    };

    await sendMessage("signUp_user", payload);

    res.status(201).json({
      message: "✅ User data sent to Kafka successfully",
  
    });
  } catch (error) {
    console.log(error)
    console.error("❌ Error sending data to Kafka:", error.message);
    res.status(500).json({ error: "Failed to send user data to Kafka" });
  }
};

// 🔁 Only call initProducer once (preferably during app startup)
initProducer();
