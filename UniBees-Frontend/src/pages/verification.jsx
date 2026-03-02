import { useState, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Stack,
  Link,
  alpha 
} from '@mui/material';
import { VerifiedUserOutlined as ShieldIcon } from '@mui/icons-material';


const Verification = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  
  const bgPath = "/src/assets/login-bg.jpg";
  const logoPath = "/src/assets/logo.png";

  
  const handleChange = (index, value) => {
    if (isNaN(value)) return; 
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

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
        backgroundColor: '#0A0A0B',
        position: 'fixed',
        top: 0,
        left: 0,
        px: 2,
      }}
    >
      {/* Background Blur Overlay */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          bgcolor: 'rgba(10, 10, 11, 0.4)', 
          backdropFilter: 'blur(8px)',
          zIndex: 0 
        }} 
      />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 4, sm: 6 }, 
            borderRadius: 8, 

            textAlign: 'center',
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(20px)',
    
            boxShadow: '0 0 40px rgba(66, 165, 245, 0.4)',
          }}
        >
          {/* Logo */}
          <Box 
            component="img"
            src={logoPath}
            alt="UniBees Logo"
            sx={{ width: 80, height: 80, mb: 3, mx: 'auto', display: 'block', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 900 }}>
            Check your <span style={{ color: '#FFC845' }}>Hive Inbox</span>
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, px: 2 }}>
            We sent a 6-digit code to your university email. 
            Enter it below to verify your wings.
          </Typography>



          {/* 6-Digit Input Row */}
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
            {code.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                variant="outlined"
                inputProps={{ 
                  style: { textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' },
                  maxLength: 1,
                  inputMode: 'numeric'
                }}
                sx={{ 
                  width: { xs: 45, sm: 54 },
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 3,
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFC845', 
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            ))}
          </Stack>



          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<ShieldIcon />}
            sx={{ 
              py: 2, 
              borderRadius: 4, 
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem',
              backgroundColor: '#FFC845',
              color: '#0A0A0B',
              boxShadow: '0 4px 14px rgba(255, 200, 69, 0.3)',
              '&:hover': {
                backgroundColor: '#e6b33e',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Verify & Enter
          </Button>

          <Box sx={{ mt: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Didn't get the buzz? {' '}
              <Link 
                href="#" 
                underline="none" 
                sx={{ 
                  color: 'inherit', 
                  fontWeight: 800, 
                  '&:hover': { color: '#FFC845' } 
                }}
              >
                Resend Code
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Verification;