import { BrowserProvider, EtherscanProvider, JsonRpcSigner } from "ethers";
import { walletService } from './walletService'; // IMPORT THE NEW WALLET SERVICE

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
export interface SidebarNavItem {
    id: string; // e.g., 'browse_all_products', 'my_purchases', 'wallets_view'
    label: string;
    iconClass: string;
    action?: () => void; // For items like "Wallets" that open a modal
    badgeKey?: string; // e.g., 'notifications', 'orders' to look up counts later
    isDefault?: boolean;
}

export interface SidebarNavSection {
    title: string;
    items: SidebarNavItem[];
}

// --- App State ---
let allProducts: Product[] = []; // This will hold the single source of truth for products.
let shoppingCart: ShoppingCartItem[] = [];

// --- Wallet State ---
// This state is being deprecated in favor of walletService.ts, but kept for the modal logic for now.
let provider: BrowserProvider | null = null;
let signer: JsonRpcSigner | null = null;

// --- Wallet Connection Logic ---

async function connectWallet() {
    // This function is now simplified to call the centralized service.
    // The service itself will handle UI updates.
    await walletService.connect();
    openWalletsModal(); // Open modal to show connection status or allow connection.
}

// updateWalletUI is now handled by walletService.ts and can be removed.

// --- Wallet Modal (Refactored for Robustness) ---

function closeWalletsModal(): void {
    const modalContainer = document.getElementById('wallet-modal-container');
    if (modalContainer) {
        modalContainer.classList.remove('is-visible');
    }
}

function setupModalEventListeners(): void {
    const closeButton = document.getElementById('wallet-modal-close-btn');
    if (closeButton) {
        closeButton.addEventListener('click', closeWalletsModal);
    }
    
    const modalContainer = document.getElementById('wallet-modal-container');
    if (modalContainer) {
        modalContainer.addEventListener('click', (event) => {
            // Close modal only if the click is on the container itself (the backdrop)
            if (event.target === modalContainer) {
                closeWalletsModal();
            }
        });
    }
}

async function loadWalletsIntoModal(): Promise<void> {
    const modalCard = document.getElementById('wallet-modal-card');
    if (!modalCard) return;

    // Fetch and inject the modal content from the HTML file
    try {
        const response = await fetch('/components/wallet-modal.html');
        if (!response.ok) throw new Error('Failed to load wallet modal template.');
        modalCard.innerHTML = await response.text();

        // Now that content is loaded, set up listeners on the *new* elements
        setupModalEventListeners();

    } catch (error) {
        console.error("Error loading wallet modal content:", error);
        modalCard.innerHTML = `<p class="p-4 text-red-500">Error: Could not load wallet interface.</p>`;
        return;
    }
    
    const listContainer = document.getElementById('wallet-list-container') as HTMLElement;
    const spinner = document.getElementById('wallet-loading-spinner') as HTMLElement;
    const errorP = document.getElementById('wallet-error-message') as HTMLElement;
    const modalTitle = document.getElementById('wallet-modal-title') as HTMLElement;


    if (!listContainer || !spinner || !errorP || !modalTitle) {
        console.error("Wallet modal is missing required content elements (title, list, spinner, error).");
        if (errorP) {
            errorP.textContent = "Modal content is malformed.";
            errorP.style.display = 'block';
        }
        return;
    }

    spinner.style.display = 'none'; // Hide spinner by default
    errorP.style.display = 'none';
    listContainer.innerHTML = '';

    const activeWallet = walletService.getActiveWallet();

    if (activeWallet) {
        // --- USER WALLET VIEW ---
        modalTitle.textContent = 'Connected Wallet';
        const address = activeWallet.address;
        // In a real app, you'd get the balance from the provider via the service
        const balance = '...'; // Placeholder

        const abbreviateAddress = (address: string) => {
            if (address.length <= 11) return address;
            return `${address.slice(0, 6)}...${address.slice(-5)}`;
        };

        listContainer.innerHTML = `
            <div class="wallet-item">
                <span class="wallet-name">Your Wallet</span>
                <div class="wallet-address-container">
                    <span 
                        class="wallet-address" 
                        title="Click to copy: ${address}" 
                        data-full-address="${address}"
                        data-wallet-id="user-wallet-address"
                    >
                        ${abbreviateAddress(address)}
                    </span>
                    <span class="copy-indicator" id="copy-indicator-user">Copied!</span>
                </div>
                <span class="wallet-balance">${balance} ETH</span>
            </div>
            <button id="disconnect-wallet-btn" class="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700">
                Disconnect
            </button>
        `;

        // Add event listeners for copy and disconnect
        const addressSpan = listContainer.querySelector('[data-wallet-id="user-wallet-address"]');
        if (addressSpan) {
            addressSpan.addEventListener('click', () => {
                const fullAddress = addressSpan.getAttribute('data-full-address');
                if (fullAddress) {
                    navigator.clipboard.writeText(fullAddress).then(() => {
                        const indicator = document.getElementById(`copy-indicator-user`);
                        if (indicator) {
                            indicator.classList.add('visible');
                            setTimeout(() => indicator.classList.remove('visible'), 1500);
                        }
                    });
                }
            });
        }

        const disconnectBtn = document.getElementById('disconnect-wallet-btn');
        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', () => {
                walletService.disconnect();
                closeWalletsModal();
            });
        }

    } else {
        // --- NO WALLET CONNECTED VIEW ---
        modalTitle.textContent = 'Connect a Wallet';
        listContainer.innerHTML = `
            <div class="p-4 text-center">
                <p class="text-gray-600 mb-4">No wallet is connected. Please connect a wallet to manage your assets.</p>
                <button id="modal-connect-btn" class="action-btn primary">Connect Wallet</button>
            </div>
        `;
        
        const connectBtn = document.getElementById('modal-connect-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', async () => {
                // Reuse the main connect logic and then reload the modal content
                await walletService.connect();
                loadWalletsIntoModal(); 
            });
        }

        // Hide the "Add New Wallet" footer when no wallet is connected
        const footer = document.querySelector('.wallet-modal-footer');
        if (footer) {
            (footer as HTMLElement).style.display = 'none';
        }
    }
}

async function openWalletsModal(): Promise<void> {
    const modalContainer = document.getElementById('wallet-modal-container');
    if (!modalContainer) {
        console.error("Wallet modal container not found in the DOM.");
        return;
    }

    // Make the modal visible first
    modalContainer.classList.remove('hidden'); // Legacy
    modalContainer.classList.add('is-visible');

    // Then load its content
    await loadWalletsIntoModal();
}


// --- Sidebar Navigation Configuration (New - Defined after Wallet functions) ---
export const sidebarNavConfig: SidebarNavSection[] = [
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
            { id: "wallets_view", label: "Wallets", iconClass: "fas fa-wallet", action: openWalletsModal },
            { id: "profile_view", label: "Profile", iconClass: "fas fa-user-circle" },
            { id: "help_view", label: "Help", iconClass: "fas fa-question-circle" }
        ]
    }
];

// --- DOM Element References (New Structure from index.html - after sidebarNavConfig) ---
const sidebarNavContainer = document.getElementById('sidebar-nav-container') as HTMLElement;
const pageTitleMain = document.getElementById('page-title-main') as HTMLElement;
// const searchInputMain = document.getElementById('search-input-main') as HTMLInputElement;
const shoppingCartButtonTopbar = document.getElementById('shopping-cart-button-topbar') as HTMLButtonElement;
const shoppingCartCountTopbar = document.getElementById('shopping-cart-count-topbar') as HTMLElement;
const productsGridContainer = document.getElementById('products-grid-container') as HTMLElement; // Main content display area
const sortSelectControl = document.getElementById('sort-select-control') as HTMLSelectElement; // Phase 2.4: Sort select
const filterTagsContainer = document.getElementById('filter-tags-container') as HTMLElement; // Phase 2.5: Filter tags
const viewToggleControl = document.getElementById('view-toggle-control') as HTMLElement; // Phase 2.6: View toggle

// --- Search Overlay Elements (Phase 3) ---
const mobileSearchOpener = document.getElementById('mobile-search');
const searchOverlay = document.getElementById('regru-search-overlay');
const searchCloser = document.getElementById('regru-search-close');
const searchInput = document.getElementById('regru-search-input') as HTMLInputElement;
const searchResults = document.getElementById('regru-search-results');

// --- App State (New) ---
let currentView: string = 'browse_all_products'; // Default view
let currentSearchTerm: string = ''; // Phase 2.3: For search functionality
let currentSortOption: string = 'featured'; // Phase 2.4: For sort functionality
let activeFilters: { category?: string } = {}; // Phase 2.5: For filter functionality
let currentDisplayMode: 'grid' | 'list' = 'grid'; // Phase 2.6: For grid/list view toggle

// Placeholder for dynamic badge counts - to be implemented later
const dynamicBadgeData = {
    userProducts: 0,
    userOrders: 0,
    unreadNotifications: 0,
    unreadMessages: 0,
};

// --- Core Functions (Phase 1 Refactor) ---

/**
 * Renders the search results in the search overlay.
 * @param results The products to display in the search results area.
 */
function renderSearchResults(results: Product[]): void {
    const resultsContainer = document.getElementById('regru-search-results') as HTMLElement;
    if (!resultsContainer) return;

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="search-result-placeholder">No products found. Try a different search.</p>';
        return;
    }

    resultsContainer.innerHTML = results.map(product => `
        <a href="#" class="search-result-item" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="search-result-image">
            <div class="search-result-info">
                <div class="search-result-name">${product.name}</div>
                <div class="search-result-category">in ${product.category}</div>
            </div>
        </a>
    `).join('');

    // Add click listeners to the new result items
    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = (item as HTMLElement).dataset.productId;
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                showProductModal(product, item as HTMLElement);
            }
        });
    });
}

/**
 * Displays a modal with detailed information about a product, animating from the clicked element.
 * @param product The product to display in the modal.
 * @param clickedElement The search result item that was clicked.
 */
function showProductModal(product: Product, clickedElement: HTMLElement): void {
    const modalContainer = document.getElementById('product-detail-modal-container') as HTMLElement;
    if (!modalContainer) return;

    const startRect = clickedElement.getBoundingClientRect();

    const modalContentHTML = `
        <div id="product-modal-card" class="product-modal-card" style="--start-top: ${startRect.top}px; --start-left: ${startRect.left}px; --start-width: ${startRect.width}px; --start-height: ${startRect.height}px;">
            <button id="close-product-modal" class="product-modal-close-btn">&times;</button>
            <div class="product-modal-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-modal-image">
            </div>
            <div class="product-modal-info">
                <h3 class="product-modal-title">${product.name}</h3>
                <p class="product-modal-seller">by ${product.seller}</p>
                <p class="product-modal-description">${product.description || 'No description available.'}</p>
                <div class="product-modal-footer">
                    <span class="product-modal-price">$${product.price.toFixed(2)}</span>
                    <button class="product-modal-add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    modalContainer.innerHTML = modalContentHTML;
    modalContainer.classList.add('is-visible');

    const card = document.getElementById('product-modal-card') as HTMLElement;
    // Trigger the animation
    requestAnimationFrame(() => {
        card.classList.add('animate-in');
    });

    // Add listener to the new close button
    modalContainer.querySelector('#close-product-modal')?.addEventListener('click', () => hideProductModal());

    // Add listener to close when clicking the backdrop
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            hideProductModal();
        }
    });
}

/**
 * Hides the product detail modal, animating it out.
 */
function hideProductModal(): void {
    const modalContainer = document.getElementById('product-detail-modal-container') as HTMLElement;
    const card = document.getElementById('product-modal-card') as HTMLElement;
    if (!modalContainer || !card) return;

    card.classList.remove('animate-in');
    card.classList.add('animate-out');

    // Listen for the animation to end before hiding the container
    card.addEventListener('animationend', () => {
        modalContainer.classList.remove('is-visible');
        modalContainer.innerHTML = ''; // Clear content
    }, { once: true });
}

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

    if (shoppingCartButtonTopbar && shoppingCartCountTopbar) {
        // Event listeners for cart will be here
    }

    if (mobileSearchOpener && searchOverlay && searchCloser && searchInput && searchResults) {
        const openSearch = () => {
            if (!searchOverlay || !searchInput) return;
            searchOverlay.classList.remove('hidden');
            searchInput.value = ''; // Clear previous search
            searchInput.focus();
            renderSearchResults(allProducts); // Show all products initially
        };

        const closeSearch = () => {
            if (!searchOverlay || !searchInput) return;
            searchOverlay.classList.add('hidden');
        };

        mobileSearchOpener.addEventListener('click', openSearch);
        searchCloser.addEventListener('click', closeSearch);

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm === '') {
                renderSearchResults(allProducts);
                return;
            }
            const filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.seller.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            renderSearchResults(filteredProducts);
        });

        // Close on escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) {
                closeSearch();
            }
        });
    }

    // Initialize the default view
    navigateTo(currentView, { title: 'Fresh Farm Products' });
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
            <div class="product-card-content">
                <h3 class="product-title">${product.name}</h3>
                <div class="farm-info">
                    <span class="farm-name">${product.seller}</span>
                    <span class="location">${product.provenance}</span>
                </div>
                ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
                ${product.tags && product.tags.length > 0 ? `<div class="product-card-tags">${tagsHTML}</div>` : ''}
                
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

    // Phase 2.6a: Set class on grid container based on display mode
    productsGridContainer.classList.remove('grid-view', 'list-view'); // Clear existing
    if (currentDisplayMode === 'grid') {
        productsGridContainer.classList.add('grid-view');
    } else {
        productsGridContainer.classList.add('list-view');
    }

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

// --- Filter Tag Functions (Phase 2.5a) ---
function renderFilterTags(): void {
    if (!filterTagsContainer) return;

    const categories = [...new Set(allProducts.map(p => p.category))].sort();
    
    const allCategoriesClass = !activeFilters.category ? 'active' : '';
    let tagsHTML = `<div class="filter-tag ${allCategoriesClass}" data-filter-type="category" data-filter-value="all">All Categories</div>`;

    categories.forEach(category => {
        const categoryClass = activeFilters.category === category ? 'active' : '';
        tagsHTML += `<div class="filter-tag ${categoryClass}" data-filter-type="category" data-filter-value="${category}">${category}</div>`;
    });

    filterTagsContainer.innerHTML = tagsHTML;

    // Phase 2.5b: Add event listeners to filter tags
    filterTagsContainer.querySelectorAll('.filter-tag').forEach(tagElement => {
        tagElement.addEventListener('click', (event) => {
            const clickedTag = event.currentTarget as HTMLElement;
            const filterType = clickedTag.dataset.filterType;
            const filterValue = clickedTag.dataset.filterValue;

            if (filterType === 'category') {
                if (filterValue === 'all') {
                    activeFilters.category = undefined;
                } else {
                    activeFilters.category = filterValue;
                }
                renderFilterTags(); // Re-render tags to update active state
                navigateTo('browse_all_products', { title: pageTitleMain?.textContent || 'All Products' });
            }
        });
    });
}

// --- View Toggle Functions (Phase 2.6a) ---
function updateViewToggleButtonsActiveState(): void {
    if (!viewToggleControl) return;
    const gridViewButton = viewToggleControl.querySelector('[data-view="grid"]') as HTMLButtonElement;
    const listViewButton = viewToggleControl.querySelector('[data-view="list"]') as HTMLButtonElement;

    if (gridViewButton && listViewButton) {
        gridViewButton.classList.remove('active');
        listViewButton.classList.remove('active');

        if (currentDisplayMode === 'grid') {
            gridViewButton.classList.add('active');
        } else {
            listViewButton.classList.add('active');
        }
    }
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
            let productsToDisplay = allProducts; // Use the live data

            // 0. Apply Category Filter (Phase 2.5b)
            if (activeFilters.category) {
                productsToDisplay = productsToDisplay.filter(product => product.category === activeFilters.category);
            }

            // 1. Apply Search Filter (Phase 2.3)
            if (currentSearchTerm) {
                const searchTermLower = currentSearchTerm.toLowerCase().trim();
                productsToDisplay = productsToDisplay.filter(product => 
                    product.name.toLowerCase().includes(searchTermLower) ||
                    product.seller.toLowerCase().includes(searchTermLower) ||
                    product.category.toLowerCase().includes(searchTermLower) ||
                    (product.description && product.description.toLowerCase().includes(searchTermLower)) ||
                    product.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
                );
            }

            // 2. Apply Sorting (Phase 2.4)
            let sortedProducts = [...productsToDisplay]; 
            if (currentSortOption === 'price_asc') {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (currentSortOption === 'price_desc') {
                sortedProducts.sort((a, b) => b.price - a.price);
            } else if (currentSortOption === 'newest') {
                sortedProducts.sort((a, b) => b.id.localeCompare(a.id));
            } else if (currentSortOption === 'featured') {
                // No additional sort needed
            }

            renderProductGrid(sortedProducts); 
        } else if (viewId === "shopping_cart_view") {
            productsGridContainer.innerHTML = `<p class="col-span-full text-center p-8">Shopping Cart View (Details coming in Phase 2)</p>`;
        }
        else {
            productsGridContainer.innerHTML = `<p class="col-span-full text-center p-8">Content for <strong>${data?.title || viewId}</strong> coming soon!</p>`;
        }
    }

    renderFilterTags(); // Phase 2.5a: Initial render of filter tags
    updateViewToggleButtonsActiveState(); // Phase 2.6a: Initial set active button state
    
    // Add other listeners (view toggle, etc.) in later phases

    // Phase 2.4: Sort Select Listener
    if (sortSelectControl) {
        sortSelectControl.addEventListener('change', (e) => {
            currentSortOption = (e.target as HTMLSelectElement).value;
            navigateTo('browse_all_products', { title: pageTitleMain?.textContent || 'All Products' });
        });
    }

    // Phase 2.6a: View Toggle Button Listeners
    if (viewToggleControl) {
        const gridBtn = viewToggleControl.querySelector('[data-view="grid"]');
        const listBtn = viewToggleControl.querySelector('[data-view="list"]');

        if (gridBtn) {
            gridBtn.addEventListener('click', () => {
                if (currentDisplayMode === 'grid') return; // Do nothing if already active
                currentDisplayMode = 'grid';
                updateViewToggleButtonsActiveState();
                navigateTo('browse_all_products', { title: pageTitleMain?.textContent || 'All Products' });
            });
        }
        if (listBtn) {
            listBtn.addEventListener('click', () => {
                if (currentDisplayMode === 'list') return; // Do nothing if already active
                currentDisplayMode = 'list';
                updateViewToggleButtonsActiveState();
                navigateTo('browse_all_products', { title: pageTitleMain?.textContent || 'All Products' });
            });
        }
    }
    
    renderFilterTags(); // Phase 2.5a: Initial render of filter tags (SINGLE CALL HERE, AT THE END OF UI SETUP)
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

function removeFromCart(productId: string): void {
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function updateCartQuantity(productId: string, newQuantityString: string): void {
    const quantity = parseInt(newQuantityString, 10);
    const itemIndex = shoppingCart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        if (quantity > 0) {
            shoppingCart[itemIndex].quantity = quantity;
        } else {
            shoppingCart.splice(itemIndex, 1);
        }
    }
    updateCartDisplay();
}

function updateCartDisplay(): void {
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    if (shoppingCartCountTopbar) {
        shoppingCartCountTopbar.textContent = totalItems.toString();
        shoppingCartCountTopbar.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// Expose functions to be callable from onclick attributes in dynamically generated HTML
(window as any).addToCart = addToCart;
(window as any).removeFromCart = removeFromCart;
(window as any).updateCartQuantity = updateCartQuantity;

// --- New API Integration ---
export interface ApiProduct {
    id: string;
    name: string;
    description: string;
    image_url: string;
    price: number;
    tags: string[];
    category: string;
}

async function fetchAndSetProducts(): Promise<void> {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    try {
        const response = await fetch(`${apiBaseUrl}/api/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiProducts: ApiProduct[] = await response.json();

        // Transform API products to the main Product interface and store them
        allProducts = apiProducts.map(apiProduct => ({
            id: apiProduct.id,
            name: apiProduct.name,
            description: apiProduct.description,
            price: apiProduct.price,
            tags: apiProduct.tags,
            image: apiProduct.image_url,
            seller: 'Regru Market', 
            provenance: 'Local Sourced',
            category: apiProduct.category, // Use the category from the API
            animal: 'N/A',
            rating: (Math.random() * (5 - 3.5) + 3.5),
            reviewCount: Math.floor(Math.random() * 200),
        }));

        // Initial render after fetching
        navigateTo(currentView, { title: 'Fresh Farm Products' });

    } catch (error) {
        console.error("Failed to fetch or set products:", error);
        if (productsGridContainer) {
            productsGridContainer.innerHTML = '<p class="col-span-full text-center p-8 text-red-500">Could not load products from the server.</p>';
        }
    }
}


// --- Initialization (Phase 1 Refactor) ---
export async function initializeApp(): Promise<void> {
    try {
        console.log("Initializing application...");
        
        // --- Initial Data Fetch & Render ---
        renderSidebar(); // Initial render of the static sidebar structure
        await fetchAndSetProducts(); // Fetch data and then render products, filters, etc.

        // --- Event Listener Setup ---
        setupEventListeners();

        // Check wallet connection status on load
        // updateWalletUI(); // This function is now handled by walletService.ts

        console.log("Application initialized successfully.");
    } catch (error) {
        console.error("Error during application initialization:", error);
    }
}

function setupEventListeners() {
    console.log("Setting up event listeners...");

    const connectButton = document.getElementById('connect-wallet-button');
    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
    }

    // Sidebar Navigation
    sidebarNavContainer.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.matches('.nav-item')) {
            const navId = target.getAttribute('data-nav-id');
            if (navId) {
                const navItem = sidebarNavConfig.flatMap(s => s.items).find(i => i.id === navId);
                if (navItem) {
                    if (navItem.action) {
                        navItem.action();
                    } else {
                        navigateTo(navItem.id, { title: navItem.label });
                    }
                }
            }
        }
    });

    // Shopping Cart Button
    if (shoppingCartButtonTopbar) {
        shoppingCartButtonTopbar.addEventListener('click', () => {
            alert("Navigate to Shopping Cart page (to be implemented)");
        });
    }

    // Sort Select Listener
    if (sortSelectControl) {
        sortSelectControl.addEventListener('change', (e) => {
            currentSortOption = (e.target as HTMLSelectElement).value;
            // Re-render the current view with the new sort option
            navigateTo(currentView, {}); 
        });
    }

    // View Toggle Button Listeners
    if (viewToggleControl) {
        viewToggleControl.addEventListener('click', (e) => {
            const button = (e.target as HTMLElement).closest('.view-btn') as HTMLElement;
            if (button && button.dataset.view) {
                currentDisplayMode = button.dataset.view as 'grid' | 'list';
                updateViewToggleButtonsActiveState();
                const products = allProducts; // In a real app, this would be a more complex state lookup
                renderProductGrid(products);
            }
        });
    }

    // Wallet Modal Listeners
    // The event listeners are now handled within openWalletsModal and closeWalletsModal

    // --- Native Search Overlay Logic ---
    console.log("Attaching search listeners...");
    console.log({
        mobileSearchOpener,
        searchOverlay,
        searchCloser,
        searchInput,
        searchResults
    });
    if (mobileSearchOpener && searchOverlay && searchCloser && searchInput && searchResults) {
        const openSearch = () => {
            // Add animation properties before making it visible
            searchOverlay.style.transition = 'opacity 0.3s ease-in-out';
            searchOverlay.style.opacity = '0';
            
            // Force the overlay to be visible and full-screen, bypassing all CSS issues.
            searchOverlay.style.display = 'flex';
            searchOverlay.style.position = 'fixed';
            searchOverlay.style.top = '0px';
            searchOverlay.style.left = '0px';
            searchOverlay.style.width = '100%';
            searchOverlay.style.height = '100vh';
            searchOverlay.style.zIndex = '1000';

            // Center the content and control its width via JS
            searchOverlay.style.justifyContent = 'center';
            searchOverlay.style.alignItems = 'flex-start';

            // Apply styling via JS to bypass CSS conflicts
            // @ts-ignore - for vendor prefix
            searchOverlay.style.webkitBackdropFilter = 'blur(4px)'; // backdrop-blur-sm
            searchOverlay.style.backdropFilter = 'blur(4px)';

            // Find the inner container and set its max-width
            const innerContainer = searchOverlay.querySelector('.w-full.max-w-xl') as HTMLElement;
            if (innerContainer) {
                innerContainer.style.marginTop = '10vh'; // Position it from the top
            }

            // Trigger the fade-in after a tiny delay
            setTimeout(() => {
                searchOverlay.style.opacity = '1';
            }, 10);

            document.body.style.overflow = 'hidden';
            searchInput.focus();
        };

        const closeSearch = () => {
            searchOverlay.style.opacity = '0';
            setTimeout(() => {
                searchOverlay.style.display = 'none';
            }, 300); // Wait for transition to finish before hiding

            document.body.style.overflow = '';
            searchInput.value = '';
            searchResults.innerHTML = '';
        };

        mobileSearchOpener.addEventListener('click', openSearch);
        searchCloser.addEventListener('click', closeSearch);

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            if (!query) {
                searchResults.innerHTML = '';
                return;
            }

            if (allProducts) {
                const hits = allProducts
                    .filter((p: Product) => p.name.toLowerCase().includes(query))
                    .slice(0, 5);

                searchResults.innerHTML = hits.length
                    ? hits.map((p: Product) => `
                        <div class="flex items-center gap-4 p-4 rounded-lg hover:bg-white/10 cursor-pointer transition-colors" data-id="${p.id}" onclick="alert('Navigate to product ${p.id}')">
                            <img src="${p.image}" class="w-14 h-14 rounded-md object-cover flex-shrink-0">
                            <div>
                                <div class="font-semibold text-white">${p.name}</div>
                                <div class="text-sm text-white/70">${p.category}</div>
                            </div>
                        </div>
                    `).join('')
                    : '<p class="p-4 text-center text-white/70">No products found.</p>';
            }
        });
    }

    console.log("app.ts (Phase 1 UI Refactor) loaded and initializeApp queued for DOMContentLoaded.");
}

// Global Exports
export {
    navigateTo,
    // any other functions you might need globally
};