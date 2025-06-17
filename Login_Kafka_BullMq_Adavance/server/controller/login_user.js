const { initProducer, sendMessage } = require("../producer/producer_login");
const Register = require("../module/student");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn("⚠️ Missing required fields. Skipping Kafka send.");
      return res.status(400).json({ error: "❌ Missing required fields" });
    }


        const userValid = await Register.findOne({ email });
    if (!userValid) {
      return res.status(404).json({ error: "User not found" });
    }


         // ✅ Generate token from model method
    const token = await userValid.generateAuthtokens();
    console.log("Generated token:", token);

        res.cookie("jwttoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      expires: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours
    });

    const user = { email, password };

    // Send login message to Kafka
    await sendMessage("login_user", user); // ✅ Use login topic

   res.status(200).json({
  message: "✅ Login data sent to Kafka successfully",
  token,
  user
});
  } catch (error) {
    console.error("❌ Error sending login data to Kafka:", error.message);
    res.status(500).json({ error: "Failed to send login data to Kafka" });
  }
};

// Only call once in entry file (server.js or app.js)
initProducer();
