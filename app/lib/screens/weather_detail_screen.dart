// weather_detail_screen.dart
import 'package:flutter/material.dart';

class WeatherDetailScreen extends StatelessWidget {
  final Map<String, dynamic> weather;

  const WeatherDetailScreen({super.key, required this.weather});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> hourlyForecast = [
      {'time': '09:00', 'temp': 24, 'condition': 'Partly Cloudy'},
      {'time': '10:00', 'temp': 25, 'condition': 'Partly Cloudy'},
      {'time': '11:00', 'temp': 26, 'condition': 'Sunny'},
      {'time': '12:00', 'temp': 27, 'condition': 'Sunny'},
      {'time': '13:00', 'temp': 28, 'condition': 'Sunny'},
      {'time': '14:00', 'temp': 27, 'condition': 'Partly Cloudy'},
      {'time': '15:00', 'temp': 26, 'condition': 'Partly Cloudy'},
      {'time': '16:00', 'temp': 25, 'condition': 'Cloudy'},
      {'time': '17:00', 'temp': 24, 'condition': 'Rainy'},
      {'time': '18:00', 'temp': 22, 'condition': 'Rainy'},
    ];

    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 255, 255, 255),
      appBar: AppBar(
        title: const Text('Weather Details'),
        backgroundColor: Color(0xFFDCECCF),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Current Weather Overview
            Container(
              color: Colors.white,
              width: double.infinity,
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  Text(
                    weather['location'],
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Last updated: ${weather['lastUpdated']}',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 20),
                  _getWeatherIcon(weather['condition'], size: 80),
                  const SizedBox(height: 16),
                  Text(
                    '${weather['temp']}°C',
                    style: const TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    weather['condition'],
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Weather Details Cards
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  Expanded(
                    child: _buildWeatherDetailCard(
                      'Rainfall',
                      '${weather['rainfall']} mm',
                      Icons.water_drop,
                      Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildWeatherDetailCard(
                      'Wind',
                      '${weather['windSpeed']} km/h',
                      Icons.air,
                      Colors.blueGrey,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Hourly Forecast
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: const Text(
                'Hourly Forecast',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              color: Colors.white,
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: SizedBox(
                height: 120,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: hourlyForecast.length,
                  itemBuilder: (context, index) {
                    final hourData = hourlyForecast[index];
                    return Container(
                      width: 80,
                      padding: EdgeInsets.only(
                        left: index == 0 ? 16.0 : 8.0,
                        right: index == hourlyForecast.length - 1 ? 16.0 : 8.0,
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            hourData['time'],
                            style: TextStyle(
                              color: Colors.grey[700],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          _getWeatherIcon(hourData['condition'], size: 30),
                          Text(
                            '${hourData['temp']}°',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Weather Impacts on Farming
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Weather Impact on Farming',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      const ListTile(
                        leading: Icon(Icons.water_drop, color: Colors.blue),
                        title: Text('Irrigation Recommendation'),
                        subtitle: Text(
                          'Moderate watering recommended due to upcoming dry period.',
                        ),
                        contentPadding: EdgeInsets.zero,
                        dense: true,
                      ),
                      const Divider(),
                      const ListTile(
                        leading: Icon(Icons.grass, color: Color(0xFFA3C585)),
                        title: Text('Crop Protection'),
                        subtitle: Text(
                          'Consider covering sensitive crops during evening rainfall.',
                        ),
                        contentPadding: EdgeInsets.zero,
                        dense: true,
                      ),
                      const Divider(),
                      const ListTile(
                        leading: Icon(Icons.bug_report, color: Colors.amber),
                        title: Text('Pest Alert'),
                        subtitle: Text(
                          'Humid conditions may increase fungal disease risk.',
                        ),
                        contentPadding: EdgeInsets.zero,
                        dense: true,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeatherDetailCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Icon(icon, color: color, size: 30),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }

  Widget _getWeatherIcon(String condition, {double size = 40}) {
    IconData iconData;
    Color color;

    switch (condition.toLowerCase()) {
      case 'sunny':
        iconData = Icons.wb_sunny;
        color = Colors.orange;
        break;
      case 'partly cloudy':
        iconData = Icons.wb_cloudy;
        color = Colors.blueGrey;
        break;
      case 'cloudy':
        iconData = Icons.cloud;
        color = Colors.grey;
        break;
      case 'rainy':
        iconData = Icons.grain;
        color = Colors.blue;
        break;
      case 'thunderstorm':
        iconData = Icons.flash_on;
        color = Colors.amber;
        break;
      default:
        iconData = Icons.wb_sunny;
        color = Colors.orange;
    }

    return Icon(iconData, color: color, size: size);
  }
}
