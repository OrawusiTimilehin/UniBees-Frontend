import React, { useState, useRef } from 'react';
import { 
  Box, Container, Typography, IconButton, Button, Paper, 
  Chip, Stack, styled, TextField, Grid, Card, CardContent, 
  CardMedia, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, alpha
} from '@mui/material';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon
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

// STYLED COMPONENTS

const UploadBox = styled(Box)(({ theme, image }) => ({
  width: '100%',
  height: '180px',
  borderRadius: '16px',
  border: '2px dashed rgba(255, 200, 69, 0.4)',
  backgroundColor: alpha('#FFC845', 0.03),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.2s ease',
  backgroundImage: image ? `url(${image})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&:hover': {
    borderColor: '#FFC845',
    backgroundColor: alpha('#FFC845', 0.08),
  },
  '& .overlay': {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFF',
    opacity: image ? 0 : 1,
    transition: 'opacity 0.2s ease',
  },
  '&:hover .overlay': {
    opacity: 1,
  }
}));

const ManageSwarms = () => {
  const { data, loading, refetch } = useQuery(MY_SWARMS);
  const [editingSwarm, setEditingSwarm] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', tags: [], image: '' });
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);

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

 
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2000000) {
      alert("File too large! Keep it under 2MB for the hive.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm({ ...editForm, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateSwarm({ 
      variables: { 
        id: editingSwarm.id, 
        ...editForm 
      } 
    });
  };

  if (loading) return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h6" fontWeight={800} color="text.secondary">
        LOCATING YOUR SWARMS...
      </Typography>
    </Container>
  );

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} mb={4} sx={{ letterSpacing: -1 }}>
          My Swarms
        </Typography>
        
        {data?.mySwarms && data.mySwarms.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 8, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography color="text.secondary" fontWeight={700}>
              You haven't established any swarms yet.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {data?.mySwarms?.map(swarm => (
              <Grid item xs={12} sm={6} key={swarm.id}>
                <Card sx={{ 
                  borderRadius: 6, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <CardMedia 
                    component="img" 
                    height="160" 
                    image={swarm.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400"} 
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" fontWeight={900} mb={1}>{swarm.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 3, 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden' 
                    }}>
                      {swarm.description}
                    </Typography>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(swarm)}
                      sx={{ 
                        bgcolor: '#FFC845', 
                        color: '#000', 
                        fontWeight: 900, 
                        borderRadius: 3, 
                        py: 1.2,
                        '&:hover': { bgcolor: '#e6b43d' }
                      }}
                    >
                      Edit Swarm
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* EDIT DIALOG */}
      <Dialog 
        open={!!editingSwarm} 
        onClose={() => setEditingSwarm(null)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 8, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, textAlign: 'center', pt: 3 }}>
          Edit Swarm: {editingSwarm?.name}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>

            
            
            {/* IMAGE UPLOAD UI */}
            <Box>
              <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>
                Swarm Profile Image
              </Typography>
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <UploadBox image={editForm.image} onClick={() => fileInputRef.current.click()}>
                <Box className="overlay">
                  <UploadIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" fontWeight={800}>Click to Upload Image</Typography>
                </Box>
              </UploadBox>
            </Box>
            
            <TextField 
              fullWidth 
              multiline 
              rows={3} 
              label="Description" 
              value={editForm.description}
              onChange={e => setEditForm({...editForm, description: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            

            <Box>
              <TextField 
                fullWidth 
                label="Add Tags" 
                placeholder="Type and press Enter"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={e => {
                  if(e.key === 'Enter' && tagInput.trim()) {
                    setEditForm({...editForm, tags: [...editForm.tags, tagInput.trim()]});
                    setTagInput('');
                  }
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => {
                        if(tagInput.trim()) {
                          setEditForm({...editForm, tags: [...editForm.tags, tagInput.trim()]});
                          setTagInput('');
                        }
                      }}>
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                {editForm.tags.map(t => (
                  <Chip 
                    key={t} 
                    label={t} 
                    onDelete={() => setEditForm({...editForm, tags: editForm.tags.filter(tag => tag !== t)})} 
                    sx={{ bgcolor: '#FFC845', fontWeight: 700, borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button onClick={() => setEditingSwarm(null)} sx={{ color: 'text.secondary', fontWeight: 800 }}>
            CANCEL
          </Button>

          <Button 
            variant="contained" 
            disabled={saving}
            onClick={handleSave}
            sx={{ 
              bgcolor: '#FFC845', 
              color: '#000', 
              fontWeight: 900, 
              px: 4, 
              borderRadius: 3,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#e6b43d', boxShadow: 'none' }
            }}
          >
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageSwarms;