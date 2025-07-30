const { Queue } = require('bullmq');
const IORedis = require('ioredis');

// Simulated database delete function (replace with actual DB logic)
async function deleteJobFromDB(jobId) {
  console.log(`🗃️ Deleted job ${jobId} from database`);
  // await db.collection('jobs').deleteOne({ jobId });
}

// Redis connection
const redis = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
});

// BullMQ queue instance
const queue = new Queue('emailQueue', { connection: redis });

async function deleteJobsByStatus(status) {
  let removedTotal = 0;

  while (true) {
    const jobs = await queue.clean(0, 1000, status);
    removedTotal += jobs.length;

    for (const job of jobs) {
      await deleteJobFromDB(job.id);
    }

    if (jobs.length < 1000) break;
  }

  console.log(`🧹 Removed ${removedTotal} '${status}' jobs`);
}

async function deleteAllJobsAndData() {
  console.log('🚨 Deleting all jobs and DB records...');

  // Drain any jobs that are still waiting or delayed
  await queue.drain();

  const statuses = ['completed', 'failed', 'wait', 'delayed', 'active'];

  for (const status of statuses) {
    await deleteJobsByStatus(status);
  }

  // Optional: force-wipe everything including repeatable job keys
  await queue.obliterate({ force: true });

  console.log('✅ All jobs and associated data have been deleted.');
}


deleteAllJobsAndData();


// 📌 Notes:
// ✅ queue.drain() clears waiting and delayed jobs from memory.

// ✅ queue.clean() removes jobs by status (in 1000 job batches).

// ✅ queue.obliterate() clears remaining keys (like repeatable jobs).

// 🛑 obliterate() will delete everything — use carefully.