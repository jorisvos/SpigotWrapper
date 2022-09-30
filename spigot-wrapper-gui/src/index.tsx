import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './core/theme';
import { BrowserRouter } from 'react-router-dom';
import { Root } from './pages';

// imports for Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
