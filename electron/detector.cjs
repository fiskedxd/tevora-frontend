const { execFile } = require('node:child_process');

const integrations = [
  { ids: ['FortniteClient-Win64-Shipping.exe'], id: 'fortnite', name: 'Fortnite', type: 'game' },
  { ids: ['Minecraft.exe', 'javaw.exe'], id: 'minecraft', name: 'Minecraft', type: 'game' },
  { ids: ['RobloxPlayerBeta.exe'], id: 'roblox', name: 'Roblox', type: 'game' },
  { ids: ['Code.exe'], id: 'vscode', name: 'Visual Studio Code', type: 'editor' },
  { ids: ['chrome.exe'], id: 'chrome', name: 'Google Chrome', type: 'browser' },
  { ids: ['Spotify.exe'], id: 'spotify', name: 'Spotify', type: 'music' },
  { ids: ['steam.exe'], id: 'steam', name: 'Steam', type: 'application' },
];

const priority = { game: 3, editor: 2, music: 2, browser: 1, application: 1 };

function detectApplications() {
  return new Promise((resolve) => {
    execFile('tasklist', ['/fo', 'csv', '/nh'], { windowsHide: true }, (error, stdout) => {
      if (error) return resolve([]);
      const names = new Set(String(stdout).split(/\r?\n/).map((line) => line.match(/^"([^"]+)"/)?.[1]).filter(Boolean).map((name) => name.toLowerCase()));
      resolve(integrations.filter((item) => item.ids.some((id) => names.has(id.toLowerCase()))).sort((left, right) => priority[right.type] - priority[left.type]));
    });
  });
}

module.exports = { detectApplications };
