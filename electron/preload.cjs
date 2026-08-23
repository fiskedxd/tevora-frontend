const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tevoraDesktop', {
  isDesktop: true,
  detectApplications: () => ipcRenderer.invoke('activity:detect'),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  toggleMaximize: () => ipcRenderer.invoke('window:toggle-maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  onBackendError: (listener) => {
    const handler = (_event, message) => listener(message);
    ipcRenderer.on('backend:error', handler);
    return () => ipcRenderer.removeListener('backend:error', handler);
  },
});
