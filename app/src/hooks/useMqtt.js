import { useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt';

const useMqtt = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    // Connect to MQTT broker
    const mqttClient = mqtt.connect(process.env.REACT_APP_MQTT_BROKER, {
      username: process.env.REACT_APP_MQTT_USERNAME,
      password: process.env.REACT_APP_MQTT_PASSWORD,
      clientId: `web_${Math.random().toString(16).slice(3)}`
    });

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      setConnected(true);
    });

    mqttClient.on('message', (topic, message) => {
      setMessages(prev => ({
        ...prev,
        [topic]: JSON.parse(message.toString())
      }));
    });

    mqttClient.on('error', (error) => {
      console.error('MQTT Error:', error);
      setConnected(false);
    });

    mqttClient.on('close', () => {
      console.log('Disconnected from MQTT broker');
      setConnected(false);
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const subscribe = useCallback((topic) => {
    if (client && connected) {
      client.subscribe(topic, (error) => {
        if (error) {
          console.error('Subscribe error:', error);
        }
      });
    }
  }, [client, connected]);

  const unsubscribe = useCallback((topic) => {
    if (client && connected) {
      client.unsubscribe(topic, (error) => {
        if (error) {
          console.error('Unsubscribe error:', error);
        }
      });
    }
  }, [client, connected]);

  const publish = useCallback((topic, message) => {
    if (client && connected) {
      client.publish(topic, JSON.stringify(message), (error) => {
        if (error) {
          console.error('Publish error:', error);
        }
      });
    }
  }, [client, connected]);

  return {
    connected,
    messages,
    subscribe,
    unsubscribe,
    publish
  };
};

export default useMqtt; 