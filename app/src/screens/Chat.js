import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  IconButton, 
  Typography,
  CircularProgress,
  Paper,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Send as SendIcon, 
  Image as ImageIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { auth, db, storage } from '../config/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { styled } from '@mui/material/styles';
import { sendMessageToGemini } from '../api/gemini';

// Styled components
const ChatContainer = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden'
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.paper,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.divider,
    borderRadius: '4px',
  },
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  position: 'relative',
  boxShadow: theme.shadows[1],
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));

const MessageContent = styled(Typography)(({ theme }) => ({
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  '& img': {
    maxWidth: '100%',
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1),
  }
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center'
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100px',
  height: '100px',
  marginTop: theme.spacing(1),
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
  }
}));

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = [];
      snapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(newMessages.reverse());
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !imageFile) || !user) return;

    setLoading(true);
    let imageUrl = null;

    try {
      if (imageFile) {
        setUploading(true);
        const storageRef = ref(storage, `chat_images/${user.uid}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
        setUploading(false);
      }

      // Add message to Firestore
      const messageRef = await addDoc(collection(db, 'users', user.uid, 'messages'), {
        text: newMessage,
        imageUrl,
        timestamp: serverTimestamp(),
        status: 'sending',
        userId: user.uid,
        userEmail: user.email,
        userPhotoURL: user.photoURL
      });

      // Get Gemini's response
      const reply = await sendMessageToGemini(newMessage, imageUrl, user.uid);

      // Add Gemini's response to Firestore
      await addDoc(collection(db, 'users', user.uid, 'messages'), {
        text: reply,
        timestamp: serverTimestamp(),
        status: 'sent',
        isAI: true,
        userId: 'gemini',
        userEmail: 'Gemini AI',
        userPhotoURL: 'https://www.gstatic.com/lamda/images/gemini_avatar.png'
      });

      // Update the original message status
      await updateDoc(doc(db, 'users', user.uid, 'messages', messageRef.id), {
        status: 'sent'
      });

      setNewMessage('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100%', py: 2 }}>
      <ChatContainer elevation={3}>
        <MessagesContainer>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.isAI ? 'flex-start' : 'flex-end',
                gap: 0.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {message.isAI && (
                  <Avatar
                    src={message.userPhotoURL}
                    alt={message.userEmail}
                    sx={{ width: 24, height: 24 }}
                  />
                )}
                <Typography variant="caption" color="text.secondary">
                  {message.userEmail}
                </Typography>
              </Box>
              <MessageBubble isUser={!message.isAI}>
                <MessageContent variant="body1">
                  {message.text}
                  {message.imageUrl && (
                    <img 
                      src={message.imageUrl} 
                      alt="Shared" 
                      style={{ maxWidth: '100%', borderRadius: theme.shape.borderRadius }}
                    />
                  )}
                </MessageContent>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {message.timestamp?.toDate().toLocaleTimeString()}
                </Typography>
              </MessageBubble>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <Tooltip title="Attach Image">
            <IconButton 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || uploading}
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={loading || uploading}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper
              }
            }}
          />
          <Tooltip title="Send Message">
            <span>
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                disabled={(!newMessage.trim() && !imageFile) || loading || uploading}
              >
                {loading || uploading ? <CircularProgress size={24} /> : <SendIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </InputContainer>

        {imagePreview && (
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <ImagePreview>
              <img src={imagePreview} alt="Preview" />
              <IconButton
                size="small"
                onClick={removeImage}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ImagePreview>
          </Box>
        )}
      </ChatContainer>
    </Container>
  );
};

export default Chat; 