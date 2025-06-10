const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
    console.log("Connected to MQTT Broker");
    client.subscribe("farm/sensors", () => {
        console.log("Subscribed to farm/sensors");
    });
});

client.on('message', (topic, message) => {
    console.log(`Received data on ${topic}: ${message.toString()}`);
});
