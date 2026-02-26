import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import { 
  NotificationsNone as BellIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material';


const Explore = () => {
  const theme = useTheme();

  // Asset paths
  const logoPath = "/src/assets/logo.png";

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      
      {/* Header Bar */}
      <Box 
        sx={{ 
          pt: 3, 
          pb: 2, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <Container maxWidth="md">
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
          >
            {/* Left Section: Logo + Hive Mind */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box 
                component="img"
                src={logoPath}
                alt="Logo"
                sx={{ width: 60, height: 60, objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 900, 
                  letterSpacing: '-0.02em',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Hive <span style={{ color: '#FFC845', marginLeft: '6px' }}>Mind</span>
              </Typography>
            </Stack>

            {/* Right Section: Online Status + Actions */}
            <Stack direction="row" spacing={1} alignItems="center">
              
              {/* People Online Badge */}
              <Box 
                sx={{ 
                  display: { xs: 'none', sm: 'flex' }, // Hide on very small screens
                  alignItems: 'center', 
                  gap: 1, 
                  bgcolor: alpha('#10B981', 0.1), 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: 10,
                  mr: 1
                }}
              >
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: '#10B981',
                    boxShadow: '0 0 8px #10B981'
                  }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}
                >
                  287 Online
                </Typography>
              </Box>

              <IconButton color="inherit">
                <BellIcon />
              </IconButton>
              
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Placeholder for future content */}
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          The swarms will appear here soon...
        </Typography>
      </Container>

    </Box>
  );
};

export default Explore;