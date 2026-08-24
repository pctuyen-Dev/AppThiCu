// Preload: cầu nối an toàn giữa React và Electron.

const { contextBridge } = require("electron");

// Cung cấp API Electron cho React.
contextBridge.exposeInMainWorld("electronAPI", {
  // Hàm kiểm tra kết nối React ↔ Electron.
  ping: () => "Electron is working",
});