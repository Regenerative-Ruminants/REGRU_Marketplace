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
const mobileLogoContainer = document.getElementById('mobile-logo-container');
const mobileLogoImg = document.getElementById('mobile-logo-img');
const mobileLogoTagline = document.getElementById('mobile-logo-tagline');

let isInitialShrinkComplete = false;

// --- Define the 3 states ---
// State 1: LARGEST (on load)
const LARGEST_LOGO_HEIGHT = 64; // h-16
const LARGEST_CONTAINER_HEIGHT = 80; // h-20

// State 2: MEDIUM (new "top")
const MEDIUM_LOGO_HEIGHT = 40; // h-10
const MEDIUM_CONTAINER_HEIGHT = 56; // h-14

// State 3: SMALLEST (sticky)
const SMALLEST_LOGO_HEIGHT = 32; // h-8
const SMALLEST_CONTAINER_HEIGHT = 48; // h-12

// --- Define Animation Ranges ---
const PHASE1_DISTANCE = 80; // Scroll distance for Largest -> Medium
const PHASE2_DISTANCE = 80; // Scroll distance for Medium -> Smallest

function updateHeaderOnScroll() {
    if (!scrollContainer || !mobileHeader || !mobileLogoContainer || !mobileLogoImg || !mobileLogoTagline) return;
    
    const scrollY = scrollContainer.scrollTop;

    if (!isInitialShrinkComplete) {
        // --- PHASE 1: One-way shrink from LARGEST to MEDIUM. Tagline is always visible. ---
        const progress = Math.min(scrollY / PHASE1_DISTANCE, 1);

        const logoHeight = LARGEST_LOGO_HEIGHT - (LARGEST_LOGO_HEIGHT - MEDIUM_LOGO_HEIGHT) * progress;
        const containerHeight = LARGEST_CONTAINER_HEIGHT - (LARGEST_CONTAINER_HEIGHT - MEDIUM_CONTAINER_HEIGHT) * progress;

        requestAnimationFrame(() => {
            mobileLogoContainer.style.height = `${containerHeight}px`;
            mobileLogoImg.style.height = `${logoHeight}px`;
            mobileLogoTagline.style.opacity = '1'; // Ensure tagline is visible
        });

        if (progress >= 1) {
            isInitialShrinkComplete = true; // The handoff
        }
    } else {
        // --- PHASE 2: Reversible shrink from MEDIUM to SMALLEST. Tagline fades out. ---
        const phase2ScrollY = Math.max(0, scrollY - PHASE1_DISTANCE);
        const progress = Math.min(phase2ScrollY / PHASE2_DISTANCE, 1);

        const logoHeight = MEDIUM_LOGO_HEIGHT - (MEDIUM_LOGO_HEIGHT - SMALLEST_LOGO_HEIGHT) * progress;
        const containerHeight = MEDIUM_CONTAINER_HEIGHT - (MEDIUM_CONTAINER_HEIGHT - SMALLEST_CONTAINER_HEIGHT) * progress;
        const taglineOpacity = 1 - progress; // Tagline fades during this phase

        requestAnimationFrame(() => {
            mobileLogoContainer.style.height = `${containerHeight}px`;
            mobileLogoImg.style.height = `${logoHeight}px`;
            mobileLogoTagline.style.opacity = `${taglineOpacity}`;
        });
    }
}

if (scrollContainer) {
    scrollContainer.addEventListener('scroll', updateHeaderOnScroll);
}

// --- Welcome Mat Handoff ---
// This listener runs exactly once on the first scroll, then removes itself.
const logo = document.getElementById('mobile-logo-img');
if (logo) {
    window.addEventListener('scroll', () => {
        logo.classList.remove('welcome-mat');
    }, { once: true });
} 