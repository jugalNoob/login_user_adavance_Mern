// queues/dlqQueue.js
const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
};

const dlqQueue = new Queue('emailQueue-dlq', { connection });

module.exports = dlqQueue;

