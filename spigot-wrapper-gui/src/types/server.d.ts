export declare global {
  interface ServerInfo {
    id: string;
    name: string;
    jarFile: string;
    javaArguments: string;
    enablePlugins: boolean;
    enabledPlugins: SpigotWrapperPlugin[];
    createdAt: Date;
    isRunning: boolean;
  }

  interface Server {
    id: string;
    name: string;
    jarFile: string;
    javaArguments: string;
    enablePlugins: boolean;
    createdAt: Date;
  }

  interface AddServerRequest {
    name: string;
    jarFile: string;
    enablePlugins?: boolean;
  }
}
