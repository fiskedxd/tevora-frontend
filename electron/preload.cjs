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
  showPrivateNotification: (payload) => ipcRenderer.send('notification:show', payload),
  onOpenPrivateNotification: (listener) => {
    const handler = (_event, payload) => listener(payload);
    ipcRenderer.on('notification:open-private', handler);
    return () => ipcRenderer.removeListener('notification:open-private', handler);
  },
});
