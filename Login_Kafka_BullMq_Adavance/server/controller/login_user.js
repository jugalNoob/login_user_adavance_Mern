const { initProducer, sendMessage } = require("../producer/producer_login");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn("⚠️ Missing required fields. Skipping Kafka send.");
      return res.status(400).json({ error: "❌ Missing required fields" });
    }

    const user = { email, password };

    // Send login message to Kafka
    await sendMessage("login_user", user); // ✅ Use login topic

    res.status(200).json({
      message: "✅ Login data sent to Kafka successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error sending login data to Kafka:", error.message);
    res.status(500).json({ error: "Failed to send login data to Kafka" });
  }
};

// Only call once in entry file (server.js or app.js)
initProducer();
