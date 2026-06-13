import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  palette: {
    primary:   { main: '#2563EB' },
    secondary: { main: '#7C3AED' },
    success:   { main: '#16A34A' },
    warning:   { main: '#D97706' },
    error:     { main: '#DC2626' },
    background:{ default: '#F8FAFC', paper: '#FFFFFF' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 500 } },
    },
    MuiCard: {
      styleOverrides: { root: { boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500 } },
    },
  },
});

export default theme;
