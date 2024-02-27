import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider } from '@mui/material';
import theme from './core/theme';
import { BrowserRouter } from 'react-router-dom';
import { Root } from './pages';

// imports for Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// other imports
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
// eslint-disable-next-line
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
