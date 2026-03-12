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



const hexagonClip = 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)';

// Main Page Wrapper: Flexible container that centers content vertically
const PageWrapper = styled(Box)({
  minHeight: 'calc(100vh - 100px)', // Account for top header and general spacing
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: '120px', // Creates space specifically for the floating navbar
  overflow: 'hidden',
});

const HexagonContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 'clamp(160px, 35vh, 220px)', 
  height: 'clamp(160px, 35vh, 220px)',
  margin: '0 auto',
  clipPath: hexagonClip,
  backgroundColor: '#FFC845',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

const MatchScore = styled(Typography)({
  color: '#FFC845',
  fontWeight: 900,
  fontSize: '2.2rem',
  textAlign: 'center',
  lineHeight: 1,
  marginTop: '16px',
});

const DiscoveryCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '32px',
  padding: theme.spacing(4),
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04)',
  position: 'relative',
  width: '100%',
  maxWidth: '420px',
  margin: '0 auto',
}));

// Action Bar: Changed from position 'fixed' to 'relative' (part of the flex flow)
const ActionBar = styled(Box)({
  display: 'flex',
  gap: 32,
  marginTop: '24px', // Space between the card and the buttons
  zIndex: 10,
  justifyContent: 'center',
})

const ActionFab = styled(Fab)(({ varianttype }) => ({
  backgroundColor: varianttype === 'match' ? '#FFC845' : '#FFFFFF',
  color: varianttype === 'match' ? '#1A1A1B' : '#FFC845',
  border: varianttype === 'match' ? 'none' : '2px solid #FFC845',
  width: '68px',
  height: '68px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
  transition: 'transform 0.2s ease',
  '&:active': {
    transform: 'scale(0.9)',
  },
  '&:hover': {
    backgroundColor: varianttype === 'match' ? '#e6b43d' : 'rgba(255, 200, 69, 0.05)',
    boxShadow: varianttype === 'match' ? '0 8px 20px rgba(255, 200, 69, 0.4)' : '0 8px 20px rgba(0,0,0,0.1)',
  }
}));

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
  }
];

const BeesMatch = () => {
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(true);

  const currentProfile = MOCK_PROFILES[index % MOCK_PROFILES.length];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = () => {
    setShowProfile(false);
    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setShowProfile(true);
    }, 250);
  };

  if (loading) {
    return (
      <Container maxWidth="xs" sx={{ pt: 10 }}>
        <Skeleton variant="rectangular" height={450} sx={{ borderRadius: '32px' }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
          <Skeleton variant="circular" width={68} height={68} />
          <Skeleton variant="circular" width={68} height={68} />
        </Box>
      </Container>
    );
  }

  return (
    <PageWrapper>
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <GroupsIcon sx={{ color: '#FFC845' }} /> HIVE DISCOVERY
        </Typography>
      </Box>

      <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Fade in={showProfile} timeout={300}>
          <Box sx={{ width: '100%' }}>
            <DiscoveryCard elevation={0}>
              <HexagonContainer>
                <img src={currentProfile.image} alt={currentProfile.name} />
              </HexagonContainer>

              <Box sx={{ textAlign: 'center' }}>
                <MatchScore>{currentProfile.match}%</MatchScore>
                <Typography variant="overline" sx={{ color: '#FFC845', fontWeight: 900, letterSpacing: 2 }}>
                  POLLEN MATCH
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{currentProfile.name}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)', mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 16 }} /> {currentProfile.major}
                </Typography>
                
                <Chip 
                  label={currentProfile.rank} 
                  sx={{ bgcolor: '#FFC845', color: '#0A0A0B', fontWeight: 800, fontSize: '0.7rem', height: '24px', borderRadius: '6px' }} 
                />
              </Box>

              <Divider sx={{ my: 3, opacity: 0.1 }} />

              <Typography variant="overline" sx={{ color: 'rgba(0,0,0,0.4)', fontWeight: 800, mb: 1, display: 'block', textAlign: 'center' }}>
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
                        fontSize: '0.7rem'
                      }} 
                    />
                  );
                })}
              </Box>
            </DiscoveryCard>
          </Box>
        </Fade>

        {/* Action Buttons now sit in the flow below the card */}
        <ActionBar>
          <Zoom in={!loading}>
            <ActionFab onClick={handleAction} aria-label="pass">
              <CloseIcon sx={{ fontSize: 32 }} />
            </ActionFab>
          </Zoom>
          
          <Zoom in={!loading} style={{ transitionDelay: '100ms' }}>
            <ActionFab variantype="match" onClick={handleAction} aria-label="match">
              <FavoriteIcon sx={{ fontSize: 32 }} />
            </ActionFab>
          </Zoom>
        </ActionBar>
      </Container>
    </PageWrapper>
  );
};

export default BeesMatch;