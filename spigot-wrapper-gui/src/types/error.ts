export enum Error {
  JarAlreadyDownloaded = 'JarAlreadyDownloaded',
  JarFilenameMustBeUnique = 'JarFilenameMustBeUnique',
  JarKindAndVersionMustBeUniqueTogether = 'JarKindAndVersionMustBeUniqueTogether',
  ServerNameMustBeUnique = 'ServerNameMustBeUnique',
  JarFileDoesNotExist = 'JarFileDoesNotExist',
  UnexpectedError = 'UnexpectedError',
}

// eslint-disable-next-line
export const isError = (error: any): error is Error =>
  Object.values(Error).includes(error);

export const getErrorMsg = (error: Error): string => {
  switch (error) {
    case Error.JarAlreadyDownloaded:
      return 'Already downloaded that jar.';
    case Error.JarFilenameMustBeUnique:
      return 'The filename of the jar you want to upload must be unique.';
    case Error.JarKindAndVersionMustBeUniqueTogether:
      return 'The jar kind and version together must be unique.';
    case Error.ServerNameMustBeUnique:
      return 'The name of the server must be unique.';
    case Error.JarFileDoesNotExist:
      return 'That jar file does not exist.';
    default:
    case Error.UnexpectedError:
      return 'An unexpected error occured.';
  }
};
