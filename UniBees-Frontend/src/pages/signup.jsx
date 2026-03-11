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
  Alert
} from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';

/**
 * THE IMPORT FIX:
 * Ensure this path is correct. 
 * If your signup.jsx is in src/pages/ 
 * and operations.js is in src/graphql/
 * then '../graphql/operations' is the correct relative path.
 */
import { SIGNUP_MUTATION } from '../graphql/operations';

const SignUp = () => {
  const navigate = useNavigate();
  
  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Apollo Mutation Hook
  const [signupUser, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      // 1. Save the Digital ID (JWT) to the browser
      localStorage.setItem('token', data.signup.token);
      // 2. Fly to the matching page!
      navigate('/explore');
    },
    onError: (error) => {
      setErrorMsg(error.message);
    }
  });

  const handleEnterHive = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (!email.includes('.ac.uk') && !email.includes('.edu')) {
      setErrorMsg("Please use a valid university email (e.g., .ac.uk).");
      return;
    }

    try {
      await signupUser({
        variables: {
          name,
          username,
          email,
          password
        }
      });
    } catch (err) {
      // Handled by onError callback above
    }
  };

  const logoPath = "/src/assets/logo.png";
  const bgPath = "/src/assets/login-bg.jpg";

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
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0}
          component="form"
          onSubmit={handleEnterHive}
          sx={{ 
            p: { xs: 4, sm: 6 }, 
            borderRadius: 8, 
            textAlign: 'center',
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box 
            component="img"
            src={logoPath}
            alt="UniBees"
            sx={{ width: 80, height: 80, mb: 2, mx: 'auto', display: 'block', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 900 }}>
            Uni<span style={{ color: '#FFC845' }}>Bees</span>
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Your university's social swarm.
          </Typography>

          {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: 3, textAlign: 'left' }}>{errorMsg}</Alert>}

          <Stack spacing={2}>
            <TextField fullWidth required label="Full Name" value={name} onChange={(e) => setName(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField fullWidth required label="Username" value={username} onChange={(e) => setUsername(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField fullWidth required type="email" label="University Email" value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField fullWidth required type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField fullWidth required type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={!loading && <ArrowIcon />}
              sx={{ py: 2, mt: 1, borderRadius: 4, fontWeight: 'bold', textTransform: 'none', backgroundColor: '#FFC845', color: '#0A0A0B', '&:hover': { backgroundColor: '#e6b33e' } }}
            >
              {loading ? 'Buzzing in...' : 'Enter the Hive'}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;