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
  Menu,
  MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyIcon from '@mui/icons-material/Reply';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '../../../context/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetRooms,
  useGetMessages,
  useSearchMember,
  useSendMessage,
  useMarkAsRead,
  useGetSupportChat,
  useDeleteMessage,
  useImageKitUpload
} from '../../../api/Chat/chatService';
import TokenService from '../../../api/token/tokenService';
import { toast } from 'react-toastify';
import moment from 'moment';

import { useLocation } from 'react-router-dom';

const THEME_COLOR = '#2c8786';
const BG_COLOR = '#efeae2'; // Subtle chat background

export default function Chat() {
  const { socket } = useSocket();
  const location = useLocation();
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.activeRoomId) {
      setActiveRoomId(location.state.activeRoomId);
      // Clear the state so it doesn't get stuck on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchMobile, setSearchMobile] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [replyingTo, setReplyingTo] = useState<any>(null);
  
  // Message Menu State
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const currentUserId = TokenService.getMemberId();

  const { data: roomsResponse, isLoading: roomsLoading } = useGetRooms();
  const { data: messagesResponse, isLoading: messagesLoading } = useGetMessages(activeRoomId || "");
  const searchMemberMutation = useSearchMember();
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const supportChatMutation = useGetSupportChat();
  const deleteMessageMutation = useDeleteMessage();
  const uploadMutation = useImageKitUpload();

  const rooms = roomsResponse?.data || [];
  const messages = messagesResponse?.data || [];

  const activeRoom = rooms.find((r: any) => r.roomId === activeRoomId);
  const filteredRooms = rooms.filter((r: any) => {
    const recipient = r.participantDetails.find((p: any) => p.memberId !== currentUserId) || r.participantDetails[0];
    return recipient?.name?.toLowerCase().includes(sidebarSearch.toLowerCase());
  });

  useEffect(() => {
    if (!currentUserId || !socket) return;
    
    const handleReceiveMessage = (message: any) => {
      const isGlobalForAdminRoom = message.roomId === "GLOBAL_BROADCAST" && activeRoomId?.includes("ADMIN_");
      if (message.roomId === activeRoomId || isGlobalForAdminRoom) {
        queryClient.setQueryData(["chatMessages", activeRoomId], (oldData: any) => {
          if (!oldData) return { data: [message] };
          return { ...oldData, data: [...oldData.data, message] };
        });
        if (activeRoomId) markAsReadMutation.mutate(activeRoomId);
        setTimeout(scrollToBottom, 100);
      } else {
        queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      }
    };

    const handleMessageDeleted = ({ messageId, roomId }: any) => {
      if (roomId === activeRoomId) {
        queryClient.setQueryData(["chatMessages", roomId], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((msg: any) => msg._id !== messageId),
          };
        });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [currentUserId, activeRoomId, queryClient, socket]);

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
    if (!messageText.trim() && !fileInputRef.current?.files?.length) return;
    if (!activeRoomId) return;

    // Optional: prepend reply quote if replying
    let finalMessage = messageText;
    if (replyingTo && messageText.trim()) {
      finalMessage = `> Replied to ${replyingTo.senderName || 'user'}:\n> ${replyingTo.text || 'file'}\n\n${messageText}`;
    }

    const payload = { roomId: activeRoomId, text: finalMessage };

    sendMessageMutation.mutate(payload, {
      onSuccess: () => {
        setMessageText("");
        setShowEmojiPicker(false);
        setReplyingTo(null);
        queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to send message");
      }
    });
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessageText(prev => prev + emojiObject.emoji);
  };

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>, msg: any) => {
    setMenuAnchorEl(e.currentTarget);
    setSelectedMessage(msg);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleCopyMessage = () => {
    if (selectedMessage?.text) {
      navigator.clipboard.writeText(selectedMessage.text);
      toast.success("Copied to clipboard");
    }
    handleCloseMenu();
  };

  const handleReplyMessage = () => {
    setReplyingTo(selectedMessage);
    handleCloseMenu();
  };

  const handleDeleteMessage = () => {
    if (!selectedMessage?._id) return;
    deleteMessageMutation.mutate(selectedMessage._id, {
      onSuccess: () => {
        handleCloseMenu();
      },
      onError: () => {
        toast.error("Failed to delete message");
        handleCloseMenu();
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRoomId) return;
    
    // Check if it's image or generic file
    const isImage = file.type.startsWith('image/');
    const messageType = isImage ? 'image' : 'file';

    const uploadToast = toast.loading("Uploading...");
    
    uploadMutation.mutate(file, {
      onSuccess: (data: any) => {
        toast.dismiss(uploadToast);
        
        // Send message with file URL
        const payload = { 
          roomId: activeRoomId, 
          imageUrl: data.url, 
          messageType,
          fileName: data.name,
          fileSize: data.size
        };

        sendMessageMutation.mutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to send message");
          }
        });
      },
      onError: () => {
        toast.dismiss(uploadToast);
        toast.error("File upload failed");
      }
    });
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, { type: 'audio/webm' });
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        // Upload the audio file
        const uploadToast = toast.loading("Uploading voice message...");
        uploadMutation.mutate(audioFile, {
          onSuccess: (data: any) => {
            toast.dismiss(uploadToast);
            
            const payload = { 
              roomId: activeRoomId as string, 
              imageUrl: data.url, 
              messageType: 'audio',
              fileName: 'Voice Message',
              fileSize: data.size
            };

            sendMessageMutation.mutate(payload, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
              },
              onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Failed to send voice message");
              }
            });
          },
          onError: () => {
            toast.dismiss(uploadToast);
            toast.error("Failed to upload voice message");
          }
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Microphone access denied or not available");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
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
                            {recipient.name}
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
                  {getRecipientDetails(activeRoom).role === 'ADMIN' ? 'Admin Team' : 'Online'}
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
                          p: '8px 12px',
                          bgcolor: isMe ? '#d9fdd3' : '#ffffff',
                          color: '#111',
                          borderRadius: '8px',
                          borderTopLeftRadius: !isMe && showTail ? '0px' : '8px',
                          borderTopRightRadius: isMe && showTail ? '0px' : '8px',
                          wordBreak: 'break-word',
                          boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          minWidth: '100px',
                          maxWidth: '100%',
                          '&:hover .msg-dropdown': {
                            opacity: 1,
                            pointerEvents: 'auto',
                          }
                        }}
                      >
                      {isMe ? (
                        <Box sx={{ position: 'absolute', top: 0, right: -8, width: 0, height: 0, borderTop: '10px solid #dcf8c6', borderRight: '10px solid transparent' }} />
                      ) : (
                        <Box sx={{ position: 'absolute', top: 0, left: -8, width: 0, height: 0, borderTop: '10px solid #fff', borderLeft: '10px solid transparent' }} />
                      )}
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {msg.messageType === 'image' && msg.imageUrl && (
                            <Box sx={{ mb: 1 }}>
                              <img src={msg.imageUrl} alt="attachment" style={{ maxWidth: '100%', borderRadius: '6px' }} />
                            </Box>
                          )}
                          {msg.messageType === 'file' && msg.imageUrl && (
                            <Box sx={{ mb: 1, p: 1, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                              <AttachFileIcon fontSize="small" sx={{ mr: 1, color: '#54656f' }} />
                              <Typography variant="body2" component="a" href={msg.imageUrl} target="_blank" rel="noopener noreferrer" sx={{ color: THEME_COLOR, textDecoration: 'none' }}>
                                {msg.fileName || "Download File"}
                              </Typography>
                            </Box>
                          )}
                          {msg.messageType === 'audio' && msg.imageUrl && (
                            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                              <audio controls src={msg.imageUrl} style={{ height: '40px', outline: 'none' }} />
                            </Box>
                          )}
                          {msg.text && (
                            <Typography variant="body1" sx={{ fontSize: '14.2px', lineHeight: '19px', whiteSpace: 'pre-wrap', pb: '12px', pr: '20px' }}>
                              {msg.text}
                            </Typography>
                          )}
                        </Box>

                        <IconButton 
                          className="msg-dropdown"
                          size="small" 
                          onClick={(e) => handleOpenMenu(e, msg)}
                          sx={{ 
                            position: 'absolute', 
                            top: 4, 
                            right: 4, 
                            opacity: 0,
                            pointerEvents: 'none',
                            bgcolor: isMe ? 'rgba(217, 253, 211, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(2px)',
                            '&:hover': { bgcolor: isMe ? 'rgba(217, 253, 211, 1)' : 'rgba(255, 255, 255, 1)', color: '#111' },
                            transition: 'opacity 0.2s',
                            zIndex: 10
                          }}
                        >
                          <ExpandMoreIcon fontSize="small" sx={{ color: '#54656f' }} />
                        </IconButton>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '-10px' }}>
                          <Typography variant="caption" sx={{ color: '#667781', fontSize: '11px', lineHeight: '15px' }}>
                            {moment(msg.createdAt).format("LT")}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Options Menu */}
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleCloseMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ sx: { boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '8px', minWidth: '150px' } }}
            >
              {!activeRoomId?.includes('ADMIN_') && (
                <MenuItem onClick={handleReplyMessage}>
                  <ReplyIcon fontSize="small" sx={{ mr: 1.5, color: '#54656f' }} />
                  <Typography variant="body2">Reply</Typography>
                </MenuItem>
              )}
              {selectedMessage?.text && (
                <MenuItem onClick={handleCopyMessage}>
                  <ContentCopyIcon fontSize="small" sx={{ mr: 1.5, color: '#54656f' }} />
                  <Typography variant="body2">Copy</Typography>
                </MenuItem>
              )}
              <MenuItem onClick={handleDeleteMessage}>
                <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: '#d32f2f' }} />
                <Typography variant="body2" sx={{ color: '#d32f2f' }}>Delete</Typography>
              </MenuItem>
            </Menu>

            {/* Input Area */}
            {replyingTo && (
              <Box sx={{ p: '10px 16px', bgcolor: '#f0f2f5', borderLeft: `4px solid ${THEME_COLOR}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: THEME_COLOR, fontWeight: 600 }}>Replying to {replyingTo.senderName || 'User'}</Typography>
                  <Typography variant="body2" sx={{ color: '#667781', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                    {replyingTo.text || 'Attachment'}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setReplyingTo(null)} sx={{ color: '#54656f' }}>
                  <DeleteIcon fontSize="small" /> {/* Using delete icon temporarily or 'close' icon if imported. I'll use a text X or close just by importing CloseIcon. Wait, I'll just use ArrowBackIcon or let it be. Let's just use DeleteIcon for canceling the reply since it is imported, but wait, a close icon is better. I can use material UI close icon if available. I will just render "X" in a span */}
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✕</span>
                </IconButton>
              </Box>
            )}
            {showEmojiPicker && (
              <Paper 
                elevation={3} 
                sx={{ 
                  position: 'absolute', 
                  bottom: '70px', 
                  left: '16px', 
                  zIndex: 100, 
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', bgcolor: '#f0f2f5', p: 0.5 }}>
                  <IconButton size="small" onClick={() => setShowEmojiPicker(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={400} />
              </Paper>
            )}
            {!activeRoomId?.includes('ADMIN_') ? (
              <Box component="form" onSubmit={handleSendMessage} sx={{ 
                p: '10px 16px', 
                bgcolor: '#f0f2f5', 
                display: 'flex', 
                gap: 1.5, 
                alignItems: 'center' 
              }}>
              <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} sx={{ color: '#54656f' }}>
                <InsertEmoticonIcon />
              </IconButton>
              
              <IconButton onClick={() => fileInputRef.current?.click()} sx={{ color: '#54656f' }}>
                <AttachFileIcon />
              </IconButton>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileUpload} 
                accept="image/*,.pdf,.doc,.docx"
              />

              <Box sx={{ flexGrow: 1, bgcolor: '#ffffff', borderRadius: '8px', px: 2, py: 0.5, display: 'flex', alignItems: 'center' }}>
                {isRecording ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', py: 1 }}>
                    <GraphicEqIcon sx={{ color: '#d32f2f', animation: 'pulse 1s infinite alternate', mr: 2 }} />
                    <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 600 }}>Recording...</Typography>
                    <style>{`
                      @keyframes pulse {
                        0% { opacity: 1; transform: scale(1); }
                        100% { opacity: 0.5; transform: scale(1.1); }
                      }
                    `}</style>
                  </Box>
                ) : (
                  <InputBase
                    fullWidth
                    placeholder="Type a message"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    sx={{ py: 1, fontSize: '15px' }}
                  />
                )}
              </Box>

              {messageText.trim() ? (
                <IconButton 
                  type="submit" 
                  disabled={sendMessageMutation.isPending} 
                  sx={{ 
                    bgcolor: THEME_COLOR, 
                    color: 'white',
                    '&:hover': { bgcolor: '#236d6c' }, 
                    transition: 'background-color 0.2s',
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              ) : (
                <IconButton 
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={sendMessageMutation.isPending}
                  sx={{ 
                    bgcolor: isRecording ? '#d32f2f' : THEME_COLOR, 
                    color: 'white',
                    '&:hover': { bgcolor: isRecording ? '#b71c1c' : '#236d6c' }, 
                    transition: 'background-color 0.2s',
                  }}
                >
                  {isRecording ? <StopIcon fontSize="small" /> : <MicIcon fontSize="small" />}
                </IconButton>
                )}
              </Box>
            ) : (
              <Box sx={{ p: '15px 16px', bgcolor: '#f0f2f5', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#54656f' }}>
                  This is a read-only broadcast channel. Only Admins can send messages here.
                </Typography>
              </Box>
            )}
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
