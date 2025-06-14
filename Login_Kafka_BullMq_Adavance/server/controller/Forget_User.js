const { sendMessage, initProducer } = require("../producer/producer_forget");

exports.forgetUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "❌ Missing required fields" });
    }

    const forgetData = { email, password };

    await sendMessage("forget_user", forgetData);

    res.status(200).json({
      message: "📨 Forget password request sent to Kafka successfully",
      forgetData,
    });
  } catch (error) {
    console.error("❌ Error sending forget password data to Kafka:", error.message);
    res.status(500).json({ error: "Failed to send forget password data to Kafka" });
  }
};

// Only once globally
initProducer();
