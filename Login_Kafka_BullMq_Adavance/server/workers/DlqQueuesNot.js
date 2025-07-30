// workers/handleDlqFailure.js
const dlqQueue = require('../queues/DlqQueue');

/**
 * Move failed BullMQ job to DLQ after all retries
 */
async function handleDlqFailure(job, err) {
  if (job.attemptsMade >= job.opts.attempts) {
    await dlqQueue.add(`failed-${job.id}`, job.data, {
      attempts: 1,
      delay: 0,
      backoff: null,
      removeOnComplete: true,
    });

    console.warn(`☠️ Job ${job.id} moved to DLQ due to: ${err.message}`);
  }
}

module.exports = handleDlqFailure;
