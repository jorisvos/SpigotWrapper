import { useStyles } from './styles';
import React, { useState } from 'react';
import { GETConsoleLog } from '../../api';
import { Container, Grid } from '@mui/material';
import { Terminal } from '../../components';

export const Console = () => {
  const classes = useStyles();
  const [log, setLog] = useState<string>('');

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  const sendCommand = (command: string) => {};

  setTimeout(() => {
    GETConsoleLog().then(setLog);
  }, 3000);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* Console */}
        <Grid item xs={12} md={12} lg={8}>
          <Terminal log={log} sendCommand={sendCommand} enableInput />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Console;
