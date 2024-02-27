import { Route, Routes, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Container, Toolbar } from '@mui/material';
import { AppBar, Copyright, Drawer, ServersOverview } from '../components';
import { Console, Dashboard, Jars } from './index';

export const Root = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const [title, setTitle] = React.useState('Dashboard');

  useEffect(() => {
    if (location.pathname.includes('/servers')) setTitle('Servers');
    else if (location.pathname.includes('/console')) setTitle('Console');
    else setTitle('Dashboard');
  });

  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar title={title} open={open} toggleDrawer={toggleDrawer} />

      <Drawer open={open} toggleDrawer={toggleDrawer} />

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/console" element={<Console />} />
            <Route path="/jars" element={<Jars />} />
            <Route path="/servers" element={<ServersOverview />} />
          </Routes>
          <Copyright />
        </Container>
      </Box>
    </Box>
  );
};
