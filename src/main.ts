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

// State flags
let hasScrolled = false; // Tracks if the user has scrolled at all
let isSticky = false;    // Tracks if the header is in the final "sticky" state

// --- Define Pixel-Based States ---
// State 1: Welcome Mat (calculated dynamically)
let welcomeHeightContainer: number; 
let welcomeHeightLogo: number; 

// State 2: Medium (after initial scroll)
const MEDIUM_CONTAINER_HEIGHT = 80; // Corresponds to Tailwind's h-20
const MEDIUM_LOGO_HEIGHT = 64;      // Corresponds to Tailwind's h-16

// State 3: Smallest (sticky state)
const SMALLEST_CONTAINER_HEIGHT = 56; // Corresponds to Tailwind's h-14
const SMALLEST_LOGO_HEIGHT = 40;      // Corresponds to Tailwind's h-10

// --- Animation Trigger Points ---
const SHRINK_FINISH_SCROLL_Y = 150; // Scroll distance at which the header is fully shrunk

// --- Core Functions ---

function setHeaderHeight(containerHeight: number, logoHeight: number) {
    requestAnimationFrame(() => {
        if (!mobileLogoContainer || !mobileLogoImg) return;
        mobileLogoContainer.style.height = `${containerHeight}px`;
        mobileLogoImg.style.height = `${logoHeight}px`;
    });
}

function handleScroll() {
    if (!scrollContainer || !mobileLogoTagline) return;

    if (!hasScrolled) {
        // This is the first scroll event.
        hasScrolled = true;
        // The one-time handoff: disable the resize listener.
        window.removeEventListener('resize', initHeader);
        
        // Add CSS transitions now so the initial set doesn't animate, but subsequent scrolls do.
        if (mobileLogoContainer && mobileLogoImg) {
            mobileLogoContainer.style.transition = 'height 0.3s ease-in-out';
            mobileLogoImg.style.transition = 'height 0.3s ease-in-out';
        }
    }

    const scrollY = scrollContainer.scrollTop;
    
    // Calculate the shrink progress (0 to 1)
    const progress = Math.min(scrollY / SHRINK_FINISH_SCROLL_Y, 1);
    
    // Interpolate between Medium and Smallest states
    const containerHeight = MEDIUM_CONTAINER_HEIGHT - (MEDIUM_CONTAINER_HEIGHT - SMALLEST_CONTAINER_HEIGHT) * progress;
    const logoHeight = MEDIUM_LOGO_HEIGHT - (MEDIUM_LOGO_HEIGHT - SMALLEST_LOGO_HEIGHT) * progress;
    const taglineOpacity = 1 - progress; // Fade out tagline as we shrink
    
    setHeaderHeight(containerHeight, logoHeight);
    mobileLogoTagline.style.opacity = `${taglineOpacity}`;
}

function initHeader() {
    // Calculate the initial "Welcome Mat" size in pixels
    // Use 50% of the viewport height as the container, and 40% for the logo
    welcomeHeightContainer = window.innerHeight * 0.5;
    welcomeHeightLogo = window.innerHeight * 0.4;
    
    // Set the initial state without transitions
    setHeaderHeight(welcomeHeightContainer, welcomeHeightLogo);

    // Ensure tagline is fully visible initially
    if (mobileLogoTagline) {
        mobileLogoTagline.style.opacity = '1';
    }
}


// --- Event Listeners ---
if (scrollContainer && mobileHeader && mobileLogoContainer && mobileLogoImg && mobileLogoTagline) {
    // 1. Set the initial state on load
    document.addEventListener('DOMContentLoaded', initHeader);

    // 2. Add a resize listener to handle orientation changes BEFORE the first scroll
    window.addEventListener('resize', initHeader);
    
    // 3. Add the main scroll listener
    scrollContainer.addEventListener('scroll', handleScroll);
} 