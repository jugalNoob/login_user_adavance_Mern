const GenOtp = () => {
  // Generate a random 6-digit number between 100000 and 999999
  return Math.floor(100000 + Math.random() * 900000);
};

module.exports = GenOtp;
