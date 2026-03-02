import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';



// --- STYLED COMPONENTS ---

const hexagonClip = 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)';

const HexagonContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '240px',
  height: '240px',
  margin: '0 auto',
  clipPath: hexagonClip,
  backgroundColor: '#FFC845',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '6px',
    backgroundColor: '#FFFFFF',
    clipPath: hexagonClip,
    zIndex: 1,
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 2,
    clipPath: hexagonClip,
  }
}));

const MatchScore = styled(Typography)(({ theme }) => ({
  color: '#FFC845',
  fontWeight: 900,
  fontSize: '2.5rem',
  textAlign: 'center',
  textShadow: '2px 2px 0px rgba(26, 26, 27, 0.05)',
  lineHeight: 1,
  marginTop: theme.spacing(2),
}));

const DiscoveryCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '32px',
  padding: theme.spacing(4),
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04)',
  position: 'relative',
  overflow: 'hidden',
}));

const ActionFab = styled(Fab)(({ variantType }) => ({
  backgroundColor: variantType === 'match' ? '#FFC845' : '#FFFFFF',
  color: variantType === 'match' ? '#1A1A1B' : '#FFC845',
  border: variantType === 'match' ? 'none' : '2px solid #FFC845',
  width: '72px',
  height: '72px',
  boxShadow: variantType === 'match' ? '0 8px 20px rgba(255, 200, 69, 0.4)' : 'none',
  '&:hover': {
    backgroundColor: variantType === 'match' ? '#e6b43d' : 'rgba(255, 200, 69, 0.05)',
  }
}));

// --- MOCK DATA ---

const MOCK_PROFILES = [
  {
    id: 1,
    name: "Elena Vance",
    rank: "ELDER BEE",
    major: "Architectural Design",
    match: 98,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    sharedPollen: ["Generative Art", "Urban Sketching", "Sustainable Tech"],
    allInterests: ["Generative Art", "Urban Sketching", "Sustainable Tech", "Lo-fi Beats", "Tennis"]
  },
  {
    id: 2,
    name: "Marcus Thorne",
    rank: "WORKER BEE",
    major: "Computer Architecture",
    match: 84,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    sharedPollen: ["Cyber-Security", "Node.js"],
    allInterests: ["Cyber-Security", "Node.js", "Climbing", "Coffee Roasting"]
  },
  {
    id: 3,
    name: "Sarah Chen",
    rank: "SCOUT",
    major: "Bio-Engineering",
    match: 92,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop",
    sharedPollen: ["Biomimicry", "Hive Mind", "Sustainable Tech"],
    allInterests: ["Biomimicry", "Hive Mind", "Sustainable Tech", "Hiking", "Vinyl"]
  },
  {
    id: 4,
    name: "Leo Garcia",
    rank: "LARVA",
    major: "Digital Philosophy",
    match: 76,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop",
    sharedPollen: ["Ethics", "AI Aesthetics"],
    allInterests: ["Ethics", "AI Aesthetics", "Surfing", "Chess"]
  },
  {
    id: 5,
    name: "Maya Patel",
    rank: "SCOUT",
    major: "Applied Neuroscience",
    match: 89,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
    sharedPollen: ["Cognitive Design", "Neuro-music"],
    allInterests: ["Cognitive Design", "Neuro-music", "Yoga", "Podcasting"]
  }
];



const BeesMatch = () => {
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(true);

  const currentProfile = MOCK_PROFILES[index];

  useEffect(() => {
    // Initial loading shimmer effect
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = () => {
    setShowProfile(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % MOCK_PROFILES.length);
      setShowProfile(true);
    }, 300);
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pt: 4 }}>
        <Container maxWidth="xs">
          <Skeleton variant="rectangular" height={500} sx={{ borderRadius: '32px', bgcolor: 'rgba(0,0,0,0.03)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
            <Skeleton variant="circular" width={72} height={72} />
            <Skeleton variant="circular" width={72} height={72} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', color: '#1A1A1B', pb: 12 }}>
      {/* Page Header */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <GroupsIcon sx={{ color: '#FFC845' }} /> HIVE DISCOVERY
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)', fontWeight: 700, letterSpacing: 1 }}>
          FINDING SWARM MEMBERS NEARBY
        </Typography>
      </Box>

      <Container maxWidth="xs">
        <Fade in={showProfile} timeout={300}>
          <Box>
            <DiscoveryCard elevation={0}>
              <HexagonContainer>
                <img src={currentProfile.image} alt={currentProfile.name} />
              </HexagonContainer>

              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <MatchScore>{currentProfile.match}%</MatchScore>
                <Typography variant="overline" sx={{ color: '#FFC845', fontWeight: 900, letterSpacing: 2 }}>
                  POLLEN MATCH
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{currentProfile.name}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)', mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 16 }} /> {currentProfile.major}
                </Typography>
                
                <Chip 
                  label={currentProfile.rank} 
                  sx={{ 
                    bgcolor: '#FFC845', 
                    color: '#0A0A0B', 
                    fontWeight: 800, 
                    fontSize: '0.7rem',
                    borderRadius: '6px',
                    height: '24px'
                  }} 
                />
              </Box>

              <Divider sx={{ my: 3, opacity: 0.1 }} />

              <Typography variant="overline" sx={{ color: 'rgba(0,0,0,0.4)', fontWeight: 800, mb: 1.5, display: 'block', textAlign: 'center' }}>
                SHARED POLLEN
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {currentProfile.allInterests.map((interest) => {
                  const isShared = currentProfile.sharedPollen.includes(interest);
                  return (
                    <Chip 
                      key={interest} 
                      label={interest} 
                      size="small"
                      icon={isShared ? <LocalFloristIcon sx={{ fontSize: '14px !important', color: '#1A1A1B !important' }} /> : undefined}
                      sx={{ 
                        bgcolor: isShared ? '#FFC845' : 'transparent', 
                        color: isShared ? '#1A1A1B' : 'rgba(0,0,0,0.6)', 
                        border: isShared ? 'none' : '1px solid rgba(0,0,0,0.1)',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }} 
                    />
                  );
                })}
              </Box>
            </DiscoveryCard>
          </Box>
        </Fade>

        {/* Action Controls */}
        <Box sx={{ 
          position: 'fixed', 
          bottom: 32, 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 4,
          zIndex: 10
        }}>
          <Zoom in={!loading}>
            <ActionFab onClick={handleAction} aria-label="pass">
              <CloseIcon sx={{ fontSize: 32 }} />
            </ActionFab>
          </Zoom>
          
          <Zoom in={!loading} style={{ transitionDelay: '100ms' }}>
            <ActionFab variantType="match" onClick={handleAction} aria-label="like">
              <FavoriteIcon sx={{ fontSize: 32 }} />
            </ActionFab>
          </Zoom>
        </Box>
      </Container>
    </Box>
  );
};

export default BeesMatch;