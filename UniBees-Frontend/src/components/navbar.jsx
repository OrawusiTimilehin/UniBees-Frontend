import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Box, Container, styled, Paper, 
  Tooltip, IconButton, Badge, Menu, MenuItem, Avatar, Button,
  Divider, List, ListItem, ListItemAvatar, ListItemText, Stack, alpha
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { 
  Hexagon as HexagonIcon, Explore as ExploreIcon, Groups as GroupsIcon, 
  Forum as ForumIcon, 
  NotificationsNone as NotificationsIcon, SettingsOutlined as SettingsIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

/**
 * APOLLO CLIENT & SOCKET IMPORTS
 * Split imports ensure compatibility with the build environment.
 */
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import io from 'socket.io-client';

const GET_NAVBAR_DATA = gql`
  query GetNavbarData {
    me {
      id
    }
    notifications {
      id
      fromUserId
      fromName
      message
      status
    }
  }
`;

const RESPOND_TO_REQUEST = gql`
  mutation RespondToRequest($id: String!, $action: String!) {
    respondToFriendRequest(notificationId: $id, action: $action)
  }
`;

const FloatingNav = styled(Paper)({
  position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
  borderRadius: '40px', backgroundColor: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)', zIndex: 1000,
});

const NavItem = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
  color: active ? '#1A1A1B' : 'rgba(26, 26, 27, 0.4)',
  backgroundColor: active ? '#FFC845' : 'transparent',
  padding: '12px', borderRadius: '50%',
  '&:hover': { backgroundColor: active ? '#FFC845' : 'rgba(255, 200, 69, 0.1)' }
}));

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // UI & Notification Buffer State
  const [anchorEl, setAnchorEl] = useState(null);
  const [realTimeNotifs, setRealTimeNotifs] = useState([]); 
  const open = Boolean(anchorEl);

  // 1. Fetch persistent data from the Hive
  const { data, refetch } = useQuery(GET_NAVBAR_DATA, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only'
  });

  const [respond] = useMutation(RESPOND_TO_REQUEST, {
    onCompleted: () => {
      // Clear local buffer when an action is taken to let the server data be the truth
      setRealTimeNotifs([]); 
      refetch();
    }
  });

  useEffect(() => {
    if (!data?.me?.id) return;

    const socket = io('http://localhost:8000');
    
    // Identify our specific Bee room
    socket.emit('identify_bee', { user_id: data.me.id });

    // Listen for incoming buzzes
    socket.on('new_notification', (notif) => {
      // 2. IMMEDIATE UI UPDATE: Add to local state buffer
      setRealTimeNotifs(prev => {
        const exists = prev.find(n => n.id === notif.id);
        if (exists) return prev;
        return [notif, ...prev];
      });

      // Background sync to ensure DB is current
      refetch();
    });

    return () => socket.close();
  }, [data?.me?.id, refetch]);

  const handleOpenNotifs = (event) => setAnchorEl(event.currentTarget);
  const handleCloseNotifs = () => setAnchorEl(null);

  const tabs = [
    { id: 'explore', icon: <ExploreIcon />, label: 'Explore', path: '/explore' },
    { id: 'match', icon: <GroupsIcon />, label: 'Bees Match', path: '/bees-match' },
    { id: 'chats', icon: <ForumIcon />, label: 'Personal Chats', path: '/chats' },
  ];

  // Combine real-time buffer with server-fetched data & deduplicate
  const serverNotifs = data?.notifications || [];
  const allNotifs = [...realTimeNotifs, ...serverNotifs].filter((v, i, a) => 
    a.findIndex(t => (t.id === v.id)) === i
  );

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: '#FFF', borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#000' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 70, justifyContent: 'space-between' }}>
            <Box component={Link} to="/explore" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}>
              <HexagonIcon sx={{ color: '#FFC845', fontSize: 28 }} />
              <Typography variant="h6" fontWeight={900}>UNIBEES</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleOpenNotifs}>
                <Badge badgeContent={allNotifs.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton component={Link} to="/profile"><SettingsIcon /></IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* NOTIFICATION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseNotifs}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { 
            width: 320, mt: 1.5, borderRadius: 4, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            maxHeight: 400
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={900}>Hive Alerts</Typography>
        </Box>
        <Divider />
        
        {allNotifs.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No new buzzes in your bag.</Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {allNotifs.map((n) => (
              <ListItem key={n.id} sx={{ py: 2, alignItems: 'flex-start' }}>
                <ListItemAvatar sx={{ mt: 0.5 }}>
                  <Avatar sx={{ bgcolor: alpha('#FFC845', 0.1), color: '#FFC845', border: '1px solid #FFC845' }}>
                    <PersonAddIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={800}>{n.fromName} sent a request!</Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                    Wants to join your swarm
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button 
                      size="small" variant="contained" 
                      onClick={() => respond({ variables: { id: n.id, action: 'ACCEPT' } })}
                      sx={{ bgcolor: '#FFC845', color: '#000', fontWeight: 800, borderRadius: 2, fontSize: '0.65rem' }}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="small" variant="outlined" 
                      onClick={() => respond({ variables: { id: n.id, action: 'IGNORE' } })}
                      sx={{ borderRadius: 2, fontSize: '0.65rem', color: 'text.secondary' }}
                    >
                      Ignore
                    </Button>
                  </Stack>
                </Box>
              </ListItem>
            ))}
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