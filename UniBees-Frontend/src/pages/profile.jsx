import React, { useState } from 'react';
import { 
  Box, Container, Typography, IconButton, Button, Skeleton, Paper,
  Chip, TextField, Stack, styled, Alert, Snackbar, InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  School as SchoolIcon, 
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon
} from '@mui/icons-material';

/**
 * APOLLO CLIENT IMPORTS
 */
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useNavigate, Navigate } from 'react-router-dom';

// --- GRAPHQL OPERATIONS ---

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

const UPDATE_INTERESTS = gql`
  mutation UpdateInterests($interests: [String!]!) {
    updateInterests(interests: $interests) {
      id
      interests
    }
  }
`;

const UPDATE_MAJOR = gql`
  mutation UpdateMajor($major: String!) {
    updateMajor(major: $major) {
      id
      major
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword)
  }
`;

// --- STYLED COMPONENTS ---

const hexagonClip = 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)';

const HexagonBox = styled(Box)(({ size = 120 }) => ({
  position: 'relative',
  width: size,
  height: size,
  clipPath: hexagonClip,
  backgroundColor: '#FFC845',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '& img': {
    width: '92%',
    height: '92%',
    objectFit: 'cover',
    zIndex: 2,
    clipPath: hexagonClip,
    backgroundColor: '#FFF'
  }
}));

const AmberTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.2s ease',
    '& fieldset': { 
      borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    '&:hover fieldset': { 
      borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    '&.Mui-focused fieldset': { 
      borderColor: '#FFC845',
      borderWidth: '2px',
    },
    // Alignment for icons
    '& .MuiInputAdornment-root': {
      color: '#FFC845',
    },
    // Styling for disabled state to fix screenshot alignment
    '&.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.04)',
      }
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    '&.Mui-focused': {
      color: '#1A1A1B',
    }
  }
});

const Profile = () => {
  const navigate = useNavigate();
  
  // State
  const [newInterest, setNewInterest] = useState("");
  const [major, setMajor] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // 1. Fetch User Data
  const { data, loading, error } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data.me) {
        setMajor(data.me.major || "Undecided");
      }
    }
  });

  // Mutations
  const [saveInterests] = useMutation(UPDATE_INTERESTS, {
    onCompleted: () => showToast('Pollen updated!'),
    onError: (err) => showToast(err.message, 'error')
  });

  const [saveMajor, { loading: majorLoading }] = useMutation(UPDATE_MAJOR, {
    onCompleted: () => showToast('Major updated!'),
    onError: (err) => showToast(err.message, 'error')
  });

  const [updatePass, { loading: passLoading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      showToast('Security updated!');
      setNewPassword('');
    },
    onError: (err) => showToast(err.message, 'error')
  });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 6 }} />
    </Container>
  );

  if (error || !data?.me) return <Navigate to="/login" replace />;

  const user = data.me;
  const avatarUrl = user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}&backgroundColor=ffc845`;

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 15 }}>
      <Container maxWidth="sm">
        {/* Header Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
          <HexagonBox size={140}>
            <img src={avatarUrl} alt="Profile" />
          </HexagonBox>
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 2, letterSpacing: -1 }}>{user.name}</Typography>
          <Chip 
            label={user.rank || "LARVA"} 
            sx={{ bgcolor: '#FFC845', color: '#000', fontWeight: 900, mt: 1, px: 2, height: 28 }} 
          />
        </Box>

        <Stack spacing={3}>
          {/* Identity Section */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 8, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1.5, display: 'block', mb: 2 }}>
              HIVE IDENTITY
            </Typography>
            <Stack spacing={2.5}>
              <AmberTextField 
                fullWidth label="Username" value={user.username} disabled 
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  )
                }}
              />
              <AmberTextField 
                fullWidth label="Email" value={user.email} disabled 
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  )
                }}
              />
              
              {/* EDITABLE MAJOR FIELD */}
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <AmberTextField 
                  fullWidth 
                  label="Major" 
                  value={major} 
                  onChange={(e) => setMajor(e.target.value)}
                  InputProps={{ 
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <IconButton 
                  onClick={() => saveMajor({ variables: { major } })}
                  disabled={majorLoading || major === user.major}
                  sx={{ 
                    bgcolor: major !== user.major ? '#FFC845' : 'rgba(0,0,0,0.05)',
                    color: major !== user.major ? '#1A1A1B' : 'rgba(0,0,0,0.25)',
                    '&:hover': { bgcolor: '#e6b43d' },
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    boxShadow: major !== user.major ? '0 4px 12px rgba(255, 200, 69, 0.3)' : 'none'
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </Box>
            </Stack>
          </Paper>

          {/* Interests Section */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 8, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1.5, display: 'block', mb: 2 }}>
              MY POLLEN (INTERESTS)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {user.interests?.map(i => (
                <Chip 
                  key={i} 
                  label={i} 
                  onDelete={() => {
                    const updated = user.interests.filter(item => item !== i);
                    saveInterests({ variables: { interests: updated } });
                  }} 
                  sx={{ 
                    bgcolor: '#FFC845', 
                    fontWeight: 800, 
                    borderRadius: '10px',
                    '& .MuiChip-deleteIcon': { color: '#1A1A1B', opacity: 0.7 }
                  }} 
                />
              ))}
              {(!user.interests || user.interests.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', opacity: 0.6 }}>
                  No pollen added yet...
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <AmberTextField 
                fullWidth 
                placeholder="Add new interest..."
                value={newInterest} 
                onChange={e => setNewInterest(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter' && newInterest.trim()) {
                    saveInterests({ variables: { interests: [...(user.interests || []), newInterest.trim()] } });
                    setNewInterest("");
                  }
                }}
              />
              <Button 
                variant="contained" 
                onClick={() => {
                  if(newInterest.trim()) {
                    saveInterests({ variables: { interests: [...(user.interests || []), newInterest.trim()] } });
                    setNewInterest("");
                  }
                }} 
                sx={{ 
                  bgcolor: '#FFC845', 
                  color: '#000', 
                  borderRadius: '16px', 
                  fontWeight: 800, 
                  minWidth: 56,
                  '&:hover': { bgcolor: '#e6b43d' }
                }}
              >
                <AddIcon />
              </Button>
            </Box>
          </Paper>

          {/* Security Section */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 8, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1.5, display: 'block', mb: 2 }}>
              SECURITY
            </Typography>
            <Stack spacing={2.5}>
              <AmberTextField 
                fullWidth 
                label="New Password" 
                type={showPass ? 'text' : 'password'} 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                        {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button 
                variant="contained" 
                fullWidth 
                disabled={!newPassword || passLoading}
                onClick={() => updatePass({ variables: { newPassword } })}
                sx={{ 
                  bgcolor: '#1A1A1B', 
                  color: '#FFF', 
                  py: 1.8, 
                  borderRadius: '16px', 
                  fontWeight: 800,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#000' }
                }}
              >
                {passLoading ? 'Updating Hive...' : 'Update Password'}
              </Button>
            </Stack>
          </Paper>

          <Button 
            fullWidth 
            color="error" 
            onClick={handleLogout} 
            sx={{ fontWeight: 900, mt: 2, textTransform: 'none', opacity: 0.8 }}
          >
            Leave the Hive (Logout)
          </Button>
        </Stack>
      </Container>
      
      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ borderRadius: '12px', fontWeight: 700 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;