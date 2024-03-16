import React, { useEffect, useState } from 'react';
import { Button, Grid, Paper, IconButton } from '@mui/material';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Title, PluginsOverview } from '../../components';
import { GETAllPlugins, POSTUploadPlugin } from '../../api';
import axios from 'axios';
import { Refresh } from '@mui/icons-material';
import { getErrorMsg, isError } from '../../utils';
import { FormDialog } from '../../views';
import { SpigotWrapperError } from '../../types/error';

export const Plugins = () => {
  const [plugins, setPlugins] = useState<SpigotWrapperPlugin[]>();
  const [disableButtons, setDisableButtons] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  useEffect(() => {
    if (plugins == undefined) updatePlugins();
  }, [plugins]);
  //TODO: fix error occuring when backend is not running
  const updatePlugins = () => GETAllPlugins().then((data) => setPlugins(data));

  const handleUploadOpen = () => {
    setDisableButtons(true);
    setOpenUpload(true);
  };
  const handleUploadClose = () => {
    updatePlugins();
    setOpenUpload(false);
    setDisableButtons(false);
  };
  const handleUploadSubmit = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: { [k: string]: any },
    callback: () => void,
  ) => {
    const data: UploadPluginRequest = {
      name: json.name,
      version: json.version,
      file: json.file,
    };

    const id = toast.loading('Uploading plugin...');
    POSTUploadPlugin(data, (p) => {
      const progress = p.loaded / (p.total ?? 1);
      toast.update(id, { progress });
    })
      .then(() => toast.success('Uploaded plugin.'))
      .catch((error) => {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          isError(error.response.data)
        )
          toast.error(getErrorMsg(error.response.data));
        else toast.error(getErrorMsg(SpigotWrapperError.UnexpectedError));
      })
      .finally(() => {
        toast.dismiss(id);
        callback();
      });
  };

  return (
    <Grid container spacing={3}>
      {/* Plugins Actions */}
      <Grid item xs={12}>
        <Button
          disabled={disableButtons}
          sx={{ mr: 1, mb: 1 }}
          variant="outlined"
          onClick={handleUploadOpen}>
          Upload plugin
        </Button>
      </Grid>

      {/* Plugins Table */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Title>
            Plugins{' '}
            <IconButton onClick={updatePlugins}>
              <Refresh />
            </IconButton>
          </Title>
          <PluginsOverview plugins={plugins} updatePlugins={updatePlugins} />
        </Paper>
      </Grid>

      <FormDialog
        open={openUpload}
        handleClose={handleUploadClose}
        handleSubmit={handleUploadSubmit}
        title="Upload a Plugin"
        text="To upload a (custom) plugin, fill out this form. All fields ending with a * are required."
        submitText="Upload"
        dialogComponents={[
          {
            type: 'text',
            name: 'name',
            label: 'Plugin name (example: JavascriptConnector)',
            required: true,
          },
          {
            type: 'text',
            name: 'version',
            label: 'Plugin version (example: 1.0.0)',
            required: true,
          },
          {
            type: 'file',
            name: 'file',
            label: 'Plugin File',
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

export default Plugins;
