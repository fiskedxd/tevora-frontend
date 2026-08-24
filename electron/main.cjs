const { app, BrowserWindow, Notification, dialog, ipcMain, Menu, session } = require('electron');
const path = require('node:path');
const { fork } = require('node:child_process');
const { autoUpdater } = require('electron-updater');
const { detectApplications } = require('./detector.cjs');

const PORT = process.env.PORT || 5000;
let backendProcess;

function setupAutoUpdates() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.logger = null;
  autoUpdater.on('error', (error) => console.warn('Tavora update check failed:', error.message));
  autoUpdater.checkForUpdates().catch((error) => console.warn('Tavora update check failed:', error.message));
}

function startBackend() {
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'server.js')
    : path.join(__dirname, '..', 'backend', 'server.js');
  backendProcess = fork(backendPath, [], {
    env: { ...process.env, PORT: String(PORT), TEVORA_DESKTOP: '1', TEVORA_DATA_DIR: path.join(app.getPath('userData'), 'data') },
    silent: true,
  });
  backendProcess.stdout?.on('data', (data) => console.log(`[backend] ${data}`));
  backendProcess.stderr?.on('data', (data) => console.error(`[backend] ${data}`));
  backendProcess.on('error', (error) => console.error('Backend startup failed:', error));
  backendProcess.on('exit', (code) => {
    if (code && !app.isQuitting) dialog.showErrorBox('Tevora', `Le service local Tevora s’est arrêté (code ${code}).`);
  });
}

async function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    title: 'Tavora',
    frame: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'frontend', 'public', 'favicon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false },
  });
  window.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.control && input.shift && input.key.toLowerCase() === 'i') {
      event.preventDefault();
      window.webContents.toggleDevTools();
    }
  });
  const isDevelopment = process.argv.includes('--dev');
  const pageStartedAt = Date.now();
  if (isDevelopment) {
    await window.loadURL('http://localhost:5173');
  } else {
    await window.loadFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  }
  console.log(`[window] page loaded in ${Date.now() - pageStartedAt}ms (${isDevelopment ? 'dev server' : 'production build'})`);
  return window;
}

app.whenReady().then(async () => {
  app.setAppUserModelId('com.tavora.desktop');
  Menu.setApplicationMenu(null);
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(['media', 'microphone', 'camera', 'notifications'].includes(permission));
  });
  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => ['media', 'microphone', 'camera', 'notifications'].includes(permission));
  ipcMain.handle('activity:detect', () => detectApplications());
  ipcMain.handle('window:minimize', (event) => BrowserWindow.fromWebContents(event.sender)?.minimize());
  ipcMain.handle('window:toggle-maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return false;
    if (window.isMaximized()) window.unmaximize(); else window.maximize();
    return window.isMaximized();
  });
  ipcMain.handle('window:close', (event) => BrowserWindow.fromWebContents(event.sender)?.close());
  ipcMain.on('notification:show', (event, payload = {}) => {
    if (!Notification.isSupported()) return;
    const notification = new Notification({
      title: String(payload.title || 'Nouveau message privé'),
      body: String(payload.body || ''),
      icon: typeof payload.icon === 'string' && payload.icon.startsWith('data:image/') ? payload.icon : path.join(__dirname, '..', 'frontend', 'public', 'favicon.png'),
      silent: false,
    });
    notification.on('click', () => {
      const window = BrowserWindow.fromWebContents(event.sender);
      if (!window) return;
      if (window.isMinimized()) window.restore();
      window.show();
      window.focus();
      window.webContents.send('notification:open-private', { userId: String(payload.userId || '') });
    });
    notification.show();
  });
  if (!app.isPackaged || process.env.TEVORA_USE_LOCAL_BACKEND === '1') startBackend();
  setupAutoUpdates();
  try {
    await createWindow();
  } catch (error) {
    dialog.showErrorBox('Tevora', `Impossible de démarrer Tevora.\n\n${error.message}`);
    app.quit();
  }
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});

app.on('before-quit', () => {
  app.isQuitting = true;
  backendProcess?.kill();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
