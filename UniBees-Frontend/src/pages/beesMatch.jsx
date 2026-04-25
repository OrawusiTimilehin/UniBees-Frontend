import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Container, Typography, IconButton, Paper, 
  Chip, Stack, styled, alpha, Fade, Zoom, LinearProgress, Divider, Button
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Favorite as FavoriteIcon, 
  Groups as GroupsIcon,
  LocalFlorist as FlowerIcon,
  LockClock as LockIcon,
  ElectricBolt as PulseIcon,
  EmojiEvents as MatchIcon
} from '@mui/icons-material';

/**
 * APOLLO CLIENT & SOCKET.IO
 */
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import io from 'socket.io-client';

const DISCOVER_BEES = gql`
  query DiscoverBees {
    me {
      id
      interests
      participatedSwarms
      swipesToday
    }
    discoverBees {
      id
      name
      major
      rank
      interests
      image
      participatedSwarms
    }
  }
`;

// --- STYLED COMPONENTS ---

const DiscoveryCard = styled(Paper)(({ theme }) => ({
  borderRadius: '32px',
  padding: '32px',
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
  textAlign: 'center',
  backgroundColor: '#FFF',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '400px'
}));

const HexagonAvatar = styled(Box)({
  width: 180,
  height: 180,
  margin: '0 auto 24px',
  backgroundColor: '#FFC845',
  clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: '92%',
    height: '92%',
    objectFit: 'cover',
    clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
    backgroundColor: '#FFF'
  }
});

const BeesMatch = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [socket, setSocket] = useState(null);
  const [matchAlert, setMatchAlert] = useState(null);

  const { data, loading, refetch } = useQuery(DISCOVER_BEES, { fetchPolicy: 'network-only' });

  useEffect(() => {
    if (!data?.me?.id) return;
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    newSocket.emit('identify_bee', { user_id: data.me.id });

    newSocket.on('new_match', (notif) => {
      setMatchAlert(notif);
    });

    newSocket.on('swipe_success', () => {
      setTimeout(() => {
        setIndex(prev => prev + 1);
        setIsAnimating(false);
        refetch(); // Refresh swipesToday
      }, 300);
    });

    newSocket.on('swipe_error', (err) => {
      alert(err.message);
      setIsAnimating(false);
    });

    return () => newSocket.close();
  }, [data?.me?.id, refetch]);

  const bees = data?.discoverBees || [];
  const me = data?.me;
  const currentBee = bees[index];
  const quotaReached = (me?.swipesToday || 0) >= 5;

  /**
   * HIVE REINFORCEMENT ALGORITHM (Frontend Simulation)
   * 1. Check shared personal tags (interests).
   * 2. Check shared swarm activity (participatedSwarms).
   */
  const matchStats = useMemo(() => {
    if (!me || !currentBee) return { score: 0, commonSwarms: 0 };
    
    const myInterests = new Set(me.interests || []);
    const theirInterests = currentBee.interests || [];
    const sharedInterests = theirInterests.filter(i => myInterests.has(i)).length;

    const mySwarms = new Set(me.participatedSwarms || []);
    const theirSwarms = currentBee.participatedSwarms || [];
    const sharedSwarms = theirSwarms.filter(s => mySwarms.has(s)).length;

    // Calculation: Base 50 + (Interests * 10) + (Swarm Overlap * 20)
    // Hive Reinforcement weight is higher (20) than tags (10)
    const score = 50 + (sharedInterests * 10) + (sharedSwarms * 20);
    
    return {
      score: Math.min(99, score),
      commonSwarms: sharedSwarms,
      commonInterests: sharedInterests
    };
  }, [me, currentBee]);

  const handleSwipe = (action) => {
    if (isAnimating || quotaReached || !currentBee) return;
    setIsAnimating(true);
    socket.emit('handle_swipe', {
      user_id: me.id,
      target_id: currentBee.id,
      action
    });
  };

  if (loading) return <Box sx={{ p: 10, textAlign: 'center' }}><LinearProgress sx={{ color: '#FFC845' }} /></Box>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FDFDFD', pb: 15 }}>
      <Container maxWidth="xs" sx={{ pt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <GroupsIcon sx={{ color: '#FFC845' }} /> HIVE DISCOVERY
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>
            {quotaReached ? "DAILY LIMIT REACHED" : `BEE ANALYSIS ${me?.swipesToday || 0}/5`}
          </Typography>
        </Box>

        {quotaReached ? (
          <Fade in>
            <Paper elevation={0} sx={{ p: 6, borderRadius: 8, textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#FFFBEB' }}>
              <LockIcon sx={{ fontSize: 60, color: '#FFC845', mb: 2 }} />
              <Typography variant="h5" fontWeight={900}>Hive Resting</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
                You have analyzed 5 bees today. This limit ensures high-quality pollen matches and avoids hive burnout.
              </Typography>
              <Button fullWidth variant="outlined" sx={{ borderRadius: 3, fontWeight: 900, color: '#FFC845', borderColor: '#FFC845' }}>View Connections</Button>
            </Paper>
          </Fade>
        ) : currentBee ? (
          <Fade in={!isAnimating}>
            <Box>
              <DiscoveryCard elevation={0}>
                <HexagonAvatar>
                  <img src={currentBee.image} alt={currentBee.name} />
                </HexagonAvatar>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                   <Typography variant="h2" fontWeight={900} sx={{ color: '#FFC845', lineHeight: 1 }}>{matchStats.score}%</Typography>
                </Box>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 2 }}>
                  REINFORCEMENT MATCH
                </Typography>

                <Box sx={{ mt: 3, mb: 1 }}>
                  <Typography variant="h5" fontWeight={900}>{currentBee.name}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={700}>{currentBee.major}</Typography>
                  <Chip label={currentBee.rank} size="small" sx={{ mt: 1, bgcolor: '#FFC845', fontWeight: 900, fontSize: '0.65rem' }} />
                </Box>

                <Divider sx={{ my: 3, opacity: 0.5 }} />

                <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={900} color={matchStats.commonSwarms > 0 ? '#FF3D00' : 'inherit'}>
                      {matchStats.commonSwarms}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 8, fontWeight: 900 }}>SHARED HIVES</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={900}>{matchStats.commonInterests}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 8, fontWeight: 900 }}>SHARED POLLEN</Typography>
                  </Box>
                </Stack>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                  {currentBee.interests.map(i => (
                    <Chip 
                      key={i} label={i} size="small" 
                      variant={me.interests.includes(i) ? "filled" : "outlined"}
                      sx={{ 
                        fontWeight: 700, fontSize: '0.7rem',
                        bgcolor: me.interests.includes(i) ? alpha('#FFC845', 0.2) : 'transparent',
                        color: me.interests.includes(i) ? '#000' : 'text.secondary'
                      }} 
                    />
                  ))}
                </Box>
              </DiscoveryCard>

              <Stack direction="row" spacing={6} justifyContent="center" sx={{ mt: 5 }}>
                <IconButton 
                  onClick={() => handleSwipe('PASS')}
                  sx={{ width: 72, height: 72, bgcolor: '#FFF', border: '1px solid #EEE', '&:hover': { bgcolor: '#F5F5F5' } }}
                >
                  <CloseIcon sx={{ fontSize: 36, color: '#999' }} />
                </IconButton>
                <IconButton 
                  onClick={() => handleSwipe('LIKE')}
                  sx={{ width: 72, height: 72, bgcolor: '#FFC845', color: '#000', boxShadow: '0 8px 25px rgba(255, 200, 69, 0.4)', '&:hover': { bgcolor: '#f2be41' } }}
                >
                  <FavoriteIcon sx={{ fontSize: 36 }} />
                </IconButton>
              </Stack>
            </Box>
          </Fade>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <GroupsIcon sx={{ fontSize: 60, opacity: 0.1, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight={900}>Scanning Sector...</Typography>
            <Typography variant="body2" color="text.secondary">No more bees nearby right now. Refill your pollen bag!</Typography>
          </Box>
        )}
      </Container>

      {/* MATCH ALERT OVERLAY */}
      {matchAlert && (
        <Fade in>
          <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.85)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Zoom in style={{ transitionDelay: '200ms' }}>
                <Box sx={{ width: 120, height: 120, bgcolor: '#FFC845', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <MatchIcon sx={{ fontSize: 60, color: '#000' }} />
                </Box>
              </Zoom>
              <Typography variant="h3" color="#FFF" fontWeight={900} gutterBottom>HIVE MATCH!</Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.7)" sx={{ mb: 6 }}>
                You and {matchAlert.partner_name} have established a connection.
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => navigate(`/chat/${matchAlert.partner_id}`)}
                sx={{ bgcolor: '#FFC845', color: '#000', px: 6, py: 2, borderRadius: 4, fontWeight: 900, fontSize: '1.1rem' }}
              >
                Start Buzzing
              </Button>
              <Button 
                fullWidth sx={{ mt: 2, color: '#FFF' }}
                onClick={() => setMatchAlert(null)}
              >
                Keep Exploring
              </Button>
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default BeesMatch;