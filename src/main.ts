import { app, BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import express from 'express'
import './app/signal_handlers.ts'

const httpServer = express()
httpServer.use('/', express.static('dist'))
httpServer.listen(6790, 'localhost')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadURL('http://localhost:6790/index.html');
}

async function start() {
  await app.whenReady()
  await installExtension(REACT_DEVELOPER_TOOLS)
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

start()