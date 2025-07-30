
   // ---------- >>>  BullMq NodeMailer Redis Otp 

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
    await redis.set(`otp:${email}`, otp, 'EX', 1000);

    
    // ✅ Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "jugal1@gmail.com", // use .env
        pass: "000",
      },
    });

    // ✅ Compose message
   
    const mailOptions = {
  from: "jugal@gmail.com",
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



worker.on('completed', job => {
  console.log(`🎉 Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
