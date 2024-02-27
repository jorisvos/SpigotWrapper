import React, { useEffect } from 'react';
import { CpuUsage, RamUsage } from '../../types';
import { CircularProgress, Grid, Link, Paper, Box } from '@mui/material';
import { LineChart, PieChart, Servers, Title } from '../../components';
import { GETCpuUsage, GETRamUsage } from '../../api';

export const Dashboard = () => {
  const [ramUsage, setRamUsage] = React.useState<RamUsage[]>();
  const [cpuUsage, setCpuUsage] = React.useState<CpuUsage[]>();

  useEffect(() => {
    if (ramUsage == undefined) setRamUsage(GETRamUsage());
    if (cpuUsage == undefined) setCpuUsage(GETCpuUsage());
  });

  return (
    <Grid container spacing={3}>
      {/* RAM Usage LineChart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          {ramUsage ? (
            <LineChart
              title="RAM Usage (in progress)"
              info="RAM"
              data={ramUsage}
              unit="MB"
            />
          ) : (
            <CircularProgress />
          )}
        </Paper>
      </Grid>
      {/* CPU Usage PieChart */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          {cpuUsage ? (
            <PieChart title="CPU Usage (in progress)" data={cpuUsage} />
          ) : (
            <CircularProgress />
          )}
        </Paper>
      </Grid>
      {/* Recent Servers */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Title>Servers</Title>
          <Servers serverCount={5} />
          <Box sx={{ mt: 3 }}>
            <Link color="primary" href="/servers">
              See all servers
            </Link>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
