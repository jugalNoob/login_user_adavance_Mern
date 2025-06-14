const { Worker } = require('bullmq');

const worker = new Worker('NotificationQueue', async (job) => {
    const { name, email, message, loc } = job.data; // ✅ include loc if needed

    console.log(`Processing job ${job.id}`);
    console.log(`Sending email to: ${name}`);
    if (loc) console.log(`Sending loc to: ${loc}`); // optional
    console.log(`Message: ${message}`);

    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Email sent successfully!');
}, {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    },
});

worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job.id} failed with error: ${err.message}`);
});

module.exports = worker;
