kafka-system/
├── admin/
│   └── admin.js
├── client/
│   └── client.js
├── producer/
│   ├── producer.js
│   ├── sendNorth.js
│   └── sendSouth.js
├── consumer/
│   ├── northConsumer.js
│   └── southConsumer.js
└── app.js




kafka-system/
├── admin/
│   └── admin.js                # Kafka admin client: creates topics (north-updates, south-updates)
├── client/
│   └── client.js               # Kafka client configuration (Kafka instance setup)
├── producer/
│   ├── producer.js             # Kafka producer initialization and disconnect logic (shared by both producers)
│   ├── sendNorth.js            # Producer code to send messages to 'north-updates' topic
│   └── sendSouth.js            # Producer code to send messages to 'south-updates' topic
├── consumer/
│   ├── northConsumer.js        # Kafka consumer for 'north-updates' topic
│   └── southConsumer.js        # Kafka consumer for 'south-updates' topic
├── controller/
│   ├── North.js                # Express controller handling POST /v1/North, calls sendNorthMessage
│   └── South.js                # Express controller handling POST /v1/South, calls sendSouthMessage
├── routes/
│   └── index.js                # Express router with routes for north and south endpoints
└── app.js                      # Main Express app, imports routes, starts server
