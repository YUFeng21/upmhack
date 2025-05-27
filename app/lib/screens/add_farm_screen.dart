//add_farm_screen.dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../providers/farm_data_provider.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class AddFarmScreen extends StatefulWidget {
  const AddFarmScreen({super.key});

  @override
  State<AddFarmScreen> createState() => _AddFarmScreenState();
}

class _AddFarmScreenState extends State<AddFarmScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _sizeController = TextEditingController();

  String _location = 'Cameron Highlands'; // Default location
  XFile? _imageFile;

  @override
  void dispose() {
    _nameController.dispose();
    _sizeController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();

    if (kIsWeb) {
      // Web implementation
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        setState(() {
          _imageFile = pickedFile;
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
          _imageFile = pickedFile; // Direct assignment
        });
      }
    }
  }

  void _saveFarm() {
    if (_formKey.currentState!.validate()) {
      if (_imageFile == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please add a farm image')),
        );
        return;
      }

      // Create a new farm object
      final newFarm = {
        'name': _nameController.text,
        'location': _location,
        'size': '${_sizeController.text} acres',
        'crops': <String>[],
        'image': _imageFile!.path,
        'soilMoisture': 70, // Default values
        'pH': 6.5,
        'temperature': 27,
        'humidity': 65,
      };

      // Add the farm to provider
      Provider.of<FarmDataProvider>(context, listen: false).addFarm(newFarm);

      // Show success message and navigate back
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Farm added successfully!')));
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add New Farm'),
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
                // Farm Name
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Farm Name',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.agriculture),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a farm name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Location selection
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(
                    labelText: 'Location',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.location_on),
                  ),
                  value: _location,
                  items: const [
                    DropdownMenuItem(
                      value: 'Cameron Highlands',
                      child: Text('Cameron Highlands'),
                    ),
                    DropdownMenuItem(
                      value: 'Genting Highlands',
                      child: Text('Genting Highlands'),
                    ),
                    DropdownMenuItem(value: 'Melaka', child: Text('Melaka')),
                    DropdownMenuItem(value: 'Penang', child: Text('Penang')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() {
                        _location = value;
                      });
                    }
                  },
                ),
                const SizedBox(height: 16),

                // Farm Size
                TextFormField(
                  controller: _sizeController,
                  decoration: const InputDecoration(
                    labelText: 'Farm Size (acres)',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.crop_square),
                    suffixText: 'acres',
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter farm size';
                    }
                    if (double.tryParse(value) == null) {
                      return 'Please enter a valid number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Farm Photo Selection
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child:
                      _imageFile == null
                          ? Container(
                            height: 200,
                            color: Colors.grey.shade200,
                            child: Center(
                              child: TextButton.icon(
                                icon: const Icon(Icons.add_a_photo),
                                label: const Text('Add Farm Photo'),
                                onPressed: _pickImage,
                              ),
                            ),
                          )
                          : Stack(
                            children: [
                              AspectRatio(
                                aspectRatio: 16 / 9,
                                child:
                                    kIsWeb
                                        ? Image.network(
                                          _imageFile!.path,
                                          width: double.infinity,
                                          fit: BoxFit.cover,
                                        )
                                        : Image.file(
                                          File(_imageFile!.path),
                                          width: double.infinity,
                                          fit: BoxFit.cover,
                                        ),
                              ),
                              Positioned(
                                right: 8,
                                top: 8,
                                child: InkWell(
                                  onTap: () {
                                    setState(() {
                                      _imageFile = null;
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
                  onPressed: _saveFarm,
                  icon: const Icon(Icons.save),
                  label: const Text('Save Farm'),
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
