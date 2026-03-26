import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Typography, IconButton, TextField, 
  Avatar, Paper, styled, CircularProgress, Chip, Button,
  Menu, MenuItem, Snackbar, Alert
} from '@mui/material';
import { 
  Send as SendIcon, 
  ArrowBack as BackIcon, 
  FiberManualRecord as OnlineIcon, 
  PersonAdd as PersonAddIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * APOLLO CLIENT IMPORTS
 */
import { gql} from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import io from 'socket.io-client';

// --- GRAPHQL ---
// FIX: Using getSwarmMessages (camelCase) to match Strawberry's auto-conversion
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
  transition: 'transform 0.2s ease',
}));

const SwarmChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  // State for Chat & Sockets
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '' });

  const { data, loading, error } = useQuery(GET_CHAT_DATA, { 
    variables: { id },
    fetchPolicy: 'network-only' // Ensures we get fresh history from the DB every time
  });

  // --- PERSISTENCE FIX: Sync messages state whenever data arrives ---
  useEffect(() => {
    if (data?.getSwarmMessages) {
      // Map history to the local state
      setMessages(data.getSwarmMessages);
    }
  }, [data]);

  // Real-time Socket Connection
  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    // Join the specific room for this swarm
    newSocket.emit('join_swarm', { swarm_id: id });
    
    // Identify this bee for private notifications
    if (data?.me?.id) {
      newSocket.emit('identify_bee', { user_id: data.me.id });
    }

    newSocket.on('receive_message', (msg) => {
      setMessages(prev => {
        // Robust duplicate check to prevent double-messages from Optimistic UI
        const exists = prev.some(m => 
          (m.id && m.id === msg.id) || 
          (m.timestamp === msg.timestamp && m.text === msg.text)
        );
        if (exists) return prev;
        
        // Format socket message (usually snake_case from server) to match camelCase UI
        const formattedMsg = {
          ...msg,
          senderId: msg.sender_id || msg.senderId,
          senderName: msg.sender_name || msg.senderName
        };
        return [...prev, formattedMsg];
      });
    });

    return () => newSocket.close();
  }, [id, data?.me?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- HANDLERS ---

  const handleNameClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleAddFriend = () => {
    if (socket && data?.me && selectedUser) {
      socket.emit('send_friend_request', {
        to_user_id: selectedUser.id,
        from_user_id: data.me.id,
        from_name: data.me.name
      });
      setToast({ open: true, message: `Friend request sent to ${selectedUser.name}!` });
    }
    setAnchorEl(null);
  };

  const handleSend = () => {
    if (!inputText.trim() || !socket || !data?.me) return;
    
    const timestamp = new Date().toISOString();
    const payload = {
      swarm_id: id,
      text: inputText,
      sender_id: data.me.id,
      sender_name: data.me.name,
      timestamp: timestamp
    };

    // Optimistic UI Update: Show it immediately
    setMessages(prev => [...prev, { 
      ...payload, 
      senderId: data.me.id, 
      senderName: data.me.name 
    }]);

    socket.emit('send_message', payload);
    setInputText('');
  };

  if (loading && !data) return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: '#FFC845' }} />
    </Box>
  );

  if (error || (data && !data.getSwarm)) return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={900} color="error" gutterBottom>Swarm Not Found</Typography>
      <Typography color="text.secondary" mb={3}>The ID <b>{id}</b> did not match any active swarms.</Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/explore')}
        sx={{ bgcolor: '#FFC845', color: '#000', fontWeight: 800, borderRadius: 2 }}
      >
        Return to Explore
      </Button>
    </Container>
  );

  const swarm = data.getSwarm;

  return (
    <Box sx={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', bgcolor: '#FDFDFD' }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: '#FFF', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/explore')} size="small"><BackIcon /></IconButton>
        <Avatar src={swarm.image} sx={{ width: 45, height: 45, border: '2px solid #FFC845' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={900}>{swarm.name}</Typography>
          <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 800 }}>● {swarm.members?.length || 1} Scouts Online</Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Container maxWidth="md">
          {messages.map((m, idx) => {
            const sId = m.senderId || m.sender_id;
            const isMe = sId === data.me?.id;
            const isQueen = sId === swarm.creatorId;
            
            return (
              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', mb: 3 }}>
                {!isMe && (
                  <Typography 
                    variant="caption" 
                    fontWeight={900} 
                    sx={{ mb: 0.5, ml: 1, cursor: 'pointer', '&:hover': { color: '#FFC845' } }}
                    onClick={(e) => handleNameClick(e, { id: sId, name: m.senderName || m.sender_name })}
                  >
                    {m.senderName || m.sender_name} {isQueen && <Chip label="Queen" size="small" sx={{ height: 16, fontSize: 9, bgcolor: '#FFFBEB', border: '1px solid #FFC845' }} />}
                  </Typography>
                )}
                <MessageBubble isMe={isMe}>
                  <Typography variant="body2" fontWeight={500}>{m.text}</Typography>
                </MessageBubble>
                <Typography variant="caption" sx={{ opacity: 0.4, fontSize: 9 }}>
                   {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            );
          })}
        </Container>
      </Box>

      {/* Social Interaction Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleAddFriend} sx={{ fontWeight: 800, gap: 1 }}>
          <PersonAddIcon fontSize="small" sx={{ color: '#FFC845' }} /> Add Friend
        </MenuItem>
        <MenuItem onClick={() => navigate(`/profile/${selectedUser?.id}`)} sx={{ fontWeight: 600 }}>
          View Profile
        </MenuItem>
      </Menu>

      {/* Message Input */}
      <Box sx={{ p: 2, bgcolor: '#FFF', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Container maxWidth="md">
          <TextField 
            fullWidth placeholder="Buzz something..." 
            value={inputText} onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            InputProps={{
              sx: { borderRadius: '30px', bgcolor: '#F5F5F5', px: 2, '& fieldset': { border: 'none' } },
              endAdornment: (
                <IconButton onClick={handleSend} disabled={!inputText.trim()} sx={{ color: inputText.trim() ? '#FFC845' : 'grey.300' }}>
                  <SendIcon fontSize="small" />
                </IconButton>
              )
            }}
          />
        </Container>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 700 }}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SwarmChat;