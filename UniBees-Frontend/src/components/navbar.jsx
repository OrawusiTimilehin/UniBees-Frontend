import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useLocation,
  Link 
} from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Button, 
  Skeleton, 
  Paper, 
  Chip, 
  Fab, 
  styled, 
  Fade, 
  Zoom,
  Divider,
  AppBar,
  Toolbar,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';

// MUI Icons
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TagIcon from '@mui/icons-material/Tag';
import HexagonIcon from '@mui/icons-material/Hexagon';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupsIcon from '@mui/icons-material/Groups';
import ForumIcon from '@mui/icons-material/Forum';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

/**
 * System Role: Senior Full-Stack Engineer
 * Project: UniBees (Campus Social Discovery)
 * * NOTE ON FILE STRUCTURE:
 * For the Canvas preview to function, all code is consolidated here. 
 * In a local IDE (Vite/CRA), you should move the sections below into 
 * their respective .jsx files as marked.
 */

// ==========================================
// SECTION: Constants & Shared Styles
// (Common/Styles.js or Constants.js)
// ==========================================
const hexagonClip = 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)';

// ==========================================
// SECTION: Navbar Components
// (Move to: src/components/Navbar.jsx)
// ==========================================

const TopHeader = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  color: '#1A1A1B',
  top: 0,
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
}));

const OnlineStatus = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  backgroundColor: 'rgba(0, 0, 0, 0.03)',
  padding: '4px 12px',
  borderRadius: '20px',
  marginRight: theme.spacing(2),
}));

const FloatingNav = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: '8px 12px',
  borderRadius: '40px',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  zIndex: 1000,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(255, 200, 69, 0.2)',
    borderColor: '#FFC845',
  }
}));

const NavItem = styled(IconButton)(({ active }) => ({
  color: active ? '#1A1A1B' : 'rgba(26, 26, 27, 0.4)',
  backgroundColor: active ? '#FFC845' : 'transparent',
  padding: '12px',
  borderRadius: '50%',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: active ? '#FFC845' : 'rgba(255, 200, 69, 0.1)',
    color: active ? '#1A1A1B' : '#FFC845',
  },
  '& svg': {
    fontSize: 26,
  }
}));

const HexAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  border: '2px solid #FFC845',
  bgcolor: '#F5F5F5',
  cursor: 'pointer',
  clipPath: hexagonClip,
});

const Navbar = ({ activeTab = 'match', onlineCount = 1242 }) => {
  const tabs = [
    { id: 'explore', icon: <ExploreIcon />, label: 'Explore', path: '/explore' },
    { id: 'match', icon: <GroupsIcon />, label: 'Bees Match', path: '/bees-match' },
    { id: 'chats', icon: <ForumIcon />, label: 'Personal Chats', path: '/personal-chats' },
  ];

  return (
    <>
      <TopHeader position="fixed" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 70, justifyContent: 'space-between' }}>
            <LogoBox component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
              <HexagonIcon sx={{ color: '#FFC845', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
                UNIBEES
              </Typography>
            </LogoBox>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <OnlineStatus sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <FiberManualRecordIcon sx={{ color: '#4CAF50', fontSize: 10 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'rgba(0,0,0,0.6)' }}>
                  {onlineCount.toLocaleString()} ONLINE
                </Typography>
              </OnlineStatus>
              
              <Tooltip title="View Profile">
                <HexAvatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" />
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </TopHeader>

      <FloatingNav elevation={0}>
        {tabs.map((tab) => (
          <Tooltip key={tab.id} title={tab.label} arrow placement="top">
            <NavItem 
              component={Link}
              to={tab.path}
              active={activeTab === tab.id ? 1 : 0}
              aria-label={tab.label}
            >
              {tab.id === 'chats' ? (
                <Badge 
                  badgeContent={3} 
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      bgcolor: '#FFC845', 
                      color: '#1A1A1B', 
                      fontWeight: 900,
                      border: '2px solid #FFFFFF'
                    } 
                  }}
                >
                  {tab.icon}
                </Badge>
              ) : (
                tab.icon
              )}
            </NavItem>
          </Tooltip>
        ))}
      </FloatingNav>
      <Box sx={{ height: 70 }} />
    </>
  );
};


export default Navbar;