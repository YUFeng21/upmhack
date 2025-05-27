//post_provider.dart
import 'package:flutter/material.dart';
import '../models/post.dart';

class PostProvider with ChangeNotifier {
  final List<Post> _posts = [];

  List<Post> get posts => List.unmodifiable(_posts);

  void addPost(Post post) {
    _posts.insert(0, post);
    notifyListeners();
  }

  void likePost(int index) {
    if (index >= 0 && index < _posts.length) {
      final post = _posts[index];
      _posts[index] = Post(
        username: post.username,
        content: post.content,
        timestamp: post.timestamp,
        imageUrl: post.imageUrl,
        likes: post.likes + 1,
        comments: post.comments,
      );
      notifyListeners();
    }
  }

  void deletePost(int index) {
    if (index >= 0 && index < _posts.length) {
      _posts.removeAt(index);
      notifyListeners();
    }
  }

  void editPost(int index, String newContent) {
    if (index >= 0 && index < _posts.length) {
      final post = _posts[index];
      _posts[index] = Post(
        username: post.username,
        content: newContent,
        timestamp: post.timestamp,
        imageUrl: post.imageUrl,
        likes: post.likes,
        comments: post.comments,
      );
      notifyListeners();
    }
  }

  void addComment(int postIndex, String username, String content) {
    if (postIndex >= 0 && postIndex < _posts.length) {
      final post = _posts[postIndex];
      final newComment = Comment(
        username: username,
        content: content,
        timestamp: DateTime.now(),
      );
      
      _posts[postIndex] = Post(
        username: post.username,
        content: post.content,
        timestamp: post.timestamp,
        imageUrl: post.imageUrl,
        likes: post.likes,
        comments: [...post.comments, newComment],
      );
      notifyListeners();
    }
  }

  void editComment(int postIndex, int commentIndex, String newContent) {
    if (postIndex >= 0 && postIndex < _posts.length) {
      final post = _posts[postIndex];
      if (commentIndex >= 0 && commentIndex < post.comments.length) {
        final updatedComments = List<Comment>.from(post.comments);
        final oldComment = updatedComments[commentIndex];
        updatedComments[commentIndex] = Comment(
          username: oldComment.username,
          content: newContent,
          timestamp: oldComment.timestamp,
        );

        _posts[postIndex] = Post(
          username: post.username,
          content: post.content,
          timestamp: post.timestamp,
          imageUrl: post.imageUrl,
          likes: post.likes,
          comments: updatedComments,
        );
        notifyListeners();
      }
    }
  }

  void deleteComment(int postIndex, int commentIndex) {
    if (postIndex >= 0 && postIndex < _posts.length) {
      final post = _posts[postIndex];
      if (commentIndex >= 0 && commentIndex < post.comments.length) {
        final updatedComments = List<Comment>.from(post.comments)
          ..removeAt(commentIndex);

        _posts[postIndex] = Post(
          username: post.username,
          content: post.content,
          timestamp: post.timestamp,
          imageUrl: post.imageUrl,
          likes: post.likes,
          comments: updatedComments,
        );
        notifyListeners();
      }
    }
  }
}
