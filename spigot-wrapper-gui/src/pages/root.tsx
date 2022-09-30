import { Route, Routes, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useStyles } from './styles';
import { Box, CssBaseline } from '@mui/material';
import { AppBar, Copyright, Drawer, Servers } from '../components';
import { Console, Dashboard } from './index';
import { Jars } from './jars/jars';

export const Root = () => {
  const location = useLocation();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [title, setTitle] = React.useState('Dashboard');

  useEffect(() => {
    if (location.pathname.includes('/servers')) setTitle('Servers');
    else if (location.pathname.includes('/console')) setTitle('Console');
    else setTitle('Dashboard');
  });

  const toggleDrawer = () => (open ? setOpen(false) : setOpen(true));

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar title={title} open={open} toggleDrawer={toggleDrawer} />

      <Drawer open={open} toggleDrawer={toggleDrawer} />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/console" element={<Console />} />
          <Route path="/jars" element={<Jars />} />
          <Route path="/servers" element={<Servers />} />
        </Routes>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
};
