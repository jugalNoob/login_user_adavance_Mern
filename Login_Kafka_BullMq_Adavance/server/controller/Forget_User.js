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

// // Only once globally
initProducer();





// const Register = require();

// exports.forgetUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // ✅ Fetch user from DB
//     const userValid = await Register.findOne({ email });
//     if (!userValid) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // ✅ Generate token from model method
//     const token = await userValid.generateAuthtokens();
//     console.log("Generated token:", token);

//     // ✅ Set cookie
//     res.cookie("jwttoken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Lax",
//       expires: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours
//     });

//     // ✅ Send forget request to Kafka
//     const forgetData = { email, password };
//     await sendMessage("forget_user", forgetData);

//     // ✅ Response
//     res.status(200).json({
//       message: "📨 Forget password request sent to Kafka successfully",
//       forgetData,
//       token
//     });

//   } catch (error) {
//     console.error("❌ Error in forgetUser:", error.message);
//     res.status(500).json({ error: "Failed to send forget password data to Kafka" });
//   }
// };

