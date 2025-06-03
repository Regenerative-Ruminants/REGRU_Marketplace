import './index.css';
import './app.ts';
import { invoke } from "@tauri-apps/api/tauri";

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // setGreetMsg(await invoke("greet", { name: greetInputEl.value }));
  console.log(await invoke("greet", { name: "World" }));
}

greet();

console.log("Hello from frontend!"); 