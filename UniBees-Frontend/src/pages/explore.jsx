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
  ElectricBolt as PulseIcon
} from '@mui/icons-material';

/**
 * APOLLO CLIENT IMPORTS
 * Splitting imports to ensure resolution within the specific preview environment.
 */
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

// --- GRAPHQL OPERATIONS ---

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

// --- STYLED COMPONENTS ---

const SearchBar = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    backgroundColor: '#FFF',
    paddingLeft: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
    '& fieldset': { border: '1px solid rgba(0,0,0,0.08)' },
    '&:hover fieldset': { borderColor: '#FFC845' },
    '&.Mui-focused fieldset': { borderColor: '#FFC845', borderWidth: '1px' },
  }
});

const TagPill = styled(Chip)(({ active }) => ({
  fontWeight: 700,
  padding: '12px 6px',
  borderRadius: '10px',
  backgroundColor: active ? '#FFC845' : '#FFF',
  color: active ? '#000' : 'rgba(0,0,0,0.6)',
  border: active ? 'none' : '1px solid rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: active ? '#e6b43d' : alpha('#FFC845', 0.1),
    borderColor: '#FFC845',
  }
}));

const PulseCardHorizontal = styled(Card)({
  borderRadius: '16px',
  border: '1px solid rgba(0,0,0,0.08)',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex', 
  flexDirection: 'row',
  height: '200px', 
  width: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
  }
});

const PheromoneBar = styled(LinearProgress)({
  height: 10,
  borderRadius: 5,
  backgroundColor: 'rgba(0,0,0,0.05)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#FFC845',
    borderRadius: 5,
  }
});

const Explore = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  
  const [swarmName, setSwarmName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [errorToast, setErrorToast] = useState(null);

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_SWARMS);

  const [createSwarm, { loading: mutationLoading }] = useMutation(CREATE_SWARM_MUTATION, {
    refetchQueries: [{ query: GET_SWARMS }],
    onCompleted: () => handleClose(),
    onError: (err) => setErrorToast(err.message)
  });

  const popularTags = ['All', '#Coding', '#Sports', '#Study', '#Fashion', '#Gaming', '#Tech', '#Art'];

  const filteredSwarms = useMemo(() => {
    if (!data?.swarms) return [];
    return data.swarms.filter(swarm => {
      const matchesSearch = swarm.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = activeTag === 'All' || 
                        swarm.tags.some(t => {
                          const cleanTag = t.startsWith('#') ? t.toLowerCase() : `#${t.toLowerCase()}`;
                          const cleanActive = activeTag.toLowerCase();
                          return cleanTag === cleanActive;
                        });
      return matchesSearch && matchesTag;
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
      {/* Container xl with custom padding to ensure everything aligns perfectly.
        Grid container spacing is compensated to align items with non-grid elements.
      */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}> 
        
        {/* HEADER AREA */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: -1.5, mb: 0.5 }}>Active Swarms</Typography>
            <Typography variant="body2" fontWeight={700} color="text.secondary">
              Sorted by <span style={{ color: '#000' }}>Nectar Quality (N)</span>
            </Typography>
          </Box>
          <Tooltip title="Start a Swarm">
            <IconButton 
              onClick={() => setOpen(true)}
              sx={{ 
                bgcolor: '#FFC845', 
                color: '#000', 
                width: 64, 
                height: 64, 
                boxShadow: '0 8px 24px rgba(255, 200, 69, 0.3)', 
                '&:hover': { bgcolor: '#e6b43d' } 
              }}
            >
              <AddIcon sx={{ fontSize: 36 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* SEARCH BAR */}
        <Box sx={{ mb: 4 }}>
          <SearchBar 
            fullWidth 
            placeholder="Search for swarms by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: 'rgba(0,0,0,0.3)', mr: 1 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* TAG FILTERS */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 6, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
          {popularTags.map(tag => (
            <TagPill 
              key={tag} 
              label={tag} 
              active={activeTag === tag} 
              onClick={() => setActiveTag(tag)}
            />
          ))}
        </Stack>

        {/* SWARMS GRID */}
        {queryLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Grid item xs={12} md={6} lg={4} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
              </Grid>
            ))}
          </Grid>
        ) : queryError ? (
          <Alert severity="error" sx={{ borderRadius: 4 }}>Hive Connection Error: {queryError.message}</Alert>
        ) : (
          /* Grid container with negative margin logic to ensure outer items touch the same edges
             as the search bar above.
          */
          <Grid container spacing={3} sx={{ width: 'calc(100% + 24px)', ml: '-12px' }}>
            {filteredSwarms.map((swarm) => (
              <Grid item xs={12} md={6} lg={4} key={swarm.id}> 
                <PulseCardHorizontal>
                  {/* Swarm Image */}
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: { xs: 120, sm: 150, md: 160, lg: 150 }, 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                    image={swarm.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400"}
                    alt={swarm.name}
                  />
                  
                  {/* Content */}
                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Chip 
                          icon={<PulseIcon sx={{ fontSize: '12px !important', color: '#FFC845 !important' }} />}
                          label="THE PULSE" 
                          size="small" 
                          sx={{ bgcolor: '#FFF', border: '1px solid rgba(0,0,0,0.08)', fontWeight: 900, color: 'rgba(0,0,0,0.4)', fontSize: '0.55rem', height: 20 }} 
                        />
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1 }}>
                            {swarm.nectarQuality ? Math.floor(swarm.nectarQuality) : 94}
                          </Typography>
                          <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.5rem' }}>NECTAR N</Typography>
                        </Box>
                      </Box>

                      <Typography variant="subtitle1" fontWeight={900} mb={0} sx={{ lineHeight: 1.2 }} noWrap>{swarm.name}</Typography>
                      <Stack direction="row" spacing={0.5} mb={1}>
                        {swarm.tags.slice(0, 2).map(t => (
                          <Typography key={t} variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {t.startsWith('#') ? t : `#${t}`}
                          </Typography>
                        ))}
                      </Stack>

                      <Typography variant="body2" color="text.secondary" sx={{ 
                        fontSize: '0.75rem', 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3
                      }}>
                        {swarm.description}
                      </Typography>
                    </Box>

                    {/* Progress Area */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.65rem' }}>Pheromone</Typography>
                        <Typography variant="caption" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.65rem' }}>
                          <FireIcon sx={{ fontSize: 10, color: '#FF5722' }} /> Hot
                        </Typography>
                      </Box>
                      <PheromoneBar variant="determinate" value={80} />
                    </Box>
                  </CardContent>
                </PulseCardHorizontal>
              </Grid>
            ))}

            {filteredSwarms.length === 0 && (
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
                fullWidth label="Add Tags / Categories" placeholder="Press Enter" value={tagInput} onChange={e => setTagInput(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleAddTag} disabled={!tagInput.trim()} size="small">
                        <AddIcon />
                      </IconButton>
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