import React, { useState } from 'react';
import { 
  Box, Container, Typography, IconButton, Button, Skeleton, Paper,
  Chip, TextField, Stack, Divider, styled, Alert, Snackbar
} from '@mui/material';
import { 
  Person as PersonIcon, Email as EmailIcon, Logout as LogoutIcon,
  Add as AddIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon
} from '@mui/icons-material';

/**
 * APOLLO IMPORTS
 * We are using the main package entry point for hooks and gql.
 * If resolution issues persist, ensuring 'npm install @apollo/client' is run locally is key.
 */
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate, Navigate } from 'react-router-dom';

// --- GRAPHQL OPERATIONS ---

const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      name
      rank
      interests
      image
    }
  }
`;

const UPDATE_INTERESTS = gql`
  mutation UpdateInterests($interests: [String!]!) {
    updateInterests(interests: $interests) {
      interests
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword)
  }
`;

// --- STYLED COMPONENTS ---

const HexagonBox = styled(Box)(({ size = 120 }) => ({
  position: 'relative',
  width: size,
  height: size,
  clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
  backgroundColor: '#FFC845',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: '92%',
    height: '92%',
    objectFit: 'cover',
    zIndex: 2,
    clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
    backgroundColor: '#FFF'
  }
}));

const AmberTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
    '&.Mui-focused fieldset': { borderColor: '#FFC845' },
  },
});

const Profile = () => {
  const navigate = useNavigate();
  const [newInterest, setNewInterest] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // 1. Fetch Real Data with 'network-only' to ensure we bypass stale cache
  const { data, loading, error } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  });

  // 2. Interest Mutation
  const [saveInterests] = useMutation(UPDATE_INTERESTS, {
    onCompleted: () => setToast({ open: true, message: 'Interests updated!', severity: 'success' }),
    onError: (err) => setToast({ open: true, message: err.message, severity: 'error' })
  });

  // 3. Password Mutation
  const [updatePass, { loading: passLoading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      setToast({ open: true, message: 'Password updated!', severity: 'success' });
      setPassword("");
    },
    onError: (err) => setToast({ open: true, message: err.message, severity: 'error' })
  });

  const handleAddInterest = () => {
    if (newInterest.trim() && !data.me.interests.includes(newInterest.trim())) {
      const updatedList = [...(data.me.interests || []), newInterest.trim()];
      saveInterests({ variables: { interests: updatedList } });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest) => {
    const updatedList = data.me.interests.filter(i => i !== interest);
    saveInterests({ variables: { interests: updatedList } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
    </Container>
  );

  /**
   * SESSION VALIDATION
   * If 'me' is null, the token is invalid or expired.
   */
  if (error || !data?.me) {
    return <Navigate to="/login" replace />;
  }

  const user = data.me;

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 15 }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
          <HexagonBox size={140}>
            {/* Fallback avatar based on name if user image is null */}
            <img 
              src={user.image || `https://ui-avatars.com/api/?background=FFC845&color=fff&name=${encodeURIComponent(user.name)}`} 
              alt="Profile" 
            />
          </HexagonBox>
          <Typography variant="h5" sx={{ fontWeight: 900, mt: 2 }}>{user.name}</Typography>
          <Chip label={user.rank || "NEW BEE"} sx={{ bgcolor: '#FFC845', fontWeight: 'bold', mt: 1 }} />
        </Box>

        <Stack spacing={3}>
          {/* Identity Section */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="overline" sx={{ fontWeight: 800, opacity: 0.5 }}>Identity</Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <AmberTextField fullWidth label="Username" value={user.username || ""} disabled InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1, color: '#FFC845' }} /> }} />
              <AmberTextField fullWidth label="Email" value={user.email || ""} disabled InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: '#FFC845' }} /> }} />
            </Stack>
          </Paper>

          {/* Interests Section */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="overline" sx={{ fontWeight: 800, opacity: 0.5 }}>My Pollen (Interests)</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
              {user.interests?.map(i => (
                <Chip key={i} label={i} onDelete={() => handleRemoveInterest(i)} sx={{ bgcolor: '#FFC845', fontWeight: 600 }} />
              ))}
              {(!user.interests || user.interests.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 1 }}>
                  Your pollen bag is empty! Add some interests below.
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <AmberTextField 
                fullWidth label="Add Interest" value={newInterest} 
                onChange={(e) => setNewInterest(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
              />
              <Button variant="contained" onClick={handleAddInterest} sx={{ bgcolor: '#FFC845', color: '#000', borderRadius: 3, minWidth: 56 }}>
                <AddIcon />
              </Button>
            </Box>
          </Paper>

          {/* Security Section */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="overline" sx={{ fontWeight: 800, opacity: 0.5 }}>Security</Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <AmberTextField 
                fullWidth label="New Password" type={showPassword ? 'text' : 'password'} 
                value={password} onChange={(e) => setPassword(e.target.value)}
                InputProps={{ 
                  endAdornment: <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton>,
                  startAdornment: <LockIcon sx={{ mr: 1, color: '#FFC845' }} />
                }} 
              />
              <Button 
                fullWidth variant="contained" disabled={!password || passLoading} 
                onClick={() => updatePass({ variables: { newPassword: password } })}
                sx={{ bgcolor: '#1A1A1B', color: '#FFF', py: 1.5, borderRadius: 3 }}
              >
                {passLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </Stack>
          </Paper>

          <Button 
            fullWidth color="error" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout} 
            sx={{ fontWeight: 800, textTransform: 'none', mt: 2 }}
          >
            Leave the Hive (Logout)
          </Button>
        </Stack>
      </Container>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;