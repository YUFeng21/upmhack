//add_crop_screen.dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../providers/farm_data_provider.dart';
import 'package:intl/intl.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:typed_data';

class AddCropScreen extends StatefulWidget {
  const AddCropScreen({super.key});

  @override
  State<AddCropScreen> createState() => _AddCropScreenState();
}

class _AddCropScreenState extends State<AddCropScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _varietyController = TextEditingController();

  String? _selectedFarm;
  DateTime _plantingDate = DateTime.now();

  File? _imageFile;
  String? _webImagePath;
  XFile? _pickedFile;

  @override
  void initState() {
    super.initState();
    // Set initial farm selection if farms are available
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final farms = Provider.of<FarmDataProvider>(context, listen: false).farms;
      if (farms.isNotEmpty) {
        setState(() {
          _selectedFarm = farms[0]['name'];
        });
      }
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _varietyController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();

    if (kIsWeb) {
      // Web implementation
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        setState(() {
          _pickedFile = pickedFile;
          _webImagePath = pickedFile.path;
        });
      }
    } else {
      final pickedFile = await showModalBottomSheet<XFile?>(
        context: context,
        builder: (BuildContext context) {
          return SafeArea(
            child: Wrap(
              children: <Widget>[
                ListTile(
                  leading: const Icon(Icons.photo_library),
                  title: const Text('Photo Gallery'),
                  onTap: () async {
                    Navigator.pop(
                      context,
                      await picker.pickImage(source: ImageSource.gallery),
                    );
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.photo_camera),
                  title: const Text('Camera'),
                  onTap: () async {
                    Navigator.pop(
                      context,
                      await picker.pickImage(source: ImageSource.camera),
                    );
                  },
                ),
              ],
            ),
          );
        },
      );

      if (pickedFile != null) {
        setState(() {
          _pickedFile = pickedFile;
          _imageFile = File(pickedFile.path);
        });
      }
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _plantingDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFFA3C585),
              onPrimary: Colors.white,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null && picked != _plantingDate) {
      setState(() {
        _plantingDate = picked;
      });
    }
  }

  void _saveCrop() async {
    if (_formKey.currentState!.validate()) {
      if (_pickedFile == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please add a crop image')),
        );
        return;
      }

      if (_selectedFarm == null) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Please select a farm')));
        return;
      }

      // Format date for display
      final formattedDate = DateFormat('MMM dd, yyyy').format(_plantingDate);

      String imagePath;
      if (kIsWeb) {
        imagePath = 'web_image_${DateTime.now().millisecondsSinceEpoch}';
      } else {
        imagePath = _imageFile!.path;
      }

      // Create a new crop object
      final newCrop = {
        'name': _nameController.text,
        'variety':
            _varietyController.text.isEmpty
                ? 'Unknown Variety'
                : _varietyController.text,
        'farm': _selectedFarm,
        'planted': formattedDate,
        'status': 'Seedling', // Default status for new crops
        'health': 'Good', // Default health
        'image': imagePath,
        'isWebImage': kIsWeb, // Flag to indicate if it's a web image
        'imageBytes':
            kIsWeb
                ? await _pickedFile!.readAsBytes()
                : null, // Store image bytes for web
        'healthScore': 85, // Default values
        'diseaseRisk': 'Low',
        'growthStage': 'Early vegetative',
        'daysToHarvest': 45, // Default value
        'recommendations': [
          'Monitor growth regularly',
          'Maintain adequate soil moisture',
          'Check for pests weekly',
        ],
      };

      // Add the crop to provider
      Provider.of<FarmDataProvider>(context, listen: false).addCrop(newCrop);

      // Show success message and navigate back
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Crop added successfully!')));
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final farmData = Provider.of<FarmDataProvider>(context);
    final List<Map<String, dynamic>> farms = farmData.farms;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add New Crop'),
        backgroundColor: const Color(0xFFDCECCF),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Crop Name
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Crop Name',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.grass),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a crop name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Crop Variety (Optional)
                TextFormField(
                  controller: _varietyController,
                  decoration: const InputDecoration(
                    labelText: 'Crop Variety (Optional)',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.category),
                  ),
                ),
                const SizedBox(height: 16),

                // Farm Selection
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(
                    labelText: 'Select Farm',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.agriculture),
                  ),
                  value: _selectedFarm,
                  items:
                      farms.isEmpty
                          ? [
                            const DropdownMenuItem<String>(
                              value: null,
                              child: Text(
                                'No farms available - add a farm first',
                              ),
                            ),
                          ]
                          : farms
                              .map(
                                (farm) => DropdownMenuItem<String>(
                                  value: farm['name'] as String,
                                  child: Text(farm['name'] as String),
                                ),
                              )
                              .toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedFarm = value;
                    });
                  },
                ),
                const SizedBox(height: 16),

                // Planting Date
                InkWell(
                  onTap: () => _selectDate(context),
                  child: InputDecorator(
                    decoration: const InputDecoration(
                      labelText: 'Planting Date',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.calendar_today),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(DateFormat('MMM dd, yyyy').format(_plantingDate)),
                        const Icon(Icons.arrow_drop_down),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Crop Photo Selection
                Container(
                  height: 200,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child:
                      _pickedFile == null
                          ? Center(
                            child: TextButton.icon(
                              icon: const Icon(Icons.add_a_photo),
                              label: const Text('Add Crop Photo'),
                              onPressed: _pickImage,
                            ),
                          )
                          : Stack(
                            fit: StackFit.expand,
                            children: [
                              kIsWeb
                                  ? FutureBuilder<Uint8List>(
                                    future: _pickedFile!.readAsBytes(),
                                    builder: (context, snapshot) {
                                      if (snapshot.connectionState ==
                                              ConnectionState.done &&
                                          snapshot.hasData) {
                                        return Image.memory(
                                          snapshot.data!,
                                          fit: BoxFit.cover,
                                        );
                                      } else {
                                        return const Center(
                                          child: CircularProgressIndicator(),
                                        );
                                      }
                                    },
                                  )
                                  : Image.file(_imageFile!, fit: BoxFit.cover),
                              Positioned(
                                right: 8,
                                top: 8,
                                child: InkWell(
                                  onTap: () {
                                    setState(() {
                                      _pickedFile = null;
                                      _imageFile = null;
                                      _webImagePath = null;
                                    });
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: Colors.white,
                                    ),
                                    child: const Icon(
                                      Icons.close,
                                      color: Colors.red,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                ),
                const SizedBox(height: 32),

                // Save Button
                ElevatedButton.icon(
                  onPressed: _saveCrop,
                  icon: const Icon(Icons.save),
                  label: const Text('Save Crop'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFA3C585),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
