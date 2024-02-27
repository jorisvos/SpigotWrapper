import React, { useEffect } from 'react';
import { CpuUsage, RamUsage, ServerInfo } from '../../types';
import { CircularProgress, Grid, Paper, Box, IconButton } from '@mui/material';
import { LineChart, PieChart, ServersOverview, Title } from '../../components';
import { GETAllServerInfo, GETCpuUsage, GETRamUsage } from '../../api';
import { Refresh } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [ramUsage, setRamUsage] = React.useState<RamUsage[]>();
  const [cpuUsage, setCpuUsage] = React.useState<CpuUsage[]>();
  const [servers, setServers] = React.useState<ServerInfo[]>();

  useEffect(() => {
    if (ramUsage == undefined) setRamUsage(GETRamUsage());
    if (cpuUsage == undefined) setCpuUsage(GETCpuUsage());
    if (servers == undefined) updateServerInfo();
  }, [servers]);

  const updateServerInfo = () =>
    GETAllServerInfo().then((data) => setServers(data));

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
          }}>
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
          }}>
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
          <Title>
            Servers{' '}
            <IconButton onClick={updateServerInfo}>
              <Refresh />
            </IconButton>
          </Title>
          <ServersOverview servers={servers} />
          <Box sx={{ mt: 3 }}>
            <Link color="primary" to="/servers">
              See all servers
            </Link>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
