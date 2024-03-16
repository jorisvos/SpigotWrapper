export declare global {
  interface Jar {
    id: string;
    fileName: string;
    jarKind: JarKind;
    minecraftVersion: string; // TODO: change to enum
    createdAt: Date;
  }

  interface UploadJarRequest {
    jarKind: JarKind;
    minecraftVersion: string;
    file: File;
  }

  interface DownloadJarRequest {
    downloadUrl: string;
    jarKind: JarKind;
    minecraftVersion: string;
    fileName: string;
  }
}
