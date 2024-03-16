import React, { useState } from 'react';
import { DELETEJar } from '../api';
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
  jars: Jar[] | undefined;
  updateJars: () => void;
}

export const JarsOverview: React.FC<Props> = ({ jars, updateJars }) => {
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
    removeJar(id);
    handleClose();
  };
  const removeJar = (id: string) =>
    DELETEJar(id)
      .then(() => {
        updateJars();
        toast.success('Removed jar successfully.');
      })
      .catch(() =>
        toast.error(
          "Something went wrong whilst trying to remove a jar file. It's probably in use.",
        ),
      );

  return (
    <>
      {jars ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Minecraft API</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Created at</TableCell>
              {/* <TableCell>File name</TableCell> */}
              <TableCell align="right">Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jars.map((jar) => (
              <TableRow key={jar.id}>
                <TableCell>
                  <IconButton onClick={() => handleOpen(jar.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
                <TableCell>{jar.jarKind}</TableCell>
                <TableCell>{jar.minecraftVersion}</TableCell>
                <TableCell>
                  {moment(jar.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                </TableCell>
                {/* <TableCell>{jar.minecraftVersion}</TableCell> */}
                <TableCell align="right">{jar.id}</TableCell>
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
          Are you sure you want to remove this jar?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {jars?.find((jar) => jar.id === id)?.jarKind}{' '}
            {jars?.find((jar) => jar.id === id)?.minecraftVersion}
            <br />
            file name: {jars?.find((jar) => jar.id === id)?.fileName}
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

export default JarsOverview;
