import React, { useState, useEffect, useMemo } from 'react';
import { 
  AppBar, Toolbar, Typography, Box, Container, styled, Paper, 
  Tooltip, IconButton, Badge, Menu, MenuItem, Avatar, Button,
  Divider, List, ListItem, ListItemAvatar, Stack, alpha
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Icons
import HexagonIcon from '@mui/icons-material/Hexagon';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupsIcon from '@mui/icons-material/Groups';
import ForumIcon from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';


import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import io from 'socket.io-client';

const GET_NAVBAR_DATA = gql`
  query GetNavbarData {
    me {
      id
      name
    }
    notifications {
      id
      fromUserId
      fromName
      status
    }
  }
`;

const RESPOND_TO_REQUEST = gql`
  mutation RespondToRequest($id: String!, $action: String!) {
    respondToFriendRequest(notificationId: $id, action: $action)
  }
`;

const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: String!) {
    deleteNotification(notificationId: $id)
  }
`;

// --- STYLED COMPONENTS ---

const TopHeader = styled(AppBar)({
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  color: '#1A1A1B',
  top: 0,
});

const FloatingNav = styled(Paper)({
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center', gap: '8px', padding: '8px 12px',
  borderRadius: '40px', backgroundColor: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)', zIndex: 1000,
});

const NavItem = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
  color: active ? '#1A1A1B' : 'rgba(26, 26, 27, 0.4)',
  backgroundColor: active ? '#FFC845' : 'transparent',
  padding: '12px',
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: active ? '#FFC845' : 'rgba(255, 200, 69, 0.1)',
  },
  '& svg': { fontSize: 26 }
}));

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [localNotifs, setLocalNotifs] = useState([]); 
  const open = Boolean(anchorEl);

  const { data, refetch } = useQuery(GET_NAVBAR_DATA, {
    fetchPolicy: 'network-only', 
    nextFetchPolicy: 'cache-first'
  });

  const [respond] = useMutation(RESPOND_TO_REQUEST, {
    onCompleted: (_, { variables }) => {
      setLocalNotifs(prev => prev.filter(n => n.id !== variables.id)); 
      refetch();
    }
  });

  const [deleteNotif] = useMutation(DELETE_NOTIFICATION, {
    onCompleted: (_, { variables }) => {
      setLocalNotifs(prev => prev.filter(n => n.id !== variables.id));
      refetch();
    }
  });

  const handleIgnore = (notifId) => {
    // Immediate removal from UI
    setLocalNotifs(prev => prev.filter(n => n.id !== notifId));
    
    if (!notifId.toString().startsWith('temp-')) {
      deleteNotif({ variables: { id: notifId } }).catch(() => {
        // Fallback already handled by onCompleted/onError
      });
    }
  };

  useEffect(() => {
    if (!data?.me?.id) return;

    const socket = io('http://localhost:8000', { transports: ['websocket'] });
    
    socket.on('connect', () => {
      socket.emit('identify_bee', { user_id: data.me.id });
    });

    socket.on('new_notification', (notif) => {
      console.log(" Socket Data Incoming:", notif);
      setLocalNotifs(prev => {
        // Use real ID if socket provides it, otherwise generate temp
        const id = notif.id || notif._id || `temp-${Date.now()}`;
        if (prev.find(n => n.id === id)) return prev;
        return [{ ...notif, id }, ...prev];
      });
      // Trigger a sync with the backend
      refetch();
    });

    return () => socket.disconnect();
  }, [data?.me?.id, refetch]);

  const allNotifications = useMemo(() => {
    const serverNotifs = data?.notifications || [];
    const merged = [...localNotifs, ...serverNotifs];
    // Filter unique by ID
    return merged.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  }, [data?.notifications, localNotifs]);

  const handleOpenNotifs = (event) => setAnchorEl(event.currentTarget);
  const handleCloseNotifs = () => setAnchorEl(null);

  const tabs = [
    { id: 'explore', icon: <ExploreIcon />, label: 'Explore', path: '/explore' },
    { id: 'match', icon: <GroupsIcon />, label: 'Bees Match', path: '/bees-match' },
    { id: 'chats', icon: <ForumIcon />, label: 'Personal Chats', path: '/chats' },
  ];

  return (
    <>
      <TopHeader position="fixed" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 70, justifyContent: 'space-between' }}>
            <Box component={Link} to="/explore" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}>
              <HexagonIcon sx={{ color: '#FFC845', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 900 }}>UNIBEES</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleOpenNotifs}>
                <Badge badgeContent={allNotifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton component={Link} to="/profile"><SettingsIcon /></IconButton>
            </Box>
          </Toolbar>
        </Container>
      </TopHeader>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseNotifs}
        PaperProps={{
          sx: { width: 340, mt: 1.5, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={900}>Hive Alerts</Typography>
          <Button size="small" onClick={() => refetch()} sx={{ color: '#FFC845', fontWeight: 800 }}>Sync</Button>
        </Box>
        <Divider />
        
        {allNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No new buzzes in your bag.</Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {allNotifications.map((n) => {
              /**
               * IDENTITY BRIDGE:
               * Ensures names show up correctly by checking all possible field variations.
               */
              const senderName = n.fromName || n.from_name || n.name || "A Scout Bee";
              const senderId = n.fromUserId || n.from_user_id;

              return (
                <ListItem key={n.id} sx={{ py: 2, flexDirection: 'column', alignItems: 'stretch', '&:hover': { bgcolor: alpha('#FFC845', 0.02) } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 0 }}>
                      <Avatar 
                        sx={{ bgcolor: '#FFC845', color: '#000', border: '1px solid #FFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 900 }}
                        onClick={() => { handleCloseNotifs(); navigate(`/profile/${senderId}`); }}
                      >
                        {senderName[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={900} 
                        sx={{ cursor: 'pointer', '&:hover': { color: '#FFC845' } }}
                        onClick={() => { handleCloseNotifs(); navigate(`/profile/${senderId}`); }}
                      >
                        {senderName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
                        wants to be friends!
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => { handleCloseNotifs(); navigate(`/profile/${senderId}`); }}>
                      <VisibilityIcon fontSize="small" sx={{ opacity: 0.3 }} />
                    </IconButton>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ pl: 6 }}>
                    <Button 
                      size="small" variant="contained" 
                      onClick={() => respond({ variables: { id: n.id, action: 'ACCEPT' } })}
                      sx={{ bgcolor: '#FFC845', color: '#000', fontWeight: 900, borderRadius: 2, textTransform: 'none', px: 2, boxShadow: 'none' }}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="small" variant="outlined" 
                      onClick={() => handleIgnore(n.id)}
                      sx={{ borderRadius: 2, textTransform: 'none', color: 'text.secondary', fontWeight: 800 }}
                    >
                      Ignore
                    </Button>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        )}
      </Menu>

      <FloatingNav elevation={0}>
        {tabs.map((tab) => (
          <Tooltip key={tab.id} title={tab.label} arrow placement="top">
            <NavItem component={Link} to={tab.path} active={currentPath === tab.path ? 1 : 0}>
              {tab.icon}
            </NavItem>
          </Tooltip>
        ))}
      </FloatingNav>
      <Box sx={{ height: 70 }} />
    </>
  );
};

export default Navbar;