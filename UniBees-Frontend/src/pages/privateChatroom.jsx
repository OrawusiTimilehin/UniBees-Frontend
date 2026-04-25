import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Typography, IconButton, TextField, 
  Avatar, Paper, styled, CircularProgress, LinearProgress, alpha, Stack
} from '@mui/material';
import { 
  Send as SendIcon, 
  ArrowBack as BackIcon,
  LocalFireDepartment as FireIcon,
  FiberManualRecord as OnlineIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { gql} from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import io from 'socket.io-client';

// GRAPHQL 
const GET_PRIVATE_CHAT_DATA = gql`
  query GetPrivateChatData($otherUserId: String!) {
    getUser(id: $otherUserId) {
      id name image rank major
    }
    getPrivateMessages(otherUserId: $otherUserId) {
      id text senderId senderName timestamp
    }
    me {
      id name
    }
  }
`;

//  STYLED 
const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMe'
})(({ isMe }) => ({
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
  const { userId } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [intensity, setIntensity] = useState(40);
  const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const { data, loading } = useQuery(GET_PRIVATE_CHAT_DATA, { 
    variables: { otherUserId: userId },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (data?.getPrivateMessages) setMessages(data.getPrivateMessages);
  }, [data]);


  // LIVE ENGINE 
  useEffect(() => {
    if (!data?.me?.id) return;

    const newSocket = io(SOCKET_URL, { 
        transports: ['websocket'],
        reconnection: true 
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log("Hive Connected");
      // CRITICAL: Must identify so the backend knows which room we belong to
      newSocket.emit('identify_bee', { user_id: data.me.id });
    });
    
    newSocket.on('receive_private_message', (msg) => {
      const sId = msg.sender_id || msg.senderId;
      const rId = msg.recipient_id || msg.recipientId;

      const isRelevant = (sId === userId && rId === data.me.id) || 
                         (sId === data.me.id && rId === userId);

      if (isRelevant) {
        setMessages(prev => {
          const exists = prev.some(m => (m.id === msg.id) || (m.timestamp === msg.timestamp && m.text === msg.text));
          if (exists) return prev;
          
          return [...prev, { 
            id: msg.id, text: msg.text, senderId: sId, 
            senderName: msg.sender_name, timestamp: msg.timestamp 
          }];
        });
        setIntensity(prev => Math.min(100, prev + 15));
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

    socket.emit('send_private_message', payload);
    
    setMessages(prev => [...prev, {
      id: `temp-${Date.now()}`,
      text: inputText,
      senderId: data.me.id,
      senderName: data.me.name,
      timestamp: payload.timestamp
    }]);

    setInputText('');
    setIntensity(prev => Math.min(100, prev + 5));
  };

  if (loading && !data) return <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: '#FFC845' }} /></Box>;

  const otherUser = data?.getUser;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FDFDFD' }}>
      <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)', borderRadius: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/chats')} size="small"><BackIcon /></IconButton>
          <Avatar src={otherUser?.image} sx={{ width: 44, height: 44, border: '2px solid #FFC845' }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={900}>{otherUser?.name}</Typography>
            <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <OnlineIcon sx={{ fontSize: 10 }} /> Connected
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
           <Typography variant="caption" fontWeight={900} sx={{ color: intensity > 70 ? '#FF5722' : 'text.secondary' }}>
              <FireIcon sx={{ fontSize: 14 }} /> {intensity > 70 ? 'FRENZY' : 'ACTIVE'}
           </Typography>
           <LinearProgress variant="determinate" value={intensity} sx={{ width: 60, height: 4, borderRadius: 2, bgcolor: alpha('#000', 0.05), '& .MuiLinearProgress-bar': { bgcolor: '#FFC845' } }} />
        </Box>
      </Paper>

      <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Container maxWidth="md">
          {messages.map((m, idx) => {
            const isMe = (m.senderId || m.sender_id) === data?.me?.id;
            return (
              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', mb: 2 }}>
                <MessageBubble isMe={isMe}>
                  <Typography variant="body2">{m.text}</Typography>
                </MessageBubble>
                <Typography variant="caption" sx={{ opacity: 0.4, fontSize: 10, px: 1 }}>
                   {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            );
          })}
        </Container>
      </Box>

      <Box sx={{ p: 2, bgcolor: '#FFF', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Container maxWidth="md">
          <TextField 
            fullWidth placeholder="Buzz something..." 
            variant="outlined"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            InputProps={{
              sx: { borderRadius: '30px', bgcolor: '#F5F5F5', px: 2, '& fieldset': { border: 'none' } },
              endAdornment: <IconButton onClick={handleSend} disabled={!inputText.trim()} sx={{ color: '#FFC845' }}><SendIcon fontSize="small" /></IconButton>
            }}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default PrivateChat;