import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  InputBase,
  alpha,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetRooms,
  useGetMessages,
  useSearchMember,
  useSendMessage,
  useMarkAsRead,
  useGetSupportChat,
} from '../../../api/Chat/chatService';
import TokenService from '../../../api/token/tokenService';
import { toast } from 'react-toastify';
import moment from 'moment';

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5051";
const THEME_COLOR = '#2c8786';
const BG_COLOR = '#efeae2'; // Subtle chat background

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchMobile, setSearchMobile] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const currentUserId = TokenService.getMemberId();

  const { data: roomsResponse, isLoading: roomsLoading } = useGetRooms();
  const { data: messagesResponse, isLoading: messagesLoading } = useGetMessages(activeRoomId || "");
  const searchMemberMutation = useSearchMember();
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const supportChatMutation = useGetSupportChat();

  const rooms = roomsResponse?.data || [];
  const messages = messagesResponse?.data || [];

  const activeRoom = rooms.find((r: any) => r.roomId === activeRoomId);
  const filteredRooms = rooms.filter((r: any) => {
    const recipient = r.participantDetails.find((p: any) => p.memberId !== currentUserId) || r.participantDetails[0];
    return recipient?.name?.toLowerCase().includes(sidebarSearch.toLowerCase());
  });

  useEffect(() => {
    if (!currentUserId) return;
    
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join", currentUserId);
    });

    newSocket.on("receiveMessage", (message: any) => {
      if (message.roomId === activeRoomId) {
        queryClient.setQueryData(["chatMessages", activeRoomId], (oldData: any) => {
          if (!oldData) return { data: [message] };
          return { ...oldData, data: [...oldData.data, message] };
        });
        if (activeRoomId) markAsReadMutation.mutate(activeRoomId);
        setTimeout(scrollToBottom, 100);
      } else {
        queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId, activeRoomId, queryClient]);

  useEffect(() => {
    if (activeRoomId) {
      if (socket) {
        socket.emit("joinRoom", activeRoomId);
      }
      markAsReadMutation.mutate(activeRoomId);
      setTimeout(scrollToBottom, 300);
    }
  }, [activeRoomId, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRoomId) return;

    const payload = { roomId: activeRoomId, text: messageText };

    sendMessageMutation.mutate(payload, {
      onSuccess: () => {
        setMessageText("");
        queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to send message");
      }
    });
  };

  const handleSearch = () => {
    if (!searchMobile.trim()) {
      toast.error("Please enter a mobile number");
      return;
    }

    searchMemberMutation.mutate(searchMobile, {
      onSuccess: (res) => {
        setSearchModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
        setActiveRoomId(res.data.chatRoom.roomId);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "User not found");
      }
    });
  };

  const handleStartSupportChat = () => {
    supportChatMutation.mutate(undefined, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
        setActiveRoomId(res.data.roomId);
      },
      onError: () => {
        toast.error("Failed to start support chat");
      }
    });
  };

  const getRecipientDetails = (room: any) => {
    return room.participantDetails.find((p: any) => p.memberId !== currentUserId) || room.participantDetails[0];
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 75px)', width: '100%', mt: { xs: 8, md: '75px' }, bgcolor: '#fff', overflow: 'hidden' }}>
      {/* Sidebar - Rooms List */}
      <Box sx={{ 
        width: { xs: activeRoomId ? '0%' : '100%', md: '350px', lg: '400px' }, 
        borderRight: '1px solid #e0e0e0', 
        display: { xs: activeRoomId ? 'none' : 'flex', md: 'flex' }, 
        flexDirection: 'column', 
        bgcolor: '#ffffff',
        transition: 'all 0.3s ease'
      }}>
        {/* Sidebar Header */}
        <Box sx={{ p: 2, bgcolor: '#f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold" color="#333">Chats</Typography>
          <Box>
            <IconButton onClick={handleStartSupportChat} sx={{ color: '#54656f' }}>
              <SupportAgentIcon />
            </IconButton>
            <IconButton onClick={() => setSearchModalOpen(true)} sx={{ color: '#54656f' }}>
              <AddCommentIcon />
            </IconButton>
            <IconButton sx={{ color: '#54656f' }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Sidebar Search */}
        <Box sx={{ p: 1.5, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff' }}>
          <Box sx={{ 
            display: 'flex', alignItems: 'center', bgcolor: '#f0f2f5', borderRadius: '8px', p: '4px 12px' 
          }}>
            <SearchIcon sx={{ color: '#54656f', mr: 1, fontSize: 20 }} />
            <InputBase 
              placeholder="Search chats" 
              fullWidth 
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              sx={{ fontSize: '14px' }} 
            />
          </Box>
        </Box>

        {/* Room List */}
        <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: '4px' } }}>
          {roomsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={30} sx={{ color: THEME_COLOR }} />
            </Box>
          ) : filteredRooms.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: '#888' }}>
              <Typography variant="body2">No chats found.</Typography>
              <Button onClick={() => setSearchModalOpen(true)} sx={{ mt: 2, color: THEME_COLOR, textTransform: 'none' }}>Start a new conversation</Button>
            </Box>
          ) : (
            filteredRooms.map((room: any) => {
              const recipient = getRecipientDetails(room);
              const isActive = activeRoomId === room.roomId;
              return (
                <Box key={room.roomId}>
                  <ListItem
                    component="div"
                    onClick={() => setActiveRoomId(room.roomId)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: isActive ? '#f0f2f5' : 'transparent',
                      '&:hover': { bgcolor: '#f5f6f6' },
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    <ListItemAvatar>
                      <Badge badgeContent={room.unreadCount} color="success" sx={{ '& .MuiBadge-badge': { bgcolor: '#25d366', color: 'white' } }}>
                        <Avatar src={recipient.profileImage} sx={{ bgcolor: THEME_COLOR, width: 48, height: 48 }}>
                          {recipient.name ? recipient.name[0].toUpperCase() : 'U'}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography fontWeight={room.unreadCount > 0 ? 600 : 400} sx={{ color: '#111', fontSize: '16px' }} noWrap>
                            {recipient.name} {recipient.role === 'ADMIN' && '(Support)'}
                          </Typography>
                          {room.lastMessageTime && (
                            <Typography variant="caption" sx={{ color: room.unreadCount > 0 ? '#25d366' : '#667781', fontWeight: room.unreadCount > 0 ? 600 : 400 }}>
                              {moment(room.lastMessageTime).format("LT")}
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" noWrap sx={{ color: room.unreadCount > 0 ? '#111' : '#667781', fontWeight: room.unreadCount > 0 ? 600 : 400, mt: 0.5 }}>
                          {room.lastMessage || "No messages yet"}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider component="li" variant="inset" sx={{ ml: 9 }} />
                </Box>
              );
            })
          )}
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{ 
        flexGrow: 1, 
        display: { xs: activeRoomId ? 'flex' : 'none', md: 'flex' }, 
        flexDirection: 'column', 
        bgcolor: BG_COLOR,
        position: 'relative' 
      }}>
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <Box sx={{ 
              p: '10px 16px', 
              bgcolor: '#f0f2f5', 
              display: 'flex', 
              alignItems: 'center', 
              borderBottom: '1px solid #e0e0e0', 
              zIndex: 10,
            }}>
              <IconButton onClick={() => setActiveRoomId(null)} sx={{ display: { md: 'none' }, mr: 1, color: '#54656f' }}>
                <ArrowBackIcon />
              </IconButton>
              <Avatar src={getRecipientDetails(activeRoom).profileImage} sx={{ bgcolor: THEME_COLOR, width: 40, height: 40, mr: 2 }}>
                {getRecipientDetails(activeRoom).name ? getRecipientDetails(activeRoom).name[0].toUpperCase() : 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ lineHeight: 1.2, color: '#111', fontWeight: 500 }}>
                  {getRecipientDetails(activeRoom).name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {getRecipientDetails(activeRoom).role === 'ADMIN' ? 'Support Team' : 'Online'}
                </Typography>
              </Box>
              <IconButton sx={{ color: '#54656f' }}><SearchIcon /></IconButton>
              <IconButton sx={{ color: '#54656f' }}><MoreVertIcon /></IconButton>
            </Box>

            {/* Messages Area */}
            <Box sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1,
              // Background pattern (optional, standard whatsapp style)
              backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")',
              backgroundSize: 'contain',
              backgroundBlendMode: 'overlay',
              backgroundColor: alpha(BG_COLOR, 0.95),
              '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: '4px' }
            }}>
              {messagesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={30} sx={{ color: THEME_COLOR }} />
                </Box>
              ) : (
                messages.map((msg: any, index: number) => {
                  const isMe = msg.senderId === currentUserId;
                  const showTail = index === 0 || messages[index - 1].senderId !== msg.senderId;

                  return (
                    <Box key={index} sx={{ 
                      alignSelf: isMe ? 'flex-end' : 'flex-start', 
                      maxWidth: { xs: '85%', md: '65%' }, 
                      display: 'flex', 
                      flexDirection: 'column',
                      position: 'relative',
                      mt: showTail ? 1 : 0
                    }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: '6px 7px 8px 9px',
                          bgcolor: isMe ? '#d9fdd3' : '#ffffff',
                          color: '#111',
                          borderRadius: '7.5px',
                          borderTopLeftRadius: !isMe && showTail ? '0px' : '7.5px',
                          borderTopRightRadius: isMe && showTail ? '0px' : '7.5px',
                          wordBreak: 'break-word',
                          boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
                          display: 'flex',
                          flexDirection: 'column',
                          minWidth: '80px'
                        }}
                      >
                        <Typography variant="body1" sx={{ fontSize: '14.2px', lineHeight: '19px', pr: 4 }}>
                          {msg.text}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: '#667781', 
                          fontSize: '11px', 
                          position: 'absolute',
                          bottom: '4px',
                          right: '12px'
                        }}>
                          {moment(msg.createdAt).format("LT")}
                        </Typography>
                      </Paper>
                    </Box>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box component="form" onSubmit={handleSendMessage} sx={{ 
              p: '10px 16px', 
              bgcolor: '#f0f2f5', 
              display: 'flex', 
              gap: 1.5, 
              alignItems: 'center' 
            }}>
              <Box sx={{ flexGrow: 1, bgcolor: '#ffffff', borderRadius: '8px', px: 2, py: 0.5 }}>
                <InputBase
                  fullWidth
                  placeholder="Type a message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  sx={{ py: 1, fontSize: '15px' }}
                />
              </Box>
              <IconButton 
                type="submit" 
                disabled={!messageText.trim() || sendMessageMutation.isPending} 
                sx={{ 
                  bgcolor: messageText.trim() ? THEME_COLOR : 'transparent', 
                  color: messageText.trim() ? 'white' : '#54656f',
                  '&:hover': { bgcolor: messageText.trim() ? '#236d6c' : 'rgba(0,0,0,0.05)' }, 
                  transition: 'background-color 0.2s',
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f2f5' }}>
            <Box sx={{ bgcolor: 'white', p: 4, borderRadius: '50%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 3 }}>
              <ChatPlaceholder />
            </Box>
            <Typography variant="h5" sx={{ color: '#41525d', fontWeight: 300, mb: 1 }}>JeevaHerbs Web Chat</Typography>
            <Typography variant="body1" sx={{ color: '#667781', maxWidth: '400px', textAlign: 'center' }}>
              Send and receive messages privately. Connect with your network and support team instantly.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Search Modal */}
      <Dialog open={searchModalOpen} onClose={() => setSearchModalOpen(false)} PaperProps={{ sx: { borderRadius: 3, width: '100%', maxWidth: '400px', p: 1 } }}>
        <DialogTitle sx={{ color: '#111', fontWeight: 600 }}>New Chat</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Enter a member's mobile number to start a conversation.
          </Typography>
          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: THEME_COLOR },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: THEME_COLOR },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setSearchModalOpen(false)} sx={{ color: '#54656f', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button
            onClick={handleSearch}
            variant="contained"
            disableElevation
            disabled={searchMemberMutation.isPending || !searchMobile}
            sx={{ bgcolor: THEME_COLOR, '&:hover': { bgcolor: '#236d6c' }, textTransform: 'none', borderRadius: '20px', px: 3 }}
          >
            {searchMemberMutation.isPending ? "Searching..." : "Start Chat"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ChatPlaceholder() {
  return (
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={THEME_COLOR} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
