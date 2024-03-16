export declare global {
  interface CpuUsage {
    name: string;
    value: number;
  }

  interface RamUsage {
    //TODO: change timestamp type from string to Date
    timestamp: string;
    amount: number;
  }

  interface SpigotWrapperSetting {
    key: string;
    value: string;
    createdAt: Date;
  }
}
