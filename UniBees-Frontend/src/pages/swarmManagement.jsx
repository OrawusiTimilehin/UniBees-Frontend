import React, { useState } from 'react';
import { 
  Box, Container, Typography, IconButton, Button, Paper, 
  Chip, Stack, styled, TextField, Grid, Card, CardContent, 
  CardMedia, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment
} from '@mui/material';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

const MY_SWARMS = gql`
  query MySwarms {
    mySwarms {
      id
      name
      description
      tags
      image
      nectarQuality
    }
  }
`;

const UPDATE_SWARM = gql`
  mutation UpdateSwarm($id: String!, $description: String, $tags: [String!], $image: String) {
    updateSwarm(swarmId: $id, description: $description, tags: $tags, image: $image) {
      id
      description
      tags
      image
    }
  }
`;

const ManageSwarms = () => {
  const { data, loading, refetch } = useQuery(MY_SWARMS);
  const [editingSwarm, setEditingSwarm] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', tags: [], image: '' });
  const [tagInput, setTagInput] = useState('');

  const [updateSwarm, { loading: saving }] = useMutation(UPDATE_SWARM, {
    onCompleted: () => {
      refetch();
      setEditingSwarm(null);
    }
  });

  const handleEditClick = (swarm) => {
    setEditingSwarm(swarm);
    setEditForm({ 
      description: swarm.description, 
      tags: [...swarm.tags], 
      image: swarm.image 
    });
  };

  const handleSave = () => {
    updateSwarm({ 
      variables: { 
        id: editingSwarm.id, 
        ...editForm 
      } 
    });
  };

  if (loading) return <Container sx={{ mt: 5 }}><Typography>Locating your swarms...</Typography></Container>;

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} mb={4}>My Swarms</Typography>
        
        {data?.mySwarms.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 8 }}>
            <Typography color="text.secondary">You haven't established any swarms yet.</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {data?.mySwarms.map(swarm => (
              <Grid item xs={12} sm={6} key={swarm.id}>
                <Card sx={{ borderRadius: 6, position: 'relative' }}>
                  <CardMedia component="img" height="140" image={swarm.image} />
                  <CardContent>
                    <Typography variant="h6" fontWeight={800}>{swarm.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                      {swarm.description}
                    </Typography>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(swarm)}
                      sx={{ bgcolor: '#FFC845', color: '#000', fontWeight: 800, borderRadius: 3 }}
                    >
                      Edit Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* EDIT DIALOG */}
      <Dialog open={!!editingSwarm} onClose={() => setEditingSwarm(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 900 }}>Edit Swarm: {editingSwarm?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField 
              fullWidth 
              label="Image URL" 
              value={editForm.image}
              onChange={e => setEditForm({...editForm, image: e.target.value})}
              InputProps={{ startAdornment: <PhotoIcon sx={{ mr: 1, color: '#FFC845' }} /> }}
            />
            
            <TextField 
              fullWidth 
              multiline 
              rows={3} 
              label="Description" 
              value={editForm.description}
              onChange={e => setEditForm({...editForm, description: e.target.value})}
            />

            <Box>
              <TextField 
                fullWidth 
                label="Add Tags" 
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={e => {
                  if(e.key === 'Enter' && tagInput.trim()) {
                    setEditForm({...editForm, tags: [...editForm.tags, tagInput.trim()]});
                    setTagInput('');
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => {
                      if(tagInput.trim()) {
                        setEditForm({...editForm, tags: [...editForm.tags, tagInput.trim()]});
                        setTagInput('');
                      }
                    }}>
                      <AddIcon />
                    </IconButton>
                  )
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {editForm.tags.map(t => (
                  <Chip key={t} label={t} onDelete={() => setEditForm({...editForm, tags: editForm.tags.filter(tag => tag !== t)})} />
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditingSwarm(null)}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={saving}
            onClick={handleSave}
            sx={{ bgcolor: '#FFC845', color: '#000', fontWeight: 800, px: 4, borderRadius: 3 }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageSwarms;