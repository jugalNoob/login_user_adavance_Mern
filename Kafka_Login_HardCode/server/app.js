// const express = require("express");
// const connectDB = require("./db/conn"); // Ensure DB connection is imported
// const router = require("./routes/router");
// const startServer = require('./Cluster/clust');
// const redisClient = require("./Redis/redisClient"); // Import Redis client
// const cors = require('cors');
// const app = express();
// const port = 9000;



// const corsOptions = {
//   origin: "http://localhost:3000",
//   methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
//   credentials: true,
// };

// startServer(app, port);

// app.use(express.json());  // ✅ Add this line before using routes
// app.use(cors(corsOptions));
// app.use(router);

// // Connect to MongoDB before starting the server
// (async () => {
//     await connectDB();
//     app.listen(port, () => {
//         console.log(`🚀 Server running on http://localhost:${port}`);
//     });
// })();

// // Gracefully shut down server
// process.on("SIGINT", async () => {
//     console.log("Shutting down server...");
//     process.exit(0);
// });




const express = require("express");
const connectDB = require("./db/conn");
const router = require("./routes/router");
const startServer = require('./Cluster/clust');
const redisClient = require("./Redis/redisClient");
const TimeDate = require("./rateLimite/rate"); // Correct import
const cors = require('cors');
const app = express();
const port = 9000;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};



// Apply middlewares before starting cluster workers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(TimeDate); // Apply the middleware globally
app.use(router);



// Start cluster (workers will listen)
startServer(app, port);




// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  process.exit(0);
});


module.exports = app; // Export only `app`
