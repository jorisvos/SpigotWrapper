export interface Plugin {
  id: string;
  name: string;
  version: string;
  fileName: string;
  createdAt: Date;
}

export interface UploadPluginRequest {
  name: string;
  version: string;
  file: File;
}
