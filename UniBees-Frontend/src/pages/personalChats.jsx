import React, { useState } from 'react';
import { 
  Box, Container, Typography, TextField, InputAdornment, 
  List, ListItem, ListItemAvatar, ListItemText, Avatar, 
  Divider, IconButton, Paper, styled, alpha, Button, Stack, 
  Badge
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import ForumIcon from '@mui/icons-material/Forum';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupsIcon from '@mui/icons-material/Groups';
import MoreVertIcon from '@mui/icons-material/MoreVert';


import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_PRIVATE_CHATS = gql`
  query GetPrivateChats {
    myFriends {
      id
      name
      major
      image
      rank
    }
  }
`;

// --- STYLED COMPONENTS ---

const ChatCard = styled(ListItem)(({ theme }) => ({
  borderRadius: '16px',
  marginBottom: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha('#FFC845', 0.08),
    transform: 'translateX(4px)',
  },
}));

const StatusBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': { transform: 'scale(.8)', opacity: 1 },
    '100%': { transform: 'scale(2.4)', opacity: 0 },
  },
}));

const PersonalChats = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Friends from the Database
  const { data, loading, error } = useQuery(GET_PRIVATE_CHATS, {
    fetchPolicy: 'cache-and-network'
  });

  const friends = data?.myFriends || [];

  // Filter local list based on search
  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && friends.length === 0) return (
    <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h6" color="text.secondary">Scouting the hive for your friends...</Typography>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 8 }}>
      {/* Header Area */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" fontWeight={900}>
            Personal <span style={{ color: '#FFC845' }}>Inbox</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Direct buzzes with your connections
          </Typography>
        </Box>
        <ForumIcon sx={{ fontSize: 40, color: alpha('#000', 0.1) }} />
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search for a bee..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 4,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: '#F8F9FA',
            '& fieldset': { border: 'none' },
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
      />

      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, mb: 4, borderRadius: '12px', 
          border: '1px solid rgba(0,0,0,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', '&:hover': { bgcolor: '#fafafa' }
        }}
        onClick={() => navigate('/swarms')}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: '#FFC845', color: '#000' }}>
            <GroupsIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={800}>Pending Swarm Requests</Typography>
            <Typography variant="caption" color="text.secondary">Check invitations to join group hives</Typography>
          </Box>
        </Stack>
        <ChevronRightIcon color="disabled" />
      </Paper>

      <Typography variant="overline" color="text.secondary" fontWeight={900} letterSpacing={1.2} sx={{ mb: 2, display: 'block' }}>
        Your Connections
      </Typography>

      {/* Friends List */}
      <List disablePadding>
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <ChatCard 
              key={friend.id} 
              button 
              onClick={() => navigate(`/chat/${friend.id}`)}
            >
              <ListItemAvatar>
                <StatusBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                  <Avatar 
                    src={friend.image} 
                    sx={{ width: 56, height: 56, border: '2px solid #FFF', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  >
                    {friend.name[0]}
                  </Avatar>
                </StatusBadge>
              </ListItemAvatar>
              <ListItemText
                sx={{ ml: 2 }}
                primary={
                  <Typography variant="subtitle1" fontWeight={900}>
                    {friend.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '80%' }}>
                    {friend.major} • {friend.rank}
                  </Typography>
                }
              />
              <Box sx={{ textAlign: 'right' }}>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" color="disabled" />
                </IconButton>
              </Box>
            </ChatCard>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary" fontWeight={600}>
              No hive members found.
            </Typography>
            <Button 
              sx={{ mt: 2, color: '#FFC845', fontWeight: 800 }}
              onClick={() => navigate('/explore')}
            >
              Find new bees to connect with
            </Button>
          </Box>
        )}
      </List>
    </Container>
  );
};

export default PersonalChats;