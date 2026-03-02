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
  Chip, 
  Grid, 
  Paper, 
  LinearProgress,
  styled 
} from '@mui/material';
import { 
  NotificationsNone as BellIcon, 
  SettingsOutlined as SettingsIcon, 
  Search as SearchIcon,
  ElectricBolt as ZapIcon,
  LocationOnOutlined as LocationIcon,
  PeopleAltOutlined as PeopleIcon,
  Whatshot as FireIcon
} from '@mui/icons-material';

// --- Styled Components for the Stigmergic UI ---

const PheromoneBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundImage: value > 80 
      ? `linear-gradient(90deg, #FFC845 0%, #FF4444 100%)` // High activity (Hot)
      : `linear-gradient(90deg, #FFC845 0%, #FF8C00 100%)`, // Normal activity
  },
}));

// Use shouldForwardProp to prevent custom 'hot' prop from reaching the DOM
const SwarmCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'hot',
})(({ theme, hot }) => ({
  // paddingX is increased for horizontal width, paddingY is kept tight
  padding: theme.spacing(4), 
  borderRadius: 24,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',           
  flexDirection: 'column',   
  width: '100%',             // Ensures it takes full width of the grid item
  border: `1px solid ${hot ? '#FFC845' : theme.palette.divider}`,
  boxShadow: hot ? `0 0 20px ${alpha('#FFC845', 0.15)}` : 'none',
  '&:hover': {
    transform: 'translateY(-6px)',
    borderColor: '#FFC845',
    boxShadow: `0 12px 30px ${alpha('#000', 0.1)}`,
  },
}));

/**
 * UniBees Explore Page
 * Includes Header, Search, Categories, and real-time Swarm Cards
 */
const Explore = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  // Asset paths
  const logoPath = "/src/assets/logo.png";

  // Mock Categories
  const categories = ['All', '#Coding', '#Sports', '#Study', '#Fashion', '#Gaming', '#Music'];

  // Mock Swarm Data (Matching the Pheromone Engine spec)
  const swarms = [
    { id: '1', title: 'Library Study Hive', category: 'Study', pheromone: 85, bees: 12, location: 'Level 3, Main Lib' },
    { id: '2', title: 'Coffee Buzz', category: 'Social', pheromone: 42, bees: 8, location: 'Student Union' },
    { id: '3', title: 'Gym Swarm', category: 'Fitness', pheromone: 15, bees: 3, location: 'Campus Gym' },
    { id: '4', title: 'Late Night Coding', category: 'Gaming', pheromone: 96, bees: 21, location: 'CS Lab 2' },
    { id: '5', title: 'Fashion Studio', category: 'Creative', pheromone: 60, bees: 5, location: 'Art Block' },
    { id: '6', title: 'Music Jam', category: 'Music', pheromone: 30, bees: 4, location: 'Music Room B' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 12 }}>
      
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
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box 
                component="img"
                src={logoPath}
                alt="Logo"
                sx={{ width: 54, height: 54, objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                Hive <span style={{ color: '#FFC845' }}>Mind</span>
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, bgcolor: alpha('#10B981', 0.1), px: 1.5, py: 0.5, borderRadius: 10 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#10B981' }}>287 Online</Typography>
              </Box>
              <IconButton color="inherit"><BellIcon /></IconButton>
              <IconButton color="inherit"><SettingsIcon /></IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* 2. Main Heading */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, fontSize: { xs: '2.4rem', md: '3rem' } }}>
            Active Swarms
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sorted by <span style={{ fontWeight: 700, color: theme.palette.text.primary }}>Nectar Quality (N)</span>
          </Typography>
        </Box>

        {/* 3. Search Bar */}
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
              '& fieldset': { borderColor: 'divider' },
              height: 64
            }
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end"><SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 28 }} /></InputAdornment>,
          }}
        />

        {/* 4. Category Tags */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 6, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              clickable
              sx={{
                px: 2, py: 3, borderRadius: 4, fontWeight: 700,
                fontSize: '1rem',
                bgcolor: category === 'All' ? 'text.primary' : 'background.paper',
                color: category === 'All' ? 'background.paper' : 'text.primary',
                border: '1px solid',
                borderColor: 'divider'
              }}
            />
          ))}
        </Stack>

        {/* 5. Swarm Card Grid - Fixed horizontal overlap by removing manual margin overrides */}
        <Grid container spacing={4} rowSpacing={8}>
          {swarms.map((swarm) => (
            <Grid item xs={12} md={6} key={swarm.id}>
              <SwarmCard elevation={0} hot={swarm.pheromone > 80}>
                
                {/* Top Row: Tag + Score */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: alpha('#FFC845', 0.1), px: 2, py: 0.8, borderRadius: 3 }}>
                    <ZapIcon sx={{ fontSize: 20, color: '#FFC845' }} />
                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#FFC845', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                      {swarm.category}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" sx={{ lineHeight: 1, color: swarm.pheromone > 80 ? '#FFC845' : 'inherit', fontWeight: 900 }}>
                      {swarm.pheromone}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                      Nectar N
                    </Typography>
                  </Box>
                </Stack>

                {/* Swarm Title */}
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>
                  {swarm.title}
                </Typography>

                {/* Metadata: Location & Bee Count */}
                <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{swarm.location}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PeopleIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{swarm.bees} Bees</Typography>
                  </Stack>
                </Stack>

                {/* Spacer to push Pheromone bar to the bottom */}
                <Box sx={{ flexGrow: 1, minHeight: 20 }} />

                {/* Pheromone Level Indicator */}
                <Box sx={{ mt: 'auto' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', fontSize: 11, textTransform: 'uppercase' }}>
                      Pheromone Level
                    </Typography>
                    {swarm.pheromone > 80 && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <FireIcon sx={{ fontSize: 18, color: '#FF4444' }} />
                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#FF4444', textTransform: 'uppercase' }}>Hot</Typography>
                      </Stack>
                    )}
                  </Stack>
                  <PheromoneBar variant="determinate" value={swarm.pheromone} />
                </Box>
              </SwarmCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Explore;