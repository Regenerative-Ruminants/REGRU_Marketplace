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

interface SecondPanelItem {
    id: string;
    label: string;
    iconClass?: string;
}

interface SecondPanelGroup {
    groupLabel?: string;
    items: SecondPanelItem[];
}

interface PlatformItem {
    label: string;
    iconClass: string;
    searchPlaceholder?: string;
    secondPanelContent?: SecondPanelGroup[];
    isBottomIcon?: boolean;
}

interface PlatformData {
    [key: string]: PlatformItem;
}

interface ContentEntry {
    title: string;
    htmlFactory?: () => string;
    html?: string;
}

interface ContentData {
    [key: string]: ContentEntry;
}

interface InfoPanelData {
    [key: string]: string;
}

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


// --- Shopping Cart ---
let shoppingCart: ShoppingCartItem[] = [];

// --- Platform UI Data ---
const platformData: PlatformData = {
    marketplace: {
        label: "Marketplace",
        iconClass: "fas fa-store",
        searchPlaceholder: "Search Marketplace...",
        secondPanelContent: [
            { groupLabel: "Browse", items: [
                { id: "browse_all_products", label: "All Products", iconClass: "fas fa-th-large" },
                { id: "browse_by_category", label: "By Category", iconClass: "fas fa-tags" },
                { id: "browse_by_seller", label: "By Seller", iconClass: "fas fa-store-alt" },
                { id: "browse_by_provenance", label: "By Provenance", iconClass: "fas fa-leaf" }
            ]},
            { groupLabel: "My Buying", items: [
                { id: "my_purchases", label: "My Purchases", iconClass: "fas fa-receipt" },
                { id: "my_favourites", label: "Favourites", iconClass: "fas fa-heart" }
            ]},
            { groupLabel: "My Selling", items: [
                { id: "selling_products", label: "Products", iconClass: "fas fa-box-open" },
                { id: "selling_orders", label: "Orders", iconClass: "fas fa-dolly" },
                { id: "selling_analytics", label: "Analytics", iconClass: "fas fa-chart-line" },
                { id: "selling_finance", label: "Finance", iconClass: "fas fa-file-invoice-dollar" }
            ]}
        ]
    },
    notifications: {
        label: "Notifications",
        iconClass: "fas fa-bell",
        searchPlaceholder: "Search Notifications",
        secondPanelContent: [
            { items: [
                { id: "all_notifications", label: "All", iconClass: "fas fa-list-ul" },
                { id: "unread_notifications", label: "Unread", iconClass: "fas fa-envelope-open-text" },
                { id: "priority_notifications", label: "Priority", iconClass: "fas fa-exclamation-circle" },
                { id: "my_buying_notifications", label: "My Buying", iconClass: "fas fa-shopping-bag" },
                { id: "my_selling_notifications", label: "My Selling", iconClass: "fas fa-cash-register" },
                { id: "favourites_notifications", label: "Favourites", iconClass: "fas fa-heart-circle-check" },
            ]}
        ]
    },
    messages: {
        label: "Messages",
        iconClass: "fas fa-comments",
        searchPlaceholder: "Search Messages",
        secondPanelContent: [
            { items: [
                { id: "all_messages", label: "All Chats", iconClass: "fas fa-comment-dots" },
                { id: "unread_messages", label: "Unread", iconClass: "fas fa-inbox" },
                { id: "buyer_messages", label: "From Buyers", iconClass: "fas fa-user-friends" },
                { id: "from_seller_messages", label: "From Sellers", iconClass: "fas fa-store-alt" }
            ]}
        ]
    },
    profile: {
        label: "Profile",
        iconClass: "fas fa-user-circle",
        isBottomIcon: true,
        searchPlaceholder: "Search Profile Options",
         secondPanelContent: [
            { items: [
                { id: "view_profile", label: "View My Profile", iconClass: "fas fa-id-card" },
                { id: "edit_profile", label: "Edit Profile", iconClass: "fas fa-user-edit" },
                { id: "activity_log_profile", label: "Activity Log", iconClass: "fas fa-list-alt" },
                { id: "account_settings", label: "Account Settings", iconClass: "fas fa-cog" },
                { id: "my_store_settings", label: "My Store (Seller)", iconClass: "fas fa-store-cog" },
                { id: "switch_community", label: "Switch to COMMUNITY", iconClass: "fas fa-users" },
                { id: "switch_management", label: "Switch to MANAGEMENT", iconClass: "fas fa-briefcase" },
                { id: "sign_out", label: "Sign Out", iconClass: "fas fa-sign-out-alt" }
            ]}
        ]
    },
    help: {
        label: "Help",
        iconClass: "fas fa-question-circle",
        isBottomIcon: true,
        searchPlaceholder: "Search Help Articles",
        secondPanelContent: [
            { items: [
                { id: "knowledge_library", label: "Knowledge Library", iconClass: "fas fa-book-open" },
                { id: "report_problem", label: "Report a Problem", iconClass: "fas fa-bug" },
                { id: "talk_to_team", label: "Talk to Our Team", iconClass: "fas fa-headset" }
            ]}
        ]
    }
};

// --- Content Area Data ---
const contentData: ContentData = {
    browse_all_products: {
        title: "All Products",
        htmlFactory: () => `
            <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 class='font-oswald text-2xl text-main'>Browse All Products</h2>
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <input type="search" placeholder="Search products..." class="p-2 border border-border rounded-lg text-sm flex-grow sm:flex-grow-0 sm:w-48">
                    <select class="p-2 border border-border rounded-lg text-sm">
                        <option>Sort by: Relevance</option>
                        <option>Sort by: Popularity</option>
                        <option>Sort by: Price Low to High</option>
                        <option>Sort by: Price High to Low</option>
                    </select>
                    <button class="p-2 border border-border rounded-lg text-sm hover:bg-gray-200">
                        <i class="fas fa-filter mr-1"></i> Filters
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${sampleProducts.map(p => `
                    <div class="product-card bg-tertiary shadow-md rounded-lg overflow-hidden">
                        <div class="relative">
                            <img src="${p.image}" alt="${p.name}" class="w-full h-48 object-cover">
                            <button class="absolute top-2 right-2 bg-tertiary p-1.5 rounded-full shadow hover:bg-gray-200 transition-colors" onclick="alert('Toggle favourite for ${p.id}')">
                                <i class="far fa-heart text-gray-700"></i>
                            </button>
                        </div>
                        <div class="product-card-content">
                            <h3 class="text-lg font-semibold text-main mb-1 truncate" title="${p.name}">${p.name}</h3>
                            <p class="text-sm text-gray-600 mb-1">${p.seller}</p>
                            <p class="text-xs text-gray-500 mb-2">Provenance: ${p.provenance}</p>
                            <div class="product-card-tags">
                                ${p.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                            <div class="flex items-center mb-2 text-xs">
                                ${[...Array(5)].map((_, i) => `<i class="fas fa-star ${i < p.rating ? 'text-warning' : 'text-gray-300'}"></i>`).join('')}
                                <span class="text-gray-500 ml-1">(${p.reviewCount})</span>
                            </div>
                            <p class="text-xl font-bold text-main mb-3 mt-auto">£${p.price.toFixed(2)}</p>
                            <button class="w-full bg-accent text-text-on-accent py-2 px-4 rounded-lg hover:brightness-90 transition-all text-sm" onclick="window.addToCart('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.image}')">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-8 flex justify-center">
                <nav aria-label="Page navigation">
                  <ul class="inline-flex items-center -space-x-px">
                    <li><a href="#" class="py-2 px-3 ml-0 leading-tight text-gray-500 bg-tertiary rounded-l-lg border border-border hover:bg-gray-200 hover:text-gray-700">Previous</a></li>
                    <li><a href="#" class="py-2 px-3 leading-tight text-gray-500 bg-tertiary border border-border hover:bg-gray-200 hover:text-gray-700">1</a></li>
                    <li><a href="#" aria-current="page" class="z-10 py-2 px-3 leading-tight text-main bg-main/10 border-main hover:bg-main/20">2</a></li>
                    <li><a href="#" class="py-2 px-3 leading-tight text-gray-500 bg-tertiary border border-border hover:bg-gray-200 hover:text-gray-700">3</a></li>
                    <li><a href="#" class="py-2 px-3 leading-tight text-gray-500 bg-tertiary rounded-r-lg border border-border hover:bg-gray-200 hover:text-gray-700">Next</a></li>
                  </ul>
                </nav>
            </div>
        `
    },
    browse_by_category: { title: "By Category", htmlFactory: () => {
        const categories = [...new Set(sampleProducts.map(p => p.category))];
        let html = `
            <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 class='font-oswald text-2xl text-main'>Browse by Category</h2>
                <div class="flex space-x-2">
                    <input type="search" placeholder="Search categories..." class="p-2 border border-border rounded-lg text-sm">
                    <button class="p-2 border border-border rounded-lg text-sm hover:bg-gray-200"><i class="fas fa-filter mr-1"></i> Filters</button>
                </div>
            </div>`;
        categories.forEach(category => {
            html += `
            <h3 class="font-oswald text-xl text-main mt-6 mb-3 border-b border-border pb-1">${category}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">`;
            sampleProducts.filter(p => p.category === category).slice(0,4).forEach(p => {
                 html += `
                    <div class="product-card bg-tertiary shadow-md rounded-lg overflow-hidden">
                        <img src="${p.image}" alt="${p.name}" class="w-full h-48 object-cover">
                        <div class="product-card-content">
                             <h4 class="text-md font-semibold text-main mb-1 truncate" title="${p.name}">${p.name}</h4>
                             <p class="text-xs text-gray-500 mb-2">Seller: ${p.seller}</p>
                             <p class="text-lg font-bold text-main mt-auto">£${p.price.toFixed(2)}</p>
                             <button class="w-full bg-accent text-text-on-accent py-1.5 px-3 rounded-lg hover:brightness-90 text-xs mt-2 transition-all" onclick="window.addToCart('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.image}')">Add to Cart</button>
                        </div>
                    </div>`;
            });
            html += `</div>`;
        });
        return html;
    }},
    browse_by_seller: { title: "By Seller", htmlFactory: () => {
        const sellers = [...new Set(sampleProducts.map(p => p.seller))];
        let html = `
            <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 class='font-oswald text-2xl text-main'>Browse by Seller</h2>
                <div class="flex space-x-2">
                    <input type="search" placeholder="Search sellers..." class="p-2 border border-border rounded-lg text-sm">
                    <button class="p-2 border border-border rounded-lg text-sm hover:bg-gray-200"><i class="fas fa-filter mr-1"></i> Filters</button>
                </div>
            </div>`;
        sellers.forEach(seller => {
            html += `
            <h3 class="font-oswald text-xl text-main mt-6 mb-3 border-b border-border pb-1">${seller}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">`;
            sampleProducts.filter(p => p.seller === seller).slice(0,4).forEach(p => {
                 html += `
                    <div class="product-card bg-tertiary shadow-md rounded-lg overflow-hidden">
                        <img src="${p.image}" alt="${p.name}" class="w-full h-48 object-cover">
                        <div class="product-card-content">
                             <h4 class="text-md font-semibold text-main mb-1 truncate" title="${p.name}">${p.name}</h4>
                             <p class="text-xs text-gray-500 mb-2">Category: ${p.category}</p>
                             <p class="text-lg font-bold text-main mt-auto">£${p.price.toFixed(2)}</p>
                             <button class="w-full bg-accent text-text-on-accent py-1.5 px-3 rounded-lg hover:brightness-90 text-xs mt-2 transition-all" onclick="window.addToCart('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.image}')">Add to Cart</button>
                        </div>
                    </div>`;
            });
            html += `</div>`;
        });
        return html;
    }},
    browse_by_provenance: { title: "By Provenance", htmlFactory: () => {
        const provenances = [...new Set(sampleProducts.map(p => p.provenance))];
        let html = `
            <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 class='font-oswald text-2xl text-main'>Browse by Provenance</h2>
                <div class="flex space-x-2">
                    <input type="search" placeholder="Search provenance..." class="p-2 border border-border rounded-lg text-sm">
                    <button class="p-2 border border-border rounded-lg text-sm hover:bg-gray-200"><i class="fas fa-filter mr-1"></i> Filters</button>
                </div>
            </div>`;
        provenances.forEach(provenance => {
            html += `
            <h3 class="font-oswald text-xl text-main mt-6 mb-3 border-b border-border pb-1">${provenance}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">`;
            sampleProducts.filter(p => p.provenance === provenance).slice(0,4).forEach(p => {
                 html += `
                    <div class="product-card bg-tertiary shadow-md rounded-lg overflow-hidden">
                        <img src="${p.image}" alt="${p.name}" class="w-full h-48 object-cover">
                        <div class="product-card-content">
                             <h4 class="text-md font-semibold text-main mb-1 truncate" title="${p.name}">${p.name}</h4>
                             <p class="text-xs text-gray-500 mb-2">Seller: ${p.seller}</p>
                             <p class="text-lg font-bold text-main mt-auto">£${p.price.toFixed(2)}</p>
                             <button class="w-full bg-accent text-text-on-accent py-1.5 px-3 rounded-lg hover:brightness-90 text-xs mt-2 transition-all" onclick="window.addToCart('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.image}')">Add to Cart</button>
                        </div>
                    </div>`;
            });
            html += `</div>`;
        });
        return html;
    }},
    // My Buying Content
    my_purchases: { title: "My Purchases", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Your Purchase History</h2><p class='text-text'>This is where you can view all your past orders, track their shipping status, and manage returns or issues. Example: Order #12345 - Organic Apples - Shipped. Order #12300 - Wool Yarn - Delivered.</p>" },
    my_favourites: { title: "My Favourites", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Your Favourite Items</h2><p class='text-text'>All the products you've marked as favourites will appear here for easy access. Example: Organic Beef Sirloin Steak, Hand-Knitted Wool Scarf.</p>" },
    // My Selling Content
    selling_products: { title: "Manage Products", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Your Product Listings</h2><p class='text-text'>If you are a seller, this section allows you to add new products, edit existing listings (e.g., price, description, images), manage stock levels, and view product performance. Example: Add New Product button, list of current products with edit/delete options.</p>" },
    selling_orders: { title: "Manage Orders", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Customer Orders</h2><p class='text-text'>Sellers can view and manage all incoming orders here. This includes updating order status (e.g., processing, shipped), printing invoices, and communicating with buyers regarding their orders. Example: Order #56789 - Pending Shipment, Order #56780 - Processing.</p>" },
    selling_analytics: { title: "Sales Analytics", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Your Sales Performance</h2><p class='text-text'>Track your sales trends, top-selling products, revenue, and customer engagement metrics. Visual charts and reports would be displayed here to help you understand your business performance. Example: Graph showing monthly sales, list of most viewed products.</p>" },
    selling_finance: { title: "Financial Overview", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Your Finances</h2><p class='text-text'>Manage your earnings, view payout history, download financial statements, and manage your bank details for payouts. Example: Current Balance: £XXX.XX, Next Payout Date: DD/MM/YYYY.</p>" },

    all_notifications: {
        title: "All Notifications",
        html: `
            <div class="flex flex-col h-full">
                <div class="p-4 border-b border-border">
                    <div class="flex justify-between items-center mb-3">
                        <h2 class='font-oswald text-2xl text-main'>Notifications</h2>
                        <button class="text-sm text-main hover:underline">Mark all as read</button>
                    </div>
                    <div class="flex space-x-2">
                        <input type="search" placeholder="Search notifications..." class="flex-grow p-2 border border-border rounded-lg text-sm outline-none">
                        <select class="p-2 border border-border rounded-lg text-sm">
                            <option>Filter by: All</option>
                            <option>Filter by: Order Updates</option>
                            <option>Filter by: Messages</option>
                            <option>Filter by: System</option>
                        </select>
                    </div>
                </div>
                <div class="flex-grow overflow-y-auto">
                    ${[{icon: 'fa-receipt', title: 'Order Shipped!', text: 'Your order #12345 for Fresh Apples has been shipped.', time: '2m ago', unread: true},
                        {icon: 'fa-comment-dots', title: 'New Message from BerryFarm', text: 'You have a new message regarding your strawberry query.', time: '1h ago', unread: true},
                        {icon: 'fa-store', title: 'Product Approved', text: 'Your new product "Artisan Cheese" is now live.', time: '3h ago'},
                    ].map(n => `
                        <div class="notification-item p-4 flex items-start space-x-3 hover:bg-gray-100 ${n.unread ? 'bg-gray-100 font-semibold' : ''}">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <i class="fas ${n.icon} text-main"></i>
                            </div>
                            <div class="flex-grow">
                                <h3 class="text-sm text-main">${n.title}</h3>
                                <p class="text-xs text-gray-600">${n.text}</p>
                            </div>
                            <div class="flex-shrink-0 text-xs text-gray-500">${n.time}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `
    },
    unread_notifications: { title: "Unread Notifications", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Unread Notifications</h2><p class='text-text'>Display unread notifications here.</p>" },
    priority_notifications: { title: "Priority Notifications", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Priority Notifications</h2><p class='text-text'>Display priority notifications here.</p>" },
    my_buying_notifications: { title: "Buying Notifications", html: "<h2 class='font-oswald text-2xl text-main mb-4'>My Buying Notifications</h2><p class='text-text'>Notifications related to your purchases.</p>" },
    my_selling_notifications: { title: "Selling Notifications", html: "<h2 class='font-oswald text-2xl text-main mb-4'>My Selling Notifications</h2><p class='text-text'>Notifications related to your sales.</p>" },
    favourites_notifications: { title: "Favourites Notifications", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Favourites Notifications</h2><p class='text-text'>Notifications about your favourited items or sellers.</p>" },


    all_messages: {
        title: "All Messages",
        html: `
            <div class="flex h-full">
                <div class="w-1/3 border-r border-border flex flex-col">
                    <div class="p-4 border-b border-border">
                        <input type="search" placeholder="Search chats or start new..." class="w-full p-2 border border-border rounded-lg text-sm outline-none">
                    </div>
                    <div class="flex-grow overflow-y-auto">
                        ${[{ name: 'Farmer Giles', lastMsg: 'Yes, the eggs are fresh!', time: '10:30 AM', unread: 2, avatar: 'FG', active: true, tags: ['buyer:Farmer Giles', 'product:Fresh Eggs', 'status:pending'] },
                            { name: 'The Wool Mill', lastMsg: 'Bulk discount available.', time: 'Yesterday', avatar: 'WM', tags: ['seller:The Wool Mill', 'product:Wool Yarn', 'status:quote'] },
                            { name: 'Customer Support', lastMsg: 'Query #CS789 updated.', time: 'Mon', avatar: 'CS', tags: ['support', 'status:resolved'] },
                        ].map(chat => `
                        <div class="message-item p-3 flex items-center space-x-3 cursor-pointer ${chat.active ? 'active-chat' : ''}">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-main font-semibold">${chat.avatar}</div>
                            <div class="flex-grow overflow-hidden">
                                <div class="flex justify-between items-center">
                                    <h3 class="text-sm font-semibold text-main truncate">${chat.name}</h3>
                                    <span class="text-xs text-gray-500">${chat.time}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <p class="text-xs text-gray-600 truncate">${chat.lastMsg}</p>
                                    ${chat.unread ? `<span class="ml-2 text-xs bg-accent text-text-on-accent rounded-full px-1.5 py-0.5">${chat.unread}</span>` : ''}
                                </div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
                <div class="w-2/3 flex flex-col bg-tertiary">
                    <div class="p-4 border-b border-border flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-main font-semibold">FG</div>
                        <div>
                            <h3 class="font-semibold text-main">Farmer Giles</h3>
                            <p class="text-xs text-gray-500">Online</p>
                        </div>
                        <div class="ml-auto space-x-2">
                            <button class="p-2 text-gray-500 hover:text-main"><i class="fas fa-phone"></i></button>
                            <button class="p-2 text-gray-500 hover:text-main"><i class="fas fa-video"></i></button>
                            <button class="p-2 text-gray-500 hover:text-main"><i class="fas fa-ellipsis-v"></i></button>
                        </div>
                    </div>
                    <div class="flex-grow p-4 space-y-4 overflow-y-auto bg-secondary">
                        <div class="flex justify-end"><div class="sent-message p-3 rounded-lg max-w-xs lg:max-w-md">Hi Farmer Giles, are the large eggs available?</div></div>
                        <div class="flex justify-start"><div class="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs lg:max-w-md">Hello! Yes, the eggs are fresh from this morning! How many would you like?</div></div>
                        <div class="flex justify-end"><div class="sent-message p-3 rounded-lg max-w-xs lg:max-w-md">Great! I'll take two dozen.</div></div>
                    </div>
                    <div class="p-4 border-t border-border bg-tertiary">
                        <div class="flex items-center space-x-2">
                            <button class="p-2 text-gray-500 hover:text-main"><i class="fas fa-paperclip"></i></button>
                            <input type="text" placeholder="Type a message..." class="flex-grow p-3 border border-border rounded-full text-sm outline-none">
                            <button class="p-3 bg-main text-text-on-main rounded-full hover:bg-main/90"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    unread_messages: { title: "Unread Messages", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Unread Messages</h2><p class='text-text'>Display unread messages here.</p>" },
    buyer_messages: { title: "Messages from Buyers", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Your Buyer Communications</h2><p class='text-text'>Display messages from buyers here.</p>" },
    from_seller_messages: { title: "Messages from Sellers", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Your Seller Communications</h2><p class='text-text'>Display messages from sellers here.</p>" },

    knowledge_library: { title: "Knowledge Library", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Platform Knowledge Library</h2><p class='text-text'>Find articles, guides, and FAQs.</p>" },
    report_problem: { title: "Report a Problem", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Report an Issue</h2><textarea class='w-full p-2 border border-border rounded mt-2 text-text bg-tertiary' rows='4' placeholder='Describe the problem...'></textarea><button class='bg-main text-text-on-main py-2 px-4 rounded mt-2 hover:bg-main/90'>Submit Report</button>" },
    talk_to_team: { title: "Talk to Our Team", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Contact Support</h2><p class='text-text'>Here's how to reach us.</p>" },

    // Profile Content
    view_profile: {
        title: "My Profile",
        html: `
            <div class="bg-tertiary rounded-lg shadow">
                <div class="profile-header relative"></div>
                <div class="p-6">
                    <div class="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
                        <img src="https://placehold.co/120x120/cccccc/333333?text=User" alt="User Avatar" class="profile-avatar rounded-full">
                        <div class="text-center sm:text-left">
                            <h2 class="text-3xl font-oswald text-main">Alice Farmer</h2>
                            <p class="text-gray-600">Green Valley Organics <span class="text-sm text-gray-400 ml-1">@alicefarmer_gvo</span></p>
                            <p class="text-sm text-gray-500 mt-1"><i class="fas fa-map-marker-alt mr-1"></i>Somerset, UK</p>
                        </div>
                        <div class="sm:ml-auto mt-4 sm:mt-0">
                            <button class="bg-main text-text-on-main py-2 px-4 rounded-md hover:bg-main/90 text-sm w-full sm:w-auto" onclick="window.selectSecondPanelItem('edit_profile', 'Edit Profile', 'profile')">Edit Profile</button>
                        </div>
                    </div>
                    <p class="mt-4 text-gray-700">Passionate about sustainable farming and providing fresh, organic produce. Connecting directly with conscious consumers and businesses. Member since 2023.</p>
                    <div class="mt-4 flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-sm text-gray-600">
                        <span><strong class="text-main">125</strong> Products Listed</span>
                        <span><strong class="text-main">580</strong> Followers</span>
                        <span><strong class="text-main">320</strong> Following</span>
                    </div>
                </div>
                <div class="border-t border-border">
                    <nav class="profile-tabs flex space-x-1 px-6 -mb-px">
                        <button data-tab="profile-timeline" class="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-main hover:border-gray-300 active">Timeline</button>
                        <button data-tab="profile-products-tab" class="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-main hover:border-gray-300">Products</button>
                        <button data-tab="profile-reviews" class="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-main hover:border-gray-300">Reviews</button>
                        <button data-tab="profile-about" class="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-main hover:border-gray-300">About</button>
                    </nav>
                </div>
                <div id="profile-tab-content" class="p-6">
                    <div id="profile-timeline">
                        <h3 class="font-oswald text-xl text-main mb-3">Recent Activity (Timeline)</h3>
                        <div class="space-y-4">
                            <div class="p-4 border border-border rounded-lg bg-secondary">Posted a new product: "Organic Carrots" - 2 hours ago</div>
                            <div class="p-4 border border-border rounded-lg bg-secondary">Received a 5-star review from John B. - 1 day ago</div>
                            <div class="p-4 border border-border rounded-lg bg-secondary">Updated store banner. - 3 days ago</div>
                        </div>
                    </div>
                    <div id="profile-products-tab" class="hidden">
                        <h3 class="font-oswald text-xl text-main mb-3">Alice's Products</h3>
                        <p class="text-text">A preview of products listed by Alice would appear here, similar to the main product grid.</p>
                    </div>
                    <div id="profile-reviews" class="hidden">
                        <h3 class="font-oswald text-xl text-main mb-3">Reviews for Alice</h3>
                        <p class="text-text">A list of reviews received by Alice would be displayed here.</p>
                    </div>
                    <div id="profile-about" class="hidden">
                        <h3 class="font-oswald text-xl text-main mb-3">About Green Valley Organics</h3>
                        <p class="text-text">Detailed information about Alice's farm/business, certifications, story, etc.</p>
                    </div>
                </div>
            </div>
        `
    },
    edit_profile: { title: "Edit Profile", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Edit Your Profile</h2><p class='text-text'>This page would contain forms to update your personal information, profile picture, bio, contact details, and other public-facing profile elements. Example: Fields for Name, Username, Bio, Profile Picture Upload.</p>" },
    activity_log_profile: { title: "Activity Log", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Your Activity Log</h2><p class='text-text'>A chronological list of your recent actions on the platform, such as products viewed, items favourited, messages sent, orders placed, or listings created (if a seller). Example: Viewed 'Organic Beef Mince' - 10 mins ago. Added 'Welsh Lamb Steaks' to Favourites - 1 hour ago.</p>" },
    account_settings: { title: "Account Settings", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Account Settings</h2><p class='text-text'>Manage your account preferences here. This includes options for changing your password, managing email notification preferences (e.g., for orders, messages, promotions), setting privacy options, and managing linked accounts. Example: Change Password, Notification Preferences (toggle switches), Privacy Settings.</p>" },
    my_store_settings: { title: "My Store Settings", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Store Management (Seller)</h2><p class='text-text'>If you are a registered seller, this section is for managing your storefront. Configure your store name, banner, business information, payment receiving details, shipping options and rates, and policies (e.g., return policy). Example: Store Name field, Shipping Zones setup, Payment Gateway integration.</p>" },
    switch_community: { title: "Switch to Community", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Switching to Community View</h2><p class='text-text'>You are now switching to the community platform features. This might include forums, groups, and event listings.</p>" },
    switch_management: { title: "Switch to Management", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Switching to Management View</h2><p class='text-text'>You are now switching to the management dashboard. This area is for platform administrators or business managers with specific operational roles.</p>" },
    sign_out: { title: "Sign Out", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Sign Out</h2><p class='text-text'>You are about to be signed out of your account.</p><button class='bg-danger text-text-on-accent py-2 px-4 rounded mt-2 hover:brightness-90'>Confirm Sign Out</button><p class='mt-2 text-sm text-gray-600'>Clicking 'Confirm Sign Out' will end your current session.</p>" },

    shopping_cart_view: {
        title: "Your Shopping Cart",
        htmlFactory: () => {
            if (shoppingCart.length === 0) {
                return "<h2 class='font-oswald text-2xl text-main mb-4'>Your Cart is Empty</h2><p class='text-text'>Browse products and add them to your cart!</p>";
            }
            let cartHtml = `<h2 class='font-oswald text-2xl text-main mb-6'>Your Shopping Cart</h2>`;
            let totalAmount = 0;
            cartHtml += `<div class="space-y-4">`;
            shoppingCart.forEach((item) => {
                const itemTotal = item.price * item.quantity;
                totalAmount += itemTotal;
                cartHtml += `
                    <div class="flex items-center gap-4 p-4 border border-border rounded-lg shadow-sm bg-tertiary">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                        <div class="flex-grow">
                            <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
                            <p class="text-sm text-gray-500">Price: £${item.price.toFixed(2)}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <label for="qty-${item.id}" class="text-sm text-gray-600">Qty:</label>
                            <input type="number" id="qty-${item.id}" value="${item.quantity}" min="1" class="w-16 p-1 border border-border rounded-lg text-sm" onchange="window.updateCartQuantity('${item.id}', (event.target as HTMLInputElement).value)">
                            <button class="text-danger hover:brightness-90 text-sm" onclick="window.removeFromCart('${item.id}')"><i class="fas fa-trash"></i> Remove</button>
                        </div>
                    </div>`;
            });
            cartHtml += `</div>`;
            cartHtml += `
                <div class="mt-8 pt-4 border-t border-border">
                    <div class="flex justify-end items-center space-x-4">
                        <h3 class="text-xl font-oswald text-main">Total:</h3>
                        <p class="text-2xl font-bold text-main">£${totalAmount.toFixed(2)}</p>
                    </div>
                    <div class="flex justify-end mt-4">
                        <button class="bg-accent text-text-on-accent py-3 px-6 rounded-lg hover:brightness-90 font-semibold transition-all">Proceed to Checkout</button>
                    </div>
                </div>`;
            return cartHtml;
        }
    },

    default_content: { title: "Welcome to the Marketplace", html: "<h2 class='font-oswald text-2xl text-main mb-4'>Welcome!</h2><p class='text-text'>Your one-stop platform for connecting farms, businesses, and customers. Browse products, manage your buying and selling, and connect with the community.</p>" }
};

// --- Information Panel Data (Simplified) ---
const informationPanelData: InfoPanelData = {
    browse_all_products: "<strong>Tips:</strong> Use filters! Check seller ratings.",
    default_info: "Contextual information will appear here."
};

// --- DOM Elements ---
const firstPanelMainIconsContainer = document.getElementById('first-panel-main-icons') as HTMLElement;
const firstPanelBottomIconsContainer = document.getElementById('first-panel-bottom-icons') as HTMLElement;
const secondPanel = document.getElementById('second-panel') as HTMLElement;
const secondPanelSearch = document.getElementById('second-panel-search') as HTMLInputElement;
const secondPanelContentEl = document.getElementById('second-panel-content') as HTMLElement;
const mainHeading = document.getElementById('main-heading') as HTMLElement;
const contentSection = document.getElementById('content-section') as HTMLElement;
const contentPlaceholder = document.getElementById('content-placeholder') as HTMLElement;
const infoPanel = document.getElementById('info-panel') as HTMLElement;
const infoPanelContentEl = document.getElementById('info-panel-content') as HTMLElement;
const toggleSecondPanelBtn = document.getElementById('toggle-second-panel') as HTMLButtonElement;
const toggleInfoPanelBtn = document.getElementById('toggle-info-panel') as HTMLButtonElement;
const toggleSecondIcon = document.getElementById('toggle-second-icon') as HTMLElement;
const toggleInfoIcon = document.getElementById('toggle-info-icon') as HTMLElement;
const shoppingCartButton = document.getElementById('shopping-cart-button') as HTMLButtonElement;
const shoppingCartCountDisplay = document.getElementById('shopping-cart-count-display') as HTMLElement;


// --- App State ---
let activeFirstPanelKey: string | null = null;
let activeSecondPanelId: string | null = null;
let isSecondPanelOpen = true;
let isInfoPanelOpen = true;

// --- Core Functions ---
function renderFirstPanel(): void {
    firstPanelMainIconsContainer.innerHTML = '';
    firstPanelBottomIconsContainer.innerHTML = '';
    Object.keys(platformData).forEach(key => {
        const item = platformData[key];
        if (!item.label || key === 'shopping_cart_view') return;

        const button = document.createElement('button');
        button.className = `first-panel-item group w-full flex flex-col items-center p-3 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none`;
        button.setAttribute('data-key', key);
        button.innerHTML = `<i class="${item.iconClass} text-2xl text-main group-hover:text-main"></i><span class="first-panel-label text-xs mt-1 text-main group-hover:text-main font-oswald">${item.label}</span>`;
        button.onclick = () => selectFirstPanelItem(key);
        if (item.isBottomIcon) firstPanelBottomIconsContainer.appendChild(button);
        else firstPanelMainIconsContainer.appendChild(button);
    });
}

function renderSecondPanel(key: string | null): void {
    if (!key) {
        secondPanelSearch.placeholder = "Search...";
        secondPanelContentEl.innerHTML = '';
        activeSecondPanelId = null;
        updateSecondPanelActiveState();
        return;
    }
    const itemData = platformData[key];
    secondPanelSearch.placeholder = itemData.searchPlaceholder || "Search...";
    secondPanelContentEl.innerHTML = '';
    if (!itemData.secondPanelContent) {
         activeSecondPanelId = null;
         updateSecondPanelActiveState();
        return;
    }


    itemData.secondPanelContent.forEach(group => {
        if (group.groupLabel) {
            const groupLabelDiv = document.createElement('h3');
            groupLabelDiv.className = 'second-panel-group-label text-sm text-main font-semibold mt-3 mb-4 px-2 uppercase tracking-wider';
            groupLabelDiv.textContent = group.groupLabel;
            secondPanelContentEl.appendChild(groupLabelDiv);
        }
        group.items.forEach(subItem => {
            const div = document.createElement('div');
            div.className = 'second-panel-item block w-full text-left p-2.5 text-text rounded-lg hover:bg-gray-200 cursor-pointer transition-colors flex items-center space-x-2';
            div.setAttribute('data-id', subItem.id);
            div.setAttribute('data-parent-key', key);
            div.setAttribute('data-label', subItem.label);
            div.innerHTML = subItem.iconClass ? `<i class="${subItem.iconClass} fa-fw w-5 h-5 mr-2 text-gray-500 group-hover:text-main"></i> <span class="flex-1">${subItem.label}</span>` : `<span class="flex-1">${subItem.label}</span>`;
            div.onclick = () => selectSecondPanelItem(subItem.id, subItem.label, key);
            secondPanelContentEl.appendChild(div);
        });
    });
    updateSecondPanelActiveState();
}

function updateMainContent(itemId: string, itemLabelFromSecondPanel?: string): void {
    const contentEntry = contentData[itemId] || contentData['default_content'];

    mainHeading.textContent = itemLabelFromSecondPanel || contentEntry.title || "Marketplace";

    if (typeof contentEntry.htmlFactory === 'function') {
        contentSection.innerHTML = contentEntry.htmlFactory();
    } else {
        contentSection.innerHTML = contentEntry.html || "";
    }

    contentPlaceholder.style.display = 'none';

    const info = informationPanelData[itemId] || informationPanelData['default_info'];
    infoPanelContentEl.innerHTML = info;

    if (itemId === 'view_profile') attachProfileTabListeners();
}


function attachProfileTabListeners(): void {
    const tabButtons = document.querySelectorAll('.profile-tabs button') as NodeListOf<HTMLButtonElement>;
    const tabContents = document.querySelectorAll('#profile-tab-content > div') as NodeListOf<HTMLElement>;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active', 'border-main', 'text-main'));
            tabButtons.forEach(btn => btn.classList.add('border-transparent', 'text-gray-500'));

            button.classList.add('active', 'border-main', 'text-main');
            button.classList.remove('border-transparent', 'text-gray-500');

            tabContents.forEach(content => content.classList.add('hidden'));
            const tabId = button.getAttribute('data-tab');
            if (tabId) {
                const activeTabContent = document.getElementById(tabId) as HTMLElement;
                if (activeTabContent) activeTabContent.classList.remove('hidden');
            }
        });
    });
    if (tabButtons.length > 0 && !document.querySelector('.profile-tabs button.active')) {
         tabButtons[0].click();
    }
}

function selectFirstPanelItem(key: string): void {
    if (activeFirstPanelKey === key) {
        if (!isSecondPanelOpen && platformData[key] && platformData[key].secondPanelContent) {
            toggleSecondPanelDisplay(true);
        }
        return;
    }

    activeFirstPanelKey = key;
    renderSecondPanel(key);

    document.querySelectorAll('#first-panel .first-panel-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-key') === key);
    });

    let secondPanelItemStillValidForThisFirstPanel = false;
    if (activeSecondPanelId && platformData[key] && platformData[key].secondPanelContent) {
        secondPanelItemStillValidForThisFirstPanel = platformData[key].secondPanelContent!
            .flatMap(g => g.items)
            .some(item => item.id === activeSecondPanelId);
    }

    if (!secondPanelItemStillValidForThisFirstPanel) {
        activeSecondPanelId = null;
    }

    updateSecondPanelActiveState();

    if (!isSecondPanelOpen && platformData[key] && platformData[key].secondPanelContent) {
        toggleSecondPanelDisplay(true);
    }
}


function selectSecondPanelItem(itemId: string, itemLabel: string, parentKey: string): void {
    activeSecondPanelId = itemId;
    activeFirstPanelKey = parentKey;
    updateMainContent(itemId, itemLabel);
    updateSecondPanelActiveState();
    document.querySelectorAll('#first-panel .first-panel-item').forEach(btn => {
         btn.classList.toggle('active', btn.getAttribute('data-key') === parentKey);
    });
}
(window as any).selectSecondPanelItem = selectSecondPanelItem;


function updateSecondPanelActiveState(): void {
    secondPanelContentEl.querySelectorAll('.second-panel-item').forEach(div => {
        const isCorrectParentActive = div.getAttribute('data-parent-key') === activeFirstPanelKey;
        const isThisItemActive = div.getAttribute('data-id') === activeSecondPanelId;
        div.classList.toggle('active', isCorrectParentActive && isThisItemActive);
    });
}

function toggleSecondPanelDisplay(forceOpen?: boolean): void {
    const openState = forceOpen !== undefined ? forceOpen : !isSecondPanelOpen;
    isSecondPanelOpen = openState;
    secondPanel.classList.toggle('w-72', isSecondPanelOpen);
    secondPanel.classList.toggle('w-0', !isSecondPanelOpen);
    secondPanel.classList.toggle('p-0', !isSecondPanelOpen);
    secondPanel.classList.toggle('border-r', isSecondPanelOpen);
    secondPanel.classList.toggle('overflow-hidden', !isSecondPanelOpen);
    secondPanelSearch.style.display = isSecondPanelOpen ? 'block' : 'none';
    secondPanelContentEl.style.display = isSecondPanelOpen ? 'block' : 'none';
    toggleSecondIcon.innerHTML = isSecondPanelOpen ? `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />` : `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />`;
}
toggleSecondPanelBtn.addEventListener('click', () => toggleSecondPanelDisplay());

function toggleInfoPanelDisplay(forceOpen?: boolean): void {
    const openState = forceOpen !== undefined ? forceOpen : !isInfoPanelOpen;
    isInfoPanelOpen = openState;
    infoPanel.classList.toggle('w-80', isInfoPanelOpen);
    infoPanel.classList.toggle('w-0', !isInfoPanelOpen);
    infoPanel.classList.toggle('p-4', isInfoPanelOpen);
    infoPanel.classList.toggle('p-0', !isInfoPanelOpen);
    infoPanel.classList.toggle('border-l', isInfoPanelOpen);
    infoPanel.classList.toggle('overflow-hidden', !isInfoPanelOpen);

    const h3 = infoPanel.querySelector('h3');
    if (h3) h3.style.display = isInfoPanelOpen ? 'block' : 'none';
    infoPanelContentEl.style.display = isInfoPanelOpen ? 'block' : 'none';
    toggleInfoIcon.innerHTML = isInfoPanelOpen ? `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />` : `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />`;
}
toggleInfoPanelBtn.addEventListener('click', () => toggleInfoPanelDisplay());

// --- Shopping Cart Functions ---
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
    if (activeSecondPanelId === 'shopping_cart_view') {
        updateMainContent('shopping_cart_view', contentData.shopping_cart_view.title);
    }
}
(window as any).removeFromCart = removeFromCart;

function updateCartQuantity(productId: string, newQuantityString: string): void {
    const item = shoppingCart.find(item => item.id === productId);
    const quantity = parseInt(newQuantityString);
    if (item && quantity > 0) {
        item.quantity = quantity;
    } else if (item && quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    updateCartDisplay();
     if (activeSecondPanelId === 'shopping_cart_view') {
        updateMainContent('shopping_cart_view', contentData.shopping_cart_view.title);
    }
}
(window as any).updateCartQuantity = updateCartQuantity;

function updateCartDisplay(): void {
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        shoppingCartCountDisplay.textContent = totalItems.toString();
        shoppingCartCountDisplay.classList.remove('hidden');
    } else {
        shoppingCartCountDisplay.classList.add('hidden');
    }
}

shoppingCartButton.addEventListener('click', () => {
    activeFirstPanelKey = null;
    activeSecondPanelId = 'shopping_cart_view';

    document.querySelectorAll('#first-panel .first-panel-item.active').forEach(btn => btn.classList.remove('active'));
    secondPanelContentEl.querySelectorAll('.second-panel-item.active').forEach(div => div.classList.remove('active'));

    updateMainContent('shopping_cart_view', contentData.shopping_cart_view.title);
});


// --- Initialization ---
function initializeApp(): void {
    renderFirstPanel();
    const firstKey = Object.keys(platformData).find(k => platformData[k].label && !platformData[k].isBottomIcon && k !== 'shopping_cart_view') ||
                     Object.keys(platformData).find(k => platformData[k].label && k !== 'shopping_cart_view');

    mainHeading.textContent = contentData.default_content.title || "Welcome";
    contentSection.innerHTML = '';
    contentPlaceholder.style.display = 'block';
    infoPanelContentEl.innerHTML = informationPanelData['default_info'];


    if (firstKey && platformData[firstKey]) {
        activeFirstPanelKey = firstKey;
        renderSecondPanel(firstKey);
        document.querySelectorAll('#first-panel .first-panel-item').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-key') === firstKey);
        });
        activeSecondPanelId = null;
        updateSecondPanelActiveState();
    } else {
        activeFirstPanelKey = null;
        activeSecondPanelId = null;
        renderSecondPanel(null);
        updateSecondPanelActiveState();
    }

    toggleSecondPanelDisplay(isSecondPanelOpen);
    toggleInfoPanelDisplay(isInfoPanelOpen);
    
    toggleInfoIcon.innerHTML = isInfoPanelOpen ? `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />` : `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />`;

    updateCartDisplay();
}

initializeApp();

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('[aria-controls="mobile-menu"]');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded));
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Theme toggle
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleButton = document.getElementById('theme-toggle');

    if (themeToggleDarkIcon && themeToggleLightIcon && themeToggleButton) {
        // Check for saved theme preference or use system preference
        if (localStorage.getItem('color-theme') === 'dark' || 
            (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            themeToggleLightIcon.classList.remove('hidden');
            document.documentElement.classList.add('dark');
        } else {
            themeToggleDarkIcon.classList.remove('hidden');
            document.documentElement.classList.remove('dark');
        }

        themeToggleButton.addEventListener('click', () => {
            themeToggleDarkIcon.classList.toggle('hidden');
            themeToggleLightIcon.classList.toggle('hidden');

            if (localStorage.getItem('color-theme')) {
                if (localStorage.getItem('color-theme') === 'light') {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                }
            } else {
                if (document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                }
            }
        });
    }

    // Profile dropdown toggle
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenuDropdown = document.querySelector('[aria-labelledby="user-menu-button"]');
    if (userMenuButton && userMenuDropdown) {
        userMenuButton.addEventListener('click', () => {
            const isExpanded = userMenuButton.getAttribute('aria-expanded') === 'true';
            userMenuButton.setAttribute('aria-expanded', String(!isExpanded));
            userMenuDropdown.classList.toggle('hidden');
            userMenuDropdown.classList.toggle('absolute'); // Ensure it's positioned correctly
            userMenuDropdown.classList.toggle('right-0');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (!userMenuButton.contains(target) && !userMenuDropdown.contains(target)) {
                userMenuButton.setAttribute('aria-expanded', 'false');
                userMenuDropdown.classList.add('hidden');
            }
        });
    }
});

// Function to toggle dark mode (can be called from other parts of the app if needed)
export function toggleDarkMode(enable: boolean): void {
    if (enable) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
    }
}

// Example of how you might use a function from Rust
// import { invoke } from '@tauri-apps/api/tauri';
// async function greet() {
//   const greeting = await invoke('greet', { name: 'World' });
//   console.log(greeting);
// }
// greet(); 