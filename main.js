const { app, BrowserWindow } = require('electron')
const Strapi = require('@strapi/strapi');
const path = require('path');
const fs = require('fs');
const isPackaged = require('electron-is-packaged');
const appPath = `${__dirname}/`;
//const buildPath = `${__dirname}/build`;

const strapi = Strapi({
  appDir: appPath,
  distDir: appPath
})


if (isPackaged) {
  const requiredFolderPaths = {
    database: path.join(appPath, 'database'),
    public: path.join(appPath, 'public'),
    uploads: path.join(appPath, 'public', 'uploads'),
  }

  Object.values(requiredFolderPaths).forEach((folderPath) => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {
        recursive: true
      })

    }
  })
}

process.env.NODE_ENV = isPackaged ? 'production' : 'development';
process.env.BROWSER = 'none';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })
  win.maximize();
  win.webContents.openDevTools();



  strapi.start().then(() => {
    win.loadURL('http://localhost:1337/admin')
    //win.loadFile('index.html')
  }).catch((e) => {
    console.log(e);
  });
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



