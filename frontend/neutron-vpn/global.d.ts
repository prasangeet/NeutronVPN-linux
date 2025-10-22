export {};

declare global {
  interface Window {
    vpnAPI: {
      connect: (configPath: string) => Promise<any>;
      disconnect: (configPath: string) => Promise<any>;
      saveConfig: (filename: string, content: string) => Promise<string>;
      getConfigPath: (filename: string) => string;
      getInterfaceIP: (interfaceName: string) => Promise<string>;
      getPublicIP: () => Promise<string>;
      getConnectionStatus: () => Promise<boolean>;
      getSpeed: () => Promise<{ rx: number; tx: number }>;
    };
  }
}
