import API from './index';
import { Plugin, UploadPluginRequest } from '../types';
import { AxiosProgressEvent } from 'axios';

export const GETAllPlugins = async (): Promise<Plugin[]> =>
  (await API.get('/plugin')).data;

export const POSTUploadPlugin = async (
  data: UploadPluginRequest,
  onUploadProgress = (event: AxiosProgressEvent) =>
    console.log(Math.round((100 * event.loaded) / (event.total ?? 1))),
): Promise<Plugin | null> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('version', data.version);
  formData.append('file', data.file);

  try {
    const response = await API.post('/plugin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    //TODO: remove following 2 console.logs
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const GETPlugin = async (id: string): Promise<Plugin> =>
  (await API.get(`/plugin/${id}`)).data;

export const DELETEPlugin = async (id: string): Promise<string> =>
  (await API.delete(`/plugin/${id}`)).statusText;
