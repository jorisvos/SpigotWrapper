import { JarKind } from './jarkind';

export interface Jar {
  id: string;
  fileName: string;
  jarKind: JarKind; // TODO: change to enum
  minecraftVersion: string; // TODO: possibly change to enum
  createdAt: Date;
}

export interface UploadJarRequest {
  jarKind: JarKind;
  minecraftVersion: string;
  file: any;
}
