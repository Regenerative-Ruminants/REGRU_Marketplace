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
    // --- NEW PRODUCTS ADDED HERE ---
    { 
        id: 'prod_new_001', name: 'The Fauna', seller: 'Artisan Creations', provenance: 'Local Workshop', category: 'Crafts', animal: 'N/A', price: 75.00, 
        image: '/images/products/The-Fauna.png', 
        rating: 5, reviewCount: 15, 
        description: 'A beautifully handcrafted item, perfect for any collection.',
        tags: ['Handmade', 'Unique', 'Artisan'] 
    },
    { 
        id: 'prod_new_002', name: 'Beautiful Washed BFL Curls', seller: 'Woolly Wonders Farm', provenance: 'Countryside', category: 'Crafts', animal: 'Sheep', price: 25.50, 
        image: '/images/products/Big-bags-of-beautiful-washed-BFL-curls.png', 
        rating: 5, reviewCount: 32, 
        description: 'Premium, clean Bluefaced Leicester curls, ready for spinning or felting.',
        tags: ['BFL', 'Spinning', 'Felting', 'Natural Fiber'] 
    },
    { 
        id: 'prod_new_003', name: 'Whole Beef Shank', seller: 'Highland Heritage Farm', provenance: 'Scottish Highlands', category: 'Meat', animal: 'Cattle', price: 18.75, 
        image: '/images/products/Whole-beef-shank.png', 
        rating: 4, reviewCount: 41, 
        description: 'A hearty and flavorful cut, perfect for slow cooking, stews, or broth.',
        tags: ['Grass-fed', 'Slow-cook', 'Osso Buco'] 
    },
    { 
        id: 'prod_new_004', name: 'Raw Milk', seller: 'Cotswold Creamery', provenance: 'Gloucestershire', category: 'Dairy', animal: 'Cattle', price: 3.20, 
        image: '/images/products/Raw-Milk.png', 
        rating: 5, reviewCount: 98, 
        description: 'Fresh, unpasteurized raw milk from our grass-fed herd. Creamy and full of natural goodness.',
        tags: ['Raw', 'Unpasteurized', 'Grass-fed'] 
    },
    { 
        id: 'prod_new_005', name: 'Grass-Fed Chateaubriand Steak', seller: 'Highland Heritage Farm', provenance: 'Scottish Highlands', category: 'Meat', animal: 'Cattle', price: 45.00, 
        image: '/images/products/Grass-Fed-Beef-Chateaubriand-Sharing-Steak.png', 
        rating: 5, reviewCount: 62, 
        description: 'The most tender and luxurious cut of beef, perfect for a special occasion.',
        tags: ['Center-cut', 'Tenderloin', 'Sharing Steak'] 
    },
    { 
        id: 'prod_new_006', name: 'Raw Organic A2 Grass-Fed Milk', seller: 'Cotswold Creamery', provenance: 'Gloucestershire', category: 'Dairy', animal: 'Cattle', price: 4.50, 
        image: '/images/products/Raw-Organic-A2-Grass-Fed-milk.png', 
        rating: 5, reviewCount: 150, 
        description: 'Premium organic raw milk from A2 cows, easier to digest and exceptionally creamy.',
        tags: ['A2 Milk', 'Organic', 'Raw', 'Grass-fed'] 
    },
    { 
        id: 'prod_new_007', name: 'Stevie Bag in Black', seller: 'Artisan Creations', provenance: 'Local Workshop', category: 'Crafts', animal: 'N/A', price: 120.00, 
        image: '/images/products/Stevie-Bag-in-Black.png', 
        rating: 5, reviewCount: 8, 
        description: 'A stylish and durable handcrafted bag, perfect for everyday use.',
        tags: ['Handmade', 'Leather', 'Fashion'] 
    },
    { 
        id: 'prod_new_008', name: 'Jacob Felted Fleece', seller: 'Woolly Wonders Farm', provenance: 'Countryside', category: 'Crafts', animal: 'Sheep', price: 35.00, 
        image: '/images/products/Jacob-Felted-Fleece.png', 
        rating: 5, reviewCount: 25, 
        description: 'A beautiful and unique felted fleece from Jacob sheep, ideal for rugs or wall hangings.',
        tags: ['Felted Fleece', 'Jacob Sheep', 'Natural', 'Crafting'] 
    },
    // --- EXISTING DUMMY PRODUCTS ---
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
        const response = await fetch('/api/wallets'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        walletModalResults.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error("Error fetching wallets:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        walletModalResults.textContent = `Error fetching wallets: ${errorMessage}`;
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
 * Renders search results inside the search overlay.
 * @param results - An array of products to display.
 */
function renderSearchResults(results: Product[]): void {
    if (!searchResults) return;

    searchResults.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        searchResults.innerHTML = `<p class="p-4 text-center text-white/70">No products found.</p>`;
        return;
    }

    results.forEach(product => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'p-4 rounded-md cursor-pointer hover:bg-white/10 transition-colors duration-200';
        resultDiv.innerHTML = `
            <p class="text-xl text-white text-shadow-strong">${product.name}</p>
            <p class="text-base text-white/70 text-shadow-strong">in ${product.category}</p>
        `;
        // Optional: Add a click listener to navigate to the product
        // resultDiv.addEventListener('click', () => { /* navigate to product detail */ });
        searchResults.appendChild(resultDiv);
    });
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
            renderSearchResults(sampleProducts); // Show all products initially
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
                renderSearchResults(sampleProducts);
                return;
            }
            const filteredProducts = sampleProducts.filter(product => 
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

    const categories = [...new Set(sampleProducts.map(p => p.category))].sort();
    
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
            let productsToDisplay = sampleProducts;

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
    renderFilterTags(); // Initial render for default view
    updateViewToggleButtonsActiveState();

    // Set initial view based on default in config
    const defaultNavItem = sidebarNavConfig.flatMap(s => s.items).find(i => i.isDefault);
    if (defaultNavItem) {
        navigateTo(defaultNavItem.id, { title: defaultNavItem.label });
    }

    // --- Event Listeners ---
    if (shoppingCartButtonTopbar) {
        shoppingCartButtonTopbar.addEventListener('click', () => {
            alert("Navigate to Shopping Cart page (to be implemented)");
        });
    }

    if (sortSelectControl) {
        sortSelectControl.addEventListener('change', (e) => {
            currentSortOption = (e.target as HTMLSelectElement).value;
            // Re-render the current view with the new sort option
            navigateTo(currentView, {}); 
        });
    }

    if (viewToggleControl) {
        viewToggleControl.addEventListener('click', (e) => {
            const button = (e.target as HTMLElement).closest('.view-btn') as HTMLElement;
            if (button && button.dataset.view) {
                currentDisplayMode = button.dataset.view as 'grid' | 'list';
                updateViewToggleButtonsActiveState();
                const products = sampleProducts; // In a real app, this would be a more complex state lookup
                renderProductGrid(products);
            }
        });
    }

    // Wallet Modal Listeners
    if (closeWalletModalButton) {
        closeWalletModalButton.addEventListener('click', closeWalletsModal);
    }
    
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

            if ((window as any).sampleProducts) {
                const hits = (window as any).sampleProducts
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
(window as any).navigateTo = navigateTo;
(window as any).updateCartDisplay = updateCartDisplay;
(window as any).sampleProducts = sampleProducts; // For console debugging/other scripts
(window as any).shoppingCart = shoppingCart;
(window as any).activeFilters = activeFilters;
(window as any).renderFilterTags = renderFilterTags;

// Run the app once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp); 