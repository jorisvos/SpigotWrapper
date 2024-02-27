import { createTheme, ThemeOptions } from '@mui/material';
import { red } from '@mui/material/colors';

export const theme: ThemeOptions = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export const drawerWidth = 240;

export default theme;
