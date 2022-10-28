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
import {
  DELETESetting,
  GETAllSettings,
  GETSetting,
  POSTAddSetting,
  PUTUpdateSetting,
} from './setting';
import { GETStatus } from './spigotwrapper';

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
  GETStatus,
  GETAllSettings,
  POSTAddSetting,
  PUTUpdateSetting,
  GETSetting,
  DELETESetting,
};

function getBaseURL() {
  if (process.env.REACT_APP_BACKEND_BASE_URL) {
    return process.env.REACT_APP_BACKEND_BASE_URL;
  } else {
    throw new Error('REACT_APP_BACKEND_BASE_URL not set');
  }
}

export const API = axios.create({
  baseURL: getBaseURL(),
});

export default API;
