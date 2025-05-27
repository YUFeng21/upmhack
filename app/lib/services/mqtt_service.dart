import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mqtt_client/mqtt_client.dart';
import 'package:mqtt_client/mqtt_browser_client.dart';

class MqttService extends ChangeNotifier {
  final String broker = 'wss://3e3d3355c77f45dba1e9d2c236cef977.s1.eu.hivemq.cloud/mqtt';
  final String username = 'keanhoekoh1';
  final String password = 'aA12345678';
  final String clientId = 'flutter_client';
  final String topic = 'farm/sensors';

  late MqttBrowserClient client;

  // Sensor Data
  double temperature = 0.0;
  double humidity = 0.0;
  int lightIntensity = 0;
  int soilMoisture = 0;
  double phValue = 7.0; // Default pH value

  MqttService() {
    client = MqttBrowserClient(broker, clientId);
    client.port = 8884;
    client.keepAlivePeriod = 60;
    client.logging(on: true);
    client.setProtocolV311();
    client.onDisconnected = onDisconnected;
    client.onConnected = onConnected;
    client.onSubscribed = onSubscribed;
  }

  Future<void> connect() async {
    try {
      print('🔹 Connecting to MQTT Broker...');
      final connMessage = MqttConnectMessage()
          .withClientIdentifier(clientId)
          .authenticateAs(username, password)
          .startClean()
          .withWillQos(MqttQos.atMostOnce);
      client.connectionMessage = connMessage;

      await client.connect();
      if (client.connectionStatus!.state == MqttConnectionState.connected) {
        print('✅ Connected to MQTT!');
        client.subscribe(topic, MqttQos.atMostOnce);
        client.updates!.listen((List<MqttReceivedMessage<MqttMessage>> messages) {
          final MqttPublishMessage recMessage = messages[0].payload as MqttPublishMessage;
          final payload = MqttPublishPayload.bytesToStringAsString(recMessage.payload.message);
          _processMessage(payload);
        });
      } else {
        print('⚠️ Failed to connect');
        disconnect();
      }
    } catch (e) {
      print('❌ Error: $e');
      disconnect();
    }
  }

  void _processMessage(String message) {
    print("📩 Received: $message");
    try {
      final data = jsonDecode(message);
      temperature = data["temperature"] ?? 0.0;
      humidity = data["humidity"] ?? 0.0;
      lightIntensity = data["lightIntensity"] ?? 0;
      soilMoisture = data["soilMoisture"] ?? 0;
      phValue = data["pH"] ?? 0.0;
      notifyListeners(); // Update UI
    } catch (e) {
      print("❌ JSON Error: $e");
    }
  }

  void disconnect() {
    client.disconnect();
    print('🔌 Disconnected from MQTT');
  }

  void onDisconnected() {
    print('❌ MQTT Disconnected! Reconnecting...');
    Future.delayed(Duration(seconds: 5), connect);
  }

  void onConnected() {
    print('✅ MQTT Connected!');
    client.subscribe(topic, MqttQos.atMostOnce);
  }

  void onSubscribed(String topic) {
    print('✅ Subscribed to $topic');
  }
}
