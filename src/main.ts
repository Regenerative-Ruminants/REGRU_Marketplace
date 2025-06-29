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
    const animationScrollDistance = 80; // The distance over which the animation occurs (in pixels)

    scrollContainer.addEventListener('scroll', () => {
        const scrollY = scrollContainer.scrollTop;
        const progress = Math.min(scrollY / animationScrollDistance, 1); // Progress from 0.0 to 1.0

        // Interpolate values based on progress
        const headerPadding = 8 - (4 * progress); // From 8px (0.5rem) down to 4px (0.25rem)
        const logoHeight = 40 - (8 * progress); // From 40px (2.5rem) down to 32px (2.0rem)
        const taglineOpacity = 1 - progress;

        // Apply styles directly
        requestAnimationFrame(() => {
            mobileHeader.style.paddingTop = `${headerPadding}px`;
            mobileHeader.style.paddingBottom = `${headerPadding}px`;
            mobileLogoImg.style.height = `${logoHeight}px`;
            mobileLogoTagline.style.opacity = `${taglineOpacity}`;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Other initializations...
    
    // Mobile Header Scroll Animation
    const mainContent = document.getElementById('app-main-content');
    const mobileHeader = document.getElementById('mobile-top-bar');
    const mobileLogoImg = document.getElementById('mobile-logo-img');
    const mobileLogoTagline = document.getElementById('mobile-logo-tagline');

    if (mainContent && mobileHeader && mobileLogoImg && mobileLogoTagline) {
        mainContent.addEventListener('scroll', () => {
            if (mainContent.scrollTop > 10) { // Add class after scrolling a small amount
                mobileHeader.classList.add('scrolled');
            } else {
                mobileHeader.classList.remove('scrolled');
            }
        });
    }
}); 