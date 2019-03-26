// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  dialog
} = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const ipc = require("electron").ipcMain;
const ipcr = require("electron").ipcRenderer;
const _dialog = dialog;
ipc.on("open-directory-dialog", function (event) {
  _dialog.showOpenDialog({
      properties: ["openDirectory"]
    },
    function (files) {
      if (files) {
        console.log("====================================");
        console.log(files[0]);
        console.log("====================================");
        event.sender.send("selectedItem", files);
      }
    }
  );
});

// win.setProgressBar(0.5);
ipc.on("task-progress", function (event, cout) {
  mainWindow.setProgressBar(cout);
});

/**
 * 生成线程
 */
const util = require("util");
const exec = require("child_process").exec
// const exec = util.promisify(require("child_process").exec);
let childPid;

async function createWindow() {

  // 运行aria2的cmd命令
  childPid = exec(".\\aria2\\aria2c --enable-rpc --rpc-listen-all=true --rpc-allow-origin-all")

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 960,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // mainWindow.webContents.openDevTools();
  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.