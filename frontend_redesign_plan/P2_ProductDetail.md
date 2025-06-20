# Phase 2: Product Detail Page

**Goal:** Implement the Product Detail Page, displaying comprehensive information about a single product, including image carousel, ratings, variant selection, CTAs, and collapsible description sections.

**Depends on:** Phase 0, Phase 1 (for product data structure and navigation context)

**Key Considerations:**
*   Layout and hierarchy must follow "Product Page Specifications".
*   Components like image carousel, rating display, quantity stepper, and accordions need to be developed or integrated.
*   Preserve existing `sampleProducts` data structure for populating the page.
*   "Add to cart" functionality should use existing `addToCart` logic from `app.ts`.

---

## Stub 1: Product Detail Page Structure & Navigation

**Objective:** Create the basic structure for the Product Detail Page and enable navigation to it from the product grid.

**Steps:**

1.  **Define Product Detail Page Routing/Logic (in `app.ts` or `pages/productDetail.ts`):**
    *   Create a function `renderProductDetailPage(productId: string)` that will:
        *   Find the product in `sampleProducts` using `productId`.
        *   If not found, display a "Product not found" message.
        *   Generate the HTML for the product detail page using the product's data.
        *   Render this HTML into the `#page-content` div.
    *   The page should have a clear "Back" button or rely on browser/app navigation to return to the previous view (e.g., Home page grid).
2.  **Update Product Grid Interaction (from P1 Stub 4):**
    *   Modify the product card click listener in the product grid (from Phase 1) to call `renderProductDetailPage(product.id)` instead of just logging to console.
3.  **Page Title:** Dynamically set a page title (e.g., in the simplified header or document title) to the product name.

---

## Stub 2: Implement Image Carousel

**Objective:** Develop a full-width swipeable image carousel for product images.

**Steps:**

1.  **HTML Structure for Carousel:**
    *   Container for the carousel.
    *   Slides for each product image (initially, use the single `product.image`, but design for multiple).
    *   Dot indicators for navigation.
    *   Optional: Previous/Next arrow buttons.
2.  **CSS Styling for Carousel:**
    *   Ensure full-width display.
    *   Style slides, dot indicators, and arrows.
    *   Maintain aspect ratio for images to avoid distortion.
    *   Use Tailwind CSS for layout and styling.
3.  **JavaScript for Carousel Functionality:**
    *   Implement swipe gestures for mobile (can use a lightweight library or custom JS).
    *   Implement click on dot indicators to navigate.
    *   Support pinch-to-zoom (this might require a library or be a more advanced feature for later refinement; for now, ensure basic image display is good).
    *   Focus on a single image display first if carousel is complex, then iterate. The spec mentions `shopney.co` as an example.

---

## Stub 3: Implement Ratings & Reviews Section

**Objective:** Display average rating, review count, star distribution, and recent review snippets.

**Steps:**

1.  **HTML Structure (based on `shop.app` example):**
    *   Average rating badge (e.g., "4.7").
    *   Total review count (e.g., "363 ratings").
    *   Horizontal bar chart for 5-star to 1-star distribution (can be simple divs styled with widths or a basic chart component).
    *   Snippet area for 2-3 most recent reviews (use placeholder text for now, as actual review data isn't in `sampleProducts`).
    *   "Read more reviews" link (placeholder action).
2.  **CSS Styling:**
    *   Style the badge, text, bar chart elements.
    *   Use existing theme colors and typography.
3.  **Data Population:**
    *   Use `product.rating` and `product.reviewCount` from `sampleProducts`.
    *   For the bar chart, if detailed star distribution isn't available, show the average rating prominently.

---

## Stub 4: Implement Product Header & Price

**Objective:** Display merchant logo/name, product title, rating summary, and price.

**Steps:**

1.  **HTML Structure (based on `shop.app` example):**
    *   Merchant logo/name (linkable, placeholder for now). Use `product.seller`.
    *   Product title in H1 (20pt). Use `product.name`.
    *   Rating summary badge (re-use/adapt from Stub 3).
    *   Price in H2 (24pt) with currency styling. Use `product.price`.
2.  **CSS Styling:**
    *   Apply specified font sizes and styles.
    *   Ensure proper hierarchy and spacing.

---

## Stub 5: Implement Variant & Quantity Controls

**Objective:** Add controls for selecting product variants (if any) and quantity.

**Steps:**

1.  **HTML Structure (based on `shop.app` example):**
    *   **Variants:** Dropdown or radio group for variants (e.g., Size, Color).
        *   Since `sampleProducts` doesn't have variants, create a placeholder (e.g., a disabled dropdown or a note "No variants for this product"). This sets up the UI for future backend integration.
    *   **Quantity Stepper:**
        *   Input field (type number) displaying current quantity (default 1).
        *   "–" button to decrease quantity.
        *   "+" button to increase quantity.
2.  **CSS Styling:**
    *   Style dropdowns, radio buttons, and the stepper control to be clear and touch-friendly (≥44px).
    *   Align adjacent to price if feasible.
3.  **JavaScript for Quantity Stepper:**
    *   Initialize quantity to 1.
    *   Increment/decrement quantity on button clicks.
    *   Prevent quantity from going below 1.
    *   Store the selected quantity for "Add to cart".

---

## Stub 6: Implement Primary CTAs (Add to Cart, Buy Now)

**Objective:** Add "Add to cart" and "Buy now" buttons.

**Steps:**

1.  **HTML Structure (based on `shop.app` example):**
    *   Two side-by-side buttons:
        *   "Add to cart" (primary, filled style using your `--main-color`).
        *   "Buy now" (secondary, outline style).
    *   Ensure minimum touch target of 44px.
2.  **CSS Styling:**
    *   Style primary and secondary buttons using Tailwind and existing theme colors.
    *   Ensure clear visual distinction.
3.  **JavaScript for "Add to Cart":**
    *   On click, call the existing `addToCart(productId, productName, productPrice, productImage)` function from `app.ts`.
    *   Pass the current product's details and the selected quantity (from Stub 5).
    *   Show a toast notification "Added to cart" (implement basic toast in P5 or use alert for now).
4.  **JavaScript for "Buy Now" (Placeholder):**
    *   For now, this button can either be disabled, or perform the same action as "Add to cart" and then navigate to the (future) cart page.
    *   `alert('\"Buy Now\" clicked - will proceed to checkout.');`

---

## Stub 7: Implement Description & Policies Accordions

**Objective:** Display product description and policies in collapsible accordions.

**Steps:**

1.  **HTML Structure (based on `shop.app` example):**
    *   Create accordion items for "Description," "Shipping Policy," and "Refund Policy."
    *   Each item:
        *   Header with title and chevron icon (FontAwesome).
        *   Content panel (initially hidden).
    *   Use `product.provenance` or other available fields from `sampleProducts` for the "Description". Add placeholder text for Shipping/Refund policies.
2.  **CSS Styling:**
    *   Style accordion headers and content panels.
    *   Style chevron icon to indicate expand/collapse state.
3.  **JavaScript for Accordion Functionality:**
    *   Toggle content panel visibility on header click.
    *   Animate chevron icon rotation.
    *   Ensure only one or multiple accordions can be open based on desired UX (spec implies multiple).

---

## Stub 8: Implement Merchant Actions (Follow, Favorite)

**Objective:** Add "Follow Seller" and "Favorite product" actions.

**Steps:**

1.  **HTML Structure (based on `shop.app` example):**
    *   Inline "Follow Seller" button next to merchant name (from Stub 4).
    *   Heart icon to "Favorite product" (can be the same as product card or a new instance).
2.  **CSS Styling:** Style the button and icon.
3.  **JavaScript (Placeholder Interaction):**
    *   "Follow Seller": `alert('Follow Seller clicked');`
    *   "Favorite product": Toggle heart icon style (e.g., filled/unfilled) and `alert('Favorite clicked');`. This state will be local for now.

---

## Stub 9: Testing and Verification

**Objective:** Ensure the Product Detail Page displays correctly, is interactive, and integrates with existing systems.

**Steps:**

1.  **Navigation:** Verify navigation from product grid to detail page works.
2.  **Content Display:** Check all sections: carousel (basic image), ratings, header, price, CTAs, accordions, merchant actions.
3.  **Data Accuracy:** Ensure product-specific data from `sampleProducts` is correctly shown.
4.  **Interactivity:**
    *   Test quantity stepper.
    *   Test "Add to Cart" button (verify item is added using existing cart logic, check console or cart count if displayed globally).
    *   Test "Buy Now" placeholder.
    *   Test accordions expand/collapse.
    *   Test placeholder favorite/follow actions.
5.  **Responsiveness:** Check layout on different screen sizes. Ensure touch targets are adequate.
6.  **Styling & Accessibility:** Review for consistency with global styles and basic accessibility (readable text, focus indicators).
7.  **No Console Errors.**

---

**Expected Outcome:**
*   A fully functional (though initially with some placeholder data/actions) Product Detail Page.
*   Reusable components for image display, quantity control, and accordions.
*   Integration with existing `addToCart` functionality.
*   Clear path for future enhancements (e.g., real reviews, variant data, full favorite/follow logic). 