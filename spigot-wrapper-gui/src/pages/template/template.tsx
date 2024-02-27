import React from 'react';
import { Grid, Paper } from '@mui/material';

export const Template = () => {
  return (
    <Grid container spacing={3}>
      {/* NUMMER 1 */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          NUMMER 1
        </Paper>
      </Grid>
      {/* NUMMER 2 */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          NUMMER 2
        </Paper>
      </Grid>
      {/* NUMMER 3 */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          NUMMER 3
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Template;
