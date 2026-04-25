import React from 'react';
import { 
  Box, Container, Typography, Button, Stack, Paper, 
  Grid, styled, alpha, useTheme, useMediaQuery, 
  IconButton, Divider
} from '@mui/material';
import { 
  ArrowForward as ArrowIcon, 
  Hexagon as HexagonIcon,
  Groups as GroupsIcon,
  ElectricBolt as PulseIcon,
  LocalFlorist as PollenIcon,
  Language as HiveIcon,
  AutoGraph as TrendingIcon,
  NorthEast as ExploreIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';


const GlassNavbar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backdropFilter: 'blur(12px)',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  padding: '16px 0',
}));

const HeroWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: '120px',
  background: `linear-gradient(135deg, ${alpha('#FFC845', 0.05)} 0%, #FFFFFF 50%, ${alpha('#FFC845', 0.1)} 100%)`,
  position: 'relative',
  overflow: 'hidden',
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '32px',
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 30px 60px rgba(255, 200, 69, 0.15)',
    border: '1px solid #FFC845',
  }
}));

const AlgorithmBadge = styled(Box)(({ theme }) => ({
  padding: '8px 16px',
  borderRadius: '50px',
  backgroundColor: '#000',
  color: '#FFC845',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: 900,
  fontSize: '0.75rem',
  letterSpacing: '1px',
  marginBottom: '24px',
}));


const SwarmPulseMockup = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '450px',
  height: '550px',
  borderRadius: '40px',
  backgroundColor: '#1A1A1B',
  position: 'relative',
  padding: '30px',
  boxShadow: '0 50px 100px rgba(0,0,0,0.2)',
  transform: 'rotate(2deg)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: -2,
    borderRadius: '42px',
    background: 'linear-gradient(45deg, #FFC845, transparent, #FFC845)',
    zIndex: -1,
    opacity: 0.5,
  }
}));

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ bgcolor: '#FFF', color: '#1A1A1B' }}>

      <GlassNavbar>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HexagonIcon sx={{ color: '#FFC845', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -1 }}>UNIBEES</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button onClick={() => navigate('/login')} sx={{ fontWeight: 800, color: '#000', textTransform: 'none' }}>Login</Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/signup')}
              sx={{ bgcolor: '#000', color: '#FFC845', borderRadius: 3, px: 3, fontWeight: 900, textTransform: 'none', '&:hover': { bgcolor: '#333' } }}
            >
              Start Buzzing
            </Button>
          </Stack>
        </Container>
      </GlassNavbar>

      {/* --- HERO SECTION --- */}
      <HeroWrapper>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={7}>
              <AlgorithmBadge>
                <PulseIcon sx={{ fontSize: 16 }} /> STIGMERGIC PROTOCOL v2.5 ACTIVE
              </AlgorithmBadge>
              
              <Typography variant={isMobile ? "h2" : "h1"} sx={{ fontWeight: 900, letterSpacing: -3, lineHeight: 0.9, mb: 3 }}>
                Experience <br />
                <span style={{ color: '#FFC845', textShadow: '2px 2px 0px #000' }}>Campus Flow</span> <br />
                In Real-Time.
              </Typography>
              
              <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: 1.6, mb: 6, maxWidth: '500px' }}>
                Stop searching. Start sensing. UniBees uses social pheromones to map the hottest events, swarms, and connections on campus right now.
              </Typography>

              <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{ 
                    bgcolor: '#FFC845', color: '#000', px: 6, py: 2.5, borderRadius: '20px', 
                    fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 20px 40px rgba(255, 200, 69, 0.4)',
                    textTransform: 'none', '&:hover': { bgcolor: '#e6b43d' } 
                  }}
                >
                  Join the Hive
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" fontWeight={800} color="text.secondary">
                    Active Bees: <span style={{ color: '#000' }}>2,842</span>
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="body2" fontWeight={800} color="text.secondary">
                    Live Swarms: <span style={{ color: '#000' }}>148</span>
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {!isMobile && (
              <Grid item md={5}>
                {/* Visual Mockup of the UI Algorithm */}
                <SwarmPulseMockup>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900 }}>SCANNING SECTOR 04</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                       <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#FFC845' }} />
                       <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
                    </Box>
                  </Box>
                  
                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                       <Box sx={{ width: 40, height: 40, bgcolor: '#FFC845', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography fontWeight={900}>94</Typography>
                       </Box>
                       <Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFF', fontWeight: 900 }}>Late Night Coders</Typography>
                          <Typography variant="caption" sx={{ color: '#FFC845', fontWeight: 700 }}>FRENZY DETECTED</Typography>
                       </Box>
                    </Stack>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, opacity: 0.8 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                       <Box sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography color="#FFF" fontWeight={900}>62</Typography>
                       </Box>
                       <Box>
                          <Typography variant="subtitle2" sx={{ color: '#FFF', opacity: 0.8 }}>Coffee Buzz</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>Quiet</Typography>
                       </Box>
                    </Stack>
                  </Paper>

                  <Box sx={{ mt: 'auto', textAlign: 'center' }}>
                     <Box sx={{ position: 'relative', width: '100%', height: 120, mb: 2 }}>
                        {/* SVG Pulse Line */}
                        <svg width="100%" height="100%" viewBox="0 0 200 100">
                           <path d="M0 50 Q 25 10, 50 50 T 100 50 T 150 50 T 200 50" fill="none" stroke="#FFC845" strokeWidth="2" />
                        </svg>
                     </Box>
                     <Typography sx={{ color: '#FFC845', fontSize: '0.7rem', fontWeight: 900 }}>LIVE PHEROMONE DENSITY</Typography>
                  </Box>
                </SwarmPulseMockup>
              </Grid>
            )}
          </Grid>
        </Container>
      </HeroWrapper>

      <Box sx={{ py: 20, bgcolor: '#000', color: '#FFF' }}>
        <Container maxWidth="lg">
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} md={6}>
               <Typography variant="overline" sx={{ color: '#FFC845', fontWeight: 900, letterSpacing: 3 }}>BEYOND SOCIAL MEDIA</Typography>
               <Typography variant="h3" sx={{ fontWeight: 900, mt: 2, mb: 4 }}>What is <span style={{ color: '#FFC845' }}>Stigmergy</span>?</Typography>
               <Typography variant="h6" sx={{ opacity: 0.7, fontWeight: 400, lineHeight: 1.8 }}>
                 In nature, bees don't need a manager. They leave pheromone trails in the environment that guide the rest of the swarm to nectar. 
                 <br /><br />
                 UniBees brings this to your campus. Every message, every upvote, and every shared interest leaves a digital trail. The app automatically maps these trails, creating a living heatmap of your social environment.
               </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
               <Grid container spacing={3}>
                  <Grid item xs={6}>
                     <GlassCard sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <PulseIcon sx={{ color: '#FFC845', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#FFF', fontWeight: 900 }}>Real-Time</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Decays every 120 minutes to keep info fresh.</Typography>
                     </GlassCard>
                  </Grid>
                  <Grid item xs={6} sx={{ mt: 4 }}>
                     <GlassCard sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <HiveIcon sx={{ color: '#FFC845', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#FFF', fontWeight: 900 }}>Collective</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Data is driven by the movement of the crowd.</Typography>
                     </GlassCard>
                  </Grid>
               </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Box sx={{ textAlign: 'center', mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: -2 }}>Three Pillars of the Hive</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <GlassCard elevation={0}>
              <Box sx={{ width: 60, height: 60, bgcolor: '#000', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                 <TrendingIcon sx={{ color: '#FFC845' }} />
              </Box>
              <Typography variant="h5" fontWeight={900} gutterBottom>Nectar Quality</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ lineHeight: 1.6 }}>
                Our algorithm scores swarms based on density and frequency. Find where the pulse is highest without scrolling through endless feeds.
              </Typography>
            </GlassCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <GlassCard elevation={0}>
              <Box sx={{ width: 60, height: 60, bgcolor: '#000', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                 <PollenIcon sx={{ color: '#FFC845' }} />
              </Box>
              <Typography variant="h5" fontWeight={900} gutterBottom>Pollen Matching</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ lineHeight: 1.6 }}>
                Meet bees who share your "pollen bag." We match you based on shared swarm participation and academic sectors for deeper connections.
              </Typography>
            </GlassCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <GlassCard elevation={0}>
              <Box sx={{ width: 60, height: 60, bgcolor: '#000', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                 <GroupsIcon sx={{ color: '#FFC845' }} />
              </Box>
              <Typography variant="h5" fontWeight={900} gutterBottom>Stigmergic Mapping</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ lineHeight: 1.6 }}>
                Visualize your campus like never before. See where the buzzing is localized and join the swarm before the pheromones evaporate.
              </Typography>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ py: 15, textAlign: 'center', position: 'relative' }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ 
            p: { xs: 6, md: 10 }, 
            borderRadius: '40px', 
            bgcolor: '#FFC845', 
            color: '#000',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: -2 }}>Stop Browsing. <br /> Start Buzzing.</Typography>
            <Typography variant="h6" sx={{ mb: 6, fontWeight: 500, opacity: 0.8 }}>Ready to sync your frequency with the campus hive?</Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ 
                bgcolor: '#000', color: '#FFC845', px: 8, py: 2.5, borderRadius: '20px', 
                fontWeight: 900, fontSize: '1.2rem', textTransform: 'none',
                '&:hover': { bgcolor: '#222' }
              }}
            >
              Enter the Swarm
            </Button>
            
            {/* Background Hexagon Decoration */}
            <HexagonIcon sx={{ position: 'absolute', top: -40, right: -40, fontSize: 200, opacity: 0.1 }} />
            <HexagonIcon sx={{ position: 'absolute', bottom: -40, left: -40, fontSize: 180, opacity: 0.1 }} />
          </Paper>
        </Container>
      </Box>

      <Box sx={{ py: 8, textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <Typography variant="body2" color="text.secondary" fontWeight={700}>
          © 2026 UNIBEES • BUILT FOR THE COLLECTIVE • STIGMERGIC DISCOVERY PROTOCOL
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;