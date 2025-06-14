// const kafka = require("../client/client");

// async function northProducer() {
//   const producer = kafka.producer();

//   await producer.connect();
//   console.log("North Producer connected");

//   const messages = [
//     { key: "north-1", value: JSON.stringify({ name: "Amit", loc: "Delhi" }), partition: 0 },
//     { key: "north-2", value: JSON.stringify({ name: "Jugal", loc: "Jammu" }), partition: 0 },
//   ];

//   await producer.send({
//     topic: "rider-updates",
//     messages,
//   });

//   console.log("North messages sent");
//   await producer.disconnect();
// }

// northProducer();



const kafka = require("../client/client");

let producer; // Declare globally to share across functions

async function initProducer() {
  try {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Kafka Producer connected successfully North");
  } catch (error) {
    console.error("❌ Error initializing Kafka Producer:", error);
  }
}

async function sendNorthMessage({ name, loc }) {
  try {
    if (!producer) {
      throw new Error("Producer is not initialized. Call initProducer first.");
    }

    const message = {
      key: `north-${name.toLowerCase()}`,
      value: JSON.stringify({ name, loc }),
      partition: 0, // Fixed partition for North
    };

    await producer.send({
      topic: "north-updates",
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

module.exports = { initProducer, sendNorthMessage };



/// --> Changes  -------------------->>>>


// const kafka = require("../client/client");

// async function sendLocationMessage(name, loc) {
//   const producer = kafka.producer();

//   try {
//     await producer.connect();
//     console.log("Producer connected");

//     // Determine partition
//     let partition;
//     if (loc.toLowerCase() === "jammu") {
//       partition = 0;
//     } else if (loc.toLowerCase() === "delhi") {
//       partition = 1;
//     } else {
//       throw new Error("Unsupported location. Only Jammu or Delhi are allowed.");
//     }

//     const message = {
//       key: `update-${name.toLowerCase()}`,
//       value: JSON.stringify({ name, loc }),
//       partition,
//     };

//     await producer.send({
//       topic: "rider-updates",
//       messages: [message],
//     });

//     console.log(`Message for ${name} in ${loc} sent to partition ${partition}`);
//     await producer.disconnect();
//   } catch (error) {
//     console.error("Producer error:", error);
//   }
// }