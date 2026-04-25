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
import { useNavigate } from 'react-router-dom';

/**
 * APOLLO CLIENT IMPORTS
 * Updated to use the standard package path to resolve the environment resolution error.
 */
import { gql} from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * LOCAL MUTATION DEFINITIONS
 * These are defined here to ensure the "major" variable and the String return type
 * match your specific backend implementation perfectly.
 */
const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $name: String!, $major: String!) {
    signup(username: $username, email: $email, password: $password, name: $name, major: $major)
  }
`;

const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($email: String!, $code: String!) {
    verifyOtp(email: $email, code: $code) {
      token
      user {
        id
        username
      }
    }
  }
`;

const SignUp = () => {
  const navigate = useNavigate();
  
  // UI Flow State: 1 = Details, 2 = OTP Entry
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState(''); // New required field
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Initial Signup Mutation
  const [signupUser, { loading: signupLoading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      if (data.signup === "OTP_SENT") {
        setStep(2); // Transition to OTP screen
      }
    },
    onError: (error) => setErrorMsg(error.message)
  });

  // 2. OTP Verification Mutation
  const [verifyOtp, { loading: verifyLoading }] = useMutation(VERIFY_OTP_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.verifyOtp.token);
      navigate('/explore');
    },
    onError: (error) => setErrorMsg(error.message)
  });

  const handleEnterHive = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    const emailLower = email.toLowerCase().trim();
    if (!emailLower.endsWith('.ac.uk') && !emailLower.endsWith('.edu')) {
      setErrorMsg("Please use a valid university email (e.g., .ac.uk).");
      return;
    }

    signupUser({
      variables: { name, username, email: emailLower, password, major }
    });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    verifyOtp({
      variables: { email: email.toLowerCase().trim(), code: otp }
    });
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
            {step === 1 ? 'Uni' : 'Verify '}<span style={{ color: '#FFC845' }}>{step === 1 ? 'Bees' : 'Wing'}</span>
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {step === 1 ? "Your university's social swarm." : `Enter the code sent to ${email}`}
          </Typography>

          {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: 3, textAlign: 'left' }}>{errorMsg}</Alert>}

          {step === 1 ? (
            <Stack spacing={2} component="form" onSubmit={handleEnterHive}>
              <TextField fullWidth required label="Full Name" value={name} onChange={(e) => setName(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField fullWidth required label="Username" value={username} onChange={(e) => setUsername(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField fullWidth required type="email" label="University Email" value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              
              {/* MAJOR FIELD: Added to resolve the "Variable $major not provided" error */}
              <TextField 
                fullWidth required label="Course / Major" value={major} 
                onChange={(e) => setMajor(e.target.value)} 
                placeholder="e.g. Computer Science"
                variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} 
              />
              
              <TextField fullWidth required type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField fullWidth required type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={signupLoading}
                endIcon={!signupLoading && <ArrowIcon />}
                sx={{ py: 2, mt: 1, borderRadius: 4, fontWeight: 'bold', textTransform: 'none', backgroundColor: '#FFC845', color: '#0A0A0B', '&:hover': { backgroundColor: '#e6b33e' } }}
              >
                {signupLoading ? 'Buzzing...' : 'Enter the Hive'}
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3} component="form" onSubmit={handleVerifyOtp}>
              <TextField 
                fullWidth required label="6-Digit Code" value={otp} onChange={(e) => setOtp(e.target.value)} 
                variant="outlined" autoFocus
                inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: 8, fontWeight: 900, fontSize: '1.5rem' } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} 
              />

              <Box>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={verifyLoading}
                  sx={{ py: 2, borderRadius: 4, fontWeight: 'bold', textTransform: 'none', backgroundColor: '#FFC845', color: '#000', '&:hover': { backgroundColor: '#e6b33e' } }}
                >
                  {verifyLoading ? 'Verifying...' : 'Verify & Enter'}
                </Button>
                <Button 
                  fullWidth variant="text" onClick={() => setStep(1)}
                  sx={{ mt: 1, color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}
                >
                  Back to details
                </Button>
              </Box>
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;