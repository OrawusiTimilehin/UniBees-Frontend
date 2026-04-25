import React, { useState, useMemo } from 'react';
import { 
  Box, Container, Typography, IconButton, Button, Paper, 
  Chip, Stack, styled, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, InputAdornment,
  Grid, Card, CardContent, CardMedia, Skeleton, Alert, Snackbar, LinearProgress, alpha
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon,
  Groups as GroupsIcon,
  LocalFireDepartment as FireIcon,
  ElectricBolt as PulseIcon,
  Waves as WavesIcon
} from '@mui/icons-material';


import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';

// GRAPHQL OPERATIONS 

const GET_SWARMS = gql`
  query GetSwarms {
    swarms {
      id
      name
      description
      tags
      nectarQuality
      image
      members
    }
  }
`;

const CREATE_SWARM_MUTATION = gql`
  mutation CreateSwarm($name: String!, $description: String!, $tags: [String!]!) {
    createSwarm(name: $name, description: $description, tags: $tags) {
      id
      name
      tags
    }
  }
`;

// STYLED COMPONENTS 
const PheromoneMeter = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'energy'
})(({ energy }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: alpha('#000', 0.05),
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: 
      energy > 80 ? '#FF3D00' : 
      energy > 55 ? '#FFC845' : 
      '#BDBDBD',
    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
  }
}));

const PulseCardHorizontal = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'frenzy'
})(({ frenzy }) => ({
  borderRadius: '16px',
  border: frenzy ? '1px solid #FFC845' : '1px solid rgba(0,0,0,0.08)',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  display: 'flex', 
  flexDirection: 'row',
  height: '200px', 
  width: '100%',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
    borderColor: '#FFC845',
  },
  ...(frenzy && {
    animation: 'frenzy-pulse 2s infinite ease-in-out',
  }),
  '@keyframes frenzy-pulse': {
    '0%': { boxShadow: '0 0 0 0px rgba(255, 200, 69, 0.4)' },
    '70%': { boxShadow: '0 0 0 10px rgba(255, 200, 69, 0)' },
    '100%': { boxShadow: '0 0 0 0px rgba(255, 200, 69, 0)' },
  }
}));

const Explore = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  
  const [swarmName, setSwarmName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [errorToast, setErrorToast] = useState(null);

  const { data, loading, error } = useQuery(GET_SWARMS, {
    pollInterval: 20000,
    fetchPolicy: 'cache-and-network'
  });


  const [createSwarm, { loading: mutationLoading }] = useMutation(CREATE_SWARM_MUTATION, {
    refetchQueries: [{ query: GET_SWARMS }],
    onCompleted: () => handleClose(),
    onError: (err) => setErrorToast(err.message)
  });

  const popularTags = ['All', '#Coding', '#Sports', '#Study', '#Fashion', '#Gaming', '#Tech', '#Art'];

  const getVibeMetadata = (score) => {
    const val = score || 0;
    if (val > 80) return { label: 'FRENZY', icon: <FireIcon sx={{ fontSize: 14 }} />, color: '#FF3D00', pulse: true };
    if (val > 55) return { label: 'BUZZING', icon: <PulseIcon sx={{ fontSize: 14 }} />, color: '#FFC845', pulse: false };
    return { label: 'QUIET', icon: <WavesIcon sx={{ fontSize: 14 }} />, color: '#9E9E9E', pulse: false };
  };

  /**
   * FILTER LOGIC
   * Restoring null checks to prevent crashes when swarm data is incomplete.
   */
  const filteredSwarms = useMemo(() => {
    const swarms = data?.swarms;
    if (!swarms || !Array.isArray(swarms)) return [];
    
    return swarms.filter(swarm => {
      if (!swarm) return false;
      const nameMatch = (swarm.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      const swarmTags = swarm.tags || [];
      const tagMatch = activeTag === 'All' || swarmTags.some(t => {
        if (!t) return false;
        const cleanT = t.startsWith('#') ? t.toLowerCase() : `#${t.toLowerCase()}`;
        return cleanT === activeTag.toLowerCase();
      });
      return nameMatch && tagMatch;
    });
  }, [data, searchQuery, activeTag]);

  const handleClose = () => {
    setOpen(false);
    setSwarmName('');
    setDescription('');
    setTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <Box sx={{ bgcolor: '#F9F9F9', minHeight: '100vh', pt: 4, pb: 15 }}>
      <Container maxWidth="xl"> 
        
        {/* HEADER AREA */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: 1.5 }}>
          <Box>
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: -1.5, mb: 0.5 }}>Active Swarms</Typography>
            <Typography variant="body2" fontWeight={700} color="text.secondary">
              Sorted by <span style={{ color: '#000' }}>Nectar Quality (N)</span>
            </Typography>
          </Box>
          <Tooltip title="Start a Swarm">
            <IconButton 
              onClick={() => setOpen(true)}
              sx={{ bgcolor: '#FFC845', color: '#000', width: 64, height: 64, boxShadow: '0 8px 24px rgba(255, 200, 69, 0.3)', '&:hover': { bgcolor: '#e6b43d' } }}
            >
              <AddIcon sx={{ fontSize: 36 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* SEARCH BAR */}
        <Box sx={{ mb: 4, px: 1.5 }}>
          <TextField 
            fullWidth 
            placeholder="Search for swarms by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon color="disabled" /></InputAdornment>,
              sx: { borderRadius: '50px', bgcolor: '#FFF', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }
            }}
          />
        </Box>

        {/* TAG FILTERS */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 6, overflowX: 'auto', pb: 1, px: 1.5, '&::-webkit-scrollbar': { display: 'none' } }}>
          {popularTags.map(tag => (
            <Chip 
              key={tag} label={tag} clickable
              onClick={() => setActiveTag(tag)}
              sx={{ 
                fontWeight: 700, borderRadius: '10px', height: 40, px: 1,
                bgcolor: activeTag === tag ? '#FFC845' : '#FFF',
                color: activeTag === tag ? '#000' : 'text.secondary',
                border: activeTag === tag ? 'none' : '1px solid rgba(0,0,0,0.1)',
              }}
            />
          ))}
        </Stack>

        {/* MAIN SWARM GRID */}
        {loading && filteredSwarms.length === 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {[1, 2, 3].map(i => (
              <Grid item xs={12} md={6} lg={4} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 4, mx: 1.5 }}>Hive Connection Error: {error.message}</Alert>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {filteredSwarms.map((swarm) => {
              if (!swarm || !swarm.id) return null;
              const vibe = getVibeMetadata(swarm.nectarQuality);
              const beesCount = (swarm.members || []).length;
              
              return (
                <Grid item xs={12} md={6} lg={4} key={swarm.id}> 
                  <PulseCardHorizontal 
                    frenzy={vibe.pulse} 
                    onClick={() => navigate(`/swarm/${swarm.id}`)}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 140, height: '100%', objectFit: 'cover' }}
                      image={swarm.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400"}
                      alt={swarm.name}
                    />
                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Chip 
                            icon={vibe.icon} label={vibe.label} size="small" 
                            sx={{ 
                              bgcolor: alpha(vibe.color, 0.1), border: `1px solid ${alpha(vibe.color, 0.2)}`, 
                              fontWeight: 900, color: vibe.color, fontSize: '0.6rem', height: 22 
                            }} 
                          />
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1, color: vibe.color }}>
                              {Math.floor(swarm.nectarQuality || 0)}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.5rem', fontWeight: 800 }}>NECTAR N</Typography>
                          </Box>
                        </Stack>
                        <Typography variant="subtitle1" fontWeight={900} noWrap sx={{ mt: 0.5 }}>{swarm.name || "Unnamed Swarm"}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                          {swarm.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 0.5, display: 'block' }}>
                          {beesCount} bees active
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.65rem', mb: 0.5, display: 'block' }}>
                          Pheromone Intensity
                        </Typography>
                        <PheromoneMeter variant="determinate" value={swarm.nectarQuality || 0} energy={swarm.nectarQuality || 0} />
                      </Box>
                    </CardContent>
                  </PulseCardHorizontal>
                </Grid>
              );
            })}

            {filteredSwarms.length === 0 && !loading && (
              <Grid item xs={12}>
                <Paper sx={{ p: 12, textAlign: 'center', borderRadius: 8, bgcolor: 'transparent', border: '2px dashed rgba(0,0,0,0.05)' }}>
                  <GroupsIcon sx={{ fontSize: 60, color: 'rgba(0,0,0,0.1)', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" fontWeight={800}>No swarms found in this sector...</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      {/* CREATE SWARM DIALOG */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 8, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, textAlign: 'center', pt: 3 }}>Start a New Swarm</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField fullWidth label="Swarm Name" variant="outlined" value={swarmName} onChange={e => setSwarmName(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <Box>
              <TextField 
                fullWidth label="Add Tags / Categories" placeholder="Press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleAddTag} disabled={!tagInput.trim()} size="small"><AddIcon /></IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                {tags.map(t => <Chip key={t} label={t} onDelete={() => setTags(tags.filter(tag => tag !== t))} sx={{ bgcolor: '#FFC845', fontWeight: 700, borderRadius: 2 }} />)}
              </Box>
            </Box>
            <TextField fullWidth multiline rows={3} label="Description" variant="outlined" value={description} onChange={e => setDescription(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button onClick={handleClose} sx={{ color: 'text.secondary', fontWeight: 800 }}>CANCEL</Button>
          <Button 
            variant="contained" disabled={mutationLoading || !swarmName || tags.length === 0} 
            onClick={() => createSwarm({ variables: { name: swarmName, description, tags } })}
            sx={{ bgcolor: '#FFC845', color: '#000', borderRadius: 3, fontWeight: 900, px: 4, boxShadow: 'none' }}
          >
            {mutationLoading ? 'CREATING...' : 'CREATE'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!errorToast} autoHideDuration={6000} onClose={() => setErrorToast(null)}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>{errorToast}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Explore;