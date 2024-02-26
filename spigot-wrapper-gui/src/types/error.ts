export enum Error {
  JarAlreadyDownloaded = 'JarAlreadyDownloaded',
  UnexpectedError = 'UnexpectedError',
}

export const isError = (error: any): error is Error =>
  Object.values(Error).includes(error);
