import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  List,
  ListItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GroupIcon from '@mui/icons-material/Group';
import api from '../../../api/Api';
import { toast } from 'react-toastify';
import moment from 'moment';

const THEME_COLOR = '#2c8786';
const BG_COLOR = '#efeae2';

export default function ChatAllUsers() {
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentMessages, setSentMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sentMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setLoading(true);
    try {
      await api.post('/admin/broadcast-chat', { message: messageText });
      
      const newMsg = {
        _id: Date.now().toString(),
        text: messageText,
        createdAt: new Date().toISOString(),
        senderName: 'Admin',
      };
      
      setSentMessages(prev => [...prev, newMsg]);
      setMessageText("");
      toast.success("Broadcast message sent successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', mt: { xs: 8, md: 8 } }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: THEME_COLOR, display: 'flex', alignItems: 'center', gap: 1 }}>
        <GroupIcon /> Broadcast Chat
      </Typography>

      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          borderRadius: 3,
          bgcolor: '#fff'
        }}
      >
        {/* Chat Header */}
        <Box sx={{ 
          p: 2, 
          bgcolor: THEME_COLOR, 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2 
        }}>
          <Avatar sx={{ bgcolor: 'white', color: THEME_COLOR }}>
            <GroupIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              All Users
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Broadcast to everyone
            </Typography>
          </Box>
        </Box>

        {/* Chat Messages Area */}
        <Box sx={{ 
          flex: 1, 
          bgcolor: BG_COLOR, 
          overflowY: 'auto', 
          p: 2,
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
        }}>
          {sentMessages.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', opacity: 0.5, flexDirection: 'column' }}>
              <GroupIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography>Messages you send here will be broadcasted to all users.</Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {sentMessages.map((msg) => (
                <ListItem 
                  key={msg._id} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    mb: 2, 
                    px: 0 
                  }}
                >
                  <Box sx={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: '#d9fdd3', 
                        borderRadius: '16px 0 16px 16px',
                        position: 'relative',
                        wordBreak: 'break-word'
                      }}
                    >
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {msg.text}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: '#667781', fontSize: '0.7rem' }}>
                        {moment(msg.createdAt).format('LT')}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        {/* Message Input Area */}
        <Box sx={{ p: 2, bgcolor: '#f0f2f5', display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a broadcast message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{ 
              bgcolor: 'white', 
              borderRadius: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                '& fieldset': { border: 'none' },
              }
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={loading || !messageText.trim()}
            sx={{ bgcolor: THEME_COLOR, color: 'white', '&:hover': { bgcolor: '#206362' }, p: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
