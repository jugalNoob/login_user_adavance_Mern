services:
  kafka:
    ...
    networks:
      - backend_network

  kowl:
    image: quay.io/cloudhut/kowl:latest
    ports:
      - "8080:8080"
    environment:
      KAFKA_BROKERS: "PLAINTEXT://kafka:9092"
    depends_on:
      - kafka
    networks:
      - backend_network

  redpanda-console:
    image: docker.redpanda.com/redpandadata/console:latest
    ports:
      - "8081:8080"
    environment:
      KAFKA_BROKERS: "kafka:9092"
    depends_on:
      - kafka
    networks:
      - backend_network


      /// ------------------------------------>>>>


      🧭 What Are These UIs?
🔹 Kowl (http://localhost:8080)
Kowl is a Kafka topic browser and inspector that helps developers and engineers debug and observe Kafka in real-time.

🔹 Redpanda Console (http://localhost:8081)
A newer, modern UI for Kafka and Redpanda, designed to monitor clusters, view partitions, offsets, lag, and interact with Kafka consumers/producers.


| 🔍 Use Case                   | 💡 How Kowl / Redpanda Console Help                          |
| ----------------------------- | ------------------------------------------------------------ |
| **Debug producers/consumers** | See if data is actually reaching Kafka topics                |
| **Explore topic messages**    | View, filter, decode Kafka topic messages (JSON, Avro, etc.) |
| **Inspect consumer groups**   | Check if your services are consuming or lagging              |
| **Test manually**             | Produce/consume messages from the UI without writing code    |
| **Monitor partitions**        | See partition count, leader brokers, replication state       |
| **Track Kafka health**        | Verify brokers, topics, partitions, and offsets are OK       |
| **Check lag**                 | See consumer lag in real-time (very useful in prod!)         |


🧪 Real Example from Your Project
Let’s say your system does this:

🔐 User logs in → Kafka message sent to login_user topic

✅ Worker consumes that → Logs login or fails

Using Kowl or Redpanda Console:

You can open login_user topic and see the actual message Kafka received.

Check the login_success or login_failed topic to debug your logic.

See how many partitions each topic has and how they're distributed.



📌 Where You Access Them
Just open browser:

http://localhost:8080 → Kowl

http://localhost:8081 → Redpanda Console




| Feature                   | **Kowl**          | **Redpanda Console**         |
| ------------------------- | ----------------- | ---------------------------- |
| UI Style                  | Simple, classic   | Modern, slick, intuitive     |
| Topic Explorer            | ✅                 | ✅                            |
| Message Producer/Consumer | ✅                 | ✅                            |
| Consumer Group Lag        | Limited           | ✅ Real-time lag tracking     |
| Schema Registry Support   | JSON/Avro (basic) | Full schema registry support |
| Best For                  | Debugging/dev use | Monitoring + production use  |




💡 Summary
Use these tools while developing or debugging any system using Kafka, especially to:

View and verify messages,

Monitor consumer lag,

Produce test messages, and

Understand topic partitioning.

Let me know if you want:

Sample screenshots of what to look for

Redpanda Console config with auth

Topic auto-creation or retention settings in the UI



| 🔧 Feature          | 📋 Description                              |
| ------------------- | ------------------------------------------- |
| **Topics**          | See all Kafka topics and their messages     |
| **Messages**        | Read, filter, and decode Kafka messages     |
| **Consumer Groups** | Check which service is consuming a topic    |
| **Lag**             | Know if your consumer is **behind**         |
| **Partitions**      | View topic partitions and leaders           |
| **Broker status**   | Check Kafka cluster health (broker up/down) |
