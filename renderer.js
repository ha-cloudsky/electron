const { ipcRenderer } = require("electron");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

document.getElementById("upload-button").addEventListener("click", async () => {
  const filePath = await ipcRenderer.invoke("select-file");
  if (!filePath) return alert("No file selected");

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const csvData = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);

  const outputDirectory = path.join(__dirname, "csv_output");
  if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory);

  const outputFilePath = path.join(
    outputDirectory,
    `${path.parse(filePath).name}.csv`
  );
  fs.writeFileSync(outputFilePath, csvData, "utf8");

  alert(`File converted successfully: ${outputFilePath}`);
});

document.getElementById("open-folder-button").addEventListener("click", () => {
  const outputDirectory = path.join(__dirname, "csv_output");
  ipcRenderer.invoke("open-directory", outputDirectory);
});
