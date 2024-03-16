import { SpigotWrapperError } from '../types/error';

// eslint-disable-next-line
export const preventDefault = (event: any) => event.preventDefault();

// eslint-disable-next-line
export const isError = (error: any): error is SpigotWrapperError =>
  Object.values(SpigotWrapperError).includes(error);

export const getErrorMsg = (error: SpigotWrapperError): string => {
  switch (error) {
    case SpigotWrapperError.JarAlreadyDownloaded:
      return 'Already downloaded that jar.';
    case SpigotWrapperError.JarFilenameMustBeUnique:
      return 'The filename of the jar you want to upload must be unique.';
    case SpigotWrapperError.JarKindAndVersionMustBeUniqueTogether:
      return 'The jar kind and version together must be unique.';
    case SpigotWrapperError.ServerNameMustBeUnique:
      return 'The name of the server must be unique.';
    case SpigotWrapperError.JarFileDoesNotExist:
      return 'That jar file does not exist.';
    default:
    case SpigotWrapperError.UnexpectedError:
      return 'An unexpected error occured.';
  }
};
