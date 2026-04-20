import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Box, Container, Typography, IconButton, TextField, 
  Avatar, Paper, styled, CircularProgress, Chip, Button,
  List, ListItem, ListItemAvatar, ListItemText, Divider,
  InputAdornment, Badge, Stack, Fade, alpha, Grid
} from '@mui/material';
import { 
  Send as SendIcon, 
  ArrowBack as BackIcon, 
  Search as SearchIcon,
  PersonAddOutlined as PendingIcon,
  ChatBubbleOutline as ChatIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * APOLLO CLIENT IMPORTS
 * Consolidating imports to the primary entry point to resolve bundling issues.
 */
import { gql} from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import io from 'socket.io-client';

// --- GRAPHQL ---
const GET_PERSONAL_DATA = gql`
  query GetPersonalData {
    me {
      id
      name
      friends
      image
    }
    notifications {
      id
      fromUserId  # Updated from from_user_id
      fromName    # Updated from from_name
      status
      type
    }
  }
`;

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

const RESPOND_TO_REQUEST = gql`
  mutation RespondToRequest($id: String!, $action: String!) {
    respondToFriendRequest(notificationId: $id, action: $action)
  }
`;

// --- STYLED COMPONENTS ---
const SearchBar = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#F5F5F5',
    '& fieldset': { border: 'none' },
  }
});

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMe',
})(({ isMe }) => ({
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

  // 1. Fetch Basic Data with Loading/Error handling
  const { data: meData, loading: meLoading, error: meError, refetch: refetchMe } = useQuery(GET_PERSONAL_DATA, {
    fetchPolicy: 'cache-and-network'
  });
  
  // 2. Fetch Friend Details
  const { data: friendsData, loading: friendsLoading } = useQuery(GET_FRIENDS_DETAILS, {
    variables: { ids: meData?.me?.friends || [] },
    skip: !meData?.me?.friends?.length
  });

  const [respond] = useMutation(RESPOND_TO_REQUEST, {
    onCompleted: () => refetchMe()
  });

  // Socket management
  useEffect(() => {
    if (!meData?.me?.id) return;
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    newSocket.emit('identify_bee', { user_id: meData.me.id });

    newSocket.on('receive_private_message', (msg) => {
      if (activeFriend && (msg.sender_id === activeFriend.id || msg.sender_id === meData.me.id)) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => newSocket.close();
  }, [meData?.me?.id, activeFriend]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const filteredFriends = useMemo(() => {
    if (!friendsData?.getUsersByIds) return [];
    return friendsData.getUsersByIds.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friendsData, searchQuery]);

  const handleSendPrivate = () => {
    if (!inputText.trim() || !socket || !meData?.me || !activeFriend) return;
    const payload = {
      recipient_id: activeFriend.id,
      sender_id: meData.me.id,
      sender_name: meData.me.name,
      text: inputText,
      timestamp: new Date().toISOString()
    };
    socket.emit('send_private_message', payload);
    setInputText('');
  };

  // SAFETY CHECK: Handle loading and error states before rendering logic
  if (meLoading && !meData) return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: '#FFC845' }} />
    </Box>
  );

  if (meError) return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography color="error" fontWeight={800}>Hive Connection Lost: {meError.message}</Typography>
      <Button onClick={() => refetchMe()} sx={{ mt: 2, color: '#FFC845' }}>Retry Buzzing</Button>
    </Container>
  );

  // --- RENDERING LOGIC ---

  const renderListView = () => (
    <Box sx={{ p: 3, pb: 12 }}>
      <Typography variant="h4" fontWeight={900} mb={3}>Personal <span style={{ color: '#FFC845' }}>Inbox</span></Typography>
      
      <Stack spacing={2} mb={4}>
        <SearchBar 
          fullWidth 
          placeholder="Search friends..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} 
        />
        
        <Button 
          fullWidth 
          variant="outlined" 
          startIcon={<PendingIcon />} 
          onClick={() => setView('pending')}
          sx={{ 
            py: 1.5, borderRadius: 3, color: '#000', fontWeight: 800, 
            textTransform: 'none', justifyContent: 'flex-start', px: 2,
            borderColor: 'rgba(0,0,0,0.1)'
          }}
        >
          Pending Swarm Requests
          <Box sx={{ flexGrow: 1 }} />
          {meData?.notifications?.length > 0 && (
            <Badge badgeContent={meData.notifications.length} color="error" sx={{ mr: 1 }} />
          )}
          <ChevronRightIcon />
        </Button>
      </Stack>

      <Typography variant="overline" fontWeight={900} color="text.secondary">YOUR SWARM CONNECTIONS</Typography>
      
      <List sx={{ mt: 1 }}>
        {filteredFriends.map(friend => (
          <Paper key={friend.id} elevation={0} sx={{ mb: 1.5, borderRadius: 4, border: '1px solid #EEE' }}>
            <ListItem button onClick={() => { setActiveFriend(friend); setView('chat'); setMessages([]); }} sx={{ py: 2 }}>
              <ListItemAvatar><Avatar src={friend.image} /></ListItemAvatar>
              <ListItemText primary={friend.name} secondary={friend.major} primaryTypographyProps={{ fontWeight: 800 }} />
              <ChatIcon sx={{ color: '#FFC845' }} />
            </ListItem>
          </Paper>
        ))}
        {filteredFriends.length === 0 && !friendsLoading && (
          <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
            No hive members found.
          </Typography>
        )}
      </List>
    </Box>
  );

  const renderChatView = () => (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FDFDFD' }}>
      <Box sx={{ p: 2, bgcolor: '#FFF', borderBottom: '1px solid #EEE', display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => setView('list')}><BackIcon /></IconButton>
        <Avatar src={activeFriend?.image} sx={{ border: '2px solid #FFC845' }} />
        <Typography variant="subtitle1" fontWeight={900}>{activeFriend?.name}</Typography>
      </Box>
      <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Container maxWidth="md">
          {messages.map((m, i) => (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: m.sender_id === meData?.me?.id ? 'flex-end' : 'flex-start', mb: 2 }}>
              <MessageBubble isMe={m.sender_id === meData?.me?.id}>
                <Typography variant="body2" fontWeight={500}>{m.text}</Typography>
              </MessageBubble>
            </Box>
          ))}
        </Container>
      </Box>
      <Box sx={{ p: 2, bgcolor: '#FFF', borderTop: '1px solid #EEE' }}>
        <Container maxWidth="md">
          <TextField 
            fullWidth placeholder="Buzz something..." 
            value={inputText} 
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendPrivate()}
            InputProps={{ 
              sx: { borderRadius: '30px', bgcolor: '#F5F5F5', px: 2, '& fieldset': { border: 'none' } },
              endAdornment: <IconButton onClick={handleSendPrivate} sx={{ color: '#FFC845' }}><SendIcon fontSize="small" /></IconButton>
            }} 
          />
        </Container>
      </Box>
    </Box>
  );

  const renderPendingView = () => (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #EEE' }}>
        <IconButton onClick={() => setView('list')}><BackIcon /></IconButton>
        <Typography variant="h6" fontWeight={900}>Pending Requests</Typography>
      </Box>
      <List sx={{ p: 2 }}>
        {meData?.notifications?.map(n => (
          <ListItem key={n.id} sx={{ bgcolor: '#FFF', borderRadius: 4, mb: 1, border: '1px solid #F0F0F0' }}>
            {/* Updated references from n.from_name to n.fromName */}
            <ListItemAvatar><Avatar sx={{ bgcolor: '#FFC845' }}>{n.fromName ? n.fromName[0] : 'B'}</Avatar></ListItemAvatar>
            <ListItemText primary={n.fromName} secondary="Wants to connect" primaryTypographyProps={{ fontWeight: 800 }} />
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" onClick={() => respond({ variables: { id: n.id, action: 'ACCEPT' } })} sx={{ bgcolor: '#FFC845', color: '#000', fontWeight: 800 }}>Accept</Button>
              <Button size="small" variant="outlined" onClick={() => respond({ variables: { id: n.id, action: 'IGNORE' } })}>Ignore</Button>
            </Stack>
          </ListItem>
        ))}
        {(!meData?.notifications || meData.notifications.length === 0) && (
          <Typography sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>No pending buzzes in your bag.</Typography>
        )}
      </List>
    </Box>
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