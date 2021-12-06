const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const ElectronVtube = require('./electron-vtube');
const ElectronProfiles = require('./electron-profiles');
const ElectronTwitch = require('./electron-twitch');

let win;
const electronVtube = new ElectronVtube();
const electronProfiles = new ElectronProfiles();
const electronTwitch = new ElectronTwitch(); 

ipcMain.handle('profiles-create', electronProfiles.createTable);
ipcMain.handle('profiles-update', electronProfiles.updateTable);
ipcMain.handle('profiles-get', electronProfiles.getTable);
ipcMain.handle('profiles-exists', electronProfiles.checkProfileTable);
ipcMain.handle('profiles-delete', electronProfiles.deleteFromTable);

ipcMain.handle('vtube-status', electronVtube.getVtubeTable);
ipcMain.handle('vtube-status-update', electronVtube.updateVtube);
ipcMain.on('vtube-auth', electronVtube.authVtube);
ipcMain.on('vtube-connect', electronVtube.connectVtube);
ipcMain.on('vtube-list', electronVtube.getAllModels);
ipcMain.on('vtube-hotkeys', electronVtube.getModelHotkeys);
// ipcMain.on('vtube-select', switchModel);

ipcMain.handle('twitch-auth-request', electronTwitch.authTwitch);
ipcMain.handle('twitch-auth-cancel', electronTwitch.cancelAuthTwitch);
ipcMain.handle('twitch-list-rewards', electronTwitch.getRewards);

ipcMain.handle('twitch-create-reward', electronTwitch.createReward);
ipcMain.handle('twitch-update-reward', electronTwitch.updateReward);

function createWindow() {
  win = new BrowserWindow({
    wnameth: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(createWindow).then(() => electronProfiles.startServer(win));

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('will-quit', async () => {
  const currentData = await electronVtube.getVtubeTable();
  await electronVtube.updateVtube({}, { ...currentData, connected: false });
  electronVtube.close();
  electronProfiles.close();
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});