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

// Drawer logic
const sidebar      = document.getElementById('app-sidebar')!;
const drawer       = document.getElementById('mobile-drawer')!;
const drawerPanel  = document.getElementById('mobile-drawer-panel')!;
const backdrop     = document.getElementById('drawer-backdrop')!;
const hamburgerBtn = document.getElementById('hamburger')!;

if (hamburgerBtn && drawer && drawerPanel && backdrop && sidebar) {
    hamburgerBtn.addEventListener('click', () => {
       // Only clone the content if the drawer is empty
       if (!drawerPanel.innerHTML) {
            const navClone = sidebar.querySelector('#sidebar-nav-container')?.cloneNode(true);
            if (navClone) {
                drawerPanel.appendChild(navClone);
            }
       }
       drawer.classList.remove('-translate-x-full');
    });
    backdrop.addEventListener('click', () => drawer.classList.add('-translate-x-full'));
}

// Bottom‑nav routing
// @ts-ignore
let navigateTo = (id, options) => { console.log(`Navigating to ${id} with options:`, options)};
document.querySelectorAll('.nav-btn').forEach(btn=>{
   btn.addEventListener('click', e=>{
      const id=(e.currentTarget as HTMLElement).dataset.nav!;
      navigateTo(id,{title:''});
   });
});

// @ts-ignore
let shoppingCart = [{quantity: 0}];
// @ts-ignore
let shoppingCartCountTopbar = {textContent: '0'};

// Mobile Header Scroll Animation
const scrollContainer = document.getElementById('app-content-area');
const mobileLogoImg = document.getElementById('mobile-logo-img');
const mobileLogoTagline = document.getElementById('mobile-logo-tagline');

if (scrollContainer && mobileLogoImg && mobileLogoTagline) {
    let isHandoffComplete = false;

    // --- Define Scale States ---
    const SCALE_LARGEST = 1.0; // Initial fluid size
    const SCALE_MEDIUM = 0.6;
    const SCALE_SMALLEST = 0.5;

    // --- Define Animation Ranges ---
    const PHASE1_DISTANCE = 80;
    const PHASE2_DISTANCE = 80;
    
    const handleScroll = () => {
        const scrollY = scrollContainer.scrollTop;

        if (!isHandoffComplete) {
            // PHASE 1: One-way shrink from LARGEST to MEDIUM scale.
            const progress = Math.min(scrollY / PHASE1_DISTANCE, 1);
            const scale = SCALE_LARGEST - (SCALE_LARGEST - SCALE_MEDIUM) * progress;
            
            requestAnimationFrame(() => {
                mobileLogoImg.style.transform = `scale(${scale})`;
                mobileLogoTagline.style.opacity = '1';
            });
            
            if (progress >= 1) {
                isHandoffComplete = true;
            }
        } else {
            // PHASE 2: Reversible shrink from MEDIUM to SMALLEST scale.
            const phase2ScrollY = Math.max(0, scrollY - PHASE1_DISTANCE);
            const progress = Math.min(phase2ScrollY / PHASE2_DISTANCE, 1);

            const scale = SCALE_MEDIUM - (SCALE_MEDIUM - SCALE_SMALLEST) * progress;
            const taglineOpacity = 1 - progress;

            requestAnimationFrame(() => {
                mobileLogoImg.style.transform = `scale(${scale})`;
                mobileLogoTagline.style.opacity = `${taglineOpacity}`;
            });
        }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
} 