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
