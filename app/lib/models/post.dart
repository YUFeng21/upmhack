//post.dart
class Comment {
  final String username;
  final String content;
  final DateTime timestamp;

  Comment({
    required this.username,
    required this.content,
    required this.timestamp,
  });
}

class Post {
  final String username;
  final String content;
  final DateTime timestamp;
  final String? imageUrl;
  final int likes;
  final List<Comment> comments;

  Post({
    required this.username,
    required this.content,
    required this.timestamp,
    this.imageUrl,
    this.likes = 0,
    List<Comment>? comments,
  }) : comments = comments ?? [];
}
