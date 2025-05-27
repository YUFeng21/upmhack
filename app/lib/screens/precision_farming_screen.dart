//precision_farming_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/farm_data_provider.dart';

class PrecisionFarmingScreen extends StatefulWidget {
  const PrecisionFarmingScreen({super.key});

  @override
  _PrecisionFarmingScreenState createState() => _PrecisionFarmingScreenState();
}

class _PrecisionFarmingScreenState extends State<PrecisionFarmingScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final farmData = Provider.of<FarmDataProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Precision Farming'),
        backgroundColor: Color(0xFFDCECCF),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Predictions'),
            Tab(text: 'Automation'),
            Tab(text: 'Alerts'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Predictions Tab
          _buildPredictionsTab(context, farmData),

          // Automation Tab
          _buildAutomationTab(context),

          // Alerts Tab
          _buildAlertsTab(context),
        ],
      ),
    );
  }

  Widget _buildPredictionsTab(BuildContext context, FarmDataProvider farmData) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'AI-Driven Crop Predictions',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'Optimize planting schedules and resource allocation with smart predictions',
            style: TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 24),

          // Growth Prediction Card
          Card(
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.trending_up, color: Colors.green),
                      SizedBox(width: 8),
                      Text(
                        'Growth Prediction',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Growth Timeline Visualization
                  Container(
                    height: 180,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.all(8),
                    child: Center(
                      child: Image.asset(
                        'assets/growth_prediction.jpg',
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),
                  const Text(
                    'Current Growth Stage: Vegetative',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),

                  const Text('• Expected Flowering: 2 weeks'),
                  const Text('• Expected Harvest: 8 weeks'),
                  const Text('• Predicted Yield: 4.2 tons/acre'),

                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                'Detailed prediction view coming soon!',
                              ),
                            ),
                          );
                        },
                        child: const Text('View Details'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Weather Impact Card
          Card(
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.cloud, color: Colors.blue),
                      SizedBox(width: 8),
                      Text(
                        'Weather Impact Analysis',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Location: ${farmData.currentWeather['location']}',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          Text(
                            'Temperature: ${farmData.currentWeather['temp']}°C',
                          ),
                          Text(
                            'Rainfall: ${farmData.currentWeather['rainfall']} mm',
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: const Icon(
                          Icons.sunny,
                          size: 40,
                          color: Colors.orange,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),

                  const Text(
                    'Impact Assessment:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Current weather conditions are optimal for crop growth. The temperature range and moisture levels support healthy development.',
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Resource Optimization Card
          Card(
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.eco, color: Colors.green),
                      SizedBox(width: 8),
                      Text(
                        'Resource Optimization',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Resource usage visualization
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildResourceIndicator('Water', 60, Colors.blue),
                      _buildResourceIndicator('Fertilizer', 40, Colors.green),
                      _buildResourceIndicator('Pesticide', 20, Colors.red),
                    ],
                  ),

                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),

                  const Text(
                    'Recommendations:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '• Increase irrigation by 10% next week due to forecasted dry spell\n'
                    '• Reduce nitrogen fertilizer application by 15%\n'
                    '• Schedule preventative fungicide application before rainy season',
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResourceIndicator(String label, int percentage, Color color) {
    return Column(
      children: [
        SizedBox(
          height: 80,
          width: 80,
          child: Stack(
            children: [
              Center(
                child: SizedBox(
                  height: 80,
                  width: 80,
                  child: CircularProgressIndicator(
                    value: percentage / 100,
                    strokeWidth: 8,
                    backgroundColor: Colors.grey[300],
                    valueColor: AlwaysStoppedAnimation<Color>(color),
                  ),
                ),
              ),
              Center(
                child: Text(
                  '$percentage%',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Text(label),
      ],
    );
  }

  Widget _buildAutomationTab(BuildContext context) {
    final automationSystems = [
      {
        'title': 'Smart Irrigation',
        'icon': Icons.water_drop,
        'color': Colors.blue,
        'status': 'Active',
        'lastRun': '2 hours ago',
        'nextRun': 'Tomorrow, 6:00 AM',
      },
      {
        'title': 'Fertilization System',
        'icon': Icons.grass,
        'color': Colors.green,
        'status': 'Scheduled',
        'lastRun': '3 days ago',
        'nextRun': 'Tomorrow, 7:00 AM',
      },
      {
        'title': 'Pest Control',
        'icon': Icons.bug_report,
        'color': Colors.amber,
        'status': 'Inactive',
        'lastRun': '7 days ago',
        'nextRun': 'Manual activation required',
      },
      {
        'title': 'Climate Control',
        'icon': Icons.thermostat,
        'color': Colors.red,
        'status': 'Active',
        'lastRun': 'Running continuously',
        'nextRun': 'N/A',
      },
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Automated Farming Systems',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'Monitor and control your automated farming equipment',
            style: TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 24),

          // Automation Systems List
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: automationSystems.length,
            itemBuilder: (context, index) {
              final system = automationSystems[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 16),
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                system['icon'] as IconData,
                                color: system['color'] as Color,
                                size: 28,
                              ),
                              const SizedBox(width: 12),
                              Text(
                                system['title'] as String,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          // System status indicator
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color:
                                  (system['status'] == 'Active')
                                      ? Colors.green.withOpacity(0.2)
                                      : (system['status'] == 'Scheduled')
                                      ? Colors.blue.withOpacity(0.2)
                                      : Colors.grey.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              system['status'] as String,
                              style: TextStyle(
                                color:
                                    (system['status'] == 'Active')
                                        ? Colors.green
                                        : (system['status'] == 'Scheduled')
                                        ? Colors.blue
                                        : Colors.grey,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Last Run: ${system['lastRun']}',
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Next Run: ${system['nextRun']}',
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                            ],
                          ),
                          Switch(
                            value: system['status'] == 'Active',
                            onChanged: (value) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    value
                                        ? '${system['title']} activated'
                                        : '${system['title']} deactivated',
                                  ),
                                ),
                              );
                            },
                            activeColor: Color(0xFFA3C585),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                '${system['title']} settings coming soon!',
                              ),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFFA3C585),
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Configure'),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildAlertsTab(BuildContext context) {
    final alerts = [
      {
        'title': 'Soil Moisture Low',
        'description':
            'Field 3 soil moisture has dropped below optimal levels.',
        'timestamp': 'Today, 2:45 PM',
        'priority': 'High',
        'icon': Icons.water_drop,
        'color': Colors.red,
      },
      {
        'title': 'Pest Detection',
        'description': 'Aphid population detected in Field 2 (North section).',
        'timestamp': 'Today, 11:30 AM',
        'priority': 'Medium',
        'icon': Icons.bug_report,
        'color': Colors.orange,
      },
      {
        'title': 'Weather Alert',
        'description': 'Heavy rainfall expected in next 48 hours.',
        'timestamp': 'Yesterday, 8:15 PM',
        'priority': 'Medium',
        'icon': Icons.cloud,
        'color': Colors.blue,
      },
      {
        'title': 'System Update',
        'description': 'Irrigation system successfully updated to version 2.3.',
        'timestamp': 'Yesterday, 3:20 PM',
        'priority': 'Low',
        'icon': Icons.system_update,
        'color': Colors.green,
      },
      {
        'title': 'Harvest Reminder',
        'description':
            'Field 1 crops will be ready for harvest in approximately 5 days.',
        'timestamp': '2 days ago',
        'priority': 'Low',
        'icon': Icons.calendar_today,
        'color': Colors.purple,
      },
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Farm Alerts & Notifications',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              IconButton(
                icon: const Icon(Icons.filter_list),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Filter options coming soon!'),
                    ),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Stay informed about important farm activities and issues',
            style: TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 24),

          // Alert Summary Cards
          LayoutBuilder(
            builder: (context, constraints) {
              double cardWidth = (constraints.maxWidth - 24) / 3;

              return Row(
                children: [
                  _buildAlertSummaryCard(
                    'High Priority',
                    '1',
                    Colors.red,
                    Icons.warning_rounded,
                    width: cardWidth,
                  ),
                  const SizedBox(width: 12),
                  _buildAlertSummaryCard(
                    'Medium Priority',
                    '2',
                    Colors.orange,
                    Icons.info_outline,
                    width: cardWidth,
                  ),
                  const SizedBox(width: 12),
                  _buildAlertSummaryCard(
                    'Low Priority',
                    '2',
                    Colors.green,
                    Icons.check_circle_outline,
                    width: cardWidth,
                  ),
                ],
              );
            },
          ),

          const SizedBox(height: 24),

          // Alert List Section
          const Text(
            'Recent Alerts',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),

          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: alerts.length,
            itemBuilder: (context, index) {
              final alert = alerts[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 2,
                child: ListTile(
                  contentPadding: const EdgeInsets.all(16),
                  leading: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: (alert['color'] as Color).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      alert['icon'] as IconData,
                      color: alert['color'] as Color,
                    ),
                  ),
                  title: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        alert['title'] as String,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color:
                              (alert['priority'] == 'High')
                                  ? Colors.red.withOpacity(0.2)
                                  : (alert['priority'] == 'Medium')
                                  ? Colors.orange.withOpacity(0.2)
                                  : Colors.green.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          alert['priority'] as String,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color:
                                (alert['priority'] == 'High')
                                    ? Colors.red
                                    : (alert['priority'] == 'Medium')
                                    ? Colors.orange
                                    : Colors.green,
                          ),
                        ),
                      ),
                    ],
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 8),
                      Text(alert['description'] as String),
                      const SizedBox(height: 8),
                      Text(
                        alert['timestamp'] as String,
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Alert details for: ${alert['title']}'),
                      ),
                    );
                  },
                ),
              );
            },
          ),

          const SizedBox(height: 16),

          // Settings Button
          Center(
            child: TextButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Alert settings coming soon!')),
                );
              },
              icon: const Icon(Icons.settings, size: 20),
              label: const Text('Configure Alert Settings'),
              style: TextButton.styleFrom(foregroundColor: Color(0xFFA3C585)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAlertSummaryCard(
    String title,
    String count,
    Color color,
    IconData icon, {
    double? width,
  }) {
    return Container(
      width: width,
      height: 100,
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: color,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            '$count Alert${count == '1' ? '' : 's'}',
            style: const TextStyle(fontSize: 11),
          ),
        ],
      ),
    );
  }
}
