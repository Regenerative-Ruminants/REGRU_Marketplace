const errorDisplay = document.getElementById('error-display');

function displayError(message: string, source?: string, lineno?: number, colno?: number, error?: Error) {
  if (errorDisplay) {
    const errorElement = document.createElement('div');
    let errorMessage = `Error: ${message}`;
    if (source) errorMessage += `\nSource: ${source}`;
    if (lineno) errorMessage += `\nLine: ${lineno}, Column: ${colno}`;
    if (error && error.stack) errorMessage += `\nStack: ${error.stack}`;
    else if (error) errorMessage += `\nError Object: ${String(error)}`;
    errorElement.textContent = errorMessage;
    errorElement.style.borderBottom = "1px solid #ffcccc";
    errorElement.style.paddingBottom = "5px";
    errorElement.style.marginBottom = "5px";
    errorDisplay.appendChild(errorElement);
    errorDisplay.style.display = 'block'; // Ensure it's visible
  } else {
    console.error("Error display element not found. Original error:", message, error);
  }
}

window.onerror = function(message, source, lineno, colno, error) {
  displayError(message.toString(), source, lineno, colno, error);
  return true; // Prevents the browser's default error handling
};

window.addEventListener('unhandledrejection', function(event) {
  displayError('Unhandled Promise Rejection:', undefined, undefined, undefined, event.reason);
});

import './index.css';
import './app.ts';
import { invoke } from "@tauri-apps/api/tauri";

try {
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
          displayError('Error fetching wallets (test button)', undefined, undefined, undefined, error as Error);
        }
      });
    } else {
      // Not a critical error if these test elements are not always present.
      // console.warn('Wallet test UI elements not found in the DOM (main.ts).');
    }
  } else {
    // console.info('Not in Tauri environment or IPC not available (main.ts).');
  }

  console.log("Hello from frontend! (main.ts)");

} catch (e: any) {
  displayError("Error in main.ts execution", undefined, undefined, undefined, e);
  console.error("Error in main.ts execution:", e);
} 