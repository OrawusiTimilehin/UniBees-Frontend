import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container, 
  styled,
  Paper,
  Tooltip,
  IconButton,
  Badge
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// Icons
import HexagonIcon from '@mui/icons-material/Hexagon';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupsIcon from '@mui/icons-material/Groups';
import ForumIcon from '@mui/icons-material/Forum';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

/**
 * Component: Navbar
 * Recreated based on the "Hive Mind" screenshot.
 * Updated branding: "Uni" (Black) "Bees" (Yellow).
 */

const TopHeader = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  color: '#1A1A1B',
  top: 0,
}));

const LogoBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  textDecoration: 'none',
  color: 'inherit'
});

const OnlinePill = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: '#F0F9F4', // Very pale green
  padding: '6px 16px',
  borderRadius: '24px',
  marginRight: theme.spacing(2),
}));

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
    color: active ? '#1A1A1B' : '#FFC845',
  },
  '& svg': { fontSize: 26 }
}));

const Navbar = ({ onlineCount = 287 }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { id: 'explore', icon: <ExploreIcon />, label: 'Explore', path: '/explore' },
    { id: 'match', icon: <GroupsIcon />, label: 'Bees Match', path: '/match' },
    { id: 'chats', icon: <ForumIcon />, label: 'Personal Chats', path: '/chats' },
  ];

  return (
    <>
      <TopHeader position="fixed" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 80, justifyContent: 'space-between' }}>
            
            {/* Logo Section */}
            <LogoBox component={Link} to="/match">
              {/* Using a Hexagon styled to look like the bee icon in your screenshot */}
              <Box component="img" src="/src/assets/logo.png" sx={{ width: 32, height: 32 }} />
              
              <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center' }}>
                Uni<span style={{ color: '#FFC845', marginLeft: '4px' }}>Bees</span>
              </Typography>
            </LogoBox>

            {/* Status & Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <OnlinePill>
                <FiberManualRecordIcon sx={{ color: '#52C41A', fontSize: 12 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#52C41A' }}>
                  {onlineCount} Online
                </Typography>
              </OnlinePill>
              
              <IconButton sx={{ color: '#1A1A1B' }}>
                <Badge variant="dot" color="error">
                  <NotificationsNoneIcon sx={{ fontSize: 28 }} />
                </Badge>
              </IconButton>

              <IconButton 
                component={Link} 
                to="/profile"
                sx={{ 
                  color: currentPath === '/profile' ? '#FFC845' : '#1A1A1B',
                  transition: '0.2s'
                }}
              >
                <SettingsOutlinedIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>

          </Toolbar>
        </Container>
      </TopHeader>

      {/* Persistent Floating Navigation for App Logic */}
      <FloatingNav elevation={0}>
        {tabs.map((tab) => (
          <Tooltip key={tab.id} title={tab.label} arrow placement="top">
            <NavItem 
              component={Link}
              to={tab.path}
              active={currentPath === tab.path ? 1 : 0}
            >
              {tab.id === 'chats' ? (
                <Badge badgeContent={3} sx={{ '& .MuiBadge-badge': { bgcolor: '#FFC845', color: '#1A1A1B', fontWeight: 900 } }}>
                  {tab.icon}
                </Badge>
              ) : tab.icon}
            </NavItem>
          </Tooltip>
        ))}
      </FloatingNav>
      
      {/* Spacer to prevent content from going under the header */}
      <Box sx={{ height: 80 }} />
    </>
  );
};

export default Navbar;