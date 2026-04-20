import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Typography, IconButton, TextField, 
  Avatar, Paper, styled, CircularProgress, Chip, Stack
} from '@mui/material';
import { 
  Send as SendIcon, 
  ArrowBack as BackIcon,
  MoreVert as MoreIcon,
  FiberManualRecord as OnlineIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * APOLLO CLIENT & SOCKET.IO
 * Consolidated imports into the main '@apollo/client' package to resolve 
 * compilation issues in the current build environment.
 */
import {useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import io from 'socket.io-client';

// --- GRAPHQL ---
const GET_PRIVATE_CHAT_DATA = gql`
  query GetPrivateChatData($otherUserId: String!) {
    getUser(id: $otherUserId) {
      id
      name
      image
      rank
      major
    }
    getPrivateMessages(otherUserId: $otherUserId) {
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
const ChatHeader = styled(Paper)({
  padding: '16px 24px',
  backgroundColor: '#FFF',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 0,
  zIndex: 10,
});

const MessageBubble = styled(Box)(({ isMe }) => ({
  maxWidth: '75%',
  padding: '12px 18px',
  borderRadius: isMe ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
  backgroundColor: isMe ? '#FFC845' : '#FFFFFF',
  color: isMe ? '#000' : 'inherit',
  border: isMe ? 'none' : '1px solid rgba(0,0,0,0.1)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  marginBottom: '4px',
}));

const PrivateChat = () => {
  const { userId } = useParams(); // The ID of the friend you're chatting with (e.g., Ryan)
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const { data, loading } = useQuery(GET_PRIVATE_CHAT_DATA, { 
    variables: { otherUserId: userId },
    fetchPolicy: 'network-only'
  });

  // Sync initial history from DB
  useEffect(() => {
    if (data?.getPrivateMessages) {
      setMessages(data.getPrivateMessages);
    }
  }, [data]);

  // Handle Real-time via Socket.io
  useEffect(() => {
    if (!data?.me?.id) return;

    const newSocket = io('http://localhost:8000', { transports: ['websocket'] });
    setSocket(newSocket);

    // Identify ourselves to receive private buzzes
    newSocket.emit('identify_bee', { user_id: data.me.id });
    
    // Listen specifically for 1-on-1 messages
    newSocket.on('receive_private_message', (msg) => {
      // Only show if the message is from the person we are currently looking at
      // OR if we sent it (to keep multiple tabs in sync)
      if (msg.sender_id === userId || msg.sender_id === data.me.id) {
        setMessages(prev => {
          const exists = prev.some(m => m.timestamp === msg.timestamp && m.text === msg.text);
          if (exists) return prev;
          return [...prev, { 
            id: msg.id, 
            text: msg.text, 
            senderId: msg.sender_id, 
            senderName: msg.sender_name, 
            timestamp: msg.timestamp 
          }];
        });
      }
    });

    return () => newSocket.close();
  }, [userId, data?.me?.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !socket || !data?.me) return;

    const payload = {
      recipient_id: userId,
      sender_id: data.me.id,
      sender_name: data.me.name,
      text: inputText,
      timestamp: new Date().toISOString()
    };

    // Emit to backend
    socket.emit('send_private_message', payload);
    
    // Optimistic UI update
    setMessages(prev => [...prev, {
      id: `temp-${Date.now()}`,
      text: inputText,
      senderId: data.me.id,
      senderName: data.me.name,
      timestamp: payload.timestamp
    }]);

    setInputText('');
  };

  if (loading && !data) return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: '#FFC845' }} />
    </Box>
  );

  const otherUser = data?.getUser;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FDFDFD' }}>
      {/* Header */}
      <ChatHeader elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/chats')} size="small"><BackIcon /></IconButton>
          <Avatar 
            src={otherUser?.image} 
            sx={{ width: 48, height: 48, border: '2px solid #FFC845' }}
          >
            {otherUser?.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={900}>{otherUser?.name}</Typography>
            <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.5 }}>
               <OnlineIcon sx={{ fontSize: 10 }} /> Direct Connection
            </Typography>
          </Box>
        </Box>
        <IconButton size="small"><MoreIcon /></IconButton>
      </ChatHeader>

      {/* Messages Area */}
      <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Chip 
              label={`Beginning of your buzzes with ${otherUser?.name}`} 
              size="small" 
              variant="outlined"
              sx={{ color: 'text.secondary', fontWeight: 700, borderRadius: '8px' }} 
            />
          </Box>

          {messages.map((m, idx) => {
            const isMe = m.senderId === data?.me?.id;
            return (
              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', mb: 2 }}>
                <MessageBubble isMe={isMe}>
                  <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.5 }}>
                    {m.text}
                  </Typography>
                </MessageBubble>
                <Typography variant="caption" sx={{ opacity: 0.4, fontSize: 10, px: 1 }}>
                   {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            );
          })}
        </Container>
      </Box>

      {/* Input Dock */}
      <Box sx={{ p: 2, bgcolor: '#FFF', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Container maxWidth="md">
          <TextField 
            fullWidth 
            placeholder={`Buzz ${otherUser?.name}...`}
            variant="outlined"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            InputProps={{
              sx: { borderRadius: '30px', bgcolor: '#F5F5F5', px: 2, '& fieldset': { border: 'none' } },
              endAdornment: (
                <IconButton 
                  onClick={handleSend} 
                  disabled={!inputText.trim()}
                  sx={{ color: inputText.trim() ? '#FFC845' : 'grey.300', transition: '0.2s' }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              )
            }}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default PrivateChat;