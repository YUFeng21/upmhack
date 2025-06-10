//home_screen.dart
import 'package:app/screens/chat_screen.dart';
import 'package:app/screens/community_screen.dart';
import 'package:flutter/material.dart';
import 'package:app/services/mqtt_service.dart'; // Import the MqttService
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import '../providers/farm_data_provider.dart';
import '../widgets/app_drawer.dart';
import 'profile_screen.dart';
import 'my_farm_screen.dart';
import 'my_crops_screen.dart';
import 'weather_detail_screen.dart';
import 'package:firebase_auth/firebase_auth.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int currentIndex = 0;

  // List of pages for the bottom navigation bar
  final List<Widget> pages = [
    const HomeContent(), // Home content
    const CommunityScreen(), // AgriFriend content
    const ChatScreen(), // AgriBot content
    const ProfileScreen(), // Profile content
  ];

  void onTabTapped(int index) {
    setState(() {
      currentIndex = index; // Update the selected index
    });
  }

  @override
  Widget build(BuildContext context) {
    final userName = Provider.of<UserProvider>(context).username;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Text('Hi, '),
            Text(userName, style: const TextStyle(fontWeight: FontWeight.bold)),
            const Text('!'),
          ],
        ),
        backgroundColor: const Color(0xFFDCECCF),
        leading: Builder(
          builder:
              (context) => IconButton(
                icon: const Icon(Icons.menu),
                onPressed: () {
                  Scaffold.of(context).openDrawer();
                },
              ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('No new notifications')),
              );
            },
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: pages[currentIndex], // Display the selected page
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(
            icon: Icon(Icons.people),
            label: 'AgriFriend',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_bubble_outline),
            label: 'AgriBot',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
        currentIndex: currentIndex,
        selectedItemColor: Color(0xFFA3C585),
        unselectedItemColor: Colors.grey,
        onTap: onTabTapped, // Handle tab selection
      ),
    );
  }
}

// HomeContent widget
class HomeContent extends StatelessWidget {
  const HomeContent({super.key});

  @override
  Widget build(BuildContext context) {
    final farmData = Provider.of<FarmDataProvider>(context);
    final Map<String, dynamic> weather = farmData.currentWeather;

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Weather Forecast Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Weather',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Text(
                  'Last updated: ${weather['lastUpdated'].toString().substring(11)}',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
            const SizedBox(height: 12),
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => WeatherDetailScreen(weather: weather),
                  ),
                );
              },
              child: Card(
                elevation: 3,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        weather['location'],
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              _getWeatherIcon(weather['condition']),
                              const SizedBox(width: 8),
                              Text(
                                '${weather['temp']}°C',
                                style: const TextStyle(
                                  fontSize: 36,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Row(
                                children: [
                                  const Icon(
                                    Icons.water_drop,
                                    size: 16,
                                    color: Colors.blue,
                                  ),
                                  const SizedBox(width: 4),
                                  Text('${weather['rainfall']} mm'),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.air,
                                    size: 16,
                                    color: Colors.blueGrey,
                                  ),
                                  const SizedBox(width: 4),
                                  Text('${weather['windSpeed']} km/h'),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // My Farms Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'My Farms',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => MyFarmScreen(mqttService: Provider.of<MqttService>(context)),
                      ),
                    );
                  },
                  child: const Text(
                    'See All',
                    style: TextStyle(color: Color(0xFFA3C585)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      farmData.getFarmByIndex(0)['name'] ??
                          'Farm 1: Green Valley',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Location: ${farmData.getFarmByIndex(0)['location'] ?? 'Cameron Highlands'}',
                    ),
                    Text(
                      'Size: ${farmData.getFarmByIndex(0)['size'] ?? '10 acres'}',
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // My Crops Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'My Crops',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const MyCropsScreen(),
                      ),
                    );
                  },
                  child: const Text(
                    'See All',
                    style: TextStyle(color: Color(0xFFA3C585)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Crop: ${farmData.getCropByIndex(0)['name'] ?? 'Tomatoes'}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Growth Stage: ${farmData.getCropByIndex(0)['growthStage'] ?? 'Flowering'}',
                    ),
                    Text(
                      'Health Status: ${farmData.getCropByIndex(0)['health'] ?? 'Good'}',
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Farm News Today Section
            const Text(
              'Farm News Today',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            SizedBox(
              height: 180,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: farmData.farmNews.length,
                itemBuilder: (context, index) {
                  final news = farmData.farmNews[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 24.0),
                    child: _buildNewsCard(news),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNewsCard(Map<String, dynamic> news) {
    return Container(
      width: 250,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Card(
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // News Image
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
              child: Image.asset(
                news['image'],
                height: 80,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
            // News Content
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    news['title'],
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    news['description'],
                    style: TextStyle(fontSize: 12, color: Colors.grey[700]),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _getWeatherIcon(String condition) {
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

    return Icon(iconData, color: color, size: 40);
  }
}