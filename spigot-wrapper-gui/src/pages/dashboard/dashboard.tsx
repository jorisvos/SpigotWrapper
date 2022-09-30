import React, { useEffect } from 'react';
import { useStyles } from './styles';
import clsx from 'clsx';
import { CpuUsage, RamUsage } from '../../types';
import { CircularProgress, Container, Grid, Link, Paper } from '@mui/material';
import { LineChart, PieChart, Servers, Title } from '../../components';
import { GETCpuUsage, GETRamUsage } from '../../api';

export const Dashboard = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [ramUsage, setRamUsage] = React.useState<RamUsage[]>();
  const [cpuUsage, setCpuUsage] = React.useState<CpuUsage[]>();

  useEffect(() => {
    if (ramUsage == undefined) setRamUsage(GETRamUsage());
    if (cpuUsage == undefined) setCpuUsage(GETCpuUsage());
  });

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* RAM Usage LineChart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
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
          <Paper className={fixedHeightPaper}>
            {cpuUsage ? (
              <PieChart title="CPU Usage (in progress)" data={cpuUsage} />
            ) : (
              <CircularProgress />
            )}
          </Paper>
        </Grid>
        {/* Recent Servers */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title>Servers</Title>
            <Servers serverCount={5} />
            <div className={classes.seeMore}>
              <Link color="primary" href="/servers">
                See all servers
              </Link>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
