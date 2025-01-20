const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { parse } = require("path");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"), // Preload script
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("index.html");
});

ipcMain.handle("select-file", async () => {
  const result = await dialog.showOpenDialog({
    filters: [{ name: "Excel Files", extensions: ["xls", "xlsx"] }],
    properties: ["openFile"],
  });
  return result.filePaths[0];
});

ipcMain.handle("open-directory", (event, directoryPath) => {
  require("child_process").exec(`start "" "${directoryPath}"`);
});
