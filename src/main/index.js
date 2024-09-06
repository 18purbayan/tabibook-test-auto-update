import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'

// autoUpdater.setFeedURL({
//   provider: 'github',
//   owner: '18purbayan',
//   repo: 'tabibook-test-auto-update',
//   // repo: 'tabibook-desktop-electron-vite-react',
//   // token: import.meta.env.VITE_GITHUB_TOKEN
// })

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon: join(__dirname, 'assets/images/Union.png'),
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // autoUpdater.checkForUpdatesAndNotify();
  })

  // autoUpdater.on('update-available', (info) => {
  //   dialog.showMessageBox({
  //     type: 'info',
  //     title: 'Update available',
  //     message: 'A new update is available. Do you want to download and install it now?',
  //     buttons: ['Yes', 'No']
  //   }).then(result => {
  //     console.log(result.response);
  //     if (result.response === 0) { // If 'Yes' is clicked
  //       autoUpdater.downloadUpdate();
  //     }
  //   });
  // });

  // autoUpdater.on('update-downloaded', (info) => {
  //   dialog.showMessageBox({
  //     type: 'info',
  //     title: 'Update ready',
  //     message: 'The update is ready to install. The app will restart and install the update.',
  //     buttons: ['Restart']
  //   }).then(() => {
  //     autoUpdater.quitAndInstall();
  //   });
  // });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // mainWindow.webContents.on('before-input-event', (event, input) => {
  //   // Disable Ctrl+Shift+I (for Windows/Linux) and Cmd+Opt+I (for Mac)
  //   if ((input.control || input.meta) && input.shift && input.key.toLowerCase() === 'i') {
  //     event.preventDefault();
  //   }
  // })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.tabibookdesktop.algeria')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  autoUpdater.on('update-available', () => {
    console.log('Update available.')

    if (mainWindow) {
      const options = {
        type: 'info',
        buttons: ['Update Now', 'Later'],
        title: 'Update Available',
        message: 'A new version of the app is available. Do you want to update now?'
      }

      dialog.showMessageBox(mainWindow, options).then((result) => {
        if (result.response === 0) {
          // 0 is the index for "Update Now"
          autoUpdater.downloadUpdate()
        }
      })
    }
  })

  autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded.')

    if (mainWindow) {
      const options = {
        type: 'info',
        buttons: ['Restart Now', 'Later'],
        title: 'Update Ready',
        message: 'The update has been downloaded. Restart the app to apply the updates?'
      }

      dialog.showMessageBox(mainWindow, options).then((result) => {
        if (result.response === 0) {
          // 0 is the index for "Restart Now"
          autoUpdater.quitAndInstall()
        }
      })
    }
  })

  autoUpdater.on('error', (err) => {
    console.error('Update error:', err)
    if (mainWindow) {
      dialog.showErrorBox(
        'Update Error',
        'An error occurred while checking for updates. Please try again later.'
      )
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
