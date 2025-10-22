const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const https = require("https");

const configDir = path.join(app.getPath("userData"), "vpn-configs");
if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// -------------------- VPN IPC --------------------

// Connect VPN
ipcMain.handle("vpn-connect", async (event, filename) => {
  try {
    const configPath = path.join(configDir, filename);
    await fs.promises.chmod(configPath, 0o600);

    // Bring interface down first (ignore errors)
    await new Promise((resolve) => {
      exec(`sudo wg-quick down "${configPath}" || true`, () => resolve());
    });

    // Bring interface up
    return new Promise((resolve, reject) => {
      exec(`sudo wg-quick up "${configPath}"`, (error, stdout, stderr) => {
        if (error) return reject(stderr || error.message);
        resolve(stdout);
      });
    });
  } catch (err) {
    console.error("Error in vpn-connect handler:", err);
    throw err;
  }
});

// Disconnect VPN
ipcMain.handle("vpn-disconnect", async (event, filename) => {
  try {
    const configPath = path.join(configDir, filename);
    if (fs.existsSync(configPath)) await fs.promises.chmod(configPath, 0o600);

    return new Promise((resolve, reject) => {
      exec(
        `sudo wg-quick down "${configPath}" || true`,
        (error, stdout, stderr) => {
          if (error) return reject(stderr || error.message);
          resolve(stdout);
        }
      );
    });
  } catch (err) {
    console.error("Error in vpn-disconnect handler:", err);
    throw err;
  }
});

// Save VPN config
ipcMain.handle("vpn-save-config", async (event, filename, content) => {
  const filePath = path.join(configDir, filename);
  try {
    await fs.promises.writeFile(filePath, content, "utf-8");
    return filePath;
  } catch (err) {
    console.error("Failed to save config:", err);
    throw err;
  }
});

// Get config path
ipcMain.handle("vpn-get-config-path", async (event, filename) => {
  return path.join(configDir, filename);
});

// -------------------- Get VPN interface IP --------------------
ipcMain.handle("vpn-get-interface-ip", async (event, interfaceName) => {
  return new Promise((resolve) => {
    exec(
      `ip -4 addr show ${interfaceName} | grep -oP '(?<=inet\\s)\\d+(\\.\\d+){3}'`,
      (err, stdout) => {
        if (err) return resolve("-");
        resolve(stdout.trim() || "-");
      }
    );
  });
});

// -------------------- Get public IP (server-side, safe) --------------------
ipcMain.handle("vpn-get-public-ip", async () => {
  return new Promise((resolve) => {
    https
      .get("https://api.ipify.org?format=json", (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json.ip || "-");
          } catch {
            resolve("-");
          }
        });
      })
      .on("error", () => resolve("-"));
  });
});

ipcMain.handle("getConnectionStatus", async () => {
  return new Promise((resolve) => {
    exec("ip link show | grep -E 'NeutronVPN'", (error, stdout) => {
      if (error || !stdout.trim()) {
        resolve(false); // No VPN interface found
      } else {
        // Optional: you could parse specific interface info if needed
        resolve(true);
      }
    });
  });
});

ipcMain.handle("vpn-get-speed", async () => {
  try {
    const iface = "NeutronVPN";
    const rxPath = `/sys/class/net/${iface}/statistics/rx_bytes`;
    const txPath = `/sys/class/net/${iface}/statistics/tx_bytes`;

    if (!fs.existsSync(rxPath)) return { upload: 0, download: 0 };

    const rx = parseInt(await fs.promises.readFile(rxPath, "utf-8"));
    const tx = parseInt(await fs.promises.readFile(txPath, "utf-8"));

    return { rx, tx };
  } catch (err) {
    console.error("Error fetching VPN speed:", err);
    return { upload: 0, download: 0 };
  }
});
