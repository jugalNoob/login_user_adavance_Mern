const jwt = require("jsonwebtoken");

  const secretKey = "myVerySecretHardcodedKey123"; // 🔐 Embedded secret key

// Only allow access if role is admin
const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, secretKey);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};
module.exports = checkAdmin;
