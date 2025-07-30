const passport = require('passport');

exports.authWithGitHub = passport.authenticate('github', { scope: ['user:email'] });

exports.authGitHubCallback = [
  passport.authenticate('github', { failureRedirect: '/login/failed' }),
  (req, res) => {
       res.redirect('http://localhost:3000/DashboardG'); // Frontend route

          // res.redirect(${process.env.FRONTEND_URL}/dashboard);
  },
];

exports.loginSuccess = (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      success: true,
      user: req.user,
      message: "Authenticated ✅",
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Not Authenticated ❌",
    });
  }
};

exports.loginFailed = (req, res) => {
  res.status(401).json({ message: 'GitHub Login Failed ❌' });
};

exports.logoutUser = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect(process.env.FRONTEND_URL || '/');
  });
};
