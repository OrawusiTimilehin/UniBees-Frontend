import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Typography, IconButton, TextField, 
  Avatar, Paper, styled, CircularProgress, Chip, Button,
  Menu, MenuItem, Badge, Snackbar, Alert
} from '@mui/material';
import { 
  Send as SendIcon, 
  NotificationsNone as NotificationsIcon, 
  ArrowBack as BackIcon, 
  FiberManualRecord as OnlineIcon, 
  Explore as ExploreIcon, 
  Groups as GroupsIcon, 
  ChatBubbleOutline as ChatIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';

/**
 * APOLLO CLIENT IMPORTS
 * Split imports are used here to resolve specific environment resolution issues.
 */
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import io from 'socket.io-client';

// --- GRAPHQL ---
const GET_CHAT_DATA = gql`
  query GetChatData($id: String!) {
    getSwarm(id: $id) {
      id
      name
      image
      members
      creatorId
    }
    getSwarmMessages(swarmId: $id) {
      id
      text
      senderId
      senderName
      timestamp
    }
    me {
      id
      name
      image
    }
  }
`;

// --- STYLED COMPONENTS ---
const MessageBubble = styled(Box)(({ isMe }) => ({
  maxWidth: '75%',
  padding: '12px 20px',
  borderRadius: isMe ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
  backgroundColor: isMe ? '#FFC845' : '#FFFFFF',
  border: isMe ? 'none' : '1px solid rgba(0,0,0,0.1)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  marginBottom: '4px',
}));

const SwarmChats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '' });

  // Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, loading, error } = useQuery(GET_CHAT_DATA, { 
    variables: { id },
    fetchPolicy: 'network-only' 
  });

  useEffect(() => {
    if (data?.getSwarmMessages) setMessages(data.getSwarmMessages);
  }, [data]);

  // Handle Socket Connection and Identification
  useEffect(() => {
    // Wait for my user data before connecting to ensure identification works
    if (!data?.me?.id) return;

    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    // 1. Join the swarm room for group chat
    newSocket.emit('join_swarm', { swarm_id: id });

    // 2. Identify so this page can also receive notifications
    newSocket.emit('identify_bee', { user_id: data.me.id });
    
    newSocket.on('receive_message', (msg) => {
      setMessages(prev => {
        const isDuplicate = prev.some(m => (m.timestamp === msg.timestamp && m.text === msg.text));
        if (isDuplicate) return prev;
        return [...prev, { ...msg, senderId: msg.sender_id, senderName: msg.sender_name }];
      });
    });

    return () => newSocket.close();
  }, [id, data?.me?.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleNameClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleAddFriend = () => {
    if (!socket || !data?.me || !selectedUser) return;

    // This payload must match the snake_case keys used in your main.py @sio.event
    socket.emit('send_friend_request', {
      to_user_id: selectedUser.id,
      from_user_id: data.me.id,
      from_name: data.me.name
    });

    setToast({ open: true, message: `Friend request buzzed to ${selectedUser.name}!` });
    setAnchorEl(null);
  };

  const handleSend = () => {
    if (!inputText.trim() || !socket || !data?.me) return;
    const payload = {
      swarm_id: id,
      text: inputText,
      sender_id: data.me.id,
      sender_name: data.me.name,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, { ...payload, senderId: data.me.id, senderName: data.me.name }]);
    socket.emit('send_message', payload);
    setInputText('');
  };

  if (loading && !data) return <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: '#FFC845' }} /></Box>;

  const swarm = data?.getSwarm;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FDFDFD' }}>
      <Box sx={{ p: 2, bgcolor: '#FFF', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/explore')} size="small"><BackIcon /></IconButton>
        <Avatar src={swarm?.image} sx={{ width: 45, height: 45, border: '2px solid #FFC845' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={900}>{swarm?.name}</Typography>
          <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 800 }}>● {swarm?.members?.length || 1} Online</Typography>
        </Box>
      </Box>

      <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Container maxWidth="md">
          {messages.map((m, idx) => {
            const sId = m.senderId || m.sender_id;
            const isMe = sId === data?.me?.id;
            return (
              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', mb: 2.5 }}>
                {!isMe && (
                  <Typography 
                    variant="caption" fontWeight={900} 
                    sx={{ mb: 0.5, ml: 1, cursor: 'pointer', '&:hover': { color: '#FFC845' } }}
                    onClick={(e) => handleNameClick(e, { id: sId, name: m.senderName || m.sender_name })}
                  >
                    {m.senderName || m.sender_name}
                  </Typography>
                )}
                <MessageBubble isMe={isMe}>
                  <Typography variant="body2">{m.text}</Typography>
                </MessageBubble>
                <Typography variant="caption" sx={{ opacity: 0.4, fontSize: 9 }}>
                   {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            );
          })}
        </Container>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleAddFriend} sx={{ fontWeight: 800, gap: 1.5 }}><PersonAddIcon sx={{ color: '#FFC845' }} /> Add Friend</MenuItem>
        <MenuItem onClick={() => navigate(`/profile/${selectedUser?.id}`)} sx={{ fontWeight: 700 }}>View Profile</MenuItem>
      </Menu>

      <Box sx={{ p: 2, bgcolor: '#FFF', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Container maxWidth="md">
          <TextField 
            fullWidth placeholder="Buzz something..." 
            value={inputText} onChange={e => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            InputProps={{
              sx: { borderRadius: '30px', bgcolor: '#F5F5F5', px: 2, '& fieldset': { border: 'none' } },
              endAdornment: <IconButton onClick={handleSend} sx={{ color: '#FFC845' }}><SendIcon fontSize="small" /></IconButton>
            }}
          />
        </Container>
      </Box>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}><Alert severity="success">{toast.message}</Alert></Snackbar>
    </Box>
  );
};

export default SwarmChats;