import { API } from './index';
import {
  DownloadJarRequest,
  Error,
  Jar,
  JarKind,
  UploadJarRequest,
} from '../types';
import axios, { AxiosProgressEvent } from 'axios';

export const GETAllJars = async (): Promise<Jar[]> =>
  (await API.get('/jar')).data;

// https://www.bezkoder.com/axios-file-upload/
export const POSTUploadJar = async (
  data: UploadJarRequest,
  onUploadProgress = (event: AxiosProgressEvent) =>
    console.log(Math.round((100 * event.loaded) / (event.total ?? 1))),
): Promise<Jar> => {
  const formData = new FormData();
  formData.append('jarKind', data.jarKind);
  formData.append('minecraftVersion', data.minecraftVersion);
  formData.append('file', data.file);

  const response = await API.post('/jar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const GETJar = async (id: string): Promise<Jar> =>
  (await API.get(`/jar/${id}`)).data;

// TODO: fix return type and data that's actually returned
export const DELETEJar = async (id: string): Promise<string> =>
  (await API.delete(`/jar/${id}`)).statusText;

export const POSTDownloadJar = async (data: DownloadJarRequest): Promise<Jar> =>
  (
    await API.post('/jar/download', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).data;

export const POSTDownloadLatestJar = async (): Promise<Jar | Error> => {
  try {
    return (await API.post('/jar/downloadlatest')).data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      return Error.UnexpectedError;
    }
  }
};
