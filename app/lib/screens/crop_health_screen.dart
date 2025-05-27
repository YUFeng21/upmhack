// crop_health_screen.dart
import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';

class CropHealthScreen extends StatefulWidget {
  const CropHealthScreen({super.key});

  @override
  _CropHealthScreenState createState() => _CropHealthScreenState();
}

class _CropHealthScreenState extends State<CropHealthScreen> {
  File? _image;
  final ImagePicker _picker = ImagePicker();
  bool _analyzing = false;
  String _analysisResult = '';
  bool _showResults = false;

  Future<void> _takePhoto() async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
    if (photo != null) {
      setState(() {
        _image = File(photo.path);
        _analysisResult = '';
        _showResults = false;
      });
    }
  }

  Future<void> _pickFromGallery() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        _image = File(image.path);
        _analysisResult = '';
        _showResults = false;
      });
    }
  }

  void _analyzeImage() {
    if (_image == null) return;

    setState(() {
      _analyzing = true;
    });

    // Simulate analysis delay
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _analyzing = false;
        _showResults = true;
        _analysisResult = 'Healthy'; // Default test result
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Crop Health Analysis')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'AI-Powered Crop Health Monitoring',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Use your camera to analyze crop health, detect pests and diseases early',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 24),

            // Image capture/selection section
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const Text(
                      'Capture or Select Image',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),

                    _image != null
                        ? ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.file(
                            _image!,
                            height: 200,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                        )
                        : Container(
                          height: 200,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.grey[300],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Center(child: Text('No image selected')),
                        ),
                    const SizedBox(height: 16),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton.icon(
                          onPressed: _takePhoto,
                          icon: const Icon(Icons.camera_alt),
                          label: const Text('Camera'),
                          style: ElevatedButton.styleFrom(
                            foregroundColor: Colors.white,
                            backgroundColor: Colors.green,
                          ),
                        ),
                        ElevatedButton.icon(
                          onPressed: _pickFromGallery,
                          icon: const Icon(Icons.photo_library),
                          label: const Text('Gallery'),
                          style: ElevatedButton.styleFrom(
                            foregroundColor: Colors.white,
                            backgroundColor: Colors.blue,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed:
                            _image != null && !_analyzing
                                ? _analyzeImage
                                : null,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child:
                            _analyzing
                                ? const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    ),
                                    SizedBox(width: 12),
                                    Text('Analyzing...'),
                                  ],
                                )
                                : const Text('Analyze Image'),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Analysis Results Section
            if (_showResults)
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
                      const Text(
                        'Analysis Results',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color:
                                  _analysisResult == 'Healthy'
                                      ? Colors.green
                                      : Colors.red,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.check, color: Colors.white),
                          ),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Status: $_analysisResult',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              Text(
                                _analysisResult == 'Healthy'
                                    ? 'No issues detected'
                                    : 'Issues detected',
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                            ],
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),
                      const Divider(),
                      const SizedBox(height: 16),

                      const Text(
                        'Detailed Analysis',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        '• Leaf Color: Normal green color indicates good chlorophyll levels\n'
                        '• Growth Pattern: Even growth across all visible sections\n'
                        '• Pest Detection: No visible signs of pest infestation\n'
                        '• Disease Markers: No visible diseases detected\n'
                        '• Nutrient Status: Plant appears to have adequate nutrients',
                      ),

                      const SizedBox(height: 16),
                      const Text(
                        'AI Recommendations',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Continue with your current farming practices. The crop is showing healthy development. Consider routine preventative measures during the upcoming rainy season.',
                      ),
                    ],
                  ),
                ),
              ),

            const SizedBox(height: 24),

            // Additional Features Section
            const Text(
              'Additional Features',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            ListView(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildFeatureListTile(
                  'Drone Mapping',
                  'Schedule drone flights to map your entire field',
                  Icons.flight,
                ),
                _buildFeatureListTile(
                  'Batch Analysis',
                  'Upload multiple images for bulk analysis',
                  Icons.copy,
                ),
                _buildFeatureListTile(
                  'Historical Analysis',
                  'View trends and patterns over time',
                  Icons.history,
                ),
                _buildFeatureListTile(
                  'Export Reports',
                  'Download detailed PDF reports of analyses',
                  Icons.download,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureListTile(String title, String subtitle, IconData icon) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.green.withOpacity(0.2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: Colors.green),
        ),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('$title coming soon!')));
        },
      ),
    );
  }
}
