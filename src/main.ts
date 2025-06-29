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
const mobileHeader = document.getElementById('mobile-top-bar');
const mobileLogoImg = document.getElementById('mobile-logo-img');
const mobileLogoTagline = document.getElementById('mobile-logo-tagline');

if (scrollContainer && mobileHeader && mobileLogoImg && mobileLogoTagline) {
    let isHandoffComplete = false;
    let initialFluidHeight = 0;

    // State definitions
    const MEDIUM_LOGO_HEIGHT = 40;
    const SMALLEST_LOGO_HEIGHT = 32;
    const ANIMATION_DISTANCE_PHASE1 = 80;
    const ANIMATION_DISTANCE_PHASE2 = 80;

    const setInitialState = () => {
        // Measure the true rendered height of the fluid logo
        initialFluidHeight = mobileLogoImg.offsetHeight;
        // Ensure the initial state is set correctly
        mobileLogoImg.style.height = `${initialFluidHeight}px`;
        mobileLogoTagline.style.opacity = '1';
    };
    
    const handleScroll = () => {
        const scrollY = scrollContainer.scrollTop;

        if (!isHandoffComplete) {
            // PHASE 1: Animate from fluid welcome mat to a fixed medium size
            const progress = Math.min(scrollY / ANIMATION_DISTANCE_PHASE1, 1);
            const currentHeight = initialFluidHeight - (initialFluidHeight - MEDIUM_LOGO_HEIGHT) * progress;
            
            mobileLogoImg.style.height = `${currentHeight}px`;
            
            if (progress >= 1) {
                isHandoffComplete = true;
            }
        } else {
            // PHASE 2: Animate between medium and smallest size
            const phase2ScrollY = Math.max(0, scrollY - ANIMATION_DISTANCE_PHASE1);
            const progress = Math.min(phase2ScrollY / ANIMATION_DISTANCE_PHASE2, 1);

            const currentHeight = MEDIUM_LOGO_HEIGHT - (MEDIUM_LOGO_HEIGHT - SMALLEST_LOGO_HEIGHT) * progress;
            const taglineOpacity = 1 - progress;

            mobileLogoImg.style.height = `${currentHeight}px`;
            mobileLogoTagline.style.opacity = `${taglineOpacity}`;
        }
    };

    // Set the initial state once the layout is stable, then attach scroll listener
    window.addEventListener('load', () => {
        setInitialState();
        scrollContainer.addEventListener('scroll', handleScroll);
    });
} 