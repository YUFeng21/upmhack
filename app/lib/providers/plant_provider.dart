import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:image_picker/image_picker.dart'; // Ensure you have image_picker installed
import 'package:flutter/foundation.dart'; // For kIsWeb
import 'package:http_parser/http_parser.dart'; // ✅ Import MediaType
import 'package:path/path.dart' as path;
import 'package:provider/provider.dart';
import 'package:image/image.dart' as img; // Import image package
import 'dart:io'; // Import dart:io for File
import 'package:path_provider/path_provider.dart'; // Import path_provider


class Message {
  final String role;
  String content;
  final String? imageUrl;
  final DateTime timestamp;

  Message({
    required this.role,
    required this.content,
    this.imageUrl,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();
}

class FarmData {
  final String typePlant;
  final String environment;
  final String suitableSoil;
  final String wateringAmount;

  FarmData({
    required this.typePlant,
    required this.environment,
    required this.suitableSoil,
    required this.wateringAmount,
  });

  factory FarmData.fromJson(Map<String, dynamic> json) {
    return FarmData(
      typePlant: json['type_plant'] ?? 'N/A',
      environment: json['environment'] ?? 'N/A',
      suitableSoil: json['suitable_soil'] ?? 'N/A',
      wateringAmount: json['watering_amount'] ?? 'N/A',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type_plant': typePlant,
      'environment': environment,
      'suitable_soil': suitableSoil,
      'watering_amount': wateringAmount,
    };
  }
}

class PlantProvider with ChangeNotifier {
  // Directly set baseUrl to localhost:3000
  final String baseUrl = 'http://localhost:3000';
  final String apiKey = dotenv.env['JAMAI_API_KEY'] ?? '';
  final String projectId = dotenv.env['JAMAI_PROJECT_ID'] ?? '';
  
  // Chat-related state
  final List<Message> _messages = [];
  bool _isLoading = false;
  StreamSubscription? _streamSubscription;
  String _currentStreamingMessage = '';
  
  // Farm data state
  List<FarmData> _farmData = [];
  String? _error;

  // Getters
  List<Message> get messages => _messages;
  bool get isLoading => _isLoading;
  List<FarmData> get farmData => _farmData;
  String? get error => _error;

  // Chat Methods
  Future<void> sendTextMessage(String userId, String message) async {
    _isLoading = true;
    _currentStreamingMessage = '';
    notifyListeners();

    try {
      _messages.add(Message(role: 'user', content: message));
      notifyListeners();

      final request = http.Request('POST', Uri.parse('$baseUrl/chat'));
      request.headers['Content-Type'] = 'application/json';
      request.body = json.encode({'userId': userId, 'message': message});

      final client = http.Client();
      final response = await client.send(request);

      if (response.statusCode != 200) {
        final errorBody = await response.stream.bytesToString();
        throw Exception('Server returned ${response.statusCode}: $errorBody');
      }

      await getFarmData(); // Fetch the latest farm data

      // Handle the response if needed
    } catch (e) {
      print('Error sending message: $e');
      _messages.add(Message(
        role: 'assistant',
        content: 'Sorry, there was an error. Please try again.',
      ));
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> sendImageMessage(String userId, String message, XFile imageFile) async {
    _isLoading = true;
    notifyListeners();

    try {
        // Prepare the request
        var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/chat'));
        request.fields['userId'] = userId;
        request.fields['message'] = message;

        // Attach the image file directly
        request.files.add(await http.MultipartFile.fromPath(
            'image', // The name of the field in the server
            imageFile.path,
            contentType: MediaType(getMimeType(path.extension(imageFile.path).split('.').last), '')
        ));

        // Send the request
        final response = await request.send();

        if (response.statusCode != 200) {
            final errorBody = await response.stream.bytesToString();
            throw Exception('Server returned ${response.statusCode}: $errorBody');
        }

        // Add the message to the local messages list
        _messages.add(Message(role: 'user', content: message, imageUrl: imageFile.path));
        notifyListeners();

        await getFarmData(); // Fetch the latest farm data
    } catch (e) {
        print('Error sending image message: $e');
        _messages.add(Message(
            role: 'assistant',
            content: 'Sorry, there was an error. Please try again.',
            imageUrl: null,
            timestamp: DateTime.now(),
        ));
    } finally {
        _isLoading = false;
        notifyListeners();
    }
  }

  void _handleStreamResponse(http.StreamedResponse streamedResponse, Message tempMessage) {
    _streamSubscription = streamedResponse.stream
        .transform(utf8.decoder)
        .transform(const LineSplitter())
        .listen(
      (data) {
        print('Received stream data: $data'); // Debugging line
        if (data.startsWith('data: ')) {
          try {
            // Strip the 'data: ' prefix before parsing
            final jsonData = json.decode(data.substring(6)); // Start from index 6 to skip 'data: '
            if (jsonData['results'] != null) {
              final results = jsonData['results'];
              // Update the message with the fetched data
              tempMessage.content = "Plant Type: ${results['plant_type']}, Environment: ${results['environment']}, Suitable Soil: ${results['suitable_soil']}, Watering Amount: ${results['watering_amount']}";
              notifyListeners();
            } else if (jsonData['message'] != null) {
              // Handle the success message
              tempMessage.content = jsonData['message']; // Display the success message
              notifyListeners();
            } else if (jsonData['error'] != null) {
              print('Stream error: ${jsonData['error']}');
              tempMessage.content = 'Error: ${jsonData['error']}';
              notifyListeners();
            }
          } catch (e) {
            print('Error parsing stream data: $e');
          }
        }
      },
      onError: (error) {
        print('Stream error: $error');
        tempMessage.content = 'Error: Failed to receive response. Please try again.';
        notifyListeners();
      },
      onDone: () {
        print('Stream completed');
        _streamSubscription?.cancel();
        _isLoading = false;
        notifyListeners();
      },
    );
  }

  // Farm Data Methods
  Future<void> getFarmData() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
        print('Fetching farm data...'); // Debugging line
        final response = await http.get(Uri.parse('$baseUrl/get-farm-data'));

        print('Response status: ${response.statusCode}'); // Log response status
        print('Response body: ${response.body}'); // Log response body

        if (response.statusCode == 200) {
            final List<dynamic> data = jsonDecode(response.body);
            if (data.isNotEmpty) {
                _farmData = [FarmData.fromJson(data.first)]; // Only keep the latest entry
                final latestEntry = data.first;

                // Format the latest message neatly without space before the hyphen
                final latestMessage = '''
- Type of Plant: ${latestEntry['type_plant'] ?? 'N/A'}
- Environment: ${latestEntry['environment'] ?? 'N/A'}
- Suitable Soil: ${latestEntry['suitable_soil'] ?? 'N/A'}
- Watering Amount: ${latestEntry['watering_amount'] ?? 'N/A'}
''';

                _messages.add(Message(role: 'assistant', content: latestMessage)); // Add to messages
            } else {
                _farmData = []; // No data case
            }
            print('✅ Latest farm data retrieved successfully');
        } else {
            _error = 'Failed to retrieve farm data: ${response.statusCode}';
            print('❌ Error retrieving farm data: ${response.body}');
            throw Exception(_error);
        }
    } catch (e) {
        _error = 'Error: $e';
        print('❌ Error: $e');
        rethrow;
    } finally {
        _isLoading = false;
        notifyListeners();
    }
  }

  Future<void> fetchData(String question) async {
    try {
        final response = await http.get(Uri.parse('$baseUrl/get-farm-data?question=$question'));

        if (response.statusCode == 200) {
            final List<dynamic> data = jsonDecode(response.body);
            _farmData = data.map((json) => FarmData.fromJson(json)).toList();
            print('✅ Farm data retrieved successfully');
        } else {
            _error = 'Failed to retrieve farm data: ${response.statusCode}';
            print('❌ Error retrieving farm data: ${response.body}');
            throw Exception(_error);
        }
    } catch (e) {
        _error = 'Error: $e';
        print('❌ Error: $e');
        rethrow;
    } finally {
        _isLoading = false;
        notifyListeners();
    }
  }

  // Utility Methods
  void clearMessages() {
    _messages.clear();
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _streamSubscription?.cancel();
    super.dispose();
  }

  String getMimeType(String extension) {
    switch (extension.toLowerCase()) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'application/octet-stream'; // Fallback for unsupported formats
    }
  }
}