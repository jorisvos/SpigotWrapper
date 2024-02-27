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
  Button,
  Grid,
  Paper,
  SelectChangeEvent,
  IconButton,
} from '@mui/material';
import { Bounce, ToastContainer, UpdateOptions, toast } from 'react-toastify';
import { Title, Jars as JarsComp, FormDialog } from '../../components';
import {
  GETAllJars,
  POSTDownloadJar,
  POSTDownloadLatestJar,
  POSTUploadJar,
} from '../../api';
import axios from 'axios';
import { Refresh } from '@mui/icons-material';

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

export const Jars = () => {
  const [jars, setJars] = useState<Jar[]>();
  const [disableButtons, setDisableButtons] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [jarKind, setJarKind] = useState('');

  useEffect(() => {
    if (jars == undefined) updateJars();
  });
  //TODO: fix error occuring when backend is not running
  const updateJars = () => GETAllJars().then((data) => setJars(data));

  const handleUploadOpen = () => {
    setDisableButtons(true);
    setOpenUpload(true);
  };
  const handleUploadClose = () => {
    updateJars();
    setOpenUpload(false);
    setDisableButtons(false);
  };
  const handleUploadSubmit = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: { [k: string]: any },
    callback: () => void,
  ) => {
    const data: UploadJarRequest = {
      jarKind: json.jarKind,
      minecraftVersion: json.minecraftVersion,
      file: json.file,
    };

    const id = toast.loading('Uploading file...');
    POSTUploadJar(data, (p) => {
      const progress = p.loaded / (p.total ?? 1);
      toast.update(id, { progress });
    })
      .then(() => toast.success('Uploaded jar.'))
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
  const handleJarKindChange = (event: SelectChangeEvent<typeof jarKind>) => {
    setJarKind(event.target.value);
  };

  const handleDownloadOpen = () => {
    setDisableButtons(true);
    setOpenDownload(true);
  };
  const handleDownloadClose = () => {
    updateJars();
    setOpenDownload(false);
    setDisableButtons(false);
  };
  const handleDownloadSubmit = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: { [k: string]: any },
    callback: () => void,
  ) => {
    const data: DownloadJarRequest = {
      downloadUrl: json.downloadUrl,
      jarKind: json.jarKind,
      minecraftVersion: json.minecraftVersion,
      fileName: json.fileName,
    };

    const id = toast.loading('Downloading jar...');
    POSTDownloadJar(data)
      .then(() => toast.success('Downloaded jar.'))
      .catch((error) => {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          isError(error.response.data)
        ) {
          toast.error(getErrorMsg(error.response.data));
        } else {
          toast.error(getErrorMsg(Error.UnexpectedError));
        }
      })
      .finally(() => {
        toast.dismiss(id);
        callback();
      });
  };

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

      <FormDialog
        open={openUpload}
        handleClose={handleUploadClose}
        handleSubmit={handleUploadSubmit}
        title="Upload a Jar"
        text="To upload a (custom) jar file, fill out this form. All fields ending with a * are required."
        submitText="Upload"
        dialogComponents={[
          {
            type: 'select',
            name: 'jarKind',
            label: 'Jar Kind',
            required: true,
            value: jarKind,
            onValueChanged: handleJarKindChange,
            items: Object.values(JarKind),
          },
          {
            type: 'text',
            name: 'minecraftVersion',
            label: 'Minecraft Version (example: 1.20.4)',
            required: true,
          },
          {
            type: 'file',
            name: 'file',
            label: 'Jar File',
            required: true,
          },
        ]}
      />
      <FormDialog
        open={openDownload}
        handleClose={handleDownloadClose}
        handleSubmit={handleDownloadSubmit}
        title="Download a Jar"
        text="To download a (custom) jar file, fill out this form. All fields ending with a * are required."
        submitText="Download"
        dialogComponents={[
          {
            type: 'text',
            name: 'downloadUrl',
            label:
              'Download Url (example: https://download.getbukkit.org/spigot/spigot-1.20.4.jar)',
            required: true,
          },
          {
            type: 'select',
            name: 'jarKind',
            label: 'Jar Kind',
            required: true,
            value: jarKind,
            onValueChanged: handleJarKindChange,
            items: Object.values(JarKind),
          },
          {
            type: 'text',
            name: 'minecraftVersion',
            label: 'Minecraft Version (example: 1.20.4)',
            required: true,
          },
          {
            type: 'text',
            name: 'fileName',
            label: 'File Name (example: server.jar)',
            required: true,
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

export default Jars;
