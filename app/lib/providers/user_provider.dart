//user_provider.dart
import 'package:flutter/material.dart';
import '../models/user.dart';

class UserProvider with ChangeNotifier {
  // Initialize the user with default values
  User _user = User(
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    profilePicture: null,
  );

  // Getter for the user object
  User get user => _user;

  // Getter for username (was missing implementation)
  String get username => _user.username;

  // Method to update the user details
  void updateUser({
    String? fullName,
    String? username,
    String? email,
    String? phone,
    String? password,
    String? profilePicture,
  }) {
    _user = User(
      fullName: fullName ?? _user.fullName,
      username: username ?? _user.username,
      email: email ?? _user.email,
      phone: phone ?? _user.phone,
      password: password ?? _user.password,
      profilePicture: profilePicture ?? _user.profilePicture,
    );
    notifyListeners();
  }

  // Method to clear the user details (e.g., on logout)
  void clearUser() {
    _user = User(
      username: '',
      email: '',
      password: '',
      fullName: '',
      phone: '',
      profilePicture: null,
    );
    notifyListeners();
  }
}
