// const kafka = require("../client/client");

// async function northConsumer() {
//   const consumer = kafka.consumer({ groupId: "north-group" });

//   await consumer.connect();
//   await consumer.subscribe({ topic: "north-updates", fromBeginning: true });

//   await consumer.run({
//   eachMessage: async ({ topic, partition, message }) => {
//     //if (partition !==0) return; // Only handle South messages
//     // console.log(`[SOUTH] Partition ${partition}: ${message.value.toString()}`);
//      console.log(`Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}, Key: ${message.key?.toString()}, Value: ${message.value.toString()}`);
//   },


  
// });


  // await consumer.run({
  //   eachMessage: async ({ topic, partition, message }) => {
  //     if (partition === 0) {
  //       // console.log(`partition${partition} [NORTH] ${message.value.toString()}`);\
  //     console.log(`Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}, Key: ${message.key?.toString()}, Value: ${message.value.toString()}`);
  //     }
  //   },
  // });
// }

// northConsumer();



const kafka = require("../client/client");
const NotificationQueue = require("../queues/noticationQueu"); // Correct queue import

async function northConsumer() {
  const consumer = kafka.consumer({ groupId: "north-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "north-updates", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key?.toString();
      const value = message.value.toString();

      console.log(`📥 Kafka Message:
        🔹 Topic: ${topic}
        🔹 Partition: ${partition}
        🔹 Offset: ${message.offset}
        🔹 Key: ${key}
        🔹 Value: ${value}
      `);

      try {
        // Parse the value assuming it's a JSON string
        const data = JSON.parse(value);

        // Push to BullMQ for processing (e.g., sendEmail)
        await NotificationQueue.add('sendEmail', data, {
          // jobId: key,
          delay: 1000,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          },
          removeOnComplete: true,
          removeOnFail: false
        });

        console.log('📤 Job added to BullMQ queue successfully.' ,      );//, jobId: job.id,
      } catch (error) {
        console.error('❌ Failed to process Kafka message:', error);
      }
    }
  });
}

 northConsumer();
