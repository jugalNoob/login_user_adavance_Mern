
const { sendSouthMessage } = require("../producer/producer_south");
exports.SouthData = async (req, res) => { 

  const { name, loc } = req.body;

  if (!name || !loc) {
    return res.status(400).json({ success: false, error: "Name and location are required" });
  }

  try {
    await sendSouthMessage({ name, loc });
    res.status(200).json({ success: true, message: `Message sent for ${name}` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }

}