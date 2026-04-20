import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Box, Container, Typography, IconButton, TextField, 
  Avatar, Paper, styled, CircularProgress, Chip, Button,
  List, ListItem, ListItemAvatar, ListItemText, Divider,
  InputAdornment, Badge, Stack, Fade
} from '@mui/material';
import { 
  Send as SendIcon, 
  ArrowBack as BackIcon, 
  Search as SearchIcon,
  PersonAddOutlined as PendingIcon,
  ChatBubbleOutline as ChatIcon,
  FiberManualRecord as OnlineIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import io from 'socket.io-client';

// GRAPHQL 
const GET_PERSONAL_CHAT_DATA = gql`
  query GetPersonalChatData {
    me {
      id
      name
      friends # List of IDs
      image
    }
    notifications { # Used here to see incoming pending requests
      id
      from_user_id
      from_name
      status
      type
    }
  }
`;

// get details of multiple users (friends)
const GET_FRIENDS_DETAILS = gql`
  query GetFriendsDetails($ids: [String!]!) {
    getUsersByIds(ids: $ids) {
      id
      name
      username
      image
      major
    }
  }
`;

// --- STYLED COMPONENTS ---
const SearchBar = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#F5F5F5',
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: 'none' },
  }
});

const MessageBubble = styled(Box)(({ isMe }) => ({
  maxWidth: '75%',
  padding: '12px 18px',
  borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
  backgroundColor: isMe ? '#FFC845' : '#FFFFFF',
  border: isMe ? 'none' : '1px solid rgba(0,0,0,0.08)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  marginBottom: '4px',
}));

const PersonalChats = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const [view, setView] = useState('list'); 
  const [activeFriend, setActiveFriend] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const { data: meData, loading: meLoading } = useQuery(GET_PERSONAL_CHAT_DATA);
  
  const { data: friendsData, loading: friendsLoading } = useQuery(GET_FRIENDS_DETAILS, {
    variables: { ids: meData?.me?.friends || [] },
    skip: !meData?.me?.friends?.length
  });


  useEffect(() => {
    if (!meData?.me?.id) return;
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    newSocket.emit('identify_bee', { user_id: meData.me.id });

    newSocket.on('receive_private_message', (msg) => {
      // Only add to state if it's from the person we are currently talking to
      if (activeFriend && (msg.sender_id === activeFriend.id || msg.sender_id === meData.me.id)) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => newSocket.close();
  }, [meData?.me?.id, activeFriend]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // LOGIC
  const filteredFriends = useMemo(() => {
    if (!friendsData?.getUsersByIds) return [];
    return friendsData.getUsersByIds.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friendsData, searchQuery]);

  const handleOpenChat = (friend) => {
    setActiveFriend(friend);
    setMessages([]); 
    setView('chat');
  };

  const handleSendPrivate = () => {
    if (!inputText.trim() || !socket || !meData?.me || !activeFriend) return;

    const payload = {
      recipient_id: activeFriend.id,
      sender_id: meData.me.id,
      sender_name: meData.me.name,
      text: inputText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, payload]);
    socket.emit('send_private_message', payload);
    setInputText('');
  };

  if (meLoading) return <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: '#FFC845' }} /></Box>;

  //  RENDER VIEWS

  const renderPendingView = () => (
    <Fade in={true}>
      <Box>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #EEE' }}>
          <IconButton onClick={() => setView('list')}><BackIcon /></IconButton>
          <Typography variant="h6" fontWeight={900}>Pending Requests</Typography>
        </Box>
        <List sx={{ p: 2 }}>
          {meData.notifications?.filter(n => n.status === 'PENDING').map(notif => (
            <ListItem key={notif.id} sx={{ bgcolor: '#FFF', borderRadius: 4, mb: 1, border: '1px solid #F0F0F0' }}>
              <ListItemAvatar><Avatar sx={{ bgcolor: '#FFC845' }}>{notif.from_name[0]}</Avatar></ListItemAvatar>
              <ListItemText primary={notif.from_name} secondary="Wants to connect" primaryTypographyProps={{ fontWeight: 800 }} />
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="contained" sx={{ bgcolor: '#FFC845', color: '#000', borderRadius: 2, fontWeight: 800 }}>Accept</Button>
                <Button size="small" variant="outlined" sx={{ borderRadius: 2, color: 'text.secondary' }}>Ignore</Button>
              </Stack>
            </ListItem>
          ))}
          {(!meData.notifications || meData.notifications.length === 0) && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>No requests found in your pollen bag.</Typography>
          )}
        </List>
      </Box>
    </Fade>
  );

  const renderChatView = () => (
    <Fade in={true}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FDFDFD' }}>
        <Box sx={{ p: 2, bgcolor: '#FFF', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => setView('list')} size="small"><BackIcon /></IconButton>
          <Avatar src={activeFriend?.image} sx={{ border: '2px solid #FFC845' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={900}>{activeFriend?.name}</Typography>
            <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 800 }}>● Online</Typography>
          </Box>
        </Box>

        <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
          <Container maxWidth="md">
            {messages.map((m, idx) => {
              const isMe = m.sender_id === meData.me.id;
              return (
                <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', mb: 2 }}>
                  <MessageBubble isMe={isMe}>
                    <Typography variant="body2" fontWeight={500}>{m.text}</Typography>
                  </MessageBubble>
                  <Typography variant="caption" sx={{ opacity: 0.4, fontSize: 9 }}>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                </Box>
              );
            })}
          </Container>
        </Box>

        <Box sx={{ p: 2, bgcolor: '#FFF', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Container maxWidth="md">
            <TextField 
              fullWidth placeholder="Buzz something..." value={inputText} onChange={e => setInputText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendPrivate()}
              InputProps={{
                sx: { borderRadius: '30px', bgcolor: '#F5F5F5', px: 2, '& fieldset': { border: 'none' } },
                endAdornment: <IconButton onClick={handleSendPrivate} disabled={!inputText.trim()} sx={{ color: inputText.trim() ? '#FFC845' : 'grey.300' }}><SendIcon fontSize="small" /></IconButton>
              }}
            />
          </Container>
        </Box>
      </Box>
    </Fade>
  );

  const renderListView = () => (
    <Fade in={true}>
      <Box sx={{ p: 3, pb: 12 }}>
        <Typography variant="h4" fontWeight={900} sx={{ mb: 3, letterSpacing: -1 }}>Personal <span style={{ color: '#FFC845' }}>Inbox</span></Typography>
        
        <Stack spacing={2} mb={4}>
          <SearchBar 
            fullWidth placeholder="Search friends..." 
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(0,0,0,0.3)' }} /></InputAdornment> }}
          />
          
          <Button 
            fullWidth variant="outlined" startIcon={<PendingIcon />} onClick={() => setView('pending')}
            sx={{ py: 1.5, borderRadius: 3, borderColor: 'rgba(255,200,69,0.3)', color: '#000', fontWeight: 800, textTransform: 'none', justifyContent: 'flex-start', px: 2 }}
          >
            Pending Swarm Requests
            <Box sx={{ flexGrow: 1 }} />
            {meData.notifications?.length > 0 && <Badge badgeContent={meData.notifications.length} color="error" sx={{ mr: 1 }} />}
            <ChevronRightIcon sx={{ opacity: 0.3 }} />
          </Button>
        </Stack>

        <Typography variant="overline" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1.5 }}>YOUR SWARM CONNECTIONS</Typography>
        
        <List sx={{ mt: 1 }}>
          {filteredFriends.map((friend) => (
            <Paper key={friend.id} elevation={0} sx={{ mb: 1.5, borderRadius: 4, border: '1px solid rgba(0,0,0,0.04)', transition: '0.2s', '&:hover': { bgcolor: alpha('#FFC845', 0.05), transform: 'translateX(4px)' } }}>
              <ListItem button onClick={() => handleOpenChat(friend)} sx={{ py: 2 }}>
                <ListItemAvatar>
                  <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" sx={{ '& .MuiBadge-badge': { backgroundColor: '#44b700', color: '#44b700', boxShadow: '0 0 0 2px #FFF' } }}>
                    <Avatar src={friend.image} sx={{ border: '2px solid #FFF' }} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText 
                  primary={friend.name} secondary={friend.major || "Scholar Bee"} 
                  primaryTypographyProps={{ fontWeight: 800 }} secondaryTypographyProps={{ fontWeight: 600, fontSize: '0.75rem' }} 
                />
                <ChatIcon sx={{ color: '#FFC845', opacity: 0.8 }} />
              </ListItem>
            </Paper>
          ))}
          {filteredFriends.length === 0 && !friendsLoading && (
            <Box sx={{ textAlign: 'center', py: 8, opacity: 0.5 }}>
              <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(0,0,0,0.03)', width: 60, height: 60 }}><ChatIcon sx={{ color: '#000' }} /></Avatar>
              <Typography variant="body2" fontWeight={800}>No friends found in this sector.</Typography>
            </Box>
          )}
        </List>
      </Box>
    </Fade>
  );

  return (
    <Box sx={{ bgcolor: '#FDFDFD', minHeight: '100vh' }}>
      {view === 'list' && renderListView()}
      {view === 'chat' && renderChatView()}
      {view === 'pending' && renderPendingView()}
    </Box>
  );
};

export default PersonalChats;