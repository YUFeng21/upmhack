#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <DHT.h>

// ✅ WiFi & MQTT Credentials
const char* ssid = "Wokwi-GUEST";  
const char* password = "";  
const char* mqttServer = "3e3d3355c77f45dba1e9d2c236cef977.s1.eu.hivemq.cloud";  
const int mqttPort = 8883;
const char* mqttUser = "keanhoekoh1";
const char* mqttPassword = "aA12345678";
const char* mqttTopic = "farm/sensors";

// ✅ Sensor Pins
#define DHT_PIN 4
#define DHT_TYPE DHT22
#define LDR_PIN 34  // Used instead of pH sensor
#define SOIL_MOISTURE_PIN 35
#define BUZZER_PIN 5

// ✅ Objects
WiFiClientSecure espClient;
PubSubClient client(espClient);
DHT dht(DHT_PIN, DHT_TYPE);

// ✅ Variables
unsigned long lastReadTime = 0;
const int readInterval = 5000;
bool buzzerOn = false;
unsigned long buzzerStartTime = 0;

void reconnectMQTT();
void readAndSendData();

void setup() {
    Serial.begin(115200);

    // ✅ Connect to WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\n✅ Connected to WiFi");

    // ✅ Enable SSL (For Testing, Remove in Production)
    espClient.setInsecure();

    // ✅ Connect to MQTT Broker
    client.setServer(mqttServer, mqttPort);
    reconnectMQTT();

    // ✅ Initialize Sensors
    dht.begin();
    pinMode(BUZZER_PIN, OUTPUT);
    digitalWrite(BUZZER_PIN, LOW);
}

void loop() {
    if (!client.connected()) {
        reconnectMQTT();
    }
    client.loop();

    if (millis() - lastReadTime >= readInterval) {
        lastReadTime = millis();
        readAndSendData();
    }

    if (buzzerOn && millis() - buzzerStartTime >= 1000) {
        digitalWrite(BUZZER_PIN, LOW);
        buzzerOn = false;
    }
}

// ✅ Read and Publish Sensor Data
void readAndSendData() {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int lightIntensity = analogRead(LDR_PIN);
    int soilMoisture = analogRead(SOIL_MOISTURE_PIN);

    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("❌ DHT sensor error! Skipping this reading...");
        return;
    }

    // ✅ Convert LDR reading to a simulated pH value (0 to 14)
    float simulated_pH = map(lightIntensity, 4095, 0, 0, 14);

    // ✅ Convert Soil Moisture to percentage
    int soilMoisturePercent = map(soilMoisture, 4095, 0, 0, 100);

    Serial.printf("🌡 Temp: %.1f°C, 💧 Humidity: %.1f%%, ☀️ Light: %d, 🌱 Soil Moisture: %d%%, 🧪 Simulated pH: %.2f\n",
                  temperature, humidity, lightIntensity, soilMoisturePercent, simulated_pH);

    String payload = "{";
    payload += "\"temperature\":" + String(temperature) + ",";
    payload += "\"humidity\":" + String(humidity) + ",";
    payload += "\"lightIntensity\":" + String(lightIntensity) + ",";
    payload += "\"soilMoisture\":" + String(soilMoisturePercent) + ",";
    payload += "\"pH\":" + String(simulated_pH);
    payload += "}";

    if (client.publish(mqttTopic, payload.c_str(), true)) {
        Serial.println("✅ Data published to MQTT");
    } else {
        Serial.println("❌ Failed to publish data!");
    }

    if (soilMoisturePercent < 30) {
        digitalWrite(BUZZER_PIN, HIGH);
        buzzerOn = true;
        buzzerStartTime = millis();
    }
}

// ✅ Ensure MQTT Connection
void reconnectMQTT() {
    while (!client.connected()) {
        Serial.print("🔄 Connecting to MQTT...");
        if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
            Serial.println("✅ Connected to MQTT broker!");
        } else {
            Serial.print("❌ Failed, retrying in 5s...");
            delay(5000);
        }
    }
}
