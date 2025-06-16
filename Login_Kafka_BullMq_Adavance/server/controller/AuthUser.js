// use authentication  method to Login ----------------->>

exports.auth = async (req, res, next) => {
    try {
      const userData = req.user;
      console.log(userData, "userData DashBord"); // Check if userData is defined
  
      if (!userData) {
        return res.status(401).json({ error: "User data not available" });
      }
  
      return res.status(200).json({ userData });
    } catch (error) {
      console.log(`Error from user route: ${error}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  };