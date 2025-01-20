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
  const platform = os.platform(); // Lấy hệ điều hành hiện tại (e.g., 'win32', 'darwin', 'linux')

  let command;

  if (platform === "win32") {
    command = `start "" "${directoryPath}"`; // Windows
  } else if (platform === "darwin") {
    command = `open "${directoryPath}"`; // macOS
  } else if (platform === "linux") {
    command = `xdg-open "${directoryPath}"`; // Linux
  } else {
    throw new Error("Unsupported platform");
  }

  exec(command, (error) => {
    if (error) {
      console.error(`Error opening directory: ${error.message}`);
      throw error;
    }
  });
});
