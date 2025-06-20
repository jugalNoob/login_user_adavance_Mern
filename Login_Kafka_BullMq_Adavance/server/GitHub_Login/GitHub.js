
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;




// In-memory session storage (you can replace with MongoDB/Redis)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize/Deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// GitHub OAuth strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:9000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("GitHub Profile:", profile);
    return done(null, profile);
  }
));

// ✅ GitHub Auth Routes
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login/failed' }),
  function(req, res) {
    // Successful login
    res.redirect('http://localhost:3000/dashboard'); // Frontend route
  }
);






// ✅ 4. On the React Frontend (http://localhost:3000)
// Make a button:

// jsx
// Copy
// Edit
// <a href="http://localhost:9000/auth/github">
//   <button>Login with GitHub</button>
// </a>