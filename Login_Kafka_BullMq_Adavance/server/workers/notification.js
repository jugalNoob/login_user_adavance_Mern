    //   user: "sjugal126@gmail.com", // use .env
    //     pass: "chxe ihkr uqwq okqs",

const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');

const IORedis = require('ioredis');
const GenOtp = require('./OPT/otp'); // ✅ Your OTP generator
require('dotenv').config();

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null
};

const redis = new IORedis(connection);

// BullMQ Worker
const worker = new Worker(
  'emailQueue',
  async job => {
    const { name, email, shortId } = job.data;

    // ✅ Generate OTP
    const otp = GenOtp();

    // ✅ Store in Redis (5 min expiry)
    await redis.set(`otp:${email}`, otp, 'EX', 300);

    // ✅ Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "sjugal126@gmail.com", // use .env
        pass: "chxe ihkr uqwq okqs",
      },
    });

    // ✅ Compose message
   
    const mailOptions = {
  from: "sjugal126@gmail.com",
  to: email,
  subject: 'Welcome to Our Service!',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 10px;">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for registering. Your user ID is <strong>${shortId}</strong>.</p>
      <p style="font-size: 18px;">Your OTP is: <b style="color: #2E86C1;">${otp}</b></p>
      <p>Please use this to verify your account.</p>
      <br>
      <p style="font-size: 12px; color: gray;">This OTP will expire in 5 minutes.</p>
    </div>
  `
};
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP ${otp} sent to ${email}`);
  },
  { connection }
);

// const { Worker } = require('bullmq');
// const nodemailer = require('nodemailer');
// const IORedis = require('ioredis');
// require('dotenv').config(); // ⬅️ Load env variables
// const otpStore = require("./utils/otpStore"); // ✅ Import otpStore
// const GenOtp=require("./OPT/otp") // gen Your OPT 

// // Redis connection
// const connection = new IORedis({
//   host: process.env.REDIS_HOST || 'localhost',
//   port: process.env.REDIS_PORT || 6379,
//   maxRetriesPerRequest: null,
// });

// // Create BullMQ worker
// const worker = new Worker(
//   'emailQueue',
//   async job => {
//     const { name, email, shortId } = job.data;

//     // Configure mail transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//             user: "", // use .env
//         pass: "",
//             },
//     });


//     const otp = GenOtp();  /// Ok Opt Gen
  

//       // ✅ Save OTP in memory with 5-minute expiry
//   otpStore[email] = {
//     otp,
//     expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
//   };


//     const mailOptions = {
//       from: "",
//       to: email,
//       subject: 'Welcome to Our Service!',
//      text: `Hi ${name},\n\nThank you for registering. Your user ID is ${shortId}.\nYour OTP is: ${otp}\n\nPlease use this to verify your account.`,
//        GenOtp
//     };

//     await transporter.sendMail(mailOptions);

//     // Simulate delay (optional)
//     await new Promise(resolve => setTimeout(resolve, 3000));
//     console.log(`✅ Email sent to ${email}`);
//   },
 
//   {
//   connection,             // Redis connection instance
//   concurrency: 5,         // Number of jobs to process in parallel
//   // lockDuration: 30000,    // Time (ms) the job lock is held (default: 30s)
//   // autorun: true,          // Automatically run the worker (default: true)
//   // removeOnComplete: true, // Automatically remove job on success
//   // removeOnFail: {
//   //   count: 5              // Keep last 5 failed jobs
//   // },
//   // useWorkerThreads: false,// Use worker threads (for CPU-heavy jobs)
//   // runRetryDelay: 5000,    // Delay (ms) before retrying failed jobs
//   // limiter: {
//   //   max: 100,             // Max jobs in time window
//   //   duration: 60000       // Time window (ms)
//   // }
// }
// );

// // Event listeners
// worker.on('completed', job => {
//   console.log(`🎉 Job ${job.id} completed successfully`);
// });

// worker.on('failed', (job, err) => {
//   console.error(`❌ Job ${job?.id} failed: ${err.message}`);
// });