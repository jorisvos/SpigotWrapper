import { ServerInfo } from '../types';
import API from './index';

export const GETAllServerInfo = async (count = -1): Promise<ServerInfo[]> =>
  (await API.get(`/server/info/${count}`)).data;

export const GETConsoleLog = async (): Promise<string> =>
  (await API.get('/server/log')).data;
