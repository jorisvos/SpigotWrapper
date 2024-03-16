import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { GETAllPlugins, GETServerInfo, GETServerPlugins } from '../api';
import {
  DELETERemovePluginFromServer,
  POSTAddPluginToServer,
  PUTEnablePluginsForServer,
} from '../api/server';

interface Props {
  serverId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const PluginManager: React.FC<Props> = ({ serverId, open, setOpen }) => {
  const [plugins, setPlugins] = useState<SpigotWrapperPlugin[]>([]);
  const [enablePlugins, setEnablePlugins] = useState(false);
  const [enabledPlugins, setEnabledPlugins] = useState<SpigotWrapperPlugin[]>(
    [],
  );

  useEffect(() => {
    GETAllPlugins().then((p) => setPlugins(p));
    GETServerInfo(serverId).then(({ enablePlugins }) =>
      setEnablePlugins(enablePlugins),
    );
    GETServerPlugins(serverId).then((p) => setEnabledPlugins(p));
  }, [serverId]);

  const handleEnablePluginsChange = (event: ChangeEvent<HTMLInputElement>) => {
    PUTEnablePluginsForServer(serverId, event.target.checked);
    setEnablePlugins(event.target.checked);
  };
  const handleEnabledPluginChange = (
    event: ChangeEvent<HTMLInputElement>,
    pluginId: string,
  ) => {
    if (event.target.checked && !enabledPluginsContain(pluginId)) {
      POSTAddPluginToServer(serverId, pluginId);
      setEnabledPlugins((ep) => {
        const plugin = getPluginById(pluginId);
        return plugin === undefined ? ep : [...ep, plugin];
      });
    } else if (!event.target.checked) {
      DELETERemovePluginFromServer(serverId, pluginId);
      setEnabledPlugins((ep) => ep.filter((p) => p.id !== pluginId));
    }
  };
  const enabledPluginsContain = (pluginId: string) =>
    enabledPlugins?.some((p) => p.id === pluginId);
  const getPluginById = (pluginId: string) =>
    plugins?.find((p) => p.id === pluginId);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Plugin Manager</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setOpen(false)}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <DialogContentText>
          <FormControlLabel
            control={
              <Checkbox
                checked={enablePlugins}
                onChange={handleEnablePluginsChange}
                disableRipple
                inputProps={{ 'aria-labelledby': 'checkbox-enable-plugins' }}
              />
            }
            label="Enable plugins"
          />
        </DialogContentText>

        <Divider sx={{ mt: 1, mb: 1 }} />

        <DialogContentText>
          Select the plugins you want to enable for this server.
        </DialogContentText>

        <List>
          {plugins?.map((plugin) => {
            const labelId = `checkbox-list-label-${plugin.name}`;

            return (
              <ListItem key={plugin.id} disablePadding>
                <ListItemButton onClick={() => console.log('')} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={enabledPlugins?.some((p) => p.id === plugin.id)}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleEnabledPluginChange(event, plugin.id)
                      }
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={`${plugin.name} ${plugin.version}`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>

      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default PluginManager;
