import axios from 'axios';
import { GETCpuUsage, GETRamUsage } from './dashboard';
import {
  DELETEJar,
  GETAllJars,
  GETJar,
  POSTDownloadJar,
  POSTDownloadLatestJar,
  POSTUploadJar,
} from './jar';
import { GETAllServerInfo, GETConsoleLog } from './server';

export {
  GETRamUsage,
  GETCpuUsage,
  GETAllServerInfo,
  GETConsoleLog,
  GETAllJars,
  POSTUploadJar,
  GETJar,
  DELETEJar,
  POSTDownloadJar,
  POSTDownloadLatestJar,
};

export const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
});

export default API;
