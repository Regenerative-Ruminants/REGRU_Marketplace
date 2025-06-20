import { invoke } from "@tauri-apps/api/tauri";

// --- Utility to display errors in the HTML ---
function displayAppError(message: string, error?: any) {
    const errorDisplayDiv = document.getElementById('error-display');
    if (errorDisplayDiv) {
        const errorElement = document.createElement('div');
        let fullMessage = `App.ts Error: ${message}`;
        if (error) {
            if (error.stack) {
                fullMessage += `\nStack: ${error.stack}`;
            } else {
                fullMessage += `\nDetails: ${String(error)}`;
            }
        }
        errorElement.textContent = fullMessage;
        errorElement.style.borderBottom = "1px solid #ff9999";
        errorElement.style.padding = "5px";
        errorElement.style.marginBottom = "5px";
        errorDisplayDiv.appendChild(errorElement);
        errorDisplayDiv.style.display = 'block';
    } else {
        console.error("App.ts Error (error-display div not found):", message, error);
    }
}

try {
    // --- Type Definitions ---
    interface Product {
        id: string;
        name: string;
        seller: string;
        provenance: string;
        category: string;
        animal: string;
        price: number;
        image: string;
        rating: number;
        reviewCount: number;
        tags: string[];
    }

    interface ShoppingCartItem {
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }

    // Obsolete interfaces, kept for reference if platformData/contentData are partially used later, but their usage context is gone.
    // interface SecondPanelItem { id: string; label: string; iconClass?: string; }
    // interface SecondPanelGroup { groupLabel?: string; items: SecondPanelItem[]; }
    // interface PlatformItem { label: string; iconClass: string; searchPlaceholder?: string; secondPanelContent?: SecondPanelGroup[]; isBottomIcon?: boolean; }
    // interface PlatformData { [key: string]: PlatformItem; }
    // interface ContentEntry { title: string; htmlFactory?: () => string; html?: string; }
    // interface ContentData { [key: string]: ContentEntry; }
    // interface InfoPanelData { [key: string]: string; }

    // --- Sample Product Data ---
    const sampleProducts: Product[] = [
        // Beef Products
        { id: 'prod001', name: 'Organic Beef Sirloin Steak', seller: 'Green Pastures Farm', provenance: 'Somerset Fields', category: 'Meat', animal: 'Cattle', price: 12.50, image: 'https://placehold.co/300x200/A0522D/FFFFFF?text=Beef+Steak', rating: 4, reviewCount: 120, tags: ['organic', 'beef', 'steak', 'grass-fed', 'premium'] },
        { id: 'prod002', name: 'Lean Beef Mince (5% Fat)', seller: 'Highland Butchers', provenance: 'Scottish Highlands', category: 'Meat', animal: 'Cattle', price: 7.80, image: 'https://placehold.co/300x200/8B4513/FFFFFF?text=Beef+Mince', rating: 5, reviewCount: 210, tags: ['lean', 'beef', 'mince', 'low-fat'] },
        { id: 'prod003', name: 'Aged Ribeye Roast', seller: 'The Country Butcher', provenance: 'Cotswold Farms', category: 'Meat', animal: 'Cattle', price: 25.00, image: 'https://placehold.co/300x200/D2691E/FFFFFF?text=Ribeye+Roast', rating: 4, reviewCount: 88, tags: ['aged', 'beef', 'roast', 'ribeye'] },

        // Lamb Products
        { id: 'prod004', name: 'Welsh Lamb Leg Steaks', seller: 'Valley Shepherds', provenance: 'Snowdonia Valley', category: 'Meat', animal: 'Sheep', price: 9.99, image: 'https://placehold.co/300x200/CD853F/FFFFFF?text=Lamb+Steaks', rating: 5, reviewCount: 150, tags: ['welsh-lamb', 'lamb', 'steak', 'free-range'] },
        { id: 'prod005', name: 'Minted Lamb Burgers (4 pack)', seller: 'Herdsman Choice', provenance: 'Yorkshire Dales', category: 'Meat', animal: 'Sheep', price: 6.50, image: 'https://placehold.co/300x200/BC8F8F/FFFFFF?text=Lamb+Burgers', rating: 4, reviewCount: 95, tags: ['lamb', 'burgers', 'minted', 'bbq'] },

        // Dairy Products (Cattle)
        { id: 'prod006', name: 'Organic Whole Milk (2L)', seller: 'Dairy Dell Creamery', provenance: 'Cheshire Plains', category: 'Dairy', animal: 'Cattle', price: 2.20, image: 'https://placehold.co/300x200/FFF8DC/333333?text=Whole+Milk', rating: 5, reviewCount: 300, tags: ['organic', 'milk', 'dairy', 'whole-milk', 'fresh'] },
        { id: 'prod007', name: 'Mature Cheddar Cheese (250g)', seller: 'Old Mill Cheesemakers', provenance: 'Somerset Levels', category: 'Dairy', animal: 'Cattle', price: 4.50, image: 'https://placehold.co/300x200/FFD700/333333?text=Cheddar', rating: 4, reviewCount: 180, tags: ['cheese', 'cheddar', 'mature', 'dairy', 'artisan'] },
        { id: 'prod008', name: 'Natural Yoghurt (500g)', seller: 'Dairy Dell Creamery', provenance: 'Cheshire Plains', category: 'Dairy', animal: 'Cattle', price: 1.80, image: 'https://placehold.co/300x200/F5FFFA/333333?text=Yoghurt', rating: 5, reviewCount: 120, tags: ['yoghurt', 'natural', 'dairy', 'probiotic'] },


        // Wool Products (Sheep)
        { id: 'prod009', name: 'Pure Merino Wool Yarn (100g)', seller: 'The Woolly Shepherdess', provenance: 'Lake District Fells', category: 'Wool', animal: 'Sheep', price: 8.75, image: 'https://placehold.co/300x200/D3D3D3/333333?text=Wool+Yarn', rating: 5, reviewCount: 75, tags: ['wool', 'yarn', 'merino', 'craft', 'knitting'] },
        { id: 'prod010', name: 'Hand-Knitted Wool Scarf', seller: 'Crafty Ewe', provenance: 'Peak District Moors', category: 'Wool', animal: 'Sheep', price: 22.00, image: 'https://placehold.co/300x200/C0C0C0/333333?text=Wool+Scarf', rating: 4, reviewCount: 40, tags: ['wool', 'scarf', 'handmade', 'fashion', 'winter'] },

        // Leather Products (Cattle)
        { id: 'prod011', name: 'Full-Grain Leather Belt', seller: 'Artisan Leatherworks', provenance: 'Northamptonshire Tannery', category: 'Leather', animal: 'Cattle', price: 35.00, image: 'https://placehold.co/300x200/8B4513/FFFFFF?text=Leather+Belt', rating: 5, reviewCount: 92, tags: ['leather', 'belt', 'full-grain', 'handmade', 'accessory'] },
        { id: 'prod012', name: 'Leather Wallet', seller: 'Hide & Stitch Co.', provenance: 'Rural England Workshop', category: 'Leather', animal: 'Cattle', price: 45.99, image: 'https://placehold.co/300x200/A0522D/FFFFFF?text=Leather+Wallet', rating: 4, reviewCount: 65, tags: ['leather', 'wallet', 'accessory', 'gift'] },
    ];

    // --- Platform UI Data & Content Data (Largely obsolete with panel removal, kept for potential small reuse or reference) ---
    const platformData: any = {}; // Placeholder for now
    const contentData: any = {};  // Placeholder for now
    // const informationPanelData: InfoPanelData = {}; // Likely fully obsolete

    // --- Main Application Logic ---
    // --- Shopping Cart State ---
    let shoppingCart: ShoppingCartItem[] = [];

    // --- Shopping Cart Functions (Active - some internal old logic might be commented) ---
    function addToCart(productId: string, productName: string, productPrice: number, productImage: string): void {
        const existingItem = shoppingCart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            shoppingCart.push({ id: productId, name: productName, price: productPrice, quantity: 1, image: productImage });
        }
        updateCartDisplay();
        console.log(`${productName} added to cart. Cart:`, shoppingCart);
    }
    (window as any).addToCart = addToCart;

    function removeFromCart(productId: string): void {
        shoppingCart = shoppingCart.filter(item => item.id !== productId);
        updateCartDisplay();
        // Old panel-specific update logic - commented out:
        /*
        if (activeSecondPanelId === 'shopping_cart_view') { // activeSecondPanelId is part of old state
            updateMainContent('shopping_cart_view', contentData.shopping_cart_view.title); // updateMainContent is obsolete
        }
        */
    }
    (window as any).removeFromCart = removeFromCart;

    function updateCartQuantity(productId: string, newQuantityString: string): void {
        const item = shoppingCart.find(item => item.id === productId);
        const quantity = parseInt(newQuantityString);
        if (item && quantity > 0) {
            item.quantity = quantity;
        } else if (item && quantity <= 0) {
            removeFromCart(productId); // This will call updateCartDisplay
            return;
        }
        updateCartDisplay(); // Ensure cart display is updated
        // Old panel-specific update logic - commented out:
        /*
         if (activeSecondPanelId === 'shopping_cart_view') { // activeSecondPanelId is part of old state
            updateMainContent('shopping_cart_view', contentData.shopping_cart_view.title); // updateMainContent is obsolete
        }
        */
    }
    (window as any).updateCartQuantity = updateCartQuantity;

    function updateCartDisplay(): void {
        const shoppingCartCountDisplay = document.getElementById('shopping-cart-count-display') as HTMLSpanElement;
        if (!shoppingCartCountDisplay) {
            // console.warn("shopping-cart-count-display not found for updateCartDisplay.");
            return; 
        }
        const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            shoppingCartCountDisplay.textContent = totalItems.toString();
            shoppingCartCountDisplay.classList.remove('hidden');
        } else {
            shoppingCartCountDisplay.classList.add('hidden');
        }
    }

    /* OBSOLETE: Event listener for an old general shopping cart button.
    shoppingCartButton.addEventListener('click', () => {
        // ... old logic ...
    });
    */

    // --- Wallet Modal Functions --- (Kept)
    const walletModal = document.getElementById('wallet-modal') as HTMLElement;
    const walletModalResults = document.getElementById('wallet-modal-results') as HTMLPreElement;
    const closeWalletModalButton = document.getElementById('close-wallet-modal-button') as HTMLButtonElement;

    async function openWalletsModal(): Promise<void> {
        if (!walletModal || !walletModalResults) {
            console.error("Wallet modal elements not found!");
            return;
        }
        walletModalResults.textContent = 'Fetching available wallets...';
        walletModal.classList.remove('hidden');

        try {
            const result = await invoke("get_available_wallets");
            walletModalResults.textContent = JSON.stringify(result, null, 2);
        } catch (error) {
            console.error("Error fetching wallets:", error);
            walletModalResults.textContent = `Error fetching wallets: ${JSON.stringify(error, null, 2)}`;
        }
    }

    function closeWalletsModal(): void {
        if (walletModal) {
            walletModal.classList.add('hidden');
        }
    }

    // --- New Tab Navigation Logic --- (Kept)
    function navigateToTab(tabId: string): void {
        const pageContent = document.getElementById('page-content');
        const pageTitleHeader = document.getElementById('page-title-header');
        const tabs = document.querySelectorAll('#bottom-tab-bar button');

        tabs.forEach(tab => {
            const button = tab as HTMLButtonElement;
            if (button.dataset.tabId === tabId) {
                button.classList.add('active-tab');
            } else {
                button.classList.remove('active-tab');
            }
        });

        if (pageContent && pageTitleHeader) {
            let newTitle = "Unknown Page";
            let newContent = "<p class=\"text-lg text-gray-700\">Content loading...</p>";

            switch (tabId) {
                case 'home':
                    newTitle = "Home";
                    newContent = `
                        <div class="text-center">
                            <h2 class="text-2xl font-oswald text-main-color mb-4">Welcome to the Home Page!</h2>
                            <p class="text-gray-600">This is where the main product grid will appear.</p>
                            <img src="https://placehold.co/600x300/E2E8F0/A0AEC0?text=Home+Page+Content+Area" alt="Homepage placeholder" class="mx-auto mt-4 rounded shadow-md">
                        </div>`;
                    break;
                case 'search':
                    newTitle = "Search";
                    newContent = `
                        <div class="text-center">
                            <h2 class="text-2xl font-oswald text-main-color mb-4">Search Products</h2>
                            <input type="search" placeholder="Enter search term..." class="p-2 border border-gray-300 rounded-md w-full max-w-md mx-auto focus:ring-2 focus:ring-main-color focus:border-transparent outline-none text-sm">
                            <p class="text-gray-600 mt-4">Search results will appear here. (Functionality coming soon)</p>
                        </div>`;
                    break;
                case 'cart':
                    newTitle = "Shopping Cart";
                    newContent = `
                        <div class="text-center">
                            <h2 class="text-2xl font-oswald text-main-color mb-4">Your Shopping Cart</h2>
                            <p class="text-gray-600">Cart items will be listed here. (Functionality coming in Phase 4)</p>
                             <i class="fas fa-shopping-cart text-6xl text-gray-300 mt-6"></i>
                        </div>`;
                    break;
                case 'profile':
                    newTitle = "User Profile";
                    newContent = `
                        <div class="text-center">
                            <h2 class="text-2xl font-oswald text-main-color mb-4">My Profile</h2>
                            <p class="text-gray-600">Profile details and options will be here. (Functionality coming in Phase 3)</p>
                            <img src="https://placehold.co/150x150/0d324a/FFFFFF?text=User" alt="Profile avatar placeholder" class="mx-auto mt-4 rounded-full shadow-md">
                        </div>`;
                    break;
                default:
                    newContent = "<p class=\"text-lg text-red-500\">Error: Unknown tab selected.</p>";
            }
            pageContent.innerHTML = newContent;
            pageTitleHeader.textContent = newTitle;
        } else {
            console.error("#page-content or #page-title-header not found in the DOM.");
            if (!pageContent) displayAppError("Critical Error: #page-content element not found.");
            if (!pageTitleHeader) displayAppError("Critical Error: #page-title-header element not found.");
        }
    }

    // --- Main App Initialization Function ---
    function initializeApp(): void {
        console.log("Initializing app with new layout...");

        // --- OLD PANEL ELEMENT GETTERS AND LISTENERS (Should be fully commented out now) ---
        /*
        // const firstPanelMainIconsContainer = document.getElementById('first-panel-main-icons');
        // const firstPanelBottomIconsContainer = document.getElementById('first-panel-bottom-icons');
        // renderFirstPanel(); // Old logic - Function is now commented out
        // selectFirstPanelItem('marketplace'); // Old logic - Function is now commented out

        // const secondPanelSearchInput = document.getElementById('second-panel-search') as HTMLInputElement;
        // if (secondPanelSearchInput) { 
        //     secondPanelSearchInput.addEventListener('keyup', (event) => { // ... old search logic ... // }); // Corrected comment
        // }
        // attachProfileTabListeners(); // Old logic - Function is now commented out
        */

        const openWalletModalButton = document.getElementById('open-wallet-modal-button') as HTMLButtonElement;
        if (openWalletModalButton) {
            openWalletModalButton.addEventListener('click', openWalletsModal);
        } else {
            console.warn('#open-wallet-modal-button not found.');
        }

        const closeWalletModalButton = document.getElementById('close-wallet-modal-button') as HTMLButtonElement;
        const walletModal = document.getElementById('wallet-modal') as HTMLElement;
        if (closeWalletModalButton && walletModal) {
            closeWalletModalButton.addEventListener('click', closeWalletsModal);
            walletModal.addEventListener('click', (event) => { 
                if (event.target === walletModal) {
                    closeWalletsModal();
                }
            });
        } else {
            console.warn('Wallet modal elements (button or modal itself) not found.');
        }

        const tabButtons = document.querySelectorAll('#bottom-tab-bar button');
        if (tabButtons.length === 0) {
            console.error("No tab buttons found. Tab navigation will not work.");
            if (typeof displayAppError === 'function') displayAppError("Critical Error: Tab navigation buttons not found in HTML.");
        }
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = (button as HTMLButtonElement).dataset.tabId;
                if (tabId) {
                    navigateToTab(tabId);
                }
            });
        });

        navigateToTab('home'); 
        updateCartDisplay(); 

        console.log("New layout app initialized.");
    }

    // --- Ensure DOM is ready before initializing ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
    console.log("app.ts main logic processed, initializeApp queued or called.");

} catch (e: any) {
    displayAppError("CRITICAL APP.TS EXECUTION FAILURE", e);
    console.error("CRITICAL APP.TS EXECUTION FAILURE:", e);
} 