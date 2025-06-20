# Phase 3: Profile Page

**Goal:** Implement the "Profile" tab and its corresponding page, which will initially focus on displaying store information (banner, avatar, name, rating) and a "Products" tab showcasing the seller's items using the reusable product grid.

**Depends on:** Phase 0 (Foundation), Phase 1 (Product Grid & Card Components)

**Key Considerations:**
*   Layout and hierarchy to follow "Profile Page Specifications".
*   Reuse the product grid and card components developed in Phase 1.
*   The profile displayed will be a generic placeholder or based on a sample seller, as multi-seller backend logic might not be fully available.
*   Focus on the structure and primary "Products" tab functionality.

---

## Stub 1: Basic Profile Page Structure & Navigation

**Objective:** Create the HTML shell for the Profile Page and link it to the "Profile" tab in the bottom navigator.

**Steps:**

1.  **Define Profile Page Structure (in `app.ts` or `pages/profile.ts`):**
    *   Create a function `renderProfilePage()` that returns the HTML for the Profile page.
    *   The main structure will include areas for:
        *   Header Area (Banner, Avatar, Name, Rating, Follow button).
        *   Navigation Tabs (initially "Products").
        *   Content area for the active tab.
2.  **Update Navigation Logic (in `app.ts`):**
    *   Modify the tab navigation logic (from P0 Stub 2.3) so that clicking the "Profile" tab in the bottom navigator:
        *   Calls `renderProfilePage()`.
        *   Renders the HTML into the `#page-content` div.
        *   Sets the "Profile" tab as active.
3.  **Page Title:** Set a page title like "Profile" or "[Store Name] Profile".

---

## Stub 2: Implement Profile Header Area

**Objective:** Create the header section of the Profile Page with store banner, avatar, name, rating, and follow button.

**Steps:**

1.  **HTML Structure for Header (based on `shop.app` example):**
    *   **Store Banner:** Full-width `div` or `img` for the banner. Use a placeholder image (16:9 ratio). Implement lazy-loading if simple, otherwise defer.
    *   **Avatar & Name Container:**
        *   Circular avatar `img` (80px), potentially overlaid on the bottom-left of the banner or positioned below. Use a placeholder avatar.
        *   Store name in H1 (22pt). Use a placeholder like "Sample Store".
        *   Rating badge (e.g., "4.7 (1.6K reviews)"). Use placeholder data.
    *   **Follow Button:** Prominent "Follow" CTA button, aligned to the top-right of the header area (or other suitable prominent position).
2.  **CSS Styling:**
    *   Style the banner (full-width, aspect ratio).
    *   Style avatar (circular, size, overlay/positioning).
    *   Style store name (font size) and rating badge.
    *   Style the "Follow" button using existing theme button styles (primary or secondary).
    *   Ensure "nice rounded corners" for avatar and button.
3.  **JavaScript (Placeholder Interaction):**
    *   "Follow" button: `alert('Follow store clicked');` (Full functionality depends on backend).

---

## Stub 3: Implement Navigation Tabs within Profile Page

**Objective:** Create the tab navigation within the Profile Page (initially just "Products").

**Steps:**

1.  **HTML Structure for Tabs:**
    *   Container `div` below the header area for tabs.
    *   `button` or `a` element for the "Products" tab.
    *   (Future: Add placeholders for "About," "Reviews" tabs if desired now, or add later).
2.  **CSS Styling for Tabs:**
    *   Style the tabs for clear visual indication.
    *   Highlight the active tab with an underline (as per spec).
    *   Use existing theme colors for text and active indicator.
3.  **JavaScript for Tab Interaction:**
    *   Add event listener to the "Products" tab.
    *   On click (or by default), it should:
        *   Visually mark the "Products" tab as active.
        *   Render the product grid (from Stub 4) in the content area below the tabs.

---

## Stub 4: Display Seller's Products using Product Grid

**Objective:** Use the existing product grid component (from Phase 1) to display products for the current profile.

**Steps:**

1.  **Product Data for Profile:**
    *   For now, filter `sampleProducts` to simulate a seller's products. E.g., select all products from "Green Pastures Farm" or a subset.
    *   `const sellerProducts = sampleProducts.filter(p => p.seller === 'Green Pastures Farm');`
2.  **Integrate Product Grid:**
    *   In the Profile Page rendering logic (when "Products" tab is active):
        *   Get the `sellerProducts`.
        *   Call the product grid component function (from P1 Stub 3) with this filtered data.
        *   Render the grid into the Profile Page's tab content area.
3.  **Styling:** Ensure the grid displays correctly within the Profile Page layout. The grid and card styles are already defined.

---

## Stub 5: Testing and Verification

**Objective:** Ensure the Profile Page displays correctly, its components are functional, and it integrates with existing components.

**Steps:**

1.  **Navigation:**
    *   Verify the "Profile" tab in the bottom navigator loads the Profile Page.
2.  **Header Display:**
    *   Check banner, avatar, store name, rating, and follow button are displayed with placeholder data/images.
    *   Verify styling and positioning.
3.  **Profile Tabs:**
    *   Confirm "Products" tab is visible and active by default.
    *   Clicking "Products" tab (if other placeholders exist) should show/refresh the product grid.
4.  **Product Grid:**
    *   Verify the product grid displays the correct (filtered) set of products for the sample seller.
    *   Check product card display and interaction (linking to Product Detail Page - from P2).
5.  **Interactivity:**
    *   Test "Follow" button placeholder action.
6.  **Responsiveness:** Check layout on different screen sizes.
7.  **Styling Consistency:** Ensure adherence to global styles (fonts, colors, rounded corners).
8.  **No Console Errors.**

---

**Expected Outcome:**
*   A functional "Profile" tab and page.
*   Profile header with banner, avatar, name, rating, and follow button.
*   A "Products" tab within the Profile Page that correctly displays a seller's items using the reusable product grid.
*   Clear path for adding more profile tabs ("About", "Reviews") and real data in the future. 