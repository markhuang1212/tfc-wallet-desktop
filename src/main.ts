import { Buffer } from 'buffer';
import { app, BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import './app/signal_handlers.ts'
import { EthereumChain } from './core/blockchain';
import { Endpoints } from './core/blockchain/defines';
import { EthAccount } from './core/wallet';

const privKey = '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
const account = new EthAccount(Buffer.from(privKey, 'hex'))
const ethChain = new EthereumChain(Endpoints[60].rinkeby)

ethChain.getBalance(account).then(balance => console.log(balance))

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

start()