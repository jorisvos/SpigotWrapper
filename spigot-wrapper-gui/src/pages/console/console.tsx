import { useStyles } from './styles';
import React, { useState } from 'react';
import { GETSpigotWrapperLog } from '../../api';
import { Container, Grid } from '@mui/material';
import { Terminal } from '../../components';

export const Console = () => {
  const classes = useStyles();
  const [log, setLog] = useState<string>('Loading console...');

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  const sendCommand = (command: string) => {};

  setTimeout(() => {
    GETSpigotWrapperLog().then(setLog);
  }, 3000);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* Console */}
        <Grid item xs={12} md={12} lg={12}>
          <Terminal log={log} sendCommand={sendCommand} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Console;
