import API from './index';
import { SpigotWrapperSetting } from '../types/setting';

export const GETAllSettings = async (): Promise<SpigotWrapperSetting[]> =>
  (await API.get('/spigotwrappersettings')).data;

export const POSTAddSetting = async (
  key: string,
  value: string,
): Promise<SpigotWrapperSetting> =>
  (await API.post('/spigotwrappersettings', { key, value })).data;

export const PUTUpdateSetting = async (
  key: string,
  value: string,
): Promise<SpigotWrapperSetting> =>
  (await API.put('/spigotwrappersettings', { key, value })).data;

export const GETSetting = async (key: string): Promise<SpigotWrapperSetting> =>
  (await API.get(`/spigotwrappersettings/${key}`)).data;

export const DELETESetting = async (
  key: string,
): Promise<SpigotWrapperSetting> =>
  (await API.delete(`/spigotwrappersettings/${key}`)).data;
