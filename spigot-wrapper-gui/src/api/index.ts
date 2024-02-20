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
import {
  DELETEPlugin,
  GETAllPlugins,
  GETPlugin,
  POSTUploadPlugin,
} from './plugin';
import {
  DELETEServer,
  GETAcceptEULA,
  GETAllServerInfo,
  GETAllServers,
  GETIsServerRunning,
  GETKillAllServers,
  GETKillServer,
  GETMinecraftLog,
  GETServer,
  GETServerInfo,
  GETServerLog,
  GETServerPlugins,
  GETSpigotWrapperLog,
  GETStartServer,
  GETStopAllServers,
  GETStopServer,
  GETWaitForServerStop,
  GETWaitForServersToStop,
  POSTAddServer,
  POSTExecuteCommand,
} from './server';
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
  GETStartServer,
  GETServerInfo,
  GETAllServers,
  GETIsServerRunning,
  GETKillServer,
  GETKillAllServers,
  GETMinecraftLog,
  DELETEServer,
  GETServer,
  GETServerPlugins,
  GETStopAllServers,
  GETServerLog,
  GETStopServer,
  GETWaitForServerStop,
  GETWaitForServersToStop,
  GETAcceptEULA,
  POSTAddServer,
  POSTExecuteCommand,
  GETAllServerInfo,
  GETSpigotWrapperLog,
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
  GETPlugin,
  DELETEPlugin,
  GETAllPlugins,
  POSTUploadPlugin,
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
