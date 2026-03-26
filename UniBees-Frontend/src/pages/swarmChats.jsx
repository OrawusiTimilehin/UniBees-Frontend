import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Typography, IconButton, TextField, 
  Avatar, Paper, styled, CircularProgress, Chip, Button
} from '@mui/material';
import { 
  Send as SendIcon, 
  NotificationsNone as NotificationsIcon, 
  ArrowBack as BackIcon, 
  FiberManualRecord as OnlineIcon, 
  Explore as ExploreIcon, 
  Groups as GroupsIcon, 
  ChatBubbleOutline as ChatIcon 
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';

/**
 * APOLLO CLIENT IMPORTS
 * Split imports to help resolve environment-specific bundling issues 
 * while maintaining compatibility with your local Vite project.
 */
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import io from 'socket.io-client';

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

const FloatingNav = styled(Paper)({
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: '280px',
  padding: '8px 12px',
  borderRadius: '40px',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  zIndex: 1000,
});

const SwarmChats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const { data, loading, error } = useQuery(GET_CHAT_DATA, { 
    variables: { id },
    fetchPolicy: 'network-only' // Force fetch to ensure messages are always current when coming back
  });

  // Sync messages state when data is loaded/fetched
  useEffect(() => {
    if (data?.getSwarmMessages) {
      setMessages(data.getSwarmMessages);
    }
  }, [data]);

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    newSocket.emit('join_swarm', { swarm_id: id });
    
    newSocket.on('receive_message', (msg) => {
      setMessages(prev => {
        // Prevent duplicates from optimistic UI
        const isDuplicate = prev.some(m => 
          (m.timestamp === msg.timestamp && m.text === msg.text && (m.senderId === msg.sender_id || m.sender_id === msg.sender_id))
        );
        if (isDuplicate) return prev;
        return [...prev, msg];
      });
    });

    return () => newSocket.close();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !socket || !data?.me) return;

    const timestamp = new Date().toISOString();
    
    // We create a payload that works for both Python (snake_case) 
    // and our local React rendering (camelCase)
    const payload = {
      swarm_id: id,
      text: inputText,
      sender_id: data.me.id,
      sender_name: data.me.name,
      timestamp: timestamp,
      // Duplicates for frontend rendering consistency
      senderId: data.me.id,
      senderName: data.me.name,
      swarmId: id
    };

    // 1. Optimistic UI Update
    setMessages(prev => [...prev, payload]);

    // 2. Network: Send to backend
    socket.emit('send_message', payload);
    
    setInputText('');
  };

  if (loading && !data) return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: '#FFC845' }} />
    </Box>
  );

  if (error || (data && !data.getSwarm)) return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Typography variant="h6" fontWeight={800} color="error">Swarm Not Found</Typography>
      <Button variant="contained" onClick={() => navigate('/explore')} sx={{ mt: 2, bgcolor: '#FFC845', color: '#000' }}>Return to Explore</Button>
    </Box>
  );

  const swarm = data?.getSwarm;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FDFDFD', pb: 12 }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: '#FFF', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/explore')} size="small"><BackIcon /></IconButton>
        <Avatar src={swarm?.image || "/logo.png"} sx={{ width: 45, height: 45, border: '2px solid #FFC845' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1.2 }}>{swarm?.name}</Typography>
          <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 800 }}>● {swarm?.members?.length || 1} Scouts</Typography>
        </Box>
        <IconButton size="small"><NotificationsIcon /></IconButton>
      </Box>

      {/* Message Area */}
      <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Container maxWidth="md">
          {messages.length === 0 && !loading && (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary', fontStyle: 'italic' }}>
              The hive is quiet. Start the buzz!
            </Typography>
          )}
          {messages.map((m, idx) => {
            const sId = m.senderId || m.sender_id;
            const sName = m.senderName || m.sender_name;
            const isMe = sId === data?.me?.id;
            const isQueen = sId === swarm?.creatorId;
            
            return (
              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', mb: 2.5 }}>
                {!isMe && (
                  <Typography variant="caption" fontWeight={900} sx={{ mb: 0.5, ml: 1 }}>
                    {sName} {isQueen && <Chip label="Queen" size="small" sx={{ height: 16, fontSize: 9, bgcolor: '#FFFBEB', border: '1px solid #FFC845' }} />}
                  </Typography>
                )}
                <MessageBubble isMe={isMe}>
                  <Typography variant="body2" fontWeight={500}>{m.text}</Typography>
                </MessageBubble>
                <Typography variant="caption" sx={{ opacity: 0.4, fontSize: 9, mt: 0.2 }}>
                   {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            );
          })}
        </Container>
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, bgcolor: '#FFF', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Container maxWidth="md">
          <TextField 
            fullWidth placeholder="Buzz something..." 
            value={inputText} onChange={e => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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

      {/* Persistent Nav */}
      <FloatingNav elevation={0}>
        <IconButton component={Link} to="/explore" sx={{ color: 'rgba(0,0,0,0.4)' }}><ExploreIcon /></IconButton>
        <IconButton component={Link} to="/bees-match" sx={{ color: 'rgba(0,0,0,0.4)' }}><GroupsIcon /></IconButton>
        <IconButton component={Link} to="/chats" sx={{ color: 'rgba(0,0,0,0.4)' }}><ChatIcon /></IconButton>
      </FloatingNav>
    </Box>
  );
};

export default SwarmChats;