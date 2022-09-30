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
