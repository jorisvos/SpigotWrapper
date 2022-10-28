import { JarKind } from './jarkind';

export interface Jar {
  id: string;
  fileName: string;
  jarKind: JarKind;
  minecraftVersion: string; // TODO: change to enum
  createdAt: Date;
}

export interface UploadJarRequest {
  jarKind: JarKind;
  minecraftVersion: string;
  file: any;
}
