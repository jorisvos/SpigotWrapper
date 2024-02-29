import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DELETEServer,
  GETAcceptEULA,
  GETKillServer,
  GETMinecraftLog,
  GETServerInfo,
  GETServerLog,
  GETServerProperties,
  GETStartServer,
  GETStopServer,
  POSTExecuteCommand,
  PUTUpdateServerProperties,
} from '../../api';
import { Terminal } from '../../components';
import { Bounce, ToastContainer, toast } from 'react-toastify';

export const Server = () => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const interval = useRef<NodeJS.Timeout | null>(null);
  const [log, setLog] = useState<string>('Loading console...');
  const [lock, setLock] = useState(false);
  const [logType, setLogType] = useState('spigotwrapper');
  const [serverProperties, setServerProperties] = useState(
    'Loading server properties...',
  );
  const [enableAutoScroll, setEnableAutoScroll] = useState(false);

  const [startButtonDisabled, setStartButtonDisabled] = useState(true);
  const [stopButtonDisabled, setStopButtonDisabled] = useState(true);
  const [
    saveServerPropertiesButtonDisabled,
    setSaveServerPropertiesButtonDisabled,
  ] = useState(true);

  useEffect(() => {
    updateServerLog();
    updateServerInfo();
    updateServerProperties();

    interval.current = setInterval(() => {
      updateServerLog();
      updateServerInfo();
    }, 3000);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [serverId, lock, logType]);

  const updateServerInfo = () => {
    if (serverId !== undefined) {
      GETServerInfo(serverId).then((data) => {
        updateServerStatus(data.isRunning);
      });
    }
  };
  const updateServerLog = () => {
    if (serverId !== undefined) {
      if (logType === 'spigotwrapper')
        GETServerLog(serverId)
          .then(setLog)
          .catch(() => setLog('No SpigotWrapper log found.'));
      else
        GETMinecraftLog(serverId)
          .then(setLog)
          .catch(() => setLog('No Minecraft log found.'));
    }
  };
  const updateServerProperties = () => {
    if (serverId !== undefined) {
      GETServerProperties(serverId)
        .then((data) => {
          setSaveServerPropertiesButtonDisabled(false);
          setServerProperties(data);
        })
        .catch(() => {
          setSaveServerPropertiesButtonDisabled(true);
          setServerProperties('No server.properties file found.');
        });
    }
  };

  const updateServerStatus = (isRunning: boolean) => {
    if (!lock) {
      if (isRunning) {
        setStartButtonDisabled(true);
        setStopButtonDisabled(false);
      } else {
        setStartButtonDisabled(false);
        setStopButtonDisabled(true);
      }
    }
  };

  const sendCommand = (command: string) => {
    if (serverId !== undefined)
      POSTExecuteCommand(serverId, command).then((executed) => {
        if (!executed) toast.error('Server is not running.');
        else updateServerLog();
      });
  };

  const handleStartServer = () => {
    if (serverId !== undefined) {
      setStartButtonDisabled(true);
      toast
        .promise(GETStartServer(serverId), {
          pending: 'Starting server...',
          success: 'Starting server.',
          error: 'Something went wrong whilst starting the server.',
        })
        .then(() => setLogType('minecraft'));
    }
  };
  const handleStopServer = () => {
    if (serverId !== undefined) {
      setLock(true);
      setStopButtonDisabled(true);
      toast
        .promise(GETStopServer(serverId, true), {
          pending: 'Stopping server...',
          success: 'Stopped server.',
          error: 'Something went wrong whilst stopping the server.',
        })
        .then(() => setLogType('spigotwrapper'))
        .finally(() => setLock(false));
    }
  };
  const handleKillServer = () => {
    if (
      !confirm(
        'Are you sure you want to kill this server? If you do you might have to manually remove the "session.lock" file from the world folder!',
      )
    )
      return;
    if (!confirm("Are you really, really, really sure?! I won't ask again."))
      return;
    if (serverId !== undefined) {
      setLock(true);
      setStopButtonDisabled(true);
      toast
        .promise(GETKillServer(serverId, true), {
          pending: 'Killing server...',
          success: 'Killed server.',
          error: 'Something went wrong whilst killing the server.',
        })
        .finally(() => setLock(false));
    }
  };
  const handleAcceptEula = () => {
    if (serverId !== undefined) {
      toast
        .promise(GETAcceptEULA(serverId), {
          pending: 'Accepting Minecraft EULA...',
          success: {
            render({ data }) {
              return data
                ? 'Accepted Minecraft EULA.'
                : 'Already accepted Minecraft EULA.';
            },
          },
          error: 'Something went wrong whilst killing the server.',
        })
        .finally(() => setLock(false));
    }
  };
  const handleRemoveServer = () => {
    if (
      !confirm(
        'Are you really sure you want to remove this server? There is NO way to get it back once you delete it.',
      )
    )
      return;
    if (!confirm("Are you really, really, really sure?! I won't ask again."))
      return;
    if (serverId !== undefined) {
      setLock(true);
      setStopButtonDisabled(true);
      setStartButtonDisabled(true);
      toast
        .promise(DELETEServer(serverId), {
          pending: 'Deleting server...',
          success: 'Server Deleted.',
          error: 'Something went wrong whilst deleting the server.',
        })
        .finally(() => setTimeout(() => navigate('/servers'), 5000));
    }
  };
  const handleSaveServerProperties = () => {
    if (
      !confirm(
        'Are you sure you want to save the server.properties? You need to restart the server for it to take effect.',
      )
    )
      return;
    setSaveServerPropertiesButtonDisabled(true);
    if (serverId !== undefined) {
      toast
        .promise(PUTUpdateServerProperties(serverId, serverProperties), {
          pending: 'Saving server properties...',
          success: 'Saved server properties.',
          error: 'Something went wrong whilst saving the server properties.',
        })
        .finally(() => setSaveServerPropertiesButtonDisabled(false));
    }
  };

  const onLogTypeChange = (event: SelectChangeEvent<string>) => {
    setLogType(event.target.value);
    updateServerLog();
  };
  const handleEnableAutoScrollChange = (event: ChangeEvent<HTMLInputElement>) =>
    setEnableAutoScroll(event.target.checked);
  const onServerPropertiesChange = (event: ChangeEvent<HTMLInputElement>) =>
    setServerProperties(event.target.value);

  return (
    <Grid container spacing={3}>
      {/* Server Actions */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}>
          <Button
            disabled={startButtonDisabled}
            sx={{ mr: 1, mb: 1 }}
            variant="outlined"
            onClick={handleStartServer}>
            Start server
          </Button>
          <Button
            disabled={stopButtonDisabled}
            sx={{ mr: 1, mb: 1 }}
            variant="outlined"
            onClick={handleStopServer}>
            Stop server
          </Button>
          <Button
            disabled={stopButtonDisabled}
            sx={{ mr: 1, mb: 1 }}
            variant="outlined"
            color="error"
            onClick={handleKillServer}>
            Kill server
          </Button>
          <Button
            sx={{ mr: 1, mb: 1 }}
            variant="outlined"
            onClick={handleAcceptEula}>
            Accept Minecraft EULA
          </Button>
          <Button
            disabled={startButtonDisabled}
            sx={{ mr: 1, mb: 1 }}
            variant="outlined"
            color="error"
            onClick={handleRemoveServer}>
            Remove server
          </Button>
        </Paper>
      </Grid>
      {/* Server properties */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}>
          {/* TODO: Make this so you can use checkboxes for true/false, number for numbers and text for other */}
          <Box sx={{ overflowY: 'scroll' }}>
            <TextField
              disabled={saveServerPropertiesButtonDisabled}
              sx={{
                fontSize: 13,
                lineHeight: 1.42857143,
                wordBreak: 'break-all',
                wordWrap: 'break-word',
                fontFamily: 'Menlo,Monaco,Consolas,"Courier New",monospace',
              }}
              margin="dense"
              label="Server properties"
              placeholder="Server properties"
              value={serverProperties}
              onChange={onServerPropertiesChange}
              multiline
              fullWidth
            />
          </Box>
          {/* TODO: add cancel button (and discard changes) */}
          <Button
            disabled={saveServerPropertiesButtonDisabled}
            sx={{ mt: 1 }}
            variant="outlined"
            onClick={handleSaveServerProperties}>
            Save
          </Button>
        </Paper>
      </Grid>
      {/* Console */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <InputLabel id="log-label">Log Type</InputLabel>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
            <Select
              labelId="log-label"
              sx={{ mr: 'auto', mb: 1 }}
              value={logType}
              onChange={onLogTypeChange}
              input={<OutlinedInput label="test?" id="input" />}>
              <MenuItem value="spigotwrapper">SpigotWrapper Log</MenuItem>
              <MenuItem value="minecraft">Minecraft Log</MenuItem>
            </Select>
            <FormControlLabel
              sx={{ mb: 1 }}
              value={true}
              control={
                <Checkbox
                  checked={enableAutoScroll}
                  onChange={handleEnableAutoScrollChange}
                  id="auto-scroll"
                  name="autoScroll"
                />
              }
              label="Enable auto-scroll"
              labelPlacement="start"
            />
          </Box>
          <Terminal
            log={log}
            sendCommand={sendCommand}
            enableInput
            autoScroll={enableAutoScroll}
          />
        </Paper>
      </Grid>

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

export default Server;
