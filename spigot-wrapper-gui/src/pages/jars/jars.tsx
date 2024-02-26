import React, { useEffect } from 'react';
import { useStyles } from './styles';
import clsx from 'clsx';
import { CpuUsage, RamUsage, isError } from '../../types';
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  Paper,
} from '@mui/material';
import {
  LineChart,
  PieChart,
  Servers,
  Title,
  Jars as JarsComp,
} from '../../components';
import { GETCpuUsage, GETRamUsage, POSTDownloadLatestJar } from '../../api';
import axios, { AxiosError } from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';

export const Jars = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const downloadLatest = () => {
    POSTDownloadLatestJar().then((data) => {
      if (isError(data)) {
        console.log('failure');
      } else {
        console.log('success');
      }
    });
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* Jars table */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <JarsComp />
          </Paper>
        </Grid>
        {/* Actions */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <div>
              This will contain buttons with actions (Add, Remove, Upload)
              <Button onClick={downloadLatest}>
                Download latest official minecraft server
              </Button>
            </div>
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

export default Jars;
