import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Stack,
  alpha,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  ArrowForward as ArrowIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { gql } from '@apollo/client';
import { useMutation} from '@apollo/client/react';
import { useNavigate, Link } from 'react-router-dom';


const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        name
        rank
        image
      }
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Apollo Mutation Hook
  const [loginUser, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      //  Store the Digital ID 
      localStorage.setItem('token', data.login.token);
      
      // Fly to the matching page
      navigate('/explore');
    },
    onError: (error) => {
      // Catch specific hive errors
      setErrorMsg(error.message);
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await loginUser({
        variables: { email, password }
      });
    } catch (err) {
      // Handled by onError callback
    }
  };

  const logoPath = "/src/assets/logo.png";
  const bgPath = "/src/assets/login-bg.jpg"; // Use the same background for consistency

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFC845',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${bgPath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={0}
          component="form"
          onSubmit={handleLogin}
          sx={{ 
            p: { xs: 4, sm: 6 }, 
            borderRadius: 8, 
            textAlign: 'center',
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
          }}
        >
          {/* Logo */}
          <Box 
            component="img"
            src={logoPath}
            alt="UniBees"
            sx={{ width: 80, height: 80, mb: 2, mx: 'auto', display: 'block', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 900 }}>
            Welcome <span style={{ color: '#FFC845' }}>Back</span>
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Log in to see who's buzzing in the hive.
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, textAlign: 'left' }}>
              {errorMsg}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              required
              type="email"
              label="University Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#FFC845' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <TextField
              fullWidth
              required
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#FFC845' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={!loading && <ArrowIcon />}
              sx={{ 
                py: 2, 
                mt: 1,
                borderRadius: 4, 
                fontWeight: 900,
                textTransform: 'none',
                fontSize: '1.1rem',
                backgroundColor: '#FFC845',
                color: '#0A0A0B',
                '&:hover': { backgroundColor: '#e6b43d' }
              }}
            >

              {loading ? 'Entering Hive...' : 'Sign In'}
            </Button>
          </Stack>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              New to the swarm?{' '}
              <MuiLink 
                component={Link} 
                to="/signup" 
                sx={{ 
                  color: '#FFC845', 
                  fontWeight: 800, 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Join the Hive
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;