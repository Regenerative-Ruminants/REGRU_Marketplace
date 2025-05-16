<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgriDash - Farm Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide-react@0.378.0/dist/umd/lucide-react.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        // New Brand Colors
                        'brand-primary': '#0d324a',        // Dark Blue
                        'brand-primary-dark': '#072133',   // Darker Blue for hover
                        'brand-accent': '#fff1ce',         // Light Cream/Yellow
                        'brand-card': '#ffffff',           // White
                        'brand-text-primary': '#2c3e50',   // Darker text for readability
                        'brand-text-secondary': '#55606a', // Lighter text
                        'brand-success': '#28a745',        // A pleasant green for success/added state

                        // Original colors (can be phased out or used for specific elements if needed)
                        'farm-secondary': '#FFC107', // Could be a highlight color
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                }
            }
        }
    </script>
    <style>
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        .lucide { width: 1em; height: 1em; display: inline-block; vertical-align: middle; }
        
        body { 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
            font-family: 'Inter', sans-serif; 
            background-color: tailwind.theme.colors['brand-accent'];
            color: tailwind.theme.colors['brand-text-primary'];
        }
        .content-wrapper { flex-grow: 1; }
        .cart-item-count-badge {
            position: absolute;
            top: -8px;
            right: -10px;
            background-color: #E74C3C; 
            color: white;
            border-radius: 50%;
            padding: 0.1em 0.4em;
            font-size: 0.75rem;
            font-weight: bold;
            line-height: 1;
            display: inline-flex; 
            align-items: center;
            justify-content: center;
        }
        .add-to-cart-btn {
            transition: background-color 0.2s ease-out, color 0.2s ease-out, opacity 0.2s ease-out;
        }
        /* Styling for vendor sections in marketplace */
        .vendor-product-group {
            background-color: tailwind.theme.colors['brand-card'];
            border-radius: 0.75rem; /* 12px */
            padding: 0; /* Padding will be handled by header and content area */
            margin-bottom: 1.5rem; /* 24px */
            box-shadow: 0 4px 12px -1px rgba(0, 0, 0, 0.07), 0 2px 8px -1px rgba(0, 0, 0, 0.04); /* Softer shadow */
            overflow: hidden; /* To ensure child padding doesn't break rounded corners */
        }
        .vendor-header {
            display: flex;
            align-items: center;
            padding: 1rem 1.5rem; /* 16px 24px */
            /* Subtle background for vendor header */
            background-color: hsla(var(--primary-color-hsl), 0.05); /* Using brand-primary with low opacity */
            background-color: rgba(13, 50, 74, 0.03); /* Fallback for #0d324a with 3% opacity */
            border-bottom: 1px solid #e5e7eb; 
        }
        .vendor-header .emoji {
            font-size: 1.85rem; /* Slightly larger emoji */
            margin-right: 0.85rem; /* 14px */
        }
        .vendor-header .name {
            font-size: 1.30rem; /* 21px - slightly larger */
            font-weight: 600; 
            color: tailwind.theme.colors['brand-primary'];
        }
        .vendor-product-list {
            padding: 0.5rem 1.5rem 1.5rem 1.5rem; /* Top, LR, Bottom */
        }
        .product-line-item {
             border-bottom: 1px solid #f0f2f5; /* Even lighter border for items */
             padding-top: 1rem; /* More vertical padding */
             padding-bottom: 1rem;
             transition: background-color 0.15s ease-in-out;
        }
        .product-line-item:hover {
            background-color: #f9fafb; /* Very light gray hover */
        }
        .product-line-item:last-child {
            border-bottom: none;
            padding-bottom: 0.5rem; /* Adjust last item padding if needed */
        }
        .product-line-item .lucide-plus { /* Specific styling for plus icon in button */
            width: 1.1em;
            height: 1.1em;
        }
    </style>
</head>
<body class="text-brand-text-primary">

    <header class="bg-brand-primary text-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <svg class="lucide lucide-tractor h-8 w-8 mr-2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M3 4h18M4 4v10h2M6 14L4 18M4 10h10M14 10l2-6h4l2 6M14 10v4h2m4 0v-4h-2m-2 4l-2 4m-2-4l2 4m-4-4H6m0 0l-2 4M12 2v2M12 18v2"/></svg>
                    <h1 class="text-2xl font-bold">AgriDash</h1>
                </div>
                <div class="flex items-center">
                    <nav class="hidden md:flex space-x-1">
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-primary-dark hover:bg-opacity-75">Dashboard</a>
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-primary-dark hover:bg-opacity-75">Fields</a>
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-primary-dark hover:bg-opacity-75">Livestock</a>
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-primary-dark hover:bg-opacity-75">Equipment</a>
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-primary-dark hover:bg-opacity-75">Tasks</a>
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-primary-dark hover:bg-opacity-75">Market</a>
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-primary-dark hover:bg-opacity-75">Settings</a>
                    </nav>
                    <a href="cart.html" class="ml-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-primary-dark hover:bg-opacity-75 relative">
                        <svg class="lucide lucide-shopping-cart h-5 w-5 inline-block" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16"/></svg>
                        <span id="cart-item-count-badge" class="cart-item-count-badge" style="display: none;">0</span>
                    </a>
                    <div class="md:hidden ml-2">
                        <button id="mobile-menu-button" class="text-white hover:text-gray-200 focus:outline-none">
                            <svg class="lucide lucide-menu h-6 w-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="mobile-menu" class="md:hidden hidden bg-brand-primary-dark">
            <a href="#" class="block px-3 py-2 text-base font-medium text-white hover:bg-opacity-75">Dashboard</a>
            <a href="cart.html" class="block px-3 py-2 text-base font-medium text-white hover:bg-opacity-75">Cart (<span id="mobile-cart-item-count">0</span>)</a>
            <a href="#" class="block px-3 py-2 text-base font-medium text-white hover:bg-opacity-75">Settings</a>
        </div>
    </header>

    <div class="content-wrapper container mx-auto p-4 sm:p-6 lg:p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            <div class="md:col-span-2 lg:col-span-3 xl:col-span-4 bg-brand-card p-6 rounded-xl shadow-lg">
                <h2 class="text-2xl font-semibold text-brand-primary">Welcome back, Farmer John!</h2>
                <p class="text-brand-text-secondary" id="current-date">Loading date...</p>
            </div>

            <div class="bg-brand-card p-6 rounded-xl shadow-lg">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold text-brand-text-primary">Weather Forecast</h3>
                    <svg class="lucide lucide-cloud-sun h-8 w-8 text-farm-secondary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><path d="M16 20a4 4 0 0 0-8 0"/><path d="M12 12h.01"/></svg>
                </div>
                <div class="text-center mb-4">
                    <p class="text-4xl font-bold text-brand-text-primary">18°C</p>
                    <p class="text-brand-text-secondary">Partly Cloudy</p>
                    <p class="text-sm text-brand-text-secondary">Feels like 17°C | Humidity: 65%</p>
                </div>
                <div class="space-y-2 text-brand-text-secondary">
                    <p class="text-sm font-medium ">Next 3 Days:</p>
                    <div class="flex justify-between items-center text-sm"><span>Sat: 20°C</span> <svg class="lucide lucide-sun h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></div>
                    <div class="flex justify-between items-center text-sm"><span>Sun: 22°C</span> <svg class="lucide lucide-cloud-drizzle h-5 w-5 text-blue-400" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M12 21v1"/><path d="M16 19v1"/></svg></div>
                </div>
            </div>

            <div class="bg-brand-card p-6 rounded-xl shadow-lg lg:col-span-2">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold text-brand-text-primary">Field Overview</h3>
                    <svg class="lucide lucide-map-pinned h-8 w-8 text-brand-primary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/><path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6a1 1 0 0 0 .9 1.3h18a1 1 0 0 0 .9-1.3l-2-6a1 1 0 0 0-.9-.7h-3.835"/></svg>
                </div>
                <div class="space-y-4">
                    <div class="border border-gray-200 p-3 rounded-lg hover:shadow-sm transition-shadow">
                        <h4 class="font-semibold text-brand-primary">North Field (Corn)</h4>
                        <p class="text-sm text-brand-text-secondary">Status: Vegetative | Soil Moisture: Good</p>
                    </div>
                    <div class="border border-gray-200 p-3 rounded-lg hover:shadow-sm transition-shadow">
                         <h4 class="font-semibold text-brand-primary">South Field (Soybeans)</h4>
                         <p class="text-sm text-brand-text-secondary">Status: Flowering | Soil Moisture: Low - Needs Irrigation</p>
                    </div>
                </div>
            </div>

            <div class="bg-brand-card p-6 rounded-xl shadow-lg">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold text-brand-text-primary">Quick Tasks</h3>
                    <svg class="lucide lucide-list-checks h-8 w-8 text-brand-primary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
                </div>
                <div class="space-y-3">
                    <div class="flex items-center"><input type="checkbox" id="task1_restored" class="h-4 w-4 text-brand-primary rounded focus:ring-brand-primary focus:ring-offset-1"><label for="task1_restored" class="ml-2 text-sm text-brand-text-secondary">Scout North Field</label></div>
                    <div class="flex items-center"><input type="checkbox" id="task2_restored" class="h-4 w-4 text-brand-primary rounded focus:ring-brand-primary focus:ring-offset-1" checked><label for="task2_restored" class="ml-2 text-sm text-brand-text-secondary line-through">Order seeds</label></div>
                </div>
                 <button class="mt-4 w-full bg-brand-primary hover:bg-brand-primary-dark text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center">
                    <svg class="lucide lucide-plus-circle h-4 w-4 mr-2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                    Add Task
                </button>
            </div>
        </div>

        <div class="mt-8 md:col-span-2 lg:col-span-3 xl:col-span-4">
            <div class="flex items-center justify-between mb-6 px-1">
                <h2 class="text-2xl font-semibold text-brand-primary">Marketplace Products</h2>
                <svg class="lucide lucide-store h-8 w-8 text-brand-primary" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7L12 17 2 7"/></svg>
            </div>
            <div id="marketplace-vendor-groups-container">
                {/* Vendor groups will be injected here by JavaScript */}
            </div>
        </div>
    </div>

    <footer class="bg-brand-primary-dark text-white text-center p-4 mt-auto">
        <p class="text-sm">&copy; <span id="current-year">2025</span> AgriDash. All rights reserved. Greenville, WI.</p>
    </footer>

    <script>
        // --- START: DATA ---
        const allProducts = [
            { id: 'eggs001', name: 'Farm Fresh Eggs (Dozen)', price: 4.00, vendorId: 'dairyBest', imageUrl: 'https://placehold.co/200x200/A9D18E/333333?text=Eggs', productType: 'perishable', description: 'Free-range, organic eggs from happy chickens.' },
            { id: 'milk001', name: 'Fresh Gallon Milk', price: 5.00, vendorId: 'dairyBest', imageUrl: 'https://placehold.co/200x200/A9D18E/333333?text=Milk', productType: 'perishable', description: 'Organic whole milk, pasteurized, rich and creamy.' },
            { id: 'cheese001', name: 'Artisan Cheddar Block', price: 12.00, vendorId: 'dairyBest', imageUrl: 'https://placehold.co/200x200/A9D18E/333333?text=Cheese', productType: 'perishable', description: 'Aged 12 months, sharp, crumbly, and delicious.' },
            { id: 'leather001', name: 'Tanned Cow Hide', price: 150.00, vendorId: 'homesteadLeathers', imageUrl: 'https://placehold.co/200x200/D2B48C/333333?text=Leather', productType: 'durable_good', description: 'Vegetable-tanned full-grain leather hide for crafting.' },
            { id: 'belt001', name: 'Handmade Leather Belt', price: 45.00, vendorId: 'homesteadLeathers', imageUrl: 'https://placehold.co/200x200/D2B48C/333333?text=Belt', productType: 'durable_good', description: 'Custom-fit, choice of buckle, built to last.' },
            { id: 'heifer001', name: 'Live Angus Heifer', price: 1200.00, vendorId: 'greenPastures', imageUrl: 'https://placehold.co/200x200/8FBC8F/333333?text=Cow', productType: 'livestock', description: '15-month old, grass-fed, excellent genetics.' }
        ];

        const vendorDetails = {
            'dairyBest': { name: 'Dairy Best Farms', emoji: '🥛' },
            'homesteadLeathers': { name: 'Homestead Leathers Co.', emoji: '👜' },
            'greenPastures': { name: 'Green Pastures Ranch', emoji: '🐄' }
        };
        // --- END: DATA ---

        // --- START: CART LOGIC ---
        const CART_STORAGE_KEY = 'agriDashCart';

        function getCart() {
            const cartJson = localStorage.getItem(CART_STORAGE_KEY);
            return cartJson ? JSON.parse(cartJson) : [];
        }

        function saveCart(cart) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        }

        function addToCart(productId, quantity = 1) {
            let cart = getCart();
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            const product = allProducts.find(p => p.id === productId);

            if (!product) {
                console.error("Product not found:", productId);
                return;
            }

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push({ 
                    id: productId, 
                    name: product.name, 
                    price: product.price, 
                    vendorId: product.vendorId, 
                    imageUrl: product.imageUrl, 
                    productType: product.productType,
                    quantity: quantity 
                });
            }
            saveCart(cart);
            updateCartIconCount();
            
            const addButton = document.querySelector(`button[data-product-id="${productId}"]`);
            if (addButton) {
                const originalHTML = addButton.innerHTML;
                addButton.innerHTML = `Added <svg class="lucide lucide-check h-4 w-4 inline" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>`;
                addButton.classList.remove('bg-brand-primary', 'hover:bg-brand-primary-dark');
                addButton.classList.add('bg-brand-success', 'text-white', 'cursor-not-allowed', 'opacity-75');
                addButton.disabled = true; 

                setTimeout(() => {
                    addButton.innerHTML = originalHTML;
                    addButton.classList.add('bg-brand-primary', 'hover:bg-brand-primary-dark');
                    addButton.classList.remove('bg-brand-success', 'text-white', 'cursor-not-allowed', 'opacity-75');
                    addButton.disabled = false;
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }, 2000);
            }
        }

        function getCartItemCount() {
            const cart = getCart();
            return cart.reduce((total, item) => total + item.quantity, 0);
        }

        function updateCartIconCount() {
            const count = getCartItemCount();
            const badge = document.getElementById('cart-item-count-badge');
            const mobileBadge = document.getElementById('mobile-cart-item-count');
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'inline-flex' : 'none';
            }
            if (mobileBadge) mobileBadge.textContent = count;
        }
        // --- END: CART LOGIC ---

        // Page specific JS
        document.addEventListener('DOMContentLoaded', () => {
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenuButton && mobileMenu) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileMenu.classList.toggle('hidden');
                });
            }

            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const currentDateEl = document.getElementById('current-date');
            if(currentDateEl) currentDateEl.textContent = new Date().toLocaleDateString('en-US', dateOptions);
            
            const currentYearEl = document.getElementById('current-year');
            if(currentYearEl) currentYearEl.textContent = new Date().getFullYear();

            const vendorGroupsContainer = document.getElementById('marketplace-vendor-groups-container');
            if (vendorGroupsContainer) {
                vendorGroupsContainer.innerHTML = ''; 

                const productsByVendor = allProducts.reduce((acc, product) => {
                    (acc[product.vendorId] = acc[product.vendorId] || []).push(product);
                    return acc;
                }, {});

                for (const vendorId in productsByVendor) {
                    const vendorInfo = vendorDetails[vendorId] || { name: 'Unknown Vendor', emoji: '🛍️' };
                    const products = productsByVendor[vendorId];

                    const vendorGroupDiv = document.createElement('div');
                    vendorGroupDiv.className = 'vendor-product-group'; 

                    const vendorHeaderDiv = document.createElement('div');
                    vendorHeaderDiv.className = 'vendor-header';
                    vendorHeaderDiv.innerHTML = `
                        <span class="emoji" aria-label="Vendor: ${vendorInfo.name}">${vendorInfo.emoji}</span>
                        <h3 class="name">${vendorInfo.name}</h3>
                    `;
                    vendorGroupDiv.appendChild(vendorHeaderDiv);

                    const productListDiv = document.createElement('div');
                    // Added class for specific padding for the list content
                    productListDiv.className = 'vendor-product-list'; 

                    products.forEach(product => {
                        const productLine = document.createElement('div');
                        productLine.className = 'product-line-item flex items-center'; 
                        
                        productLine.innerHTML = `
                            <div class="flex-grow min-w-0 mr-3"> {/* Added margin to separate from price */}
                                <h4 class="text-sm sm:text-base font-semibold text-brand-text-primary truncate" title="${product.name}">${product.name}</h4>
                                <p class="text-xs text-brand-text-secondary truncate" title="${product.description}">${product.description.substring(0,50)}...</p> {/* Slightly longer truncation */}
                            </div>
                            <p class="text-sm sm:text-base font-semibold text-brand-primary mx-2 sm:mx-3 w-20 text-right flex-shrink-0">$${product.price.toFixed(2)}</p> {/* Added flex-shrink-0 */}
                            <button data-product-id="${product.id}" class="add-to-cart-btn bg-brand-primary hover:bg-brand-primary-dark text-white py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center whitespace-nowrap flex-shrink-0"> {/* Added flex-shrink-0 */}
                                <svg class="lucide lucide-plus h-4 w-4 mr-1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" y2="19"></line><line x1="5" y1="12" y2="19"></line></svg>
                                Add
                            </button>
                        `;
                        productListDiv.appendChild(productLine);
                    });
                    vendorGroupDiv.appendChild(productListDiv);
                    vendorGroupsContainer.appendChild(vendorGroupDiv);
                }

                document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const productId = button.dataset.productId;
                        addToCart(productId);
                    });
                });
            }
            
            updateCartIconCount(); 

            if (typeof lucide !== 'undefined') {
                lucide.createIcons(); 
            } else {
                console.warn("Lucide library not loaded. Icons will not be rendered.");
            }
        });
    </script>
</body>
</html>
