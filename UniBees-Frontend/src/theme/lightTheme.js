import { createTheme } from '@mui/material';

/**
 * UniBees Dynamic Theme Generator
 * @param {('light'|'dark')} mode 
 */
export const getHiveTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { 
      main: '#FFC845', 
      contrastText: mode === 'dark' ? '#0A0A0B' : '#0A0A0B' 
    },
    background: { 
      default: mode === 'dark' ? '#0A0A0B' : '#F8F9FA', 
      paper: mode === 'dark' ? '#141415' : '#FFFFFF' 
    },
    text: { 
      primary: mode === 'dark' ? '#FFFFFF' : '#0A0A0B', 
      secondary: mode === 'dark' ? '#94949B' : '#6B7280' 
    },
    divider: mode === 'dark' ? '#232325' : '#E5E7EB',
  },
  shape: { borderRadius: 24 },
  typography: {
    fontFamily: '"Space Grotesk", "Inter", sans-serif',
    h4: { fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em' },
    h5: { fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em' },
    h6: { fontWeight: 800, letterSpacing: '-0.02em' },
    subtitle1: { fontWeight: 700 },
    button: { fontWeight: 900, letterSpacing: '0.05em' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { 
          backgroundImage: 'none', 
          border: `1px solid ${mode === 'dark' ? '#232325' : '#E5E7EB'}` 
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 16, padding: '10px 24px' },
      },
    },
  },
});