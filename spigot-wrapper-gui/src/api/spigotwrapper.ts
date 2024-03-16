import API from './index';

export const GETStatus = async (): Promise<Jar[]> =>
  (await API.get('/status')).data;
