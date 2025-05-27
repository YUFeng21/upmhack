//user.dart

class User {
  String username;
  String email;
  String password;
  String fullName;
  String phone;
  String? profilePicture;

  User({
    required this.username,
    required this.email,
    required this.password,
    required this.fullName,
    required this.phone,
    this.profilePicture,
  });
}
