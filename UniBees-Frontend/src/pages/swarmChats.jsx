import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Typography, IconButton, TextField, 
  Avatar, Paper, Stack, styled, Badge, CircularProgress, Chip
} from '@mui/material';
import { 
  Send as SendIcon, 
  NotificationsNone as NotificationsIcon,
  Tag as TagIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import io from 'socket.io-client';

// --- QUERIES ---
const GET_CHAT_DATA = gql`
  query GetChatData($id: String!) {
    swarm(id: $id) {
      id
      name
      image
      members
    }
    get_swarm_messages(swarm_id: $id) {
      id
      text
      sender_id
      sender_name
      timestamp
    }
    me {
      id
      name
    }
  }
`;

// --- STYLED COMPONENTS (Matching Screenshot) ---
const ChatHeader = styled(Box)({
  padding: '20px 24px',
  backgroundColor: '#FFF',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const MessageBubble = styled(Box)(({ isMe }) => ({
  maxWidth: '70%',
  padding: '16px 24px',
  borderRadius: isMe ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
  backgroundColor: isMe ? '#FFC845' : '#FFF',
  border: isMe ? 'none' : '1px solid rgba(0,0,0,0.08)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  position: 'relative',
  marginBottom: '4px'
}));

const SwarmChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const { data, loading } = useQuery(GET_CHAT_DATA, { 
    variables: { id },
    onCompleted: (data) => setMessages(data.get_swarm_messages)
  });

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    newSocket.emit('join_swarm', { swarm_id: id });
    newSocket.on('receive_message', (msg) => setMessages(prev => [...prev, msg]));
    return () => newSocket.close();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !socket || !data?.me) return;
    const payload = {
      swarm_id: id,
      text: inputText,
      sender_id: data.me.id,
      sender_name: data.me.name,
      timestamp: new Date().toISOString()
    };
    socket.emit('send_message', payload);
    setInputText('');
  };

  if (loading) return <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F8F9FA' }}>
      {/* Header (Top Nav Style from Screenshot) */}
      <ChatHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src="/src/assets/logo.png" sx={{ width: 48, height: 48 }} />
          <Box>
            <Typography variant="h5" fontWeight={900}>{data.swarm.name}</Typography>
            <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 800 }}>
              ● {data.swarm.members.length} Scouts
            </Typography>
          </Box>
        </Box>
        <IconButton><NotificationsIcon /></IconButton>
      </ChatHeader>

      {/* Messages */}
      <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 4 }}>
        <Container maxWidth="md">
          {messages.map((msg, idx) => {
            const isMe = msg.sender_id === data.me.id;
            return (
              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', mb: 3 }}>
                {!isMe && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, cursor: 'pointer' }} onClick={() => navigate(`/profile/${msg.sender_id}`)}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>{msg.sender_name[0]}</Avatar>
                    <Typography variant="caption" fontWeight={900}>{msg.sender_name} <Chip label="Queen" size="small" sx={{ height: 16, fontSize: 10, bgcolor: '#FFFBEB' }} /></Typography>
                  </Box>
                )}
                <MessageBubble isMe={isMe}>
                  <Typography variant="body1">{msg.text}</Typography>
                </MessageBubble>
                <Typography variant="caption" sx={{ opacity: 0.4, fontSize: 10 }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
              </Box>
            );
          })}
        </Container>
      </Box>

      {/* Input */}
      <Box sx={{ p: 3, bgcolor: '#FFF', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <Container maxWidth="md">
          <TextField 
            fullWidth 
            placeholder="Buzz something..." 
            variant="outlined" 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            InputProps={{
              sx: { borderRadius: '24px', bgcolor: '#F3F3F3' },
              endAdornment: (
                <IconButton onClick={handleSend} sx={{ bgcolor: inputText.trim() ? '#FFC845' : 'transparent', color: '#000', ml: 1 }}>
                  <SendIcon />
                </IconButton>
              )
            }}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default SwarmChat;