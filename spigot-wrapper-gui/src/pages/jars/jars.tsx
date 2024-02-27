import React, { useEffect, useState } from 'react';
import {
  DownloadJarRequest,
  Error,
  Jar,
  JarKind,
  UploadJarRequest,
  getErrorMsg,
  isError,
} from '../../types';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
  Paper,
  Select,
  InputLabel,
  OutlinedInput,
  Divider,
  SelectChangeEvent,
  IconButton,
} from '@mui/material';
import { Bounce, ToastContainer, UpdateOptions, toast } from 'react-toastify';
import { Title, Jars as JarsComp } from '../../components';
import {
  GETAllJars,
  POSTDownloadJar,
  POSTDownloadLatestJar,
  POSTUploadJar,
} from '../../api';
import axios from 'axios';
import { Refresh } from '@mui/icons-material';

export const Jars = () => {
  const [jars, setJars] = useState<Jar[]>();
  const [disableButtons, setDisableButtons] = useState(false);
  const [disableDialogButtons, setDisableDialogButtons] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [jarKind, setJarKind] = useState('');

  useEffect(() => {
    if (jars == undefined) updateJars();
  });

  const handleUploadOpen = () => {
    setDisableButtons(true);
    setOpenUpload(true);
  };
  const handleUploadClose = () => {
    updateJars();
    setOpenUpload(false);
    setDisableButtons(false);
    setDisableDialogButtons(false);
  };

  const handleDownloadOpen = () => {
    setDisableButtons(true);
    setOpenDownload(true);
  };
  const handleDownloadClose = () => {
    updateJars();
    setOpenDownload(false);
    setDisableButtons(false);
    setDisableDialogButtons(false);
  };

  const handleJarKindChange = (event: SelectChangeEvent<typeof jarKind>) => {
    setJarKind(event.target.value);
  };

  const defaultToastSettings: UpdateOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  };

  //TODO: fix error occuring when backend is not running
  const updateJars = () => GETAllJars().then((data) => setJars(data));
  const downloadLatest = () => {
    setDisableButtons(true);
    const id = toast.loading('Downloading latest version...');
    POSTDownloadLatestJar()
      .then((data) => {
        if (isError(data)) {
          toast.update(id, {
            render: getErrorMsg(data),
            type: 'error',
            isLoading: false,
            ...defaultToastSettings,
          });
        } else {
          toast.update(id, {
            render: 'Downloaded latest version.',
            type: 'success',
            isLoading: false,
            ...defaultToastSettings,
          });
        }
      })
      .finally(() => {
        updateJars();
        setDisableButtons(false);
      });
  };

  return (
    <Grid container spacing={3}>
      {/* Jars table */}
      <Grid item xs={12}>
        <Button
          disabled={disableButtons}
          sx={{ mr: 1 }}
          variant="outlined"
          onClick={handleUploadOpen}>
          Upload jar
        </Button>
        <Button
          disabled={disableButtons}
          sx={{ mr: 1 }}
          variant="outlined"
          onClick={handleDownloadOpen}>
          Download jar
        </Button>
        <Button
          disabled={disableButtons}
          sx={{ mr: 1 }}
          variant="outlined"
          onClick={downloadLatest}>
          Download latest official minecraft server
        </Button>
      </Grid>

      {/* Jars Table */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Title>
            Jars{' '}
            <IconButton onClick={updateJars}>
              <Refresh />
            </IconButton>
          </Title>
          <JarsComp jars={jars} updateJars={updateJars} />
        </Paper>
      </Grid>

      <Box>
        {/* Upload Dialog */}
        <Dialog
          open={openUpload}
          onClose={handleUploadClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              //TODO: add check if file is not bigger then the limit, because now it just throws an unexpected error and displays a success toast.
              event.preventDefault();
              setDisableDialogButtons(true);

              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());

              const data: UploadJarRequest = {
                jarKind: formJson.jarKind,
                minecraftVersion: formJson.minecraftVersion,
                file: formJson.file,
              };

              const id = toast.loading('Uploading file...');
              POSTUploadJar(data, (p) => {
                const progress = p.loaded / (p.total ?? 1);
                toast.update(id, { progress });
              })
                .then((data) => {
                  toast.success('Uploaded jar.');
                })
                .catch((error) => {
                  if (
                    axios.isAxiosError(error) &&
                    error.response &&
                    isError(error.response.data)
                  ) {
                    toast.update(id, {
                      render: getErrorMsg(error.response.data),
                      type: 'error',
                      isLoading: false,
                      ...defaultToastSettings,
                    });
                  } else {
                    toast.update(id, {
                      render: getErrorMsg(Error.UnexpectedError),
                      type: 'error',
                      isLoading: false,
                      ...defaultToastSettings,
                    });
                  }
                })
                .finally(handleUploadClose);
            },
          }}>
          <DialogTitle>Upload a Jar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To upload a (custom) jar file, fill out this form. All fields
              ending with a * are required.
            </DialogContentText>

            <Divider sx={{ mt: 1, mb: 1 }} />

            <InputLabel htmlFor="jar-kind">Jar Kind *</InputLabel>
            <Select
              native
              required
              id="kind"
              name="jarKind"
              value={jarKind}
              onChange={handleJarKindChange}
              input={<OutlinedInput label="Jar Kind *" id="jar-kind" />}>
              {Object.values(JarKind).map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <TextField
              required
              margin="dense"
              id="version"
              name="minecraftVersion"
              label="Minecraft Version (example: 1.20.2)"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="file"
              name="file"
              label="Jar File"
              type="file"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUploadClose} disabled={disableDialogButtons}>
              Cancel
            </Button>
            <Button type="submit" disabled={disableDialogButtons}>
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        {/* Download Dialog */}
        <Dialog
          open={openDownload}
          onClose={handleDownloadClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setDisableDialogButtons(true);

              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());

              const data: DownloadJarRequest = {
                downloadUrl: formJson.downloadUrl,
                jarKind: formJson.jarKind,
                minecraftVersion: formJson.minecraftVersion,
                fileName: formJson.fileName,
              };

              const id = toast.loading('Downloading jar...');
              POSTDownloadJar(data)
                .then((data) => {
                  toast.update(id, {
                    render: 'Downloaded jar.',
                    type: 'success',
                    isLoading: false,
                    ...defaultToastSettings,
                  });
                })
                .catch((error) => {
                  if (
                    axios.isAxiosError(error) &&
                    error.response &&
                    isError(error.response.data)
                  ) {
                    toast.update(id, {
                      render: getErrorMsg(error.response.data),
                      type: 'error',
                      isLoading: false,
                      ...defaultToastSettings,
                    });
                  } else {
                    toast.update(id, {
                      render: getErrorMsg(Error.UnexpectedError),
                      type: 'error',
                      isLoading: false,
                      ...defaultToastSettings,
                    });
                  }
                })
                .finally(handleDownloadClose);
            },
          }}>
          <DialogTitle>Download a Jar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To download a (custom) jar file, fill out this form. All fields
              ending with a * are required.
            </DialogContentText>

            <Divider sx={{ mt: 1, mb: 1 }} />

            <TextField
              required
              margin="dense"
              id="url"
              name="downloadUrl"
              label="Download Url (example: https://download.getbukkit.org/spigot/spigot-1.20.4.jar)"
              type="text"
              fullWidth
              variant="standard"
            />
            <InputLabel htmlFor="jar-kind">Jar Kind *</InputLabel>
            <Select
              native
              required
              id="kind"
              name="jarKind"
              value={jarKind}
              onChange={handleJarKindChange}
              input={<OutlinedInput label="Jar Kind *" id="jar-kind" />}>
              {Object.values(JarKind).map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <TextField
              required
              margin="dense"
              id="version"
              name="minecraftVersion"
              label="Minecraft Version (example: 1.20.2)"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="filename"
              name="fileName"
              label="File Name (example: server.jar)"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDownloadClose}
              disabled={disableDialogButtons}>
              Cancel
            </Button>
            <Button type="submit" disabled={disableDialogButtons}>
              Download
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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

export default Jars;
