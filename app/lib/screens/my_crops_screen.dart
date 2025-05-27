//my_crops_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/farm_data_provider.dart';
import 'add_crop_screen.dart';

class MyCropsScreen extends StatelessWidget {
  const MyCropsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Use Provider to get data from FarmDataProvider
    final farmData = Provider.of<FarmDataProvider>(context);
    final List<Map<String, dynamic>> crops = farmData.crops;

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Crops'),
        backgroundColor: Color(0xFFDCECCF),
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
            const SizedBox(height: 16),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 1.0,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: crops.length,
                itemBuilder: (context, index) {
                  final crop = crops[index];
                  return GestureDetector(
                    onTap: () {
                      // Navigate to crop detail screen when tapped
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => CropDetailScreen(crop: crop),
                        ),
                      );
                    },
                    child: Card(
                      elevation: 3,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Expanded(
                            flex: 6,
                            child: Stack(
                              fit: StackFit.expand,
                              children: [
                                ClipRRect(
                                  borderRadius: const BorderRadius.only(
                                    topLeft: Radius.circular(12),
                                    topRight: Radius.circular(12),
                                  ),
                                  child: Image.asset(
                                    crop['image'],
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                Positioned(
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  child: Container(
                                    height: 40,
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        begin: Alignment.topCenter,
                                        end: Alignment.bottomCenter,
                                        colors: [
                                          Colors.transparent,
                                          Colors.black.withOpacity(0.5),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                                Positioned(
                                  bottom: 8,
                                  left: 8,
                                  child: Text(
                                    crop['name'],
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                      shadows: [
                                        Shadow(
                                          blurRadius: 3.0,
                                          color: Colors.black54,
                                          offset: Offset(1.0, 1.0),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Expanded(
                            flex: 4,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    crop['variety'],
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey,
                                      fontWeight: FontWeight.w500,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      _buildStatusChip(crop['status']),
                                      _buildHealthIndicator(crop['health']),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
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
            MaterialPageRoute(builder: (context) => const AddCropScreen()),
          );
        },
        backgroundColor: Color(0xFFDCECCF),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color backgroundColor;
    Color textColor = Colors.white;

    switch (status.toLowerCase()) {
      case 'seedling':
        backgroundColor = Colors.lightBlue;
        break;
      case 'growing':
        backgroundColor = Colors.green;
        break;
      case 'flowering':
        backgroundColor = Colors.purple;
        break;
      case 'harvesting':
        backgroundColor = Colors.orange;
        break;
      default:
        backgroundColor = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status,
        style: TextStyle(
          fontSize: 10,
          color: textColor,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildHealthIndicator(String health) {
    Color color;
    IconData icon;

    switch (health.toLowerCase()) {
      case 'excellent':
        color = Colors.green;
        icon = Icons.sentiment_very_satisfied;
        break;
      case 'good':
        color = Colors.lightGreen;
        icon = Icons.sentiment_satisfied;
        break;
      case 'fair':
        color = Colors.amber;
        icon = Icons.sentiment_neutral;
        break;
      case 'poor':
        color = Colors.red;
        icon = Icons.sentiment_dissatisfied;
        break;
      default:
        color = Colors.grey;
        icon = Icons.help_outline;
    }

    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: color, size: 16),
    );
  }
}

class CropDetailScreen extends StatelessWidget {
  final Map<String, dynamic> crop;

  const CropDetailScreen({super.key, required this.crop});

  @override
  Widget build(BuildContext context) {
    // Access the provider even in the detail screen to maintain sync
    final farmData = Provider.of<FarmDataProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('${crop['name']} Details'),
        backgroundColor: Color(0xFFDCECCF),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Crop Header with Image
              Center(
                child: Hero(
                  tag: 'crop-${crop['name']}',
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.asset(
                      crop['image'],
                      height: 200,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Crop Details
              Card(
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
                        'Crop Information',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      _buildInfoRow('Name', crop['name']),
                      _buildInfoRow('Variety', crop['variety']),
                      _buildInfoRow('Farm', crop['farm']),
                      _buildInfoRow('Planted Date', crop['planted']),
                      _buildInfoRow('Status', crop['status']),
                      _buildInfoRow('Growth Stage', crop['growthStage']),
                      _buildInfoRow(
                        'Days to Harvest',
                        '${crop['daysToHarvest']}',
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // AI-Powered Crop Health Analysis
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.health_and_safety,
                            color: Colors.green,
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'AI-Powered Crop Health Analysis',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Health Score
                      Row(
                        children: [
                          _buildHealthScoreIndicator(crop['healthScore']),
                          const SizedBox(width: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Health Score',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              Text(
                                '${crop['healthScore']}/100',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: _getHealthScoreColor(
                                    crop['healthScore'],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      // Disease Risk
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: _getDiseaseRiskColor(
                                crop['diseaseRisk'],
                              ).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              'Disease Risk: ${crop['diseaseRisk']}',
                              style: TextStyle(
                                color: _getDiseaseRiskColor(
                                  crop['diseaseRisk'],
                                ),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // AI Recommendations
                      const Text(
                        'AI Recommendations',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ...List.generate(
                        crop['recommendations'].length,
                        (index) => Padding(
                          padding: const EdgeInsets.only(bottom: 8.0),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(
                                Icons.check_circle,
                                color: Colors.green,
                                size: 18,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(crop['recommendations'][index]),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      //Detailed Analysis Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pushNamed(
                              context,
                              '/crop_health',
                              arguments: crop,
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xFFA3C585),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text(
                            'Detailed Health Analysis',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Weather impact section
              const SizedBox(height: 24),
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.cloudy_snowing, color: Colors.blue),
                          const SizedBox(width: 8),
                          const Text(
                            'Weather Impact Analysis',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      _buildInfoRow(
                        'Current Weather',
                        farmData.currentWeather['condition'],
                      ),
                      _buildInfoRow(
                        'Temperature',
                        '${farmData.currentWeather['temp']}°C',
                      ),
                      _buildInfoRow(
                        'Rainfall',
                        '${farmData.currentWeather['rainfall']} mm',
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Weather Impact on Crop',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Dynamic weather impact based on crop type and current weather
                      Text(
                        _getWeatherImpactText(
                          crop['name'],
                          farmData.currentWeather,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getWeatherImpactText(String cropName, Map<String, dynamic> weather) {
    // Dynamic weather impact analysis based on crop type and current weather conditions
    if (cropName == 'Tomatoes' && weather['condition'] == 'Partly Cloudy') {
      return 'The partly cloudy conditions are favorable for tomato growth. The current temperature of ${weather['temp']}°C is within optimal range. Recent rainfall of ${weather['rainfall']} mm meets water requirements.';
    } else if (cropName == 'Strawberries' &&
        weather['condition'] == 'Partly Cloudy') {
      return 'Current weather conditions are good for your strawberry crop. The temperature of ${weather['temp']}°C supports flowering. The ${weather['rainfall']} mm rainfall provides adequate moisture without risking fungal diseases.';
    } else if (cropName == 'Lettuce' &&
        weather['condition'] == 'Partly Cloudy') {
      return 'The partly cloudy conditions help prevent lettuce from bolting. Temperature of ${weather['temp']}°C is slightly higher than ideal. Consider additional shade if temperatures rise further.';
    } else {
      return 'Current weather conditions are suitable for your ${cropName.toLowerCase()} growth. Monitor closely as weather changes may affect optimal growing conditions.';
    }
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey[700],
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHealthScoreIndicator(int score) {
    return Container(
      width: 60,
      height: 60,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white,
        border: Border.all(color: _getHealthScoreColor(score), width: 3),
      ),
      child: Center(
        child: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: _getHealthScoreColor(score).withOpacity(0.2),
          ),
          child: Center(
            child: Text(
              '$score',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: _getHealthScoreColor(score),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Color _getHealthScoreColor(int score) {
    if (score >= 90) return Colors.green;
    if (score >= 75) return Colors.lightGreen;
    if (score >= 60) return Colors.amber;
    if (score >= 40) return Colors.orange;
    return Colors.red;
  }

  Color _getDiseaseRiskColor(String risk) {
    switch (risk.toLowerCase()) {
      case 'very low':
        return Colors.green;
      case 'low':
        return Colors.lightGreen;
      case 'moderate':
        return Colors.amber;
      case 'high':
        return Colors.orange;
      case 'very high':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
