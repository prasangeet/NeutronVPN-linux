const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("vpnAPI", {
  connect: (filename) => ipcRenderer.invoke("vpn-connect", filename),
  disconnect: (filename) => ipcRenderer.invoke("vpn-disconnect", filename),
  saveConfig: (filename, content) =>
    ipcRenderer.invoke("vpn-save-config", filename, content),
  getConfigPath: (filename) =>
    ipcRenderer.invoke("vpn-get-config-path", filename),
  getInterfaceIP: (interfaceName) =>
    ipcRenderer.invoke("vpn-get-interface-ip", interfaceName),
  getPublicIP: () => ipcRenderer.invoke("vpn-get-public-ip"),
  getConnectionStatus: async () => ipcRenderer.invoke("getConnectionStatus"),
  getSpeed: () => ipcRenderer.invoke("vpn-get-speed"),
});
