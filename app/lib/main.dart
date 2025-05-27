//main dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/mqtt_service.dart';
import 'dart:async';
import 'screens/home_screen.dart';
import 'screens/sign_in_screen.dart';
import 'screens/sign_up_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/community_screen.dart';
import 'screens/my_farm_screen.dart';
import 'screens/my_crops_screen.dart';
import 'screens/smart_irrigation_screen.dart';
import 'screens/pest_control_screen.dart';
import 'screens/precision_farming_screen.dart';
import 'screens/crop_health_screen.dart';
import 'providers/farm_data_provider.dart';
import 'providers/user_provider.dart';
import 'providers/post_provider.dart';
import 'providers/plant_provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: "assets/.env");
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform,);
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => UserProvider()),
        ChangeNotifierProvider(create: (context) => PostProvider()),
        ChangeNotifierProvider(create: (context) => FarmDataProvider()),
        ChangeNotifierProvider(create: (context) => MqttService()..connect()),
        ChangeNotifierProvider(create: (context) => PlantProvider()),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        useMaterial3: true,
      ),
      home: SignInScreen(),
      routes: {
        '/home': (context) => const HomeScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/farm': (context) => MyFarmScreen(mqttService: Provider.of<MqttService>(context)),
        '/crops': (context) => const MyCropsScreen(),
        '/sign-in': (context) => SignInScreen(),
        '/sign-up': (context) => const SignUpScreen(),
        '/smart_irrigation': (context) => const SmartIrrigationScreen(),
        '/pest_control': (context) => const PestControlScreen(),
        '/precision_farming': (context) => const PrecisionFarmingScreen(),
        '/crop_health': (context) => const CropHealthScreen(),
        '/chat': (context) => ChatScreen(),
        '/community': (context) => CommunityScreen(),
      },
    );
  }
}

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final mqttService = Provider.of<MqttService>(context);

    return Scaffold(
      appBar: AppBar(title: Text("IoT Farm Dashboard")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            SensorCard("🌡 Temperature", "${mqttService.temperature} °C", Colors.orange),
            SensorCard("💧 Humidity", "${mqttService.humidity} %", Colors.blue),
            SensorCard("☀️ Light Intensity", "${mqttService.lightIntensity}", Colors.yellow),
            SensorCard("🌱 Soil Moisture", "${mqttService.soilMoisture} %", Colors.green),
          ],
        ),
      ),
    );
  }
}

class SensorCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;

  SensorCard(this.title, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Card(
      color: color.withOpacity(0.2),
      child: ListTile(
        leading: Icon(Icons.sensor_window, color: color),
        title: Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        trailing: Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => SignInScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFDCECCF),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/logo.png', width: 150),
            const SizedBox(height: 20),
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFA3C585)),
            ),
          ],
        ),
      ),
    );
  }
}

