import React, { useState } from 'react';
import { 
  Box, Container, Typography, IconButton, Button, Skeleton, Paper,
  Chip, TextField, Stack, styled, Alert, Snackbar, Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  School as SchoolIcon, 
  Save as SaveIcon,
  Logout as LogoutIcon,
  Groups as GroupsIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

/**
 * APOLLO CLIENT IMPORTS
 * Consolidating to the main package to ensure resolution in the environment.
 */
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useNavigate, Navigate } from 'react-router-dom';

const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      name
      major
      rank
      interests
      image
    }
  }
`;

const Profile = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_ME, { fetchPolicy: 'network-only' });

  if (loading) return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 6 }} />
    </Container>
  );

  if (error || !data?.me) return <Navigate to="/login" replace />;

  const user = data.me;

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 15 }}>
      <Container maxWidth="sm">
        {/* Header Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
          <Box sx={{ 
            width: 140, 
            height: 140, 
            bgcolor: '#FFC845', 
            borderRadius: '50%', 
            p: 0.5,
            boxShadow: '0 8px 24px rgba(255, 200, 69, 0.2)' 
          }}>
             <Box 
               component="img" 
               src={user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`} 
               sx={{ 
                 width: '100%', 
                 height: '100%', 
                 borderRadius: '50%', 
                 bgcolor: '#fff', 
                 objectFit: 'cover' 
               }} 
             />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 2 }}>{user.name}</Typography>
          <Chip 
            label={user.rank || "LARVA"} 
            sx={{ 
              bgcolor: '#FFC845', 
              color: '#000', 
              fontWeight: 900, 
              mt: 1,
              px: 2 
            }} 
          />
        </Box>

        <Stack spacing={3}>
          {/* SWARM MANAGEMENT SECTION */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 6, 
              border: '1px solid rgba(0,0,0,0.05)', 
              bgcolor: '#FFF' 
            }}
          >
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1.2 }}>
              SWARM MANAGEMENT
            </Typography>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => navigate('/manage-swarms')}
              startIcon={<GroupsIcon />}
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                mt: 2, 
                py: 1.5, 
                borderRadius: 4, 
                borderColor: 'rgba(255, 200, 69, 0.5)', 
                color: '#000',
                fontWeight: 800,
                justifyContent: 'space-between',
                textTransform: 'none',
                '&:hover': { 
                  borderColor: '#FFC845', 
                  bgcolor: 'rgba(255, 200, 69, 0.05)' 
                }
              }}
            >
              Manage My Swarms
            </Button>
          </Paper>

          {/* HIVE IDENTITY SECTION */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 6, 
              border: '1px solid rgba(0,0,0,0.05)',
              bgcolor: '#FFF'
            }}
          >
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1.2 }}>
              HIVE IDENTITY
            </Typography>
            <Stack spacing={2.5} sx={{ mt: 2 }}>
              <TextField 
                fullWidth 
                label="Username" 
                value={user.username} 
                disabled 
                variant="filled" 
                InputProps={{ disableUnderline: true, sx: { borderRadius: 3 } }}
              />
              <TextField 
                fullWidth 
                label="Email" 
                value={user.email} 
                disabled 
                variant="filled" 
                InputProps={{ disableUnderline: true, sx: { borderRadius: 3 } }}
              />
              <TextField 
                fullWidth 
                label="Major" 
                value={user.major || "Not specified"} 
                disabled 
                variant="filled" 
                InputProps={{ disableUnderline: true, sx: { borderRadius: 3 } }}
              />
            </Stack>
          </Paper>

          {/* LOGOUT ACTION */}
          <Button 
            fullWidth 
            color="error" 
            startIcon={<LogoutIcon />}
            onClick={() => { 
              localStorage.removeItem('token'); 
              navigate('/login'); 
            }} 
            sx={{ 
              fontWeight: 900, 
              py: 1.5,
              textTransform: 'none',
              borderRadius: 4
            }}
          >
            Leave the Hive
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Profile;