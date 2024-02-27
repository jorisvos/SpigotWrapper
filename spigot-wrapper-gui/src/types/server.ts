import { Plugin } from './index';

export interface ServerInfo {
  id: string;
  name: string;
  jarFile: string;
  javaArguments: string;
  enablePlugins: boolean;
  enabledPlugins: Plugin[];
  createdAt: Date;
  isRunning: boolean;
}

export interface Server {
  id: string;
  name: string;
  jarFile: string;
  javaArguments: string;
  enablePlugins: boolean;
  createdAt: Date;
}

export interface AddServerRequest {
  name: string;
  jarFile: string;
  enablePlugins?: boolean;
}
