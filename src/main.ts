import './index.css';
import './app.ts';

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // setGreetMsg(await invoke("greet", { name: greetInputEl.value }));
  // console.log("wallets:", await invoke("get_available_wallets")); // Commented out initial call
}

// Only call greet if running in Tauri environment and IPC is available
if (typeof (window as any).__TAURI_IPC__ === 'function') {
  greet(); 
}

// --- Wallet Test Controls Logic ---
// This now works independently of the Tauri IPC bridge
const fetchWalletsButton = document.getElementById('fetch-wallets-button');
const walletsResultDisplay = document.getElementById('wallets-result-display');

if (fetchWalletsButton && walletsResultDisplay) {
  fetchWalletsButton.addEventListener('click', async () => {
    walletsResultDisplay.textContent = 'Fetching wallets...';
    try {
      // Phase 2: Replace Tauri invoke with fetch
      const response = await fetch('/api/wallets');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      walletsResultDisplay.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      walletsResultDisplay.textContent = `Error: ${errorMessage}`;
    }
  });
} else {
  console.error('Wallet test UI elements not found in the DOM.');
}

console.log("Hello from frontend!"); 