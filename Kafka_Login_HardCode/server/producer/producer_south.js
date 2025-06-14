// const kafka = require("../client/client");

// async function southProducer() {
//   const producer = kafka.producer();

//   await producer.connect();
//   console.log("South Producer connected");

//   const messages = [
//     { key: "south-1", value: JSON.stringify({ name: "Ravi", loc: "Chennai" }), partition: 1 },
//     { key: "south-2", value: JSON.stringify({ name: "Anu", loc: "Hyderabad" }), partition: 1 },
//   ];

//   await producer.send({
//     topic: "rider-updates",
//     messages,
//   });

//   console.log("South messages sent");
//   await producer.disconnect();
// }

// southProducer();



// Let me know if you want to:

// Manually assign partitions instead of subscribing to all

// Track message offsets and rebalance logic





const kafka = require("../client/client");

let producer; // Declare globally to share across functions

async function initProducer() {
  try {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Kafka Producer connected successfully");
  } catch (error) {
    console.error("❌ Error initializing Kafka Producer:", error);
  }
}

async function sendSouthMessage({ name, loc }) {
  try {
    if (!producer) {
      throw new Error("Producer is not initialized. Call initProducer first.");
    }

    const message = {
      key: `south-${name.toLowerCase()}`,
      value: JSON.stringify({ name, loc }),
      partition: 0, // Fixed partition for North
    };

    await producer.send({
      topic: "south-updates",
      messages: [message],
    });

    console.log(`✅ Message sent for ${name}`);
  } catch (error) {
    console.error("❌ Error sending message to Kafka:", error);
  }
}

async function disconnectProducer() {
  try {
    if (producer) {
      await producer.disconnect();
      console.log("✅ Kafka Producer disconnected successfully");
    }
  } catch (error) {
    console.error("❌ Error disconnecting Kafka Producer:", error);
  }
}

// Listen for SIGINT (Ctrl+C) and disconnect producer cleanly
process.on("SIGINT", async () => {
  await disconnectProducer();
  process.exit(0);
});

module.exports = { initProducer,  sendSouthMessage};
