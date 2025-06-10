//my_farm_screen.dart
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:provider/provider.dart';
import '../providers/farm_data_provider.dart';
import '../services/mqtt_service.dart'; // Add this line to import MqttService
import 'add_farm_screen.dart';

class MyFarmScreen extends StatelessWidget {
  const MyFarmScreen({super.key, required this.mqttService});

  final MqttService mqttService;
  Widget build(BuildContext context) {
    final farmData = Provider.of<FarmDataProvider>(context);
    final List<Map<String, dynamic>> farms = farmData.farms;

    final mqttService = Provider.of<MqttService>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Farms'),
        backgroundColor: const Color(0xFFDCECCF),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            Expanded(
              child: ListView.builder(
                itemCount: farms.length,
                itemBuilder: (context, index) {
                  final farm = farms[index];
                  return GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => FarmDetailScreen(farm: farm, mqttService: mqttService),
                        ),
                      );
                    },
                    child: Card(
                      elevation: 4,
                      margin: const EdgeInsets.only(bottom: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.asset(
                                farm['image'],
                                width: 100,
                                height: 100,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) {
                                  return Image.asset(
                                    'assets/images/fallback_image.png',
                                    width: 100,
                                    height: 100,
                                    fit: BoxFit.cover,
                                  );
                                },
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    farm['name'],
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.location_on,
                                        size: 16,
                                        color: Colors.grey,
                                      ),
                                      const SizedBox(width: 4),
                                      Expanded(
                                        child: Text(
                                          farm['location'],
                                          style: const TextStyle(
                                            fontSize: 14,
                                            color: Colors.grey,
                                          ),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.crop,
                                        size: 16,
                                        color: Colors.grey,
                                      ),
                                      const SizedBox(width: 4),
                                      Expanded(
                                        child: Text(
                                          'Size: ${farm['size']}',
                                          style: const TextStyle(
                                            fontSize: 14,
                                            color: Colors.grey,
                                          ),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Crops: ${farm['crops'].join(', ')}',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      color: Color(0xFFA3C585),
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddFarmScreen()),
          );
        },
        backgroundColor: const Color(0xFFDCECCF),
        child: const Icon(Icons.add),
      ),
    );
  }
}

class FarmDetailScreen extends StatelessWidget {
  final Map<String, dynamic> farm;
  final MqttService mqttService;

  const FarmDetailScreen({super.key, required this.farm, required this.mqttService});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> historicalData = [
      {
        'day': 'Mon',
        'soilMoisture': 70,
        'temperature': 27,
        'humidity': 62,
        'pH': 6.3,
      },
      {
        'day': 'Tue',
        'soilMoisture': 72,
        'temperature': 28,
        'humidity': 65,
        'pH': 6.4,
      },
      {
        'day': 'Wed',
        'soilMoisture': 68,
        'temperature': 29,
        'humidity': 68,
        'pH': 6.5,
      },
      {
        'day': 'Thu',
        'soilMoisture': 71,
        'temperature': 28,
        'humidity': 64,
        'pH': 6.5,
      },
      {
        'day': 'Fri',
        'soilMoisture': 73,
        'temperature': 27,
        'humidity': 65,
        'pH': 6.4,
      },
      {
        'day': 'Sat',
        'soilMoisture': 72,
        'temperature': 28,
        'humidity': 66,
        'pH': 6.5,
      },
      {
        'day': 'Sun',
        'soilMoisture': farm['soilMoisture'],
        'temperature': farm['temperature'],
        'humidity': farm['humidity'],
        'pH': farm['pH'],
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(farm['name']),
        backgroundColor: const Color(0xFFDCECCF),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.asset(
                      farm['image'],
                      width: 120,
                      height: 120,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          farm['name'],
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(
                              Icons.location_on,
                              size: 16,
                              color: Colors.grey,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                farm['location'],
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(
                              Icons.crop,
                              size: 16,
                              color: Colors.grey,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                'Size: ${farm['size']}',
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Crops: ${farm['crops'].join(', ')}',
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFFA3C585),
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Real-Time Monitoring Dashboard
              const Text(
                'Real-Time Monitoring Dashboard',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              // Sensor Cards
              Row(
                children: [
                  Expanded(
                    child: _buildSensorCard(
                      'Soil Moisture',
                      '${mqttService.soilMoisture}%',
                      Icons.water_drop,
                      Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSensorCard(
                      'pH Level',
                      '${mqttService.phValue}',
                      Icons.science,
                      Colors.purple,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildSensorCard(
                      'Temperature',
                      '${mqttService.temperature}°C',
                      Icons.thermostat,
                      Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSensorCard(
                      'Humidity',
                      '${mqttService.humidity}%',
                      Icons.water,
                      Colors.teal,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Visual Graphs
              const Text(
                'Visual Graphs',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              Container(
                height: 200,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: LineChart(
                  LineChartData(
                    gridData: FlGridData(show: false),
                    titlesData: FlTitlesData(
                      leftTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      topTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      rightTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (value, meta) {
                            if (value.toInt() >= 0 && value.toInt() < 7) {
                              return Text(
                                historicalData[value.toInt()]['day'],
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 10,
                                ),
                              );
                            }
                            return const Text('');
                          },
                          reservedSize: 22,
                        ),
                      ),
                    ),
                    borderData: FlBorderData(
                      show: true,
                      border: Border.all(color: Colors.grey.withOpacity(0.3)),
                    ),
                    minX: 0,
                    maxX: 6,
                    minY: 0,
                    maxY: 100,
                    lineBarsData: [
                      // Soil Moisture Line
                      LineChartBarData(
                        spots: List.generate(
                          7,
                          (index) => FlSpot(
                            index.toDouble(),
                            historicalData[index]['soilMoisture'].toDouble(),
                          ),
                        ),
                        isCurved: true,
                        color: Colors.blue,
                        barWidth: 3,
                        isStrokeCapRound: true,
                        dotData: FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: Colors.blue.withOpacity(0.1),
                        ),
                      ),
                      // Temperature Line
                      LineChartBarData(
                        spots: List.generate(
                          7,
                          (index) => FlSpot(
                            index.toDouble(),
                            historicalData[index]['temperature'].toDouble() * 2,
                          ),
                        ),
                        isCurved: true,
                        color: Colors.orange,
                        barWidth: 3,
                        isStrokeCapRound: true,
                        dotData: FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: Colors.orange.withOpacity(0.1),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Farm Management
              const Text(
                'Farm Management',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              // Farm Management Buttons
              _buildManagementOptionButton(
                context,
                'Smart Irrigation & Fertilization',
                Icons.water_drop,
                const Color.fromARGB(255, 105, 188, 255),
                () => Navigator.pushNamed(context, '/smart_irrigation'),
              ),
              const SizedBox(height: 12),
              _buildManagementOptionButton(
                context,
                'Eco-friendly Pest Control System',
                Icons.pest_control,
                Color(0xFFA3C585),
                () => Navigator.pushNamed(context, '/pest_control'),
              ),
              const SizedBox(height: 12),
              _buildManagementOptionButton(
                context,
                'Precision Farming and Decision Support',
                Icons.analytics,
                const Color.fromARGB(255, 220, 168, 229),
                () => Navigator.pushNamed(context, '/precision_farming'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSensorCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 18),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  color: Colors.grey[700],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildManagementOptionButton(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onPressed,
  ) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: color,
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.white),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
          const Icon(Icons.arrow_forward_ios, size: 16),
        ],
      ),
    );
  }
}
