import API from './index';
import { Jar } from '../types';

export const GETStatus = async (): Promise<Jar[]> =>
  (await API.get('/status')).data;
