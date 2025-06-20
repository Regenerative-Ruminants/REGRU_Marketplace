# Phase 4: Shopping Cart Page

**Goal:** Implement the "Cart" tab and its corresponding page, displaying items grouped by seller, with quantity controls, subtotals, and per-seller checkout buttons. Leverage existing cart logic and data from `app.ts`.

**Depends on:** Phase 0 (Foundation), Phase 2 (Product Detail Page, for `addToCart` context), existing cart logic in `app.ts`.

**Key Considerations:**
*   Layout and hierarchy to follow "Shopping Cart Specifications".
*   Connect UI elements directly to `shoppingCart` array and functions like `removeFromCart`, `updateCartQuantity`, `updateCartDisplay`.
*   The "grouping by seller" is a key structural requirement. `sampleProducts` (and thus `ShoppingCartItem` via `addToCart`) contains seller info implicitly via the product it was added from, but `ShoppingCartItem` itself doesn't have `seller`. This will need adjustment: either `addToCart` needs to store seller with the cart item, or we need to look up seller from `sampleProducts` when rendering the cart.
*   Client-side cart persistence is already in place with the `shoppingCart` array. Skeleton loading can be a polish step.

---

## Stub 1: Basic Shopping Cart Page Structure & Navigation

**Objective:** Create the HTML shell for the Shopping Cart Page and link it to the "Cart" tab in the bottom navigator.

**Steps:**

1.  **Define Cart Page Structure (in `app.ts` or `pages/cart.ts`):**
    *   Create a function `renderCartPage()` that returns the HTML for the Cart page.
    *   The main structure will include:
        *   A main title (e.g., "Your Shopping Cart").
        *   A container for seller groups.
        *   A global total display area (if multi-seller combined view is eventually implemented).
2.  **Update Navigation Logic (in `app.ts`):**
    *   Modify the tab navigation logic so clicking the "Cart" tab:
        *   Calls `renderCartPage()`.
        *   Renders the HTML into the `#page-content` div.
        *   Sets the "Cart" tab as active.
3.  **Integrate Cart Count Display:**
    *   Ensure the `#shopping-cart-count-display` on the "Cart" tab (or global header, if moved) is updated by the existing `updateCartDisplay()` function in `app.ts`.

---

## Stub 2: Modify Cart Data & Logic for Seller Grouping

**Objective:** Ensure cart items can be grouped by seller for display.

**Steps:**

1.  **Augment `ShoppingCartItem` Interface (in `app.ts`):**
    *   Add a `seller: string;` field to the `ShoppingCartItem` interface.
2.  **Modify `addToCart` Function (in `app.ts`):**
    *   When adding a product to the cart, also retrieve and store its `seller` field.
    *   The `addToCart` function signature might need to be `addToCart(product: Product, quantity: number)` or similar to have access to the full product object including `seller`.
    *   Alternatively, `addToCart` could take `productId` and then look up the product from `sampleProducts` to get seller, name, price, image.
    *   Adjust `addToCart(productId: string, productName: string, productPrice: number, productImage: string)` to: `addToCart(productId: string, productName: string, productPrice: number, productImage: string, productSeller: string)`
    *   This means the call from Product Detail Page (P2 Stub 6.3) must be updated to pass `product.seller`.
3.  **Grouping Logic in `renderCartPage()`:**
    *   Before rendering, group items in the `shoppingCart` array by `seller`.
    *   Example: `const groupedBySeller = shoppingCart.reduce((acc, item) => { (acc[item.seller] = acc[item.seller] || []).push(item); return acc; }, {});`

---

## Stub 3: Implement Seller Group Section

**Objective:** For each seller in the cart, create a distinct section with a header and items.

**Steps:**

1.  **HTML Structure for Seller Group (generated in `renderCartPage()`):**
    *   For each unique seller from the grouped cart data:
        *   A section container.
        *   Header with seller's name/logo (use `seller` string for name; logo placeholder).
        *   A list or container for item rows for that seller.
        *   A subtotal display for that seller's items.
        *   A "Checkout with [Store]" button (full-width primary style).
2.  **CSS Styling:**
    *   Style the seller group container, header, and checkout button.
    *   Use existing theme styles for buttons and text.

---

## Stub 4: Implement Cart Item Row

**Objective:** Display individual items within each seller's group, including thumbnail, title, variant, quantity stepper, price, and remove button.

**Steps:**

1.  **HTML Structure for Item Row (generated in `renderCartPage()` for each item):**
    *   Outer `div` for the row, using flexbox for alignment.
    *   Thumbnail `img` (60x60px). Use `item.image`.
    *   Product title (`p` or `span`). Use `item.name`.
    *   Selected variant (placeholder text, e.g., "Variant: N/A", as variants aren't fully implemented in `ShoppingCartItem`).
    *   Quantity stepper:
        *   "–" button.
        *   Input field (readonly or directly tied to JS) displaying `item.quantity`.
        *   "+" button.
    *   Line-item price (display `item.price * item.quantity`, formatted as currency).
    *   "Remove" icon/button (e.g., FontAwesome trash icon).
2.  **CSS Styling:**
    *   Style the row, thumbnail, text elements, quantity stepper, and remove button.
    *   Ensure clear separation and readability.
    *   Ensure interactive elements (stepper, remove) meet touch target sizes.
3.  **JavaScript for Item Row Interactions:**
    *   **Quantity Stepper:**
        *   Link "–" and "+" buttons to call `updateCartQuantity(item.id, newQuantity)` (from `app.ts`). Ensure `newQuantity` is correctly calculated.
        *   The `updateCartQuantity` function already handles quantity logic and calls `updateCartDisplay` which should re-render the cart or relevant parts.
    *   **Remove Button:**
        *   Link to call `removeFromCart(item.id)` (from `app.ts`).
        *   `removeFromCart` already calls `updateCartDisplay`.

---

## Stub 5: Implement Subtotals and Global Total

**Objective:** Display subtotals for each seller group and a global cart total.

**Steps:**

1.  **Calculate Subtotals:**
    *   In `renderCartPage()`, when iterating through grouped items, calculate the subtotal for each seller (sum of `item.price * item.quantity`).
2.  **Display Subtotals:** Render the calculated subtotal within each seller's group section (Stub 3.1).
3.  **Calculate Global Total:** Sum all subtotals.
4.  **Display Global Total:**
    *   Render the global total at the bottom of the cart page if a multi-seller combined view is emphasized by the spec (spec says "global total at bottom if multi-seller combined view"). For per-seller checkout, this might be less prominent or optional.
    *   The `updateCartDisplay()` in `app.ts` already calculates and could potentially display a global total if a DOM element is designated. Re-evaluate `updateCartDisplay` if it needs to be more granular or if `renderCartPage` will handle all its own rendering.

---

## Stub 6: Implement Per-Seller Checkout Flow (Placeholder)

**Objective:** Add "Checkout with [Store]" buttons and placeholder interaction.

**Steps:**

1.  **Button Integration:** Already part of Stub 3 (Seller Group Section).
2.  **Styling:** Ensure it's a full-width primary button as per spec.
3.  **JavaScript (Placeholder Interaction):**
    *   On click: `alert('Checkout with ' + sellerName + ' clicked. Total: ' + sellerSubtotal);`
    *   Actual checkout flow is a major feature beyond this UI phase.

---

## Stub 7: Cart Persistence & Skeleton Loading (Polish)

**Objective:** Enhance perceived performance with skeleton screens when loading the cart.

**Steps:**

1.  **Cart Persistence:**
    *   The `shoppingCart` array in `app.ts` already provides client-side persistence for the session.
    *   If persistence across browser sessions is needed, `localStorage` could be used in `addToCart`, `removeFromCart`, `updateCartQuantity`, and initialization logic (beyond current scope but good to note).
2.  **Skeleton Loading (Initial Implementation):**
    *   When `renderCartPage()` is called:
        *   Immediately render a simplified, static HTML structure that mimics the cart layout (e.g., gray boxes for seller headers, item rows).
        *   Then, asynchronously (e.g., `setTimeout` for simulation, or after actual data processing) replace the skeleton with the real cart content.
    *   This is primarily a UX enhancement for perceived speed.

---

## Stub 8: Testing and Verification

**Objective:** Ensure the Shopping Cart Page is functional, accurate, and interactive.

**Steps:**

1.  **Navigation & Display:**
    *   Verify the "Cart" tab loads the Cart Page.
    *   Add items from Product Detail Page; verify they appear in the cart.
    *   Check for correct grouping by seller.
2.  **Item Row Functionality:**
    *   Test quantity steppers for multiple items; verify line totals and subtotals update.
    *   Test "Remove" button for items; verify they are removed and totals update.
3.  **Data Accuracy:**
    *   Confirm product thumbnails, names, and prices are correct.
    *   Verify seller names and subtotals.
    *   Verify global total (if displayed).
4.  **Checkout Buttons:** Test placeholder action for per-seller checkout buttons.
5.  **Empty Cart:** Verify the cart displays a user-friendly message if empty (e.g., "Your cart is empty. Start shopping!").
6.  **Responsiveness:** Check layout on different screen sizes.
7.  **Styling & State Indicators:** Review for consistency, clear information hierarchy, and good visual feedback on interactions.
8.  **No Console Errors.**

---

**Expected Outcome:**
*   A functional "Cart" tab and page that accurately reflects the `shoppingCart` state.
*   Items correctly grouped by seller.
*   Interactive item rows for quantity changes and removal.
*   Display of subtotals and per-seller checkout buttons (with placeholder action).
*   Foundation for future enhancements like full checkout integration and cross-session persistence.
*   Modification of `ShoppingCartItem` and `addToCart` to include seller information. 