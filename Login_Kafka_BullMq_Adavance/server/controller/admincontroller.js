const Register = require("../model/student");



const getAllUsers = async (req, res) => {
  try {
    // Remove role filter to fetch all users
    const userData = await Register.find() // exclude password





    console.log(userData);
    console.log("jugal");

    res.status(200).json({ users: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAllUsers;
