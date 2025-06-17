// use authentication  method to Login ----------------->>
exports.auth = async (req, res) => {
  try {
    const userData = req.user;
    if (!userData) return res.status(401).json({ error: "User not authenticated" });

    console.log(userData)

    res.status(200).json({ userData });
  } catch (error) {
    console.error("AuthUser error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
