import React, { useState } from 'react';
import { DELETEPlugin } from '../api';
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import moment from 'moment';
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface Props {
  plugins: SpigotWrapperPlugin[] | undefined;
  updatePlugins: () => void;
}

export const PluginsOverview: React.FC<Props> = ({
  plugins,
  updatePlugins,
}) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');

  const handleClose = () => {
    setId('');
    setOpen(false);
  };
  const handleOpen = (id: string) => {
    setId(id);
    setOpen(true);
  };

  const handleRemove = () => {
    removePlugin(id);
    handleClose();
  };
  const removePlugin = (id: string) =>
    DELETEPlugin(id)
      .then(() => {
        toast.success('Removed plugin successfully.');
        updatePlugins();
      })
      .catch(() =>
        toast.error(
          "Something went wrong whilst trying to remove a plugin. It's probably in use.",
        ),
      );

  return (
    <>
      {plugins ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Created at</TableCell>
              {/* <TableCell>File name</TableCell> */}
              <TableCell align="right">Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plugins.map((plugin) => (
              <TableRow key={plugin.id}>
                <TableCell>
                  <IconButton onClick={() => handleOpen(plugin.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
                <TableCell>{plugin.name}</TableCell>
                <TableCell>{plugin.version}</TableCell>
                <TableCell>
                  {moment(plugin.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                </TableCell>
                {/* <TableCell>{jar.minecraftVersion}</TableCell> */}
                <TableCell align="right">{plugin.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <CircularProgress />
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to remove this plugin?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {plugins?.find((plugin) => plugin.id === id)?.name}{' '}
            {plugins?.find((plugin) => plugin.id === id)?.version}
            <br />
            file name: {plugins?.find((plugin) => plugin.id === id)?.fileName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleRemove} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PluginsOverview;
