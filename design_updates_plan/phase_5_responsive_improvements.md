# Phase 5: Responsive Improvements

This phase aims to ensure the application layout adapts gracefully to different window sizes. While it's a desktop app, users might resize the window, and a responsive design provides a better experience.

**Testing Steps:**
*   After each step, run `pnpm tauri dev`.
*   Resize the application window to various widths (e.g., narrow, medium, wide) and heights.
*   Check for layout breaks, overlapping content, or unreadable text.
*   Use browser developer tools' responsive mode if testing in a browser before building with Tauri, or simply resize the Tauri window.
*   Verify that content reflows, stacks, or adjusts as expected.
*   Run E2E tests: `pnpm exec playwright test`. While E2E tests might not cover all responsive states by default, ensure the main layout doesn't break in a way that makes tests fail.

---

## 5.1. Responsive Grid for Product Listings

The current product listing appears to be a flex container. We need to ensure it wraps correctly and product cards resize appropriately.

**Files:** `src/index.css`, `src/app.ts` (for product listing generation)

**Checklist:**

*   [ ] **Ensure Product Listing Container is Flexible:**
    *   In `src/app.ts`, when generating the container for product cards (e.g., inside `renderProducts` or similar function in `contentData.allProducts.htmlFactory`), ensure the container uses flexbox with wrapping.
    *   _Example (if products are directly in `#content-section` or a child div):_
        The `#content-section` or its primary child for products should ideally be `flex flex-wrap gap-4` (or `gap-6`) via Tailwind.
        If a specific `div` wraps products, e.g. `<div id="product-grid" class="flex flex-wrap gap-6 justify-center">`, ensure these classes are present.
        The `justify-center` can help when the last row isn't full.

*   [ ] **Define Responsive Product Card Widths (CSS or Tailwind):**
    *   Product cards should have a base width and potentially grow, but not shrink too much.
    *   **Option A (Using Tailwind in `src/app.ts`):**
        *   When generating product cards, apply responsive width classes.
        *   Example: `class="product-card ... w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"`
        *   This requires Tailwind's default breakpoints or custom ones to be effective. The existing setup uses `w-[calc(33.333%-1rem)]` which is quite specific. A more flexible approach might be better.
        *   Consider changing to something like: `flex-grow-0 flex-shrink-0 w-full sm:max-w-xs md:max-w-sm` and let the `gap` in the parent control spacing. Or, use fixed widths that wrap: `w-72` (for example).
    *   **Option B (Using CSS in `src/index.css`):**
        ```css
        .product-card {
            /* ... existing styles ... */
            width: 100%; /* Default for smallest screens/narrow windows */
            min-width: 280px; /* Prevent shrinking too much */
            max-width: 320px; /* Optional: prevent growing too large if using flex-grow */
            /* Using flex-basis with flex-grow and flex-shrink in a flex container is often more robust */
            flex: 1 1 280px; /* Grow, shrink, with a basis of 280px. Parent must be display:flex; flex-wrap:wrap */
        }

        /* Example using @media queries if not relying on parent flex-wrap + flex-basis for sizing.
           This is generally less ideal than flexbox solutions for grids.
        @media (min-width: 640px) { // Tailwind's 'sm'
            .product-card {
                width: calc(50% - 1rem); // Assuming a 2rem gap, 1rem per side
            }
        }
        @media (min-width: 768px) { // Tailwind's 'md'
            .product-card {
                width: calc(33.333% - 1rem);
            }
        }
        // etc.
        */
        ```
    *   **Recommendation:** Given the current structure dynamically generates HTML, using responsive Tailwind classes on the product cards within a `flex flex-wrap` parent is often the cleanest. Let's assume the parent of product cards (e.g. `product-grid` div) will have `flex flex-wrap gap-4 justify-start`.
    *   Modify product card generation in `src/app.ts`:
        Change from fixed width like `w-[calc(33.333%-1rem)]` to something like:
        `class="product-card ... w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.66rem)] lg:w-[calc(25%-0.75rem)]"`
        This accounts for a `gap-4` (1rem). So for 2 items: `(100% - 1rem) / 2 = 50% - 0.5rem`. For 3: `(100% - 2rem) / 3 = 33.333% - 0.66rem`. For 4: `(100% - 3rem) / 4 = 25% - 0.75rem`.

*   [ ] **Visual Test:** Resize the window. Product cards should wrap into multiple rows and adjust their width. Check for consistent spacing.

---

## 5.2. Responsive Panels

The three-panel layout (`first-panel`, `second-panel`, `content-section`) might need adjustments. For very narrow windows, the side panels could become too small or content within them could be cramped.

**Files:** `index.html`, `src/index.css`

**Checklist:**

*   [ ] **First Panel (Navigation):**
    *   Currently `w-20` (5rem). This might be acceptable even on narrow views if it's icon-based.
    *   If text is included and wraps badly on narrow views, consider:
        *   Hiding text labels and showing only icons at very small widths (requires JS or more complex CSS).
        *   Slightly reducing padding or font size for panel items at small widths via media queries.
    *   For now, we assume `w-20` is fixed, as per its current styling. The designer hasn't specified responsive behavior for this panel.

*   [ ] **Second Panel (Sub-navigation/Filters):**
    *   Currently `w-64` (16rem). This could take up too much space on a very narrow window.
    *   **Option 1 (Stacking):** At a certain breakpoint, the second panel could stack above or below the content section, or become an off-canvas menu. This is a significant change.
    *   **Option 2 (Reduced Width/Collapsible):** Reduce its width, or make it collapsible.
    *   **Option 3 (Allow Content Overflow):** Set a `min-width` and allow `overflow-y: auto;` if content exceeds height.
    *   **Designer's Suggestion:** "Consider how panels behave on smaller window sizes. Maybe the second panel could be hidden and toggled with a button if the window is too narrow."
    *   **Implementation Idea (Simple Width Reduction):**
        In `index.html`, change `w-64` to responsive classes: `w-64 md:w-56 sm:w-48`.
        This is a basic approach. A toggle mechanism is more complex. Let's start with width adjustment.
        `<aside id="second-panel" class="bg-secondary p-4 shadow-lg rounded-lg overflow-y-auto w-full sm:w-52 md:w-60 lg:w-64 transition-all duration-300">`
        The `w-full` for the smallest size would make it stack by default if the parent `main-layout` is flex and becomes `flex-col sm:flex-row`.
    *   Modify `main-layout` in `index.html`:
        Change from `<main class="flex flex-1 overflow-hidden">` to:
        `<main class="flex flex-col sm:flex-row flex-1 overflow-hidden">`
        This will stack panels vertically on very small screens (Tailwind's default, less than `sm` breakpoint).
        The `first-panel` (nav) might also need to be part of a different flex arrangement if it should always be vertical. Current `body` is `flex`, `main-content-wrapper` is `flex flex-col`, then `main-layout` is `flex sm:flex-row`. This setup seems reasonable.

*   [ ] **Content Section:**
    *   Should be flexible (`flex-1`) to take remaining space. This is already the case.
    *   Ensure its padding (Phase 1: `2rem`) is not too large for very narrow views.
        ```css
        /* src/index.css */
        #content-section {
            background-color: var(--secondary-color); /* or --background-color */
            padding: 1rem; /* Default for small */
            /* Transitions and other styles */
        }
        @media (min-width: 640px) { /* sm */
            #content-section {
                padding: 1.5rem;
            }
        }
        @media (min-width: 1024px) { /* lg */
            #content-section {
                padding: 2rem; /* Restore original target padding for larger views */
            }
        }
        ```

*   [ ] **Info Panel (`#info-panel`):**
    *   Similar to the second panel, it has `w-72`.
    *   Apply similar responsive width classes or stacking behavior if it's part of the main flex layout.
        If it's meant to be a right sidebar:
        `<aside id="info-panel" class="bg-secondary p-4 shadow-lg rounded-lg overflow-y-auto w-full sm:w-60 md:w-68 lg:w-72 transition-all duration-300 hidden xl:flex flex-col">`
        And ensure the parent container of `content-section` and `info-panel` is `flex`.
        The `hidden xl:flex` makes it appear only on `xl` screens. This is a common pattern for tertiary sidebars.

*   [ ] **Visual Test:** Resize the window. Observe how the panels adjust.
    *   At very narrow sizes, panels should stack vertically.
    *   As width increases, they should arrange into the three-column layout.
    *   Info panel should appear on larger screens.
    *   Check for content clipping or overflow issues.

---

## 5.3. Responsive Typography

Ensure text remains readable and well-proportioned at different window sizes.

**File:** `src/index.css`

**Checklist:**

*   [ ] **Base Font Size:**
    *   The base font size (1rem = 16px) is generally good. Avoid changing the root font size with media queries unless absolutely necessary, as `rem` units should scale from user preferences.

*   [ ] **Heading Adjustments (Optional):**
    *   If headings from Phase 4 appear too large on very small screens, you can introduce subtle adjustments.
    *   Example for `h1`:
        ```css
        h1, .text-h1 {
          font-size: 1.875rem; /* ~30px for small screens */
          /* ... other h1 styles ... */
        }
        @media (min-width: 768px) { /* md */
          h1, .text-h1 {
            font-size: 2.25rem; /* ~36px, original size */
          }
        }
        /* Similar adjustments for h2, h3 if needed */
        h2, .text-h2 {
            font-size: 1.625rem; /* ~26px */
            /* ... */
        }
        @media (min-width: 768px) { /* md */
            h2, .text-h2 {
                font-size: 1.875rem; /* ~30px */
            }
        }
        ```
    *   **Recommendation:** Apply this sparingly. Good line heights and margins often suffice.

*   [ ] **Visual Test:** Check text, especially headings, at various window sizes. Ensure they don't dominate the layout on small screens.

---

## 5.4. Responsive Images/Media

If images are used (e.g., product images), ensure they scale correctly.

**File:** `src/index.css` (or Tailwind classes in `src/app.ts`)

**Checklist:**

*   [ ] **Max Width for Images:**
    *   Ensure images don't overflow their containers.
    *   Apply `max-w-full h-auto` (Tailwind) or `max-width: 100%; height: auto;` (CSS) to images. This is standard practice.
    *   The product image in `src/app.ts` (`<img src="${product.image}"... class="w-full h-48 object-cover">`) already uses `w-full` and `object-cover`, which is good for responsiveness within its container. `h-48` sets a fixed height, which might be fine if the card dimensions are also controlled.

*   [ ] **Visual Test:** If product images are present, check their scaling as the product cards resize.

---

End of Phase 5.
The application should now offer a more consistent experience across various window dimensions.
Run E2E tests: `pnpm exec playwright test`. 