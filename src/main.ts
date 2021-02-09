import { app, BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { RedisServerShared } from './app/RedisShared';
import './app/signal_handlers.ts'

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (process.env.APP_ENV === 'development') {
    win.loadURL('http://localhost:6790/index.html');
  } else {
    win.loadFile('./dist/index.html')
  }
}

async function start() {
  await app.whenReady()
  if (process.env.APP_ENV === 'development') {
    await installExtension(REACT_DEVELOPER_TOOLS)
  }
  createWindow()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  RedisServerShared.process.kill()
})

start()