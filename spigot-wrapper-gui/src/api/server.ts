import { AddServerRequest, Server, ServerInfo } from '../types';
import API from './index';

//region Server operations (per server)
export const GETStartServer = async (id: string): Promise<boolean> =>
  (await API.get(`/server/${id}/start`)).data;

export const GETStopServer = async (id: string): Promise<boolean> =>
  (await API.get(`/server/${id}/stop`)).data;

export const GETKillServer = async (id: string): Promise<boolean> =>
  (await API.get(`/server/${id}/kill`)).data;

export const GETAcceptEULA = async (id: string): Promise<boolean> =>
  (await API.get(`/server/${id}/accepteula`)).data;

export const GETServerInfo = async (id: string): Promise<ServerInfo> =>
  (await API.get(`/server/${id}/info`)).data;

export const POSTExecuteCommand = async (
  id: string,
  command: string,
): Promise<boolean> =>
  (await API.post(`/server/${id}/command`, { params: { command: command } }))
    .data;

export const GETServerLog = async (id: string): Promise<string> =>
  (await API.get(`/server/${id}/log`)).data;

export const GETMinecraftLog = async (id: string): Promise<string> =>
  (await API.get(`/server/${id}/minecraftlog`)).data;

export const GETIsServerRunning = async (id: string): Promise<boolean> =>
  (await API.get(`/server/${id}/running`)).data;

export const GETWaitForServerStop = async (id: string): Promise<string> =>
  (await API.get(`/server/${id}/wait`)).statusText;

export const GETServerPlugins = async (id: string): Promise<string[]> =>
  (await API.get(`/server/${id}/info`)).data;
//endregion

//region Server operations (all and/or SpigotWrapper)
export const GETStopAllServers = async (): Promise<string> =>
  (await API.get('/server/stopall')).statusText;

export const GETKillAllServers = async (): Promise<string> =>
  (await API.get('/server/killall')).statusText;

export const GETWaitForServersToStop = async (): Promise<string> =>
  (await API.get('/server/wait')).statusText;

export const GETSpigotWrapperLog = async (): Promise<string> =>
  (await API.get('/server/log')).data;

export const GETAllServerInfo = async (count = -1): Promise<ServerInfo[]> =>
  (await API.get(`/server/info/${count}`)).data;
//endregion

//region Database operations
export const GETAllServers = async (): Promise<Server[]> =>
  (await API.get('/server')).data;

export const POSTAddServer = async (
  data: AddServerRequest,
): Promise<Server> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('jarFile', data.jarFile);
  //TODO: add enablePlugin to formData

  return (
    await API.post('/server', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  ).data;
};

export const GETServer = async (
  id: string,
  enrichEnabledPlugins = true,
): Promise<Server> =>
  (
    await API.get(`/server/${id}`, {
      params: { enrichEnabledPlugins: enrichEnabledPlugins },
    })
  ).data;

// TODO: fix return type and data that's actually returned
export const DELETEServer = async (id: string): Promise<string> =>
  (await API.delete(`/server/${id}`)).statusText;
//endregion
