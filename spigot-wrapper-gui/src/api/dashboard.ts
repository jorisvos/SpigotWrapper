import { CpuUsage, RamUsage } from "../types";

export const GETRamUsage = (): RamUsage[] => {
  return [
    { timestamp: '00:00', amount: 500 },
    { timestamp: '03:00', amount: 550 },
    { timestamp: '06:00', amount: 589 },
    { timestamp: '09:00', amount: 469 },
  ];
};

export const GETCpuUsage = (): CpuUsage[] => {
  return [
    { name: 'Server (Test)', value: 25 },
    { name: 'Server (McWrapper)', value: 45 },
    { name: 'Server (Survival)', value: 10 },
    { name: 'Server (Hardcore)', value: 20 },
  ];
};