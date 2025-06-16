import './index.css';
import './app.ts';
import { invoke } from "@tauri-apps/api/tauri";

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // setGreetMsg(await invoke("greet", { name: greetInputEl.value }));
  console.log("wallets:", await invoke("get_available_wallets"));
  console.log("network:", await invoke("set_network", {
    network: "local"
  }));
  console.log("current wallet:", await invoke("set_wallet", {
    wallet: "0x9827947598745987494982794387"
  }));
  console.log("app state:", await invoke("get_app_state"));
}

// Only call greet if running in Tauri environment and IPC is available
if (typeof window.__TAURI_IPC__ === 'function') {
  greet();
}

console.log("Hello from frontend!"); 