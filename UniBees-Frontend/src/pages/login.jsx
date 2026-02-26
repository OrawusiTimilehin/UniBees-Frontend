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
import { Link } from 'react-router-dom';

/**
 * UniBees Login Page
 * Simplified twin of the Sign Up page with Username and Password
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Asset paths (Ensure these match your src/assets folder)
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
        backgroundColor: '#FFC845',
        position: 'fixed',
        top: 0,
        left: 0,
        px: 2,
      }}
    >
     
    </Box>
  );
};

export default Login;