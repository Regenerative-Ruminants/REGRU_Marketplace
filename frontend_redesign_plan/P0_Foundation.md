# Phase 0: Foundation & Global Setup

**Goal:** Establish the new basic HTML shell, global CSS (fonts, primary colors adapted from new spec, 8px grid), and the main bottom tab navigator. Ensure existing essential JS (like wallet modal trigger) is still connectable. Deprecate or adapt old multi-panel JS rendering logic.

**Key Considerations:**
*   Preserve existing color palette (`--main-color`, etc.) and adapt it to the 60-30-10 rule where feasible.
*   Retain font choices (Oswald, Garamond) but apply them according to the new typographic hierarchy.
*   Ensure interactive elements like the Wallet Modal remain functional or are re-integrated smoothly.
*   Prioritize a clean separation of concerns for the new layout.

---

## Stub 1: Refactor `index.html` for New Single-Page Application (SPA) Shell

**Objective:** Modify `index.html` to support a single main content area managed by tab navigation, removing the old multi-panel structure.

**Steps:**

1.  **Backup `index.html`:** Create a copy of the current `index.html` (e.g., `index_old_layout.html`) for reference.
2.  **Simplify `<body>` Structure:**
    *   Remove existing `#first-panel`, `#second-panel`, `#toggle-second-panel-container`, `#main-heading-container` (partially, header will be simpler), `#content-section` (will be replaced by a new main content host), `#toggle-info-panel`, and `#info-panel`.
    *   The main `<body>` should primarily contain:
        *   A `div` to host the main page content (e.g., `<main id="page-content" class="flex-1 overflow-y-auto"></main>`).
        *   The global bottom tab navigator (e.g., `<nav id="bottom-tab-bar" class="..."></nav>`).
        *   The existing `#wallet-modal` (ensure it remains functional and styled appropriately, possibly adjusted for the new layout).
3.  **Adapt Header:**
    *   Retain a simplified header within the body or as part of `page-content` for context (e.g., page title).
    *   The current `#main-heading` can be repurposed or a new element can be used.
    *   The shopping cart button (`#shopping-cart-button`) should be moved to the bottom tab bar (or potentially a top-right header if preferred, but spec suggests tab bar context for "Cart"). For now, ensure its JS logic remains attachable.
4.  **Preserve Essential Scripts & Links:**
    *   Keep `<link rel="stylesheet" href="/src/index.css">`.
    *   Keep `<script type="module" src="/src/main.ts"></script>`.
    *   FontAwesome and Google Fonts links should remain.
5.  **Initial Styling:** Apply basic Tailwind classes for flex layout to ensure `page-content` takes up available space above the `bottom-tab-bar`.

---

## Stub 2: Implement Global Bottom Tab Navigator

**Objective:** Create the HTML structure and basic styling for the bottom tab bar as per "Global UI/UX Guidelines".

**Steps:**

1.  **HTML Structure for Tab Bar (`#bottom-tab-bar` in `index.html`):**
    *   Create a `nav` element with `id="bottom-tab-bar"`.
    *   Style it to be fixed at the bottom of the viewport, full-width, with a background color (use existing theme neutrals or a new gray from the spec).
    *   Inside, create `button` or `a` elements for each main tab: "Home", "Search", "Cart", "Profile".
    *   Each tab item should contain:
        *   An icon (using FontAwesome, e.g., `fas fa-home`).
        *   A text label (e.g., "Home").
    *   Apply Tailwind classes for layout (flex, space-around/evenly), padding, and touch target size (≥44px).
2.  **Styling for Active/Inactive Tabs:**
    *   Define styles in `src/index.css` or using Tailwind for active vs. inactive tabs (e.g., underline for active tab, different text/icon color).
    *   Your existing `--main-color` can be used for active tab indication.
3.  **Basic JavaScript Interaction (in `app.ts` or a new navigation module):**
    *   Add event listeners to tab items.
    *   On click, a function should be called to:
        *   Update the active state of the tab visually.
        *   Trigger content loading/display for the corresponding page (placeholder for now).
    *   The "Cart" tab should display the `#shopping-cart-count-display` if this element is associated with the tab.

---

## Stub 3: Update Global Styles (`src/index.css` & `tailwind.config.js`)

**Objective:** Align global typography, spacing, and color usage with the new specifications, while respecting existing preferences.

**Steps:**

1.  **Font Family & Hierarchy (`src/index.css` or Tailwind theme):**
    *   Confirm primary sans-serif: Use Oswald as the main modern sans-serif. Garamond can be reserved for specific branding elements if desired, or for body text if a softer feel is needed (though spec leans towards single sans-serif).
    *   Define H1-H4 scale (22pt down to 14pt) and body text (16pt), caption (12pt) using Tailwind's font size utilities or custom CSS.
    *   Apply `font-oswald` as the default body font if that's the decision.
2.  **Color Palette (`src/index.css` & `tailwind.config.js`):**
    *   **Adapt, Don't Replace Blindly:** Your `--main-color` is important. Consider it the "Brand primary". If it's very different from `#1A73E8`, decide if you want to shift towards the spec's color or use your existing one as the primary.
    *   Define secondary/accent colors and neutral grays, inspired by the 60-30-10 rule and your existing theme.
    *   Update Tailwind's `theme.colors` in `tailwind.config.js` if you want to use named colors (e.g., `colors.brandPrimary`, `colors.neutralGray`).
    *   Ensure contrast ratios meet WCAG (4.5:1 for text).
3.  **Spacing & Layout (`tailwind.config.js` or global CSS):**
    *   Configure Tailwind for an 8px baseline grid (e.g., set base spacing unit).
    *   Emphasize using Tailwind margin/padding utilities in multiples of 8px (e.g., `p-2` for 8px, `p-4` for 16px if base is 4px).
4.  **Rounded Corners & State Indicators:**
    *   Review existing usage of rounded corners. Ensure Tailwind's border-radius utilities are used consistently for the desired "nice rounded corners."
    *   Identify how "indicators of state" are currently implemented (e.g., hover, focus, active states on buttons/nav items). Ensure these are preserved and enhanced, using your theme colors.
5.  **Body Background:** Set a default body background color (likely a light neutral gray from your palette).

---

## Stub 4: Adapt Core JavaScript in `app.ts` & `main.ts`

**Objective:** Modify existing JavaScript to work with the new layout, deprecate old panel rendering, and set up for new page-based content loading.

**Steps:**

1.  **Review `initializeApp()` in `app.ts`:**
    *   Remove calls related to `renderFirstPanel()`, `renderSecondPanel()`, `toggleSecondPanelDisplay()`, `toggleInfoPanelDisplay()`.
    *   The primary role of `initializeApp()` will now be to set up event listeners for the new bottom tab bar and potentially load the initial view (e.g., "Home").
2.  **Content Rendering Logic:**
    *   The existing `updateMainContent(itemId, itemLabel)` and `contentData` which dynamically creates HTML content is valuable. This pattern can be adapted.
    *   Instead of `itemId` coming from the old second panel, it will now come from the active tab or interactions within a page.
    *   The function that renders content will now target `#page-content`.
3.  **Wallet Modal Integration:**
    *   Ensure the trigger for `openWalletsModal()` (currently associated with `#wallets_view` in `platformData`) is re-assigned to an appropriate new UI element. This could be a "Wallets" option in the "Profile" tab/page, or a dedicated button if highly critical. For Phase 0, ensure it's callable.
    *   Verify `closeWalletsModal()` and related DOM elements (`#wallet-modal`, `#wallet-modal-results`, `#close-wallet-modal-button`) are still correctly referenced and styled.
4.  **Shopping Cart Button Logic:**
    *   The `#shopping-cart-button` and its count display logic (`updateCartDisplay`) will be moved. For now, ensure the functions (`addToCart`, `removeFromCart`, `updateCartQuantity`, `updateCartDisplay`) are preserved. Their UI trigger point will be re-established when the "Cart" tab/page is built.
5.  **Remove or Comment Out Obsolete Code:**
    *   Functions like `renderFirstPanel`, `renderSecondPanel`, `toggleSecondPanelDisplay`, `toggleInfoPanelDisplay`, `selectFirstPanelItem`, `selectSecondPanelItem` are likely to be largely obsolete. Comment them out or remove them carefully after ensuring no critical logic is lost.
    *   The `platformData` structure defining the old panel system will mostly be deprecated. Parts might be repurposed for defining content for new pages if applicable.
6.  **`main.ts` Review:**
    *   The `greet()` function and wallet test controls (`#fetch-wallets-button`, `#wallets-result-display`) seem to be for testing Tauri commands. If these are still needed for development/testing, ensure they can be triggered. The UI elements might need to be temporarily re-added or accessed via console if their original locations are removed. The primary `get_available_wallets` call from `openWalletsModal` is the production path.
7.  **Initial Page Load:**
    *   Modify `initializeApp()` to load a default view (e.g., "Home") into `#page-content` on startup and set the "Home" tab as active.

---

## Stub 5: Testing and Verification

**Objective:** Ensure the foundational changes are stable and core functionalities are not broken.

**Steps:**

1.  **Visual Inspection:**
    *   Verify the new `index.html` structure renders correctly: a main content area and a bottom tab bar.
    *   Check that fonts and initial colors are applied.
    *   Confirm the tab bar is fixed at the bottom and items are spaced correctly.
2.  **Tab Navigation (Basic):**
    *   Clicking tabs should visually change their active state.
    *   Console log or display placeholder text in `#page-content` to confirm tab clicks are registered.
3.  **Wallet Modal:**
    *   Ensure the Wallet Modal can still be opened (e.g., by temporarily adding a button or calling `openWalletsModal()` from the console).
    *   Verify its appearance and functionality (fetching and displaying wallets, closing).
4.  **Responsiveness (Basic):**
    *   Check the layout on different screen sizes (desktop, tablet, mobile). The tab bar should remain accessible.
5.  **No Console Errors:** Open the developer console and ensure there are no JavaScript errors related to the UI changes.

---

**Expected Outcome:**
*   A simplified `index.html` with a new SPA-like structure.
*   A functional bottom tab bar for global navigation.
*   Global styles (fonts, colors, spacing) updated.
*   Core JavaScript logic in `app.ts` adapted, with obsolete panel functions removed/commented.
*   Essential functionalities like the Wallet Modal are verified to be working.
*   The application loads with a default view (e.g., a placeholder "Home" screen). 