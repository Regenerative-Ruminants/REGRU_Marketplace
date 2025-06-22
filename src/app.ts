import { invoke } from "@tauri-apps/api/tauri";

// --- Type Definitions (Phase 1 Refactor) ---
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
    // For mockup design - will be used in later phases
    mockupImagePlaceholderClass?: string; 
    mockupBadges?: { text: string; class: string; }[];
    description?: string;
}

interface ShoppingCartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

// New types for the redesigned sidebar
interface SidebarNavItem {
    id: string; // e.g., 'browse_all_products', 'my_purchases', 'wallets_view'
    label: string;
    iconClass: string;
    action?: () => void; // For items like "Wallets" that open a modal
    badgeKey?: string; // e.g., 'notifications', 'orders' to look up counts later
    isDefault?: boolean;
}

interface SidebarNavSection {
    title: string;
    items: SidebarNavItem[];
}

// --- Sample Product Data (Preserved - will be used in Phase 2 for product grid) ---
const sampleProducts: Product[] = [
    { 
        id: 'prod001', name: 'Heritage Rainbow Carrots', seller: 'Sunrise Organic Farm', provenance: 'Devon, England', category: 'Produce', animal: 'N/A', price: 3.50, 
        image: 'https://placehold.co/400x300/84cc16/FFFFFF?text=Organic+Carrots', 
        mockupImagePlaceholderClass: 'produce-bg',
        mockupBadges: [{ text: 'Organic', class: 'organic' }, { text: 'Traceable', class: 'traceable' }],
        rating: 5, reviewCount: 127, 
        description: 'Hand-harvested heritage carrots in vibrant colors. Sweet, crisp, and packed with nutrients.',
        tags: ['Heirloom', 'No-till', 'Seasonal'] 
    },
    { 
        id: 'prod002', name: 'Aged Cheddar Wheel', seller: 'Cotswold Creamery', provenance: 'Gloucestershire', category: 'Dairy', animal: 'Cattle', price: 12.99, 
        image: 'https://placehold.co/400x300/0ea5e9/FFFFFF?text=Artisan+Cheese', 
        mockupImagePlaceholderClass: 'dairy-bg',
        mockupBadges: [{ text: 'Local', class: 'local' }, { text: 'Traceable', class: 'traceable' }],
        rating: 5, reviewCount: 89, 
        description: '18-month aged traditional cheddar. Made from grass-fed Jersey cow milk using traditional methods.',
        tags: ['Grass-fed', 'Aged 18mo', 'Artisan'] 
    },
    { 
        id: 'prod003', name: 'Grass-Fed Ribeye Steak', seller: 'Highland Heritage Farm', provenance: 'Scottish Highlands', category: 'Meat', animal: 'Cattle', price: 24.99, 
        image: 'https://placehold.co/400x300/8b4513/FFFFFF?text=Grass-Fed+Beef', 
        mockupImagePlaceholderClass: 'meat-bg',
        mockupBadges: [{ text: 'Organic', class: 'organic' }, { text: 'Local', class: 'local' }, { text: 'Traceable', class: 'traceable' }],
        rating: 5, reviewCount: 156, 
        description: 'Premium grass-fed ribeye from Highland cattle. Aged 28 days for exceptional flavor and tenderness.',
        tags: ['28-day aged', 'Grass-fed', 'Highland'] 
    },
    { 
        id: 'prod004', name: 'Mixed Spring Bouquet', seller: 'Meadow Bloom Flowers', provenance: 'Kent, England', category: 'Flowers', animal: 'N/A', price: 18.00, 
        image: 'https://placehold.co/400x300/ec4899/FFFFFF?text=Cut+Flowers', 
        mockupImagePlaceholderClass: 'flowers-bg',
        mockupBadges: [{ text: 'Seasonal', class: 'seasonal' }, { text: 'Local', class: 'local' }],
        rating: 4, reviewCount: 73, 
        description: 'Seasonal mixed bouquet featuring tulips, daffodils, and cherry blossoms. Freshly cut this morning.',
        tags: ['Seasonal', 'Fresh cut', 'Mixed'] 
    },
    { 
        id: 'prod005', name: 'Stone-Ground Spelt Flour', seller: 'Ancient Grains Collective', provenance: 'Norfolk, England', category: 'Grains', animal: 'N/A', price: 4.75, 
        image: 'https://placehold.co/400x300/d97706/FFFFFF?text=Heritage+Grains', 
        mockupImagePlaceholderClass: 'grains-bg',
        mockupBadges: [{ text: 'Organic', class: 'organic' }, { text: 'Traceable', class: 'traceable' }],
        rating: 5, reviewCount: 94, 
        description: 'Ancient spelt wheat, stone-ground in small batches. Perfect for artisan breads and baking.',
        tags: ['Stone-ground', 'Ancient grain', 'Small batch'] 
    },
    { 
        id: 'prod006', name: 'Hand-Spun Wool Yarn', seller: 'Woolly Wonders Farm', provenance: 'Lake District', category: 'Crafts', animal: 'Sheep', price: 16.50, 
        image: 'https://placehold.co/400x300/8b5cf6/FFFFFF?text=Handmade+Crafts', 
        mockupImagePlaceholderClass: 'crafts-bg',
        mockupBadges: [{ text: 'Local', class: 'local' }, { text: 'Traceable', class: 'traceable' }],
        rating: 5, reviewCount: 112, 
        description: 'Hand-spun yarn from rare breed sheep. Naturally dyed with plants grown on our farm.',
        tags: ['Hand-spun', 'Natural dye', 'Rare breed'] 
    }
];

// --- Shopping Cart (Preserved) ---
let shoppingCart: ShoppingCartItem[] = [];
let favorites: Set<string> = new Set(); // For favorite product IDs, will be used later

// --- Wallet Modal Elements (Moved Up) ---
const walletModal = document.getElementById('wallet-modal') as HTMLElement;
const walletModalResults = document.getElementById('wallet-modal-results') as HTMLPreElement;
const closeWalletModalButton = document.getElementById('close-wallet-modal-button') as HTMLButtonElement;

// --- Wallet Modal Functions (Moved Up) ---
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

// --- Sidebar Navigation Configuration (New - Defined after Wallet functions) ---
const sidebarNavConfig: SidebarNavSection[] = [
    {
        title: "Browse",
        items: [
            { id: "browse_all_products", label: "All Products", iconClass: "fas fa-th-large", isDefault: true },
            { id: "browse_by_category", label: "By Category", iconClass: "fas fa-tags" },
            { id: "browse_by_seller", label: "By Seller", iconClass: "fas fa-store-alt" },
            { id: "browse_by_provenance", label: "By Provenance", iconClass: "fas fa-leaf" }
        ]
    },
    {
        title: "My Buying",
        items: [
            { id: "my_purchases", label: "My Purchases", iconClass: "fas fa-receipt" },
            { id: "my_favourites_view", label: "Favourites", iconClass: "fas fa-heart" }
        ]
    },
    {
        title: "My Selling",
        items: [
            { id: "selling_products", label: "Products", iconClass: "fas fa-box-open", badgeKey: "userProducts" },
            { id: "selling_orders", label: "Orders", iconClass: "fas fa-dolly", badgeKey: "userOrders" },
            { id: "selling_analytics", label: "Analytics", iconClass: "fas fa-chart-line" },
            { id: "selling_finance", label: "Finance", iconClass: "fas fa-file-invoice-dollar" }
        ]
    },
    {
        title: "Communication",
        items: [
            { id: "notifications_view", label: "Notifications", iconClass: "fas fa-bell", badgeKey: "unreadNotifications" },
            { id: "messages_view", label: "Messages", iconClass: "fas fa-comments", badgeKey: "unreadMessages" }
        ]
    },
    {
        title: "Account",
        items: [
            { id: "wallets_view", label: "Wallets", iconClass: "fas fa-wallet", action: () => openWalletsModal() },
            { id: "profile_view", label: "Profile", iconClass: "fas fa-user-circle" },
            { id: "help_view", label: "Help", iconClass: "fas fa-question-circle" }
        ]
    }
];

// --- DOM Element References (New Structure from index.html - after sidebarNavConfig) ---
const sidebarNavContainer = document.getElementById('sidebar-nav-container') as HTMLElement;
const pageTitleMain = document.getElementById('page-title-main') as HTMLElement;
const searchInputMain = document.getElementById('search-input-main') as HTMLInputElement;
const shoppingCartButtonTopbar = document.getElementById('shopping-cart-button-topbar') as HTMLButtonElement;
const shoppingCartCountTopbar = document.getElementById('shopping-cart-count-topbar') as HTMLElement;
const productsGridContainer = document.getElementById('products-grid-container') as HTMLElement; // Main content display area

// --- App State (New) ---
let currentView: string = 'browse_all_products'; // Default view
// Placeholder for dynamic badge counts - to be implemented later
const dynamicBadgeData = {
    userProducts: 0,
    userOrders: 0,
    unreadNotifications: 0,
    unreadMessages: 0,
};


// --- Core Functions (Phase 1 Refactor) ---

function renderSidebar(): void {
    if (!sidebarNavContainer) return;
    sidebarNavContainer.innerHTML = ''; // Clear existing items

    sidebarNavConfig.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'nav-section';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'nav-section-title';
        titleDiv.textContent = section.title;
        sectionDiv.appendChild(titleDiv);

        section.items.forEach(item => {
            const navItemAnchor = document.createElement('a');
            navItemAnchor.href = '#'; 
            navItemAnchor.className = 'nav-item';
            navItemAnchor.setAttribute('data-nav-id', item.id);

            let badgeHTML = '';
            if (item.badgeKey && dynamicBadgeData[item.badgeKey as keyof typeof dynamicBadgeData] > 0) {
                badgeHTML = `<span class="nav-badge">${dynamicBadgeData[item.badgeKey as keyof typeof dynamicBadgeData]}</span>`;
            }
            
            navItemAnchor.innerHTML = `
                <i class="${item.iconClass}"></i>
                <span>${item.label}</span>
                ${badgeHTML}
            `;

            if (item.id === currentView) {
                navItemAnchor.classList.add('active');
            }

            navItemAnchor.addEventListener('click', (e) => {
                e.preventDefault();
                if (item.action) {
                    item.action();
                } else {
                    navigateTo(item.id, { title: item.label });
                }
            });
            sectionDiv.appendChild(navItemAnchor);
        });
        sidebarNavContainer.appendChild(sectionDiv);
    });
}

function updateSidebarActiveState(): void {
    document.querySelectorAll('#sidebar-nav-container .nav-item').forEach(el => {
        const navId = el.getAttribute('data-nav-id');
        if (navId === currentView) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

/**
 * Generates HTML for star rating display.
 * @param rating - The product rating (0-5).
 * @returns HTML string for stars.
 */
function generateStarRatingHTML(rating: number): string {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>'; // Using 'far' for empty star
    }
    return starsHTML;
}

/**
 * Renders a single product card HTML.
 * @param product - The product object.
 * @returns HTML string for the product card.
 */
function renderProductCard(product: Product): string {
    const badgesHTML = product.mockupBadges?.map(badge => 
        `<span class="badge ${badge.class}">${badge.text}</span>`
    ).join('') || '';

    const tagsHTML = product.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');

    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.mockupBadges && product.mockupBadges.length > 0 ? `<div class="product-badges">${badgesHTML}</div>` : ''}
                <button class="favorite-btn" aria-label="Favorite ${product.name}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <div class="farm-info">
                    <span class="farm-name">${product.seller}</span>
                    <span class="location">${product.provenance}</span>
                </div>
                ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
                ${product.tags && product.tags.length > 0 ? `<div class="product-tags">${tagsHTML}</div>` : ''}
                
                <div class="rating-section mb-2"> <!-- Added a wrapper for rating and review count -->
                    <span class="stars">${generateStarRatingHTML(product.rating)}</span>
                    <span class="rating-count">(${product.reviewCount} reviews)</span>
                </div>
            </div>
            <div class="product-footer">
                <div class="price-section">
                    <span class="price">£${product.price.toFixed(2)}</span>
                    ${product.category === 'Meat' || product.category === 'Dairy' ? '<span class="price-unit">/ kg</span>' : product.category === 'Produce' && product.name.toLowerCase().includes('dozen') ? '<span class="price-unit">/ dozen</span>' : '<span class="price-unit">/ unit</span>'}
                </div>
                <button class="add-to-cart" 
                        data-product-id="${product.id}" 
                        data-product-name="${product.name}" 
                        data-product-price="${product.price}" 
                        data-product-image="${product.image}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

/**
 * Renders a grid of product cards into the main content area.
 * @param productsToDisplay - Array of product objects to display.
 */
function renderProductGrid(productsToDisplay: Product[]): void {
    if (!productsGridContainer) return;

    if (!productsToDisplay || productsToDisplay.length === 0) {
        productsGridContainer.innerHTML = '<p class="col-span-full text-center p-8">No products found.</p>';
        return;
    }

    productsGridContainer.innerHTML = productsToDisplay.map(product => renderProductCard(product)).join('');

    // Attach event listeners for Add to Cart buttons within the grid
    productsGridContainer.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const btn = event.currentTarget as HTMLButtonElement;
            const productId = btn.dataset.productId;
            const productName = btn.dataset.productName;
            const productPrice = parseFloat(btn.dataset.productPrice || '0');
            const productImage = btn.dataset.productImage;

            if (productId && productName && productImage) {
                addToCart(productId, productName, productPrice, productImage);
            } else {
                console.error('Product data attributes missing from button:', btn);
            }
        });
    });
    
    // Placeholder for favorite button listeners - to be added in a later phase
    productsGridContainer.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const btn = event.currentTarget as HTMLButtonElement;
            const productCard = btn.closest('.product-card') as HTMLElement;
            const productId = productCard?.dataset.productId;
            if (productId) {
                // Toggle favorite state (actual logic for managing favorites will be in Phase 2.x)
                btn.classList.toggle('active'); // Visual cue
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('far');
                    icon.classList.toggle('fas'); // Toggle to solid heart
                }
                console.log(`Favorite toggled for product: ${productId}`);
            }
        });
    });
}

// Simplified navigateTo for Phase 1
function navigateTo(viewId: string, data?: { title?: string }): void {
    console.log(`Navigating to: ${viewId}`, data);
    currentView = viewId;

    if (pageTitleMain) {
        pageTitleMain.textContent = data?.title || viewId.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
    }
    updateSidebarActiveState();

    if (productsGridContainer) {
        if (viewId === "browse_all_products") {
            renderProductGrid(sampleProducts); // Display actual products
        } else if (viewId === "shopping_cart_view") {
            productsGridContainer.innerHTML = `<p class="col-span-full text-center p-8">Shopping Cart View (Details coming in Phase 2)</p>`;
        }
        else {
            productsGridContainer.innerHTML = `<p class="col-span-full text-center p-8">Content for <strong>${data?.title || viewId}</strong> coming soon!</p>`;
        }
    }
}

// --- Shopping Cart Functions (Preserved, minor adaptation for new cart count ID) ---
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
// Expose to window if called by dynamically generated HTML not using event listeners (review in Phase 2)
// (window as any).addToCart = addToCart; 

function removeFromCart(productId: string): void {
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    updateCartDisplay();
    if (currentView === 'shopping_cart_view') { // If on cart page, refresh it (Phase 2)
        navigateTo('shopping_cart_view', { title: 'Your Shopping Cart' }); 
    }
}
// (window as any).removeFromCart = removeFromCart;

function updateCartQuantity(productId: string, newQuantityString: string): void {
    const quantity = parseInt(newQuantityString);
    const itemIndex = shoppingCart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        if (quantity > 0) {
            shoppingCart[itemIndex].quantity = quantity;
        } else {
            shoppingCart.splice(itemIndex, 1); 
        }
    }
    updateCartDisplay();
    if (currentView === 'shopping_cart_view') { // If on cart page, refresh it (Phase 2)
         navigateTo('shopping_cart_view', { title: 'Your Shopping Cart' });
    }
}
// (window as any).updateCartQuantity = updateCartQuantity;

function updateCartDisplay(): void {
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    if (shoppingCartCountTopbar) { // Updated ID
        shoppingCartCountTopbar.textContent = totalItems.toString();
        // Use mockup's class logic for visibility if it has one, or simple display style
        shoppingCartCountTopbar.style.display = totalItems > 0 ? 'inline-block' : 'none'; 
    }
}

// --- Initialization (Phase 1 Refactor) ---
function initializeApp(): void {
    renderSidebar();
    
    const defaultNavItem = sidebarNavConfig.flatMap(s => s.items).find(item => item.isDefault);
    if (defaultNavItem) {
        navigateTo(defaultNavItem.id, { title: defaultNavItem.label });
    } else {
         navigateTo('browse_all_products', { title: 'All Products' }); // Fallback
    }

    updateCartDisplay();

    // Event listener for closing the wallet modal
    if (closeWalletModalButton) {
        closeWalletModalButton.addEventListener('click', closeWalletsModal);
    }
    if (walletModal) { 
        walletModal.addEventListener('click', (event) => {
            if (event.target === walletModal) closeWalletsModal();
        });
    }

    // Top Bar Listeners
    if (shoppingCartButtonTopbar) {
        shoppingCartButtonTopbar.addEventListener('click', () => {
            // In Phase 1, just navigate to a placeholder. Phase 2 will render actual cart.
            navigateTo('shopping_cart_view', { title: 'Your Shopping Cart' });
        });
    }

    if (searchInputMain) {
        searchInputMain.addEventListener('input', (e) => {
            const searchTerm = (e.target as HTMLInputElement).value;
            console.log("Search term (Phase 1 - not implemented):", searchTerm);
            // Search/filtering logic will be added in Phase 2
            // For now, it could re-trigger navigateTo if we want to show a "searching..." state
            // navigateTo(currentView, { title: pageTitleMain.textContent || undefined });
        });
    }
    
    // Add other listeners (sort, view toggle, filters) in later phases

    console.log("app.ts (Phase 1 UI Refactor) loaded and initializeApp queued for DOMContentLoaded.");
}

// Run initialization when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Exposing functions to window - review if needed in Phase 2
// (window as any).selectSecondPanelItem = selectSecondPanelItem; // Old function, should be removed

/* --- OLD CODE TO BE REMOVED/REPLACED (Commented out for reference during refactor) ---

// --- OLD Type Definitions ---
// interface SecondPanelItem { id: string; label: string; iconClass?: string; }
// interface SecondPanelGroup { groupLabel?: string; items: SecondPanelItem[]; }
// interface PlatformItem { label: string; iconClass: string; searchPlaceholder?: string; secondPanelContent?: SecondPanelGroup[]; isBottomIcon?: boolean;}
// interface PlatformData { [key: string]: PlatformItem; }
// interface ContentEntry { title: string; htmlFactory?: () => string; html?: string; }
// interface ContentData { [key: string]: ContentEntry; }
// interface InfoPanelData { [key: string]: string; }


// --- OLD Platform UI Data & Content Data ---
// const platformData: PlatformData = { ... };
// const contentData: ContentData = { ... };
// const informationPanelData: InfoPanelData = { ... };


// --- OLD DOM Elements ---
// const firstPanelMainIconsContainer = document.getElementById('first-panel-main-icons') as HTMLElement;
// const firstPanelBottomIconsContainer = document.getElementById('first-panel-bottom-icons') as HTMLElement;
// const secondPanel = document.getElementById('second-panel') as HTMLElement;
// const secondPanelSearch = document.getElementById('second-panel-search') as HTMLInputElement;
// const secondPanelContentEl = document.getElementById('second-panel-content') as HTMLElement;
// const mainHeading = document.getElementById('main-heading') as HTMLElement; // Replaced by pageTitleMain
// const contentSection = document.getElementById('content-section') as HTMLElement; // Replaced by productsGridContainer or similar
// const contentPlaceholder = document.getElementById('content-placeholder') as HTMLElement;
// const infoPanel = document.getElementById('info-panel') as HTMLElement;
// const infoPanelContentEl = document.getElementById('info-panel-content') as HTMLElement;
// const toggleSecondPanelBtn = document.getElementById('toggle-second-panel') as HTMLButtonElement;
// const toggleInfoPanelBtn = document.getElementById('toggle-info-panel') as HTMLButtonElement;
// const toggleSecondIcon = document.getElementById('toggle-second-icon') as HTMLElement;
// const toggleInfoIcon = document.getElementById('toggle-info-icon') as HTMLElement;
// const shoppingCartButton = document.getElementById('shopping-cart-button') as HTMLButtonElement; // Replaced by shoppingCartButtonTopbar
// const shoppingCartCountDisplay = document.getElementById('shopping-cart-count-display') as HTMLElement; // Replaced by shoppingCartCountTopbar


// --- OLD App State ---
// let activeFirstPanelKey: string | null = null;
// let activeSecondPanelId: string | null = null;
// let isSecondPanelOpen = true;
// let isInfoPanelOpen = true;

// --- OLD Core Functions ---
// function renderFirstPanel(): void { ... }
// function renderSecondPanel(key: string | null): void { ... }
// function updateMainContent(itemId: string, itemLabelFromSecondPanel?: string): void { ... } // Replaced by navigateTo and specific renderers
// function attachProfileTabListeners(): void { ... } // Will be re-added if profile view uses tabs
// function selectFirstPanelItem(key: string): void { ... }
// function selectSecondPanelItem(itemId: string, itemLabel: string, parentKey: string): void { ... }
// (window as any).selectSecondPanelItem = selectSecondPanelItem;
// function updateSecondPanelActiveState(): void { ... }
// function toggleSecondPanelDisplay(forceOpen?: boolean): void { ... }
// toggleSecondPanelBtn.addEventListener('click', () => toggleSecondPanelDisplay());
// function toggleInfoPanelDisplay(forceOpen?: boolean): void { ... }
// toggleInfoPanelBtn.addEventListener('click', () => toggleInfoPanelDisplay());
// shoppingCartButton.addEventListener('click', () => { ... }); // Old cart button logic

*/ 