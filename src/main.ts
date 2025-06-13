import './index.css';
import './app.ts';
import { invoke } from "@tauri-apps/api/tauri";

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // setGreetMsg(await invoke("greet", { name: greetInputEl.value }));
  // console.log("wallets:", await invoke("get_available_wallets")); // Commented out initial call
}

// Only call greet if running in Tauri environment and IPC is available
if (typeof window.__TAURI_IPC__ === 'function') {
  greet(); // greet still runs, but won't call get_available_wallets automatically

  // --- Wallet Test Controls Logic ---
  const fetchWalletsButton = document.getElementById('fetch-wallets-button');
  const walletsResultDisplay = document.getElementById('wallets-result-display');

  if (fetchWalletsButton && walletsResultDisplay) {
    fetchWalletsButton.addEventListener('click', async () => {
      walletsResultDisplay.textContent = 'Fetching wallets...';
      try {
        const result = await invoke("get_available_wallets");
        walletsResultDisplay.textContent = JSON.stringify(result, null, 2);
      } catch (error) {
        walletsResultDisplay.textContent = `Error: ${JSON.stringify(error, null, 2)}`;
      }
    });
  } else {
    console.error('Wallet test UI elements not found in the DOM.');
  }
}

console.log("Hello from frontend!"); 