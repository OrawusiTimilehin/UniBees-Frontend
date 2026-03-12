import React, { useState } from 'react';
import { 
  Box, Container, Typography, IconButton, Button, Paper, 
  Chip, Stack, styled, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, InputAdornment,
  Grid, Card, CardContent, CardMedia, Skeleton, Alert, Snackbar
} from '@mui/material';
import { 
  Add as AddIcon,
  Groups as GroupsIcon,
  TrendingUp as TrendingIcon,
  Person as PersonIcon
} from '@mui/icons-material';

/**
 * APOLLO CLIENT IMPORTS
 * Split imports are used here to ensure compatibility with the bundler:
 * - gql is imported from the core @apollo/client package.
 * - Hooks are imported from @apollo/client/react.
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
    }
  }
`;

const CREATE_SWARM_MUTATION = gql`
  mutation CreateSwarm($name: String!, $description: String!, $tags: [String!]!) {
    createSwarm(name: $name, description: $description, tags: $tags) {
      id
      name
      tags
      description
    }
  }
`;

// --- STYLED COMPONENTS ---

const SwarmCard = styled(Card)({
  borderRadius: '20px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(255, 200, 69, 0.15)',
  }
});

const Explore = () => {
  // State for Create Dialog
  const [open, setOpen] = useState(false);
  const [swarmName, setSwarmName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  
  // Feedback State
  const [errorToast, setErrorToast] = useState(null);

  // 1. Fetch Active Swarms from the Hive
  const { data, loading: queryLoading, error: queryError } = useQuery(GET_SWARMS);

  // 2. Creation Mutation with Refetching Logic
  const [createSwarm, { loading: mutationLoading }] = useMutation(CREATE_SWARM_MUTATION, {
    refetchQueries: [{ query: GET_SWARMS }],
    onCompleted: () => {
      handleClose();
    },
    onError: (err) => {
      setErrorToast(err.message);
    }
  });

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

  const handleRemoveTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pt: 4, pb: 10 }}>
      <Container maxWidth="md">
        {/* Page Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 5 
        }}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              Active Swarms
            </Typography>
            <Typography color="text.secondary" sx={{ fontWeight: 700, mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Sorted by <span style={{ color: '#000' }}>Nectar Quality (N)</span> <TrendingIcon sx={{ fontSize: 18 }} />
            </Typography>
          </Box>

          <Tooltip title="Start a Swarm" arrow placement="left">
            <IconButton 
              onClick={() => setOpen(true)}
              sx={{ 
                bgcolor: '#FFC845', 
                color: '#000', 
                width: 56,
                height: 56,
                boxShadow: '0 4px 14px rgba(255, 200, 69, 0.4)',
                '&:hover': { bgcolor: '#e6b43d' } 
              }}
            >
              <AddIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* LOADING STATE */}
        {queryLoading && (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 5 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* ERROR STATE */}
        {queryError && (
          <Alert severity="error" variant="outlined" sx={{ borderRadius: 3 }}>
            The hive communication is down: {queryError.message}
          </Alert>
        )}

        {/* SWARMS GRID */}
        {!queryLoading && !queryError && (
          <Grid container spacing={3}>
            {data?.swarms?.map((swarm) => (
              <Grid item xs={12} sm={6} key={swarm.id}>
                <SwarmCard>
                  <CardMedia
                    component="img"
                    height="140"
                    image={swarm.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400"}
                    alt={swarm.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                       <Typography variant="h6" fontWeight={900}>{swarm.name}</Typography>
                       <Chip 
                         label={`N: ${swarm.nectarQuality || 80}`} 
                         size="small" 
                         sx={{ bgcolor: '#FFC845', fontWeight: 800, height: 20, fontSize: '0.65rem' }} 
                       />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {swarm.description}
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {swarm.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderRadius: 1.5, fontSize: '0.7rem' }} />
                      ))}
                    </Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, color: 'text.secondary' }}>
                      <PersonIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption" fontWeight={700}>{swarm.members?.length || 0} members buzzing</Typography>
                    </Box>
                  </CardContent>
                </SwarmCard>
              </Grid>
            ))}

            {data?.swarms?.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 8, 
                  textAlign: 'center', 
                  borderRadius: 8, 
                  border: '2px dashed rgba(0,0,0,0.05)', 
                  bgcolor: 'transparent' 
                }}>
                  <GroupsIcon sx={{ fontSize: 60, color: 'rgba(0,0,0,0.1)', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                    The hive is quiet... create a swarm to start buzzing!
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      {/* CREATE SWARM DIALOG */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="xs" 
        PaperProps={{ sx: { borderRadius: 8, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, textAlign: 'center', pt: 3 }}>
          Start a New Swarm
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField 
              fullWidth label="Swarm Name" 
              variant="outlined"
              value={swarmName}
              onChange={e => setSwarmName(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <Box>
              <TextField 
                fullWidth label="Add Tags / Categories" 
                variant="outlined"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleAddTag} disabled={!tagInput.trim()} size="small">
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                {tags.map((tag) => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ bgcolor: '#FFC845', fontWeight: 700, borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Box>

            <TextField 
              fullWidth 
              multiline 
              rows={3} 
              label="Description" 
              variant="outlined"
              value={description}
              onChange={e => setDescription(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button onClick={handleClose} sx={{ color: 'text.secondary', fontWeight: 800 }}>
            CANCEL
          </Button>
          <Button 
            variant="contained" 
            disabled={mutationLoading || !swarmName || tags.length === 0}
            onClick={() => createSwarm({ variables: { name: swarmName, description, tags } })}
            sx={{ 
              bgcolor: '#FFC845', 
              color: '#000', 
              borderRadius: 3, 
              fontWeight: 900, 
              px: 4,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#e6b43d', boxShadow: 'none' }
            }}
          >
            {mutationLoading ? 'CREATING...' : 'CREATE'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ERROR SNACKBAR */}
      <Snackbar open={!!errorToast} autoHideDuration={6000} onClose={() => setErrorToast(null)}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
          {errorToast}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Explore;