import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Stack,
  alpha 
} from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const bgPath = "/src/assets/login-bg.jpg";
  const logoPath = "/src/assets/logo.png";

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundImage: `url(${bgPath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#FFC845', // Fallback color
        position: 'fixed',
        top: 0,
        left: 0,
        px: 2,
      }}
    >
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 4, sm: 6 }, 
            borderRadius: 8, 
            textAlign: 'center',
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 30px rgba(66, 165, 245, 0.3)',
          }}
        >
          {/* Logo Section */}
          <Box 
            component="img"
            src={logoPath}
            alt="UniBees Logo"
            sx={{ 
              width: 100, 
              height: 100, 
              mb: 2,
              mx: 'auto',
              display: 'block',
              objectFit: 'contain'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          
    
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 900 }}>
            Uni<span style={{ color: '#FFC845' }}>Bees</span>
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Your university's real-time social swarm. 
            Enter your details and get back buzzing!
          </Typography>

          {/* Form Stack */}
          <Stack spacing={2}>
            <TextField
              fullWidth
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
            />
            
            <TextField
              fullWidth
              placeholder="you@university.ac.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
            />

            <TextField
              fullWidth
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
            />

            <TextField
              fullWidth
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
            />


            <Button
              fullWidth
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              sx={{ 
                py: 2, 
                borderRadius: 4, 
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                backgroundColor: '#FFC845',
                color: '#0A0A0B',
                '&:hover': {
                  backgroundColor: '#e6b33e',
                }
              }}
            >
              Enter the Hive
            </Button>
          </Stack>

          <Typography variant="caption" display="block" sx={{ mt: 5, color: 'text.secondary', fontWeight: 'bold' }}>
            university emails only • No passwords • Just vibes
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;