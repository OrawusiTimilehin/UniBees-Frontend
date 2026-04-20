import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Box, Container, styled, Paper, 
  Tooltip, IconButton, Badge, Menu, MenuItem, Avatar, Button,
  Divider, List, ListItem, ListItemAvatar, ListItemText
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// Icons
import HexagonIcon from '@mui/icons-material/Hexagon';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupsIcon from '@mui/icons-material/Groups';
import ForumIcon from '@mui/icons-material/Forum';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import io from 'socket.io-client';

// --- STYLED COMPONENTS ---

const TopHeader = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  color: '#1A1A1B',
  top: 0,
}));

const LogoBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  textDecoration: 'none',
  color: 'inherit'
});

const FloatingNav = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  borderRadius: '40px',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  zIndex: 1000,
}));

const NavItem = styled(IconButton)(({ active }) => ({
  color: active ? '#1A1A1B' : 'rgba(26, 26, 27, 0.4)',
  backgroundColor: active ? '#FFC845' : 'transparent',
  padding: '12px',
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: active ? '#FFC845' : 'rgba(255, 200, 69, 0.1)',
  },
  '& svg': { fontSize: 26 }
}));

const Navbar = ({ onlineCount = 1242 }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:8000');
    
    // Listen for real-time social alerts
    socket.on('new_notification', (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => socket.close();
  }, []);

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
            <LogoBox component={Link} to="/explore">
              <HexagonIcon sx={{ color: '#FFC845', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
                UNIBEES
              </Typography>
            </LogoBox>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notification Bell */}
              <IconButton onClick={handleOpenNotifs}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton component={Link} to="/profile" sx={{ color: currentPath === '/profile' ? '#FFC845' : 'inherit' }}>
                <SettingsIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </TopHeader>

      {/* NOTIFICATION DROPDOWN MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseNotifs}
        PaperProps={{
          sx: { width: 320, maxHeight: 400, borderRadius: 4, mt: 1.5, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={900}>Hive Alerts</Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={() => setNotifications([])} sx={{ color: '#FFC845', fontWeight: 800 }}>Clear All</Button>
          )}
        </Box>
        <Divider />
        
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No new buzzes yet.</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notif, index) => (
              <ListItem key={index} sx={{ py: 2, alignItems: 'flex-start' }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#FFFBEB', color: '#FFC845', border: '1px solid #FFC845' }}>
                    <PersonAddIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={700}>
                    {notif.from_name || "A Bee"} sent you a request!
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Wants to join your swarm
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button 
                      size="small" variant="contained" 
                      sx={{ bgcolor: '#FFC845', color: '#000', borderRadius: 2, fontWeight: 800, fontSize: '0.7rem' }}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="small" variant="outlined" 
                      sx={{ borderRadius: 2, fontWeight: 800, fontSize: '0.7rem', color: 'text.secondary' }}
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
            <NavItem 
              component={Link}
              to={tab.path}
              active={currentPath === tab.path ? 1 : 0}
            >
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