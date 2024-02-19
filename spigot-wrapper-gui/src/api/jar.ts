import { API } from './index';
import { Jar, JarKind, UploadJarRequest } from '../types';

export const GETAllJars = async (): Promise<Jar[]> =>
  (await API.get('/jar')).data;

// https://www.bezkoder.com/axios-file-upload/
export const POSTUploadJar = async (
  data: UploadJarRequest,
  onUploadProgress = (event: any) =>
    console.log(Math.round((100 * event.loaded) / event.total)),
): Promise<Jar | null> => {
  const formData = new FormData();
  formData.append('jarKind', data.jarKind);
  formData.append('minecraftVersion', data.minecraftVersion);
  formData.append('file', data.file);

  try {
    const response = await API.post('/jar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const GETJar = async (id: string): Promise<Jar> =>
  (await API.get(`/jar/${id}`)).data;

// TODO: fix return type and data that's actually returned
export const DELETEJar = async (id: string): Promise<string> =>
  (await API.delete(`/jar/${id}`)).statusText;

export const POSTDownloadJar = async (
  downloadUrl: string,
  fileName: string,
  jarKind: JarKind,
  minecraftVersion: string,
): Promise<Jar> =>
  (
    await API.post('/jar/download', {
      downloadUrl,
      fileName,
      jarKind,
      minecraftVersion,
    })
  ).data;

export const POSTDownloadLatestJar = async (): Promise<Jar> =>
  (await API.post('/jar/downloadlatest')).data;