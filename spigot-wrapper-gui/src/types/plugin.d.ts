export declare global {
  interface SpigotWrapperPlugin {
    id: string;
    name: string;
    version: string;
    fileName: string;
    createdAt: Date;
  }

  interface UploadPluginRequest {
    name: string;
    version: string;
    file: File;
  }
}
