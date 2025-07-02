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
  console.log("Product:", await invoke("get_product", {
    address: "b318775912059e97d18f420debf937b146f9b0dc107e6b054a9b195cd89d647efe8bbefdccfd7785ec038e39ca88ffb2"
  }));

  console.log("Product image:", await invoke("get_product_image", {
    address: "02c18b8fdff82f4cb405ff43eab4a494a8a4092d7647c1ebfaffdb90cf5c1e98"
  }));

  console.log("All Products:", await invoke("get_all_products"));
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
