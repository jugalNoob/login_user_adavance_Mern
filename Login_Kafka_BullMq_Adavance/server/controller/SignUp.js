const { initProducer, sendMessage } = require("../producer/producer_sig");

exports.signUP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.warn("⚠️ Missing required fields. Skipping Kafka send.");
      return res.status(400).json({ error: "❌ Missing required fields" });
    }

    const user = { name, email, password };

    // Send message to Kafka
    await sendMessage("signUp_user", user);

    res.status(201).json({
      message: "✅ User data sent to Kafka successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error sending data to Kafka:", error.message);
    res.status(500).json({ error: "Failed to send user data to Kafka" });
  }
};

// 🔁 Only call initProducer once (preferably during app startup)
initProducer();
