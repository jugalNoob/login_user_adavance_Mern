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
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require("./db/conn");
const router = require("./routes/router");
const startServer = require('./Cluster/clust');
const redisClient = require("./Redis/redisClient");
const TimeDate = require("./rateLimite/rate");
const ZodValid=require("./middleware/validateSignup")
const githubRoutes = require('./routes/router'); // or './routes/githubRoutes'



const app = express();
const port = 9000;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};



// --- Session Setup (Memory-based) ---
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// --- Passport Setup ---
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// --- GitHub OAuth Strategy ---
passport.use(new GitHubStrategy({
    clientID: process.env.Client_IDGit,
    clientSecret: process.env.Client_secretGit,
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:9000/auth/github/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    console.log("GitHub Profile:", profile);
    // You can store user info in DB here
    return done(null, profile);
  }
));





// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(TimeDate);


app.use(router); // All other API routes
app.use(githubRoutes);
// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  process.exit(0);
});

// Start server via cluster
startServer(app, port);
