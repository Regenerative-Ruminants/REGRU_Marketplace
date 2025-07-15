import './index.css';
import { initializeApp, sidebarNavConfig, SidebarNavSection } from './app'; // IMPORT THE APP and CONFIG
import { initializeWallet } from './wallet'; // IMPORT THE NEW WALLET MODULE

// Greet function remains the same
async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    // setGreetMsg(await invoke("greet", { name: greetInputEl.value }));
    // console.log("wallets:", await invoke("get_available_wallets"));
}

// Check for Tauri environment
if (typeof (window as any).__TAURI__ === 'function') {
  greet(); 
}

console.log("Hello from main.ts, the application entry point!");

export function initializeHamburgerMenu() {
    // --- Get Elements ---
    const sidebar = document.getElementById('app-sidebar') as HTMLElement;
    const hamburgerBtn = document.getElementById('hamburger') as HTMLElement;
    const menuOverlay = document.getElementById('regru-menu-overlay') as HTMLElement;
    const menuContent = document.getElementById('regru-menu-content') as HTMLElement;
    const closeMenuBtn = document.getElementById('regru-menu-close') as HTMLElement;
    const mainContent = document.getElementById('app-main-content') as HTMLElement;

    if (!hamburgerBtn || !menuOverlay || !menuContent || !closeMenuBtn || !sidebar || !mainContent) {
        setTimeout(initializeHamburgerMenu, 50);
        return;
    }

    let isMenuContentInitialized = false;

    const openMenu = () => {
        mainContent.style.overflowY = 'hidden';

        if (!isMenuContentInitialized) {
            const navClone = sidebar.querySelector('#sidebar-nav-container')?.cloneNode(true) as HTMLElement;
            if (navClone) {
                // Remove active states from the clone
                navClone.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
                
                // Re-attach event listeners based on the config
                navClone.querySelectorAll('[data-view-id]').forEach(clonedItem => {
                    const navId = (clonedItem as HTMLElement).dataset.viewId;
                    const navConfigItem = sidebarNavConfig
                        .flatMap((section: SidebarNavSection) => section.items)
                        .find(item => item.id === navId);

                    if (navConfigItem && navConfigItem.action) {
                        clonedItem.addEventListener('click', (e) => {
                            e.preventDefault();
                            navConfigItem.action!(); // The 'action' function (e.g., openWalletsModal)
                        });
                    }
                });
                
                menuContent.innerHTML = ''; // Clear previous content
                menuContent.appendChild(navClone);
            }
            isMenuContentInitialized = true;
        }
        menuOverlay.classList.remove('hidden');
    };

    const closeMenu = () => {
        mainContent.style.overflowY = 'scroll';
        menuOverlay.classList.add('hidden');
    };

    hamburgerBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
}

// --- App Entry Point ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeApp();
        initializeHamburgerMenu();
    } catch (error) {
        console.error("Fatal error during application initialization:", error);
        // Display a fallback error message in the main content area
        const container = document.getElementById('products-grid-container');
        if (container) {
            container.innerHTML = `<div class="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">Fatal Error!</strong>
                <span class="block sm:inline">Could not load the application. Please try again later.</span>
            </div>`;
        }
    }
});

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
const hamburgerButton = document.getElementById('hamburger') as HTMLElement;
const searchButton = document.getElementById('mobile-search') as HTMLElement;
const hamburgerIcon = document.querySelector('#hamburger i') as HTMLElement;
const searchIcon = document.querySelector('#mobile-search i') as HTMLElement;

// State flags
let hasScrolled = false; // Tracks if the user has scrolled at all
let isInitialShrinkComplete = false; // Tracks if the main welcome-mat shrink is done

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

// --- Icon Size States (in REM for cross-browser consistency) ---
const LARGE_ICON_SIZE = 2;      // 32px / 16px
const MEDIUM_ICON_SIZE = 1.625; // 26px / 16px
const SMALL_ICON_SIZE = 1.375;  // 22px / 16px

const LARGE_ICON_PADDING = 24;  // px, Welcome Mat (readjusted)
const MEDIUM_ICON_PADDING = 18; // px, Medium (readjusted)
const SMALL_ICON_PADDING = 12;  // px, Small

// --- Tagline Size States ---
const LARGE_TAGLINE_SIZE = 36;  // px, for welcome mat (As requested)
const MEDIUM_TAGLINE_SIZE = 16; // px, Medium
const SMALL_TAGLINE_SIZE = 12;  // px, matches tailwind 'text-xs'

// --- Animation Trigger Points ---
let PHASE1_DISTANCE = 120; // Is now calculated dynamically in initHeader
const PHASE2_DISTANCE = 80;  // Scroll distance for Medium -> Small

// --- Core Functions ---

function setHeaderAppearance(containerHeight: number, logoHeight: number, iconSize: number, padding: number, taglineSize: number, taglineOpacity: number) {
    requestAnimationFrame(() => {
        if (!mobileLogoContainer || !mobileLogoImg || !hamburgerIcon || !searchIcon || !hamburgerButton || !searchButton || !mobileLogoTagline) return;
        
        mobileLogoContainer.style.height = `${containerHeight}px`;
        mobileLogoImg.style.height = `${logoHeight}px`;
        
        hamburgerIcon.style.fontSize = `${iconSize}rem`;
        searchIcon.style.fontSize = `${iconSize}rem`;
        
        hamburgerButton.style.padding = `${padding}px`;
        searchButton.style.padding = `${padding}px`;
        
        mobileLogoTagline.style.fontSize = `${taglineSize}px`;
        mobileLogoTagline.style.opacity = `${taglineOpacity}`;
    });
}

function setupButtonPositioning() {
    if (!mobileHeader || !hamburgerButton || !searchButton) return;

    // Set header as the positioning context for the absolute-positioned buttons
    mobileHeader.style.position = 'relative';

    // Style and position the hamburger button
    hamburgerButton.style.position = 'absolute';
    hamburgerButton.style.left = '16px'; // Space from the edge
    hamburgerButton.style.top = '50%';
    hamburgerButton.style.transform = 'translateY(-50%)';
    hamburgerButton.style.borderRadius = '50%';
    hamburgerButton.style.backgroundColor = 'transparent';
    hamburgerButton.style.border = '1px solid transparent';

    // Style and position the search button
    searchButton.style.position = 'absolute';
    searchButton.style.right = '16px'; // Space from the edge
    searchButton.style.top = '50%';
    searchButton.style.transform = 'translateY(-50%)';
    searchButton.style.borderRadius = '50%';
    searchButton.style.backgroundColor = 'transparent';
    searchButton.style.border = '1px solid transparent';

    // Add hover event listeners for both buttons
    [hamburgerButton, searchButton].forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            button.style.borderColor = 'rgba(0, 0, 0, 0.1)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'transparent';
            button.style.borderColor = 'transparent';
            button.style.boxShadow = 'none';
        });
    });
}

function handleScroll() {
    if (!scrollContainer) return;

    if (!hasScrolled) {
        hasScrolled = true;
        window.removeEventListener('resize', initHeader);
        
        // Add CSS transitions now so the initial set doesn't animate, but subsequent scrolls do.
        if (mobileLogoContainer && mobileLogoImg && hamburgerIcon && searchIcon && hamburgerButton && searchButton && mobileLogoTagline) {
            mobileLogoContainer.style.transition = 'height 0.3s linear';
            mobileLogoImg.style.transition = 'height 0.3s linear';
            hamburgerIcon.style.transition = 'font-size 0.3s linear';
            searchIcon.style.transition = 'font-size 0.3s linear';
            mobileLogoTagline.style.transition = 'opacity 0.3s linear, font-size 0.3s linear';

            const buttonTransitions = 'padding 0.3s linear, background-color 0.2s linear, border-color 0.2s linear, box-shadow 0.2s linear';
            hamburgerButton.style.transition = buttonTransitions;
            searchButton.style.transition = buttonTransitions;
        }
    }

    const scrollY = scrollContainer.scrollTop;
    
    if (!isInitialShrinkComplete) {
        // --- PHASE 1: One-way shrink from LARGEST to MEDIUM. ---
        const progress = Math.min(scrollY / PHASE1_DISTANCE, 1);

        const containerHeight = welcomeHeightContainer - (welcomeHeightContainer - MEDIUM_CONTAINER_HEIGHT) * progress;
        const logoHeight = welcomeHeightLogo - (welcomeHeightLogo - MEDIUM_LOGO_HEIGHT) * progress;
        const iconSize = LARGE_ICON_SIZE - (LARGE_ICON_SIZE - MEDIUM_ICON_SIZE) * progress;
        const iconPadding = LARGE_ICON_PADDING - (LARGE_ICON_PADDING - MEDIUM_ICON_PADDING) * progress;
        const taglineSize = LARGE_TAGLINE_SIZE - (LARGE_TAGLINE_SIZE - MEDIUM_TAGLINE_SIZE) * progress;
        
        setHeaderAppearance(containerHeight, logoHeight, iconSize, iconPadding, taglineSize, 1); // Opacity is always 1

        if (progress >= 1) {
            isInitialShrinkComplete = true; // The handoff is complete. Never run this block again.
        }

    } else {
        // --- PHASE 2: Reversible shrink from MEDIUM to SMALLEST. ---
        const phase2ScrollY = Math.max(0, scrollY - PHASE1_DISTANCE);
        const progress = Math.min(phase2ScrollY / PHASE2_DISTANCE, 1);

        const containerHeight = MEDIUM_CONTAINER_HEIGHT - (MEDIUM_CONTAINER_HEIGHT - SMALLEST_CONTAINER_HEIGHT) * progress;
        const logoHeight = MEDIUM_LOGO_HEIGHT - (MEDIUM_LOGO_HEIGHT - SMALLEST_LOGO_HEIGHT) * progress;
        const iconSize = MEDIUM_ICON_SIZE - (MEDIUM_ICON_SIZE - SMALL_ICON_SIZE) * progress;
        const iconPadding = MEDIUM_ICON_PADDING - (MEDIUM_ICON_PADDING - SMALL_ICON_PADDING) * progress;
        const taglineSize = MEDIUM_TAGLINE_SIZE - (MEDIUM_TAGLINE_SIZE - SMALL_TAGLINE_SIZE) * progress;
        const taglineOpacity = 1 - progress; // Fade out during phase 2

        setHeaderAppearance(containerHeight, logoHeight, iconSize, iconPadding, taglineSize, taglineOpacity);
    }
}


function initHeader() {
    if (!scrollContainer) {
        console.warn("Scroll container not found. Cannot init header animation.");
        return;
    }

    if (!hasScrolled) {
        const screenHeight = window.innerHeight;
        welcomeHeightContainer = screenHeight * 0.4;
        welcomeHeightLogo = welcomeHeightContainer * 0.5;
        PHASE1_DISTANCE = welcomeHeightContainer - MEDIUM_CONTAINER_HEIGHT; // Dynamic distance

        setHeaderAppearance(welcomeHeightContainer, welcomeHeightLogo, LARGE_ICON_SIZE, LARGE_ICON_PADDING, LARGE_TAGLINE_SIZE, 1);
    }
}


// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
    if (scrollContainer) {
        initHeader();
        scrollContainer.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', initHeader);
    }
    setupButtonPositioning();
});