import React, { useState } from 'react';
import { 
  Box, Container, Typography, IconButton, Button, Skeleton, Paper,
  Chip, TextField, Stack, Divider, styled, Alert, Snackbar
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';

/**
 * APOLLO CLIENT IMPORTS
 * We use the standard entry point for useQuery and useMutation.
 */
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate, Navigate } from 'react-router-dom';

/**
 * GRAPHQL OPERATIONS
 */
const GET_ME_QUERY = gql`
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

const UPDATE_INTERESTS_MUTATION = gql`
  mutation UpdateInterests($interests: [String!]!) {
    updateInterests(interests: $interests) {
      id
      interests
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword)
  }
`;

// --- STYLED COMPONENTS ---
const hexagonClip = 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)';

const ProfileHeader = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px 0',
});

const HexAvatar = styled(Box)(({ size = 140 }) => ({
  width: size,
  height: size,
  clipPath: hexagonClip,
  backgroundColor: '#FFC845',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '& img': {
    width: '94%',
    height: '94%',
    clipPath: hexagonClip,
    objectFit: 'cover',
    backgroundColor: '#FFF'
  }
}));

const AmberTextField = styled(TextField)({
  '& .MuiFilledInput-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    '&:before, &:after': { display: 'none' },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(0, 0, 0, 0.4)',
    fontWeight: 700,
  }
});

const Profile = () => {
  const navigate = useNavigate();
  const [newInterest, setNewInterest] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // 1. Fetch Real User Data
  const { data, loading, error } = useQuery(GET_ME_QUERY, {
    fetchPolicy: 'network-only'
  });

  // 2. Interest Update Mutation
  const [saveInterests] = useMutation(UPDATE_INTERESTS_MUTATION, {
    onCompleted: () => showToast("Pollen updated in the Hive!"),
    onError: (err) => showToast(err.message, "error")
  });

  // 3. Password Update Mutation
  const [updatePass, { loading: passLoading }] = useMutation(CHANGE_PASSWORD_MUTATION, {
    onCompleted: () => {
      showToast("Security updated!");
      setNewPassword("");
    },
    onError: (err) => showToast(err.message, "error")
  });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !data.me.interests.includes(newInterest.trim())) {
      const updated = [...(data.me.interests || []), newInterest.trim()];
      saveInterests({ variables: { interests: updated } });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest) => {
    const updated = data.me.interests.filter(i => i !== interest);
    saveInterests({ variables: { interests: updated } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return (
    <Container maxWidth="sm" sx={{ pt: 10 }}>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
    </Container>
  );
  
  if (error || !data?.me) return <Navigate to="/login" replace />;

  const user = data.me;

  /**
   * GENERATED AVATAR LOGIC
   * We use the DiceBear API to generate an avatar.
   * No local import is needed because we simply point the <img> src to their API.
   */
  const avatarUrl = user.image && !user.image.includes('unsplash') 
    ? user.image 
    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}&backgroundColor=ffc845`;

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 15 }}>
      <Container maxWidth="sm">
        <ProfileHeader>
          <Box sx={{ position: 'relative' }}>
            <HexAvatar size={160}>
              <img src={avatarUrl} alt="Profile" />
            </HexAvatar>
            <IconButton 
              sx={{ 
                position: 'absolute', 
                bottom: 5, 
                right: 5, 
                bgcolor: '#1A1A1B', 
                color: '#FFF',
                '&:hover': { bgcolor: '#333' }
              }}
              size="small"
              onClick={() => showToast("Manual upload coming in next sprint!", "info")}
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 3, letterSpacing: -1 }}>
            {user.name}
          </Typography>
          
          <Chip 
            label={user.rank || "LARVA"} 
            sx={{ 
              bgcolor: '#FFC845', 
              color: '#000', 
              fontWeight: 900, 
              mt: 1.5,
              px: 2,
              height: 32,
              fontSize: '0.8rem'
            }} 
          />
        </ProfileHeader>

        <Stack spacing={3}>
          {/* Identity Section */}
          <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid rgba(0,0,0,0.03)' }} elevation={0}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 900, letterSpacing: 1 }}>
              HIVE IDENTITY
            </Typography>
            <Stack spacing={2.5} sx={{ mt: 2 }}>
              <AmberTextField 
                fullWidth label="Username" value={user.username || ''} 
                disabled variant="filled" 
              />
              <AmberTextField 
                fullWidth label="Email" value={user.email || ''} 
                disabled variant="filled" 
              />
              <AmberTextField 
                fullWidth label="Major" value={user.major || "Undecided"} 
                disabled variant="filled" 
              />
            </Stack>
          </Paper>

          {/* Interests Section */}
          <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid rgba(0,0,0,0.03)' }} elevation={0}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 900, letterSpacing: 1 }}>
              MY POLLEN (INTERESTS)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 3 }}>
              {user.interests && user.interests.map(i => (
                <Chip 
                  key={i} 
                  label={i} 
                  onDelete={() => handleRemoveInterest(i)} 
                  sx={{ 
                    bgcolor: '#FFC845', 
                    fontWeight: 800, 
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#e6b43d' } 
                  }} 
                />
              ))}
              {(!user.interests || user.interests.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Your pollen bag is empty. Start adding some below!
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                fullWidth label="Add pollen..." value={newInterest} 
                onChange={e => setNewInterest(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAddInterest()}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <Button 
                variant="contained" 
                onClick={handleAddInterest} 
                sx={{ bgcolor: '#FFC845', color: '#000', borderRadius: 3, minWidth: 56 }}
              >
                <AddIcon />
              </Button>
            </Box>
          </Paper>

          {/* Security Section */}
          <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid rgba(0,0,0,0.05)' }} elevation={0}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 900, letterSpacing: 1 }}>
              SECURITY
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField 
                fullWidth label="Change Password" type={showPass ? 'text' : 'password'} 
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                      {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <Button 
                fullWidth variant="contained" 
                disabled={!newPassword || passLoading}
                onClick={() => updatePass({ variables: { newPassword } })}
                sx={{ 
                  bgcolor: '#1A1A1B', 
                  color: '#FFF', 
                  py: 1.8, 
                  borderRadius: 4,
                  fontWeight: 800,
                  textTransform: 'none'
                }}
              >
                {passLoading ? 'Updating Hive...' : 'Update Password'}
              </Button>
            </Stack>
          </Paper>

          <Button 
            fullWidth color="error" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout} 
            sx={{ fontWeight: 900, textTransform: 'none', mt: 2 }}
          >
            Leave the Hive (Logout)
          </Button>
        </Stack>
      </Container>

      <Snackbar 
        open={toast.open} autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;