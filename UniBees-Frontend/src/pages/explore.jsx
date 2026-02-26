import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Stack,
  alpha,
  useTheme,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import { 
  NotificationsNone as BellIcon,
  SettingsOutlined as SettingsIcon,
  Search as SearchIcon
} from '@mui/icons-material';


const Explore = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  // Asset paths
  const logoPath = "/src/assets/logo.png";

  // Mock Categories
  const categories = ['All', '#Coding', '#Sports', '#Study', '#Fashion', '#Gaming', '#Music'];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 5 }}>
      
      {/* 1. Header Bar */}
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
          zIndex: 1000,
          mb: 4
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
                sx={{ width: 54, height: 54, objectFit: 'contain' }}
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
x
            <Stack direction="row" spacing={1} alignItems="center">
              <Box 
                sx={{ 
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center', 
                  gap: 1, 
                  bgcolor: alpha('#10B981', 0.1), 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: 10,
                  mr: 1
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
                  287 Online
                </Typography>
              </Box>
              <IconButton color="inherit"><BellIcon /></IconButton>
              <IconButton color="inherit"><SettingsIcon /></IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md">
        {/* 2. Main Heading */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Active Swarms
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sorted by <span style={{ fontWeight: 700, color: theme.palette.text.primary }}>Nectar Quality (N)</span>
          </Typography>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search for a swarm or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 50,
              bgcolor: 'background.paper',
              px: 2,
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'primary.main' },
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Category Tags (Horizontal Scroll) */}
        <Stack 
          direction="row" 
          spacing={1.5} 
          sx={{ 
            mb: 5, 
            overflowX: 'auto', 
            pb: 1,
            // Hide scrollbar for Chrome/Safari
            '&::-webkit-scrollbar': { display: 'none' },
            // Hide scrollbar for IE/Edge/Firefox
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              clickable
              onClick={() => {}}
              sx={{
                px: 1,
                py: 2.5,
                borderRadius: 4,
                fontWeight: 700,
                fontSize: '0.9rem',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: category === 'All' ? 'text.primary' : 'background.paper',
                color: category === 'All' ? 'background.paper' : 'text.primary',
                '&:hover': {
                  bgcolor: category === 'All' ? 'text.primary' : alpha(theme.palette.primary.main, 0.1),
                  borderColor: 'primary.main',
                }
              }}
            />
          ))}
        </Stack>

        {/* Placeholder for future swarm cards */}
        <Box 
          sx={{ 
            py: 10, 
            textAlign: 'center', 
            border: '2px dashed', 
            borderColor: 'divider', 
            borderRadius: 8 
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Waiting for the nectar to flow...
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Swarm cards will be injected here.
          </Typography>
        </Box>
      </Container>

    </Box>
  );
};

export default Explore;