import mqtt from 'mqtt';
import { create } from 'zustand';

const MQTT_CONFIG = {
  broker: 'wss://3e3d3355c77f45dba1e9d2c236cef977.s1.eu.hivemq.cloud/mqtt',
  username: 'keanhoekoh1',
  password: 'aA12345678',
  clientId: 'react_client_' + Math.random().toString(16).substring(2, 8),
  topic: 'farm/sensors'
};

const useMqttStore = create((set) => ({
  temperature: 0.0,
  humidity: 0.0,
  lightIntensity: 0,
  soilMoisture: 0,
  phValue: 7.0,
  isConnected: false,
  error: null,
  
  setSensorData: (data) => set(data),
  setConnectionStatus: (status) => set({ isConnected: status }),
  setError: (error) => set({ error })
}));

class MqttService {
  constructor() {
    this.client = null;
    this.store = useMqttStore;
  }

  connect() {
    try {
      console.log('🔹 Connecting to MQTT Broker...');
      
      this.client = mqtt.connect(MQTT_CONFIG.broker, {
        clientId: MQTT_CONFIG.clientId,
        username: MQTT_CONFIG.username,
        password: MQTT_CONFIG.password,
        port: 8884,
        protocol: 'wss',
        keepalive: 60,
        clean: true
      });

      this.client.on('connect', () => {
        console.log('✅ Connected to MQTT!');
        this.store.getState().setConnectionStatus(true);
        this.client.subscribe(MQTT_CONFIG.topic);
      });

      this.client.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          this.store.getState().setSensorData({
            temperature: payload.temperature || 0.0,
            humidity: payload.humidity || 0.0,
            lightIntensity: payload.lightIntensity || 0,
            soilMoisture: payload.soilMoisture || 0,
            phValue: payload.phValue || 7.0
          });
        } catch (error) {
          console.error('Error parsing MQTT message:', error);
          this.store.getState().setError('Failed to parse sensor data');
        }
      });

      this.client.on('error', (error) => {
        console.error('MQTT Error:', error);
        this.store.getState().setError(error.message);
        this.store.getState().setConnectionStatus(false);
      });

      this.client.on('close', () => {
        console.log('MQTT connection closed');
        this.store.getState().setConnectionStatus(false);
      });

    } catch (error) {
      console.error('Failed to connect to MQTT:', error);
      this.store.getState().setError(error.message);
      this.store.getState().setConnectionStatus(false);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.store.getState().setConnectionStatus(false);
    }
  }

  publish(topic, message) {
    if (this.client && this.store.getState().isConnected) {
      this.client.publish(topic, JSON.stringify(message));
    }
  }
}

// Create and export a singleton instance
const mqttService = new MqttService();
export { mqttService, useMqttStore }; 