import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  IconButton,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Refresh } from '@mui/icons-material';
import { FormDialog, ServersOverview, Title } from '../../components';
import {
  AddServerRequest,
  Error,
  Jar,
  ServerInfo,
  getErrorMsg,
  isError,
} from '../../types';
import {
  GETAllJars,
  GETAllServerInfo,
  GETKillAllServers,
  GETStopAllServers,
  GETWaitForServersToStop,
  POSTAddServer,
} from '../../api';
import axios from 'axios';

export const Servers = () => {
  const [servers, setServers] = React.useState<ServerInfo[]>();
  const [disableButtons, setDisableButtons] = useState(false);
  const [openCreateServer, setOpenCreateServer] = useState(false);
  const [jars, setJars] = useState<Jar[]>();
  const [jarFile, setJarFile] = useState('');

  useEffect(() => {
    if (servers == undefined) updateServerInfo();
  }, [servers]);

  const updateJars = () => GETAllJars().then((data) => setJars(data));
  const updateServerInfo = () =>
    GETAllServerInfo().then((data) => setServers(data));

  const handleCreateServerOpen = () => {
    updateJars();
    setDisableButtons(true);
    setOpenCreateServer(true);
  };
  const handleCreateServerClose = () => {
    updateServerInfo();
    setOpenCreateServer(false);
    setDisableButtons(false);
  };
  const handleCreateServerSubmit = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: { [k: string]: any },
    callback: () => void,
  ) => {
    const data: AddServerRequest = {
      name: json.serverName,
      jarFile: json.jarFile,
      enablePlugins: json.enablePlugins,
    };

    const id = toast.loading('Creating server...');
    POSTAddServer(data)
      .then(() => toast.success('Created server.'))
      .catch((error) => {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          isError(error.response.data)
        )
          toast.error(getErrorMsg(error.response.data));
        else toast.error(getErrorMsg(Error.UnexpectedError));
      })
      .finally(() => {
        toast.dismiss(id);
        callback();
      });
  };
  const handleJarFileChange = (event: SelectChangeEvent<typeof jarFile>) =>
    setJarFile(event.target.value);

  const handleStopAllServers = () => {
    if (!confirm('Are you sure you want to stop all servers?')) return;
    toast.promise(GETStopAllServers, {
      pending: 'Stopping all servers...',
      success: 'Stopping all servers.',
      error: 'Something went wrong while stopping all servers.',
    });
  };
  const handleKillAllServers = () => {
    if (
      !confirm(
        'Are you sure you want to kill all servers? This might corrupt some or all servers!',
      )
    )
      return;
    if (!confirm("Are you really, really, really sure?! I won't ask again."))
      return;
    toast.promise(GETKillAllServers, {
      pending: 'Killing all servers...',
      success: 'Killing all servers.',
      error: 'Something went wrong while killing all servers.',
    });
  };
  const handleWaitForAllServers = () =>
    toast.promise(
      GETWaitForServersToStop,
      {
        pending: 'Waiting for all servers to stop...',
        success: 'All servers are stopped.',
        error: 'Something went wrong while waiting for all servers to stop.',
      },
      { closeButton: true, onClick: () => toast.dismiss(this) },
    );

  return (
    <Grid container spacing={3}>
      {/* Servers Actions */}
      <Grid item xs={12}>
        <Button
          disabled={disableButtons}
          sx={{ mr: 1, mb: 1 }}
          variant="outlined"
          onClick={handleCreateServerOpen}>
          Create new server
        </Button>
        <Button
          disabled={disableButtons}
          sx={{ mr: 1, mb: 1 }}
          variant="outlined"
          onClick={handleStopAllServers}>
          Stop all servers
        </Button>
        <Button
          disabled={disableButtons}
          sx={{ mr: 1, mb: 1 }}
          variant="outlined"
          color="error"
          onClick={handleKillAllServers}>
          Kill all servers
        </Button>
        <Button
          disabled={disableButtons}
          sx={{ mr: 1, mb: 1 }}
          variant="outlined"
          onClick={handleWaitForAllServers}>
          Wait for all servers to stop
        </Button>
      </Grid>

      {/* Servers Table */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Title>
            Servers{' '}
            <IconButton onClick={updateServerInfo}>
              <Refresh />
            </IconButton>
          </Title>
          <ServersOverview servers={servers} />
        </Paper>
      </Grid>

      <FormDialog
        open={openCreateServer}
        handleClose={handleCreateServerClose}
        handleSubmit={handleCreateServerSubmit}
        title="Create a new Server"
        text="To create a new server, fill out all the required fields below (all fields with a '*' are required)."
        submitText="Create server"
        dialogComponents={[
          {
            type: 'select',
            name: 'jarFile',
            label: 'Minecraft version (jar)',
            required: true,
            value: jarFile,
            onValueChanged: handleJarFileChange,
            items: jars?.map((jar) => {
              return {
                value: jar.id,
                label: `${jar.jarKind} ${jar.minecraftVersion}`,
              };
            }),
          },
          {
            type: 'text',
            name: 'serverName',
            label: 'The server name (example: Test server)',
            required: true,
          },
          {
            type: 'boolean',
            name: 'enablePlugins',
            label: 'Enable Plugins',
            required: false,
          },
        ]}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Grid>
  );
};

export default Servers;

// add, stopall, killall, wait for
