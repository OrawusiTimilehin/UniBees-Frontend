import React from 'react';
import { 
  Box, Container, Typography, IconButton, Avatar, Paper, 
  Chip, Stack, styled, Button, CircularProgress 
} from '@mui/material';

import { 
  ArrowBack as BackIcon, 
  PersonAdd as PersonAddIcon,
  Groups as GroupsIcon 
} from '@mui/icons-material';

import { useParams, useNavigate } from 'react-router-dom';
import { gql} from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_USER_PROFILE = gql`
  query GetUserProfile($id: String!) {
    getUser(id: $id) {
      id
      username
      name
      major
      rank
      interests
      image
    }
  }
`;

const HexagonAvatar = styled(Box)({
  width: 150,
  height: 150,
  backgroundColor: '#FFC845',
  clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: '94%',
    height: '94%',
    objectFit: 'cover',
    clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
    backgroundColor: '#FFF'
  }
});

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_USER_PROFILE, { 
    variables: { id: userId } 
  });

  if (loading) return <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: '#FFC845' }} /></Box>;
  if (error || !data?.getUser) return <Container sx={{ mt: 10, textAlign: 'center' }}><Typography>Bee not found.</Typography></Container>;

  const user = data.getUser;

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)}><BackIcon /></IconButton>
      </Box>

      <Container maxWidth="sm">
        <Stack alignItems="center" spacing={2} sx={{ mt: 2, mb: 6 }}>
          <HexagonAvatar>
            <img src={user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`} alt={user.name} />
          </HexagonAvatar>
          <Typography variant="h4" fontWeight={900}>{user.name}</Typography>
          <Chip label={user.rank} sx={{ bgcolor: '#FFC845', fontWeight: 900 }} />
          <Typography variant="body1" color="text.secondary" fontWeight={600}>
            {user.major || "Scholar Bee"}
          </Typography>
        </Stack>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid rgba(0,0,0,0.05)' }}>
          <Typography variant="overline" fontWeight={900} color="text.secondary">COLLECTED POLLEN</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {user.interests.map(i => (
              <Chip key={i} label={i} sx={{ fontWeight: 800, borderRadius: 2 }} />
            ))}
            {user.interests.length === 0 && <Typography variant="body2" color="text.secondary">This bee hasn't collected any pollen yet.</Typography>}
          </Box>
        </Paper>

        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<PersonAddIcon />}
          sx={{ mt: 4, py: 2, borderRadius: 4, bgcolor: '#FFC845', color: '#000', fontWeight: 900 }}
        >
          Send Friend Request
        </Button>
      </Container>
    </Box>
  );
};

export default PublicProfile;