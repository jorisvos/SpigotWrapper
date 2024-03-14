import API from './index';
import { Plugin, UploadPluginRequest } from '../types';
import { AxiosProgressEvent } from 'axios';

export const GETAllPlugins = async (): Promise<Plugin[]> =>
  (await API.get('/plugin')).data;

export const POSTUploadPlugin = async (
  data: UploadPluginRequest,
  onUploadProgress = (event: AxiosProgressEvent) =>
    console.log(Math.round((100 * event.loaded) / (event.total ?? 1))),
): Promise<Plugin> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('version', data.version);
  formData.append('file', data.file);

  const response = await API.post('/plugin', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const GETPlugin = async (id: string): Promise<Plugin> =>
  (await API.get(`/plugin/${id}`)).data;

// TODO: fix return type and data that's actually returned (also in case of an error)
export const DELETEPlugin = async (id: string): Promise<string> =>
  (await API.delete(`/plugin/${id}`)).statusText;
