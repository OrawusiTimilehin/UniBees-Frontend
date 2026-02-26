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
     
    </Box>
  );
};

export default SignUp;