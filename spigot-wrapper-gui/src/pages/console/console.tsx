import React, { useState } from 'react';
import { GETSpigotWrapperLog } from '../../api';
import { Grid, Paper } from '@mui/material';
import { Terminal, Title } from '../../components';

export const Console = () => {
  const [log, setLog] = useState<string>('Loading console...');

  const sendCommand = (command: string) => {
    console.log('NOT IMPLEMENTED YET! Command: '+command);
  };

  setTimeout(() => {
    GETSpigotWrapperLog().then(setLog);
  }, 3000);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Title>SpigotWrapper Console</Title>
          <Terminal log={log} sendCommand={sendCommand} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Console;
