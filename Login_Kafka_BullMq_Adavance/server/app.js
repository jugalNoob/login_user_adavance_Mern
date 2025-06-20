// ------------------ >>>>>>>>>>>>>>>>>>>> Sample App.js -------------->>



// const express = require("express");
// const connectDB = require("./db/conn");

// const cookieParser = require('cookie-parser');
// const router = require("./routes/router");
// const startServer = require('./Cluster/clust');
// const redisClient = require("./Redis/redisClient");
// const TimeDate = require("./rateLimite/rate"); // Correct import
// const cors = require('cors');
// const app = express();
// const port = 9000;

// const corsOptions = {
//   origin: "http://localhost:3000",
//   methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
//   credentials: true,
// };



// // Apply middlewares before starting cluster workers
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors(corsOptions));
// app.use(TimeDate); // Apply the middleware globally
// app.use(router);

// app.use(cookieParser());



// // Start cluster (workers will listen)
// startServer(app, port);




// // Graceful shutdown
// process.on("SIGINT", async () => {
//   console.log("Shutting down server...");
//   process.exit(0);
// });


// module.exports = app; // Export only `app`


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2ODUxNTM0NjQ5NDlkM2VmMjcxOWQzNWUiLCJlbWFpbCI6InJpbGVsODE5NjZAbGluYWNpdC5jb20iLCJpYXQiOjE3NTAxNjAyMTAsImV4cCI6MTc1MDE3MTAxMH0.BY1ITaeUUpSQVCCp4asVG-99FSZAfnKgxWtEaDg5cjw




/// -----------GitHUB App.js --------------------------->>


require('dotenv').config(); // Load env vars early

const express = require("express");
// const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require("./db/conn");
const router = require("./routes/router");
const startServer = require('./Cluster/clust');
const redisClient = require("./Redis/redisClient");
const TimeDate = require("./rateLimite/rate");

const app = express();
const port = 9000;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};

// Sessions
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'fallback_secret',
//   resave: false,

//   saveUninitialized: true,
// }));
// Passport GitHub Strategy
// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: "http://localhost:9000/auth/github/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log("✅ GitHub Profile:", profile);
//     return done(null, profile);
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// // GitHub Auth Routes
// app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/login/failed' }),
//   function(req, res) {
//     // Successful login
//     res.redirect('http://localhost:3000/dashboard');
//   }
// );

app.get('/login/failed', (req, res) => {
  res.status(401).json({ message: 'GitHub Login Failed ❌' });
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(TimeDate);
// app.use(passport.initialize());
// app.use(passport.session());
app.use(router); // All other API routes

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  process.exit(0);
});

// Start server via cluster
startServer(app, port);
