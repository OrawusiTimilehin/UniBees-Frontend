import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Button, 
  Skeleton, 
  Paper,
  Chip,
  TextField,
  Switch,
  Divider,
  styled,
  keyframes,
  InputAdornment
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TagIcon from '@mui/icons-material/Tag';

/**
 * System Role: Senior Full-Stack Engineer
 * Project: UniBees (Campus Social Discovery)
 * Tech Stack: React, MUI v6
 * Palette: Pure White (#FFFFFF), Amber Yellow (#FFC845), Deep Slate (#1A1A1B)
 * UI: Light Mode Functional Settings using MUI Icons
 */

// --- STYLED COMPONENTS ---

const glowAnimation = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(255, 200, 69, 0.4)); }
  50% { filter: drop-shadow(0 0 6px rgba(255, 200, 69, 0.8)); }
  100% { filter: drop-shadow(0 0 2px rgba(255, 200, 69, 0.4)); }
`;

const HexagonBox = styled(Box)(({ size = 120, border = 4 }) => ({
  position: 'relative',
  width: size,
  height: size,
  clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
  backgroundColor: '#FFC845',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: border,
    backgroundColor: '#FFFFFF',
    clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
    zIndex: 1,
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 2,
    clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
  }
}));

const XPProgressRing = styled(Box)(({ value }) => ({
  position: 'relative',
  padding: '12px',
  borderRadius: '50%',
  display: 'inline-flex',
  background: `conic-gradient(#FFC845 ${value}%, #F0F0F0 0)`,
  animation: `${glowAnimation} 3s infinite ease-in-out`,
}));

const AmberTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#1A1A1B',
    backgroundColor: '#FFFFFF',
    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
    '&:hover fieldset': { borderColor: '#FFC845' },
    '&.Mui-focused fieldset': { borderColor: '#FFC845' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#FFC845' },
});

const SettingsCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  padding: '20px',
  borderRadius: '16px',
  marginBottom: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
}));

const AmberSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFC845',
    '& + .MuiSwitch-track': { backgroundColor: '#FFC845', opacity: 1 },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#E0E0E0',
  }
}));

// --- MAIN COMPONENT ---

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [formData, setFormData] = useState({
    username: "bee_master_99",
    email: "alex.rivera@campus.edu",
    notifications: true,
    privacy: false,
    interests: ["UX Research", "Cyberpunk", "Hive Mind", "Node.js"]
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interestToRemove)
    }));
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', p: 4 }}>
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={140} height={140} sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }} />
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 4, bgcolor: 'rgba(0, 0, 0, 0.05)' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8F9FA', color: '#1A1A1B', minHeight: '100vh', pb: 6 }}>
      {/* Top Navigation */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#FFFFFF', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ color: '#1A1A1B', fontWeight: 800, letterSpacing: 0.5 }}>HIVE SETTINGS</Typography>
        <IconButton sx={{ color: '#1A1A1B' }}>
          <SettingsIcon />
        </IconButton>
      </Box>

      <Container maxWidth="sm">
        {/* Header Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5, mt: 4 }}>
          <XPProgressRing value={78}>
            <HexagonBox size={130} border={4}>
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" alt="Avatar" />
            </HexagonBox>
          </XPProgressRing>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1A1A1B' }}>
              {formData.username}
            </Typography>
            <Chip 
              label="ELDER SCOUT" 
              sx={{ bgcolor: '#FFC845', color: '#0A0A0B', fontWeight: 'bold', mt: 1, height: 26, fontSize: '0.75rem', borderRadius: '6px' }} 
            />
          </Box>
        </Box>

        {/* Identity Section */}
        <Typography variant="overline" sx={{ color: 'rgba(0,0,0,0.4)', mb: 1, ml: 1, display: 'block', letterSpacing: 1.5, fontWeight: 700 }}>Identity</Typography>
        <SettingsCard elevation={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <AmberTextField 
              fullWidth 
              label="Username" 
              value={formData.username}
              onChange={(e) => handleUpdate('username', e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#FFC845', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <AmberTextField 
              fullWidth 
              label="Email Address" 
              value={formData.email}
              onChange={(e) => handleUpdate('email', e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#FFC845', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </SettingsCard>

        {/* Interests Section */}
        <Typography variant="overline" sx={{ color: 'rgba(0,0,0,0.4)', mb: 1, ml: 1, display: 'block', letterSpacing: 1.5, fontWeight: 700 }}>Interests & Tags</Typography>
        <SettingsCard elevation={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.interests.map(interest => (
                <Chip 
                  key={interest} 
                  label={interest}
                  onDelete={() => removeInterest(interest)}
                  deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
                  sx={{ 
                    bgcolor: '#FFC845', 
                    color: '#0A0A0B', 
                    fontWeight: 600,
                    borderRadius: '8px',
                    '& .MuiChip-deleteIcon': {
                      color: '#0A0A0B',
                      opacity: 0.7,
                      '&:hover': { opacity: 1 }
                    }
                  }} 
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <AmberTextField 
                fullWidth 
                size="small"
                label="Add Interest" 
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                placeholder="Hiking..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TagIcon sx={{ color: '#FFC845', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton 
                onClick={addInterest}
                sx={{ 
                  bgcolor: '#FFC845', 
                  color: '#0A0A0B', 
                  borderRadius: '12px',
                  '&:hover': { bgcolor: '#e6b43d' }
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </SettingsCard>

        {/* Security Section */}
        <Typography variant="overline" sx={{ color: 'rgba(0,0,0,0.4)', mb: 1, ml: 1, display: 'block', letterSpacing: 1.5, fontWeight: 700 }}>Security</Typography>
        <SettingsCard elevation={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <AmberTextField 
              fullWidth 
              type={showPassword ? 'text' : 'password'}
              label="New Password" 
              placeholder="••••••••"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#FFC845', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(0,0,0,0.3)' }}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              fullWidth 
              variant="contained" 
              sx={{ 
                bgcolor: '#FFC845', 
                color: '#0A0A0B', 
                fontWeight: 800,
                py: 1.6,
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(255, 200, 69, 0.3)',
                '&:hover': { bgcolor: '#e6b43d', boxShadow: '0 6px 20px rgba(255, 200, 69, 0.4)' }
              }}
            >
              Update Credentials
            </Button>
          </Box>
        </SettingsCard>

        {/* Preferences Section */}
        <Typography variant="overline" sx={{ color: 'rgba(0,0,0,0.4)', mb: 1, ml: 1, display: 'block', letterSpacing: 1.5, fontWeight: 700 }}>Preferences</Typography>
        <SettingsCard elevation={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1, bgcolor: 'rgba(255, 200, 69, 0.1)', borderRadius: '10px', display: 'flex' }}>
                <NotificationsIcon sx={{ color: '#FFC845', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Swarm Alerts</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>Push notifications for events</Typography>
              </Box>
            </Box>
            <AmberSwitch checked={formData.notifications} onChange={(e) => handleUpdate('notifications', e.target.checked)} />
          </Box>
          <Divider sx={{ my: 2, opacity: 0.6 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1, bgcolor: 'rgba(255, 200, 69, 0.1)', borderRadius: '10px', display: 'flex' }}>
                <SecurityIcon sx={{ color: '#FFC845', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Ghost Mode</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>Hide location from map</Typography>
              </Box>
            </Box>
            <AmberSwitch checked={formData.privacy} onChange={(e) => handleUpdate('privacy', e.target.checked)} />
          </Box>
        </SettingsCard>

        {/* Logout */}
        <Box sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
          <Button 
            startIcon={<LogoutIcon />}
            sx={{ 
              color: '#FF3B30', 
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              '&:hover': { bgcolor: 'rgba(255, 59, 48, 0.05)' }
            }}
          >
            Logout of Hive
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default App;