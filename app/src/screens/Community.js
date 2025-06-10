import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider,
  List
} from '@mui/material';
import {
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const Post = ({ post, onLike, onComment, onEdit, onDelete, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = {
        text: newComment,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhoto: currentUser.photoURL,
        timestamp: serverTimestamp()
      };

      await updateDoc(doc(db, 'community', post.id), {
        comments: [...(post.comments || []), comment]
      });

      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={post.image || '/images/farm1.jpg'}
        alt={post.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={post.userPhoto} alt={post.userName}>
              {post.userName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">
                {post.userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.timestamp?.toDate()).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          {currentUser.uid === post.userId && (
            <Box>
              <IconButton size="small" onClick={() => onEdit(post)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(post.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>

        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {post.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button
            startIcon={<ThumbUpIcon />}
            onClick={() => onLike(post.id)}
            color={post.likes?.includes(currentUser.uid) ? 'primary' : 'inherit'}
          >
            {post.likes?.length || 0} Likes
          </Button>
          <Button
            startIcon={<CommentIcon />}
            onClick={() => setShowComments(!showComments)}
          >
            {post.comments?.length || 0} Comments
          </Button>
          <Button
            startIcon={<ShareIcon />}
            onClick={() => navigator.share({ title: post.title, text: post.content })}
          >
            Share
          </Button>
        </Box>

        {showComments && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Comments
            </Typography>
            <List>
              {post.comments?.map((comment, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar src={comment.userPhoto} alt={comment.userName} sx={{ width: 24, height: 24 }}>
                      {comment.userName?.[0]}
                    </Avatar>
                    <Typography variant="subtitle2">
                      {comment.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.timestamp?.toDate()).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {comment.text}
                  </Typography>
                </Box>
              ))}
            </List>
            <Box component="form" onSubmit={handleAddComment} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      type="submit"
                      disabled={!newComment.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  )
                }}
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const PostDialog = ({ open, onClose, post, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    tags: ''
  });

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        tags: post.tags?.join(', ') || ''
      });
    } else {
      setFormData({
        title: '',
        content: '',
        image: '',
        tags: ''
      });
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{post ? 'Edit Post' : 'New Post'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            required
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="content"
            label="Content"
            multiline
            rows={4}
            fullWidth
            required
            value={formData.content}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="text"
            fullWidth
            value={formData.image}
            onChange={handleChange}
            helperText="Leave empty to use default image"
          />
          <TextField
            margin="dense"
            name="tags"
            label="Tags"
            type="text"
            fullWidth
            value={formData.tags}
            onChange={handleChange}
            helperText="Separate tags with commas"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {post ? 'Update' : 'Post'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsRef = collection(db, 'community');
      const q = query(postsRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const postsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsList);
    } catch (error) {
      setError('Failed to load posts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    setSelectedPost(null);
    setDialogOpen(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'community', postId));
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        setError('Failed to delete post: ' + error.message);
      }
    }
  };

  const handleSavePost = async (postData) => {
    try {
      if (selectedPost) {
        // Update existing post
        await updateDoc(doc(db, 'community', selectedPost.id), {
          ...postData,
          timestamp: serverTimestamp()
        });
        setPosts(posts.map(post => 
          post.id === selectedPost.id ? { ...post, ...postData } : post
        ));
      } else {
        // Add new post
        const docRef = await addDoc(collection(db, 'community'), {
          ...postData,
          userId: user.uid,
          userName: user.displayName || 'Anonymous',
          userPhoto: user.photoURL,
          likes: [],
          comments: [],
          timestamp: serverTimestamp()
        });
        setPosts([{ id: docRef.id, ...postData }, ...posts]);
      }
      setDialogOpen(false);
    } catch (error) {
      setError('Failed to save post: ' + error.message);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      const likes = post.likes || [];
      const newLikes = likes.includes(user.uid)
        ? likes.filter(id => id !== user.uid)
        : [...likes, user.uid];

      await updateDoc(doc(db, 'community', postId), {
        likes: newLikes
      });

      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: newLikes } : post
      ));
    } catch (error) {
      setError('Failed to update like: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Community
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPost}
        >
          New Post
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {posts.map(post => (
          <Grid item xs={12} key={post.id}>
            <Post
              post={post}
              onLike={handleLikePost}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              currentUser={user}
            />
          </Grid>
        ))}
      </Grid>

      {posts.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No posts yet. Be the first to share your farming experience!
        </Alert>
      )}

      <PostDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        post={selectedPost}
        onSave={handleSavePost}
      />
    </Box>
  );
};

export default Community; 