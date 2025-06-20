# Phase 1: "Home" Page & Basic Product Grid Display

**Goal:** Implement the "Home" tab as the initial landing view and develop a reusable responsive product grid component to display products. This grid will initially use the existing `sampleProducts` data.

**Depends on:** Phase 0 (Foundation & Global Setup)

**Key Considerations:**
*   The "Home" page should feel welcoming and potentially guide users.
*   The product grid must be responsive (2-column phone, 4-column tablet as per spec).
*   Preserve existing styling for product cards where appropriate (rounded corners, shadows) while adapting to new spec dimensions/content.
*   Ensure smooth data flow from `sampleProducts` to the grid.

---

## Stub 1: Create Basic "Home" Page Content

**Objective:** Define and render the initial content for the "Home" tab.

**Steps:**

1.  **Define "Home" Page Structure (in `app.ts` or a new module, e.g., `pages/home.ts`):**
    *   Create a function that returns HTML string or DOM elements for the Home page.
    *   Content could include:
        *   A welcoming headline (e.g., "Welcome to The REGRU Marketplace").
        *   Optional: A brief introduction or featured categories/promotions (placeholders for now).
        *   A section that will host the product grid.
2.  **Update Navigation Logic (in `app.ts`):**
    *   Modify the tab navigation logic (from P0 Stub 2.3) so that clicking the "Home" tab:
        *   Calls the function to get "Home" page HTML.
        *   Renders this HTML into the `#page-content` div.
        *   Sets the "Home" tab as active.
    *   Ensure the "Home" page is loaded by default when `initializeApp()` runs.
3.  **Styling:**
    *   Apply basic styling for the Home page content using Tailwind CSS, adhering to global styles (fonts, colors, spacing) established in Phase 0.

---

## Stub 2: Develop Responsive Product Card Component

**Objective:** Create the HTML structure and styling for a single product card as per "Profile Page Specifications" (for the grid part) but make it reusable.

**Steps:**

1.  **Define Product Card HTML Structure (as a template function in `app.ts` or `components/productCard.ts`):**
    *   The function should take a `Product` object (using existing interface from `app.ts`) as input.
    *   Card structure:
        *   Outer `div` for the card with appropriate padding (12px), border, rounded corners, and shadow.
        *   Product image (`img` tag): 1:1 aspect ratio. Use `sampleProducts[n].image`.
        *   Product title (`h3` or `p`): 14pt. Use `sampleProducts[n].name`.
        *   Price (`p`): 16pt, bold. Use `sampleProducts[n].price`, formatted as currency.
        *   Rating stars (placeholder for now, can be simple text like "Rating: 4/5" or actual star icons if easy). Use `sampleProducts[n].rating`.
        *   Heart icon for favorites (FontAwesome icon). Add a class for future interaction.
    *   Ensure the card itself has a minimum touch target or its interactive elements do.
2.  **Styling Product Card (`src/index.css` or Tailwind):**
    *   Apply Tailwind classes for image aspect ratio, font sizes, text styling, spacing within the card.
    *   Use existing theme colors for text, icons, and potentially borders/backgrounds.
    *   Ensure "nice rounded corners" are applied.
3.  **Accessibility:** Add `aria-label` or appropriate ARIA roles to interactive elements like the favorite icon.

---

## Stub 3: Implement Responsive Product Grid Component

**Objective:** Create a component that takes an array of `Product` objects and displays them in a responsive grid using the product card component.

**Steps:**

1.  **Define Product Grid HTML Structure (function in `app.ts` or `components/productGrid.ts`):**
    *   The function should take `Product[]` as input.
    *   Outer `div` for the grid.
    *   Use Tailwind CSS grid classes:
        *   `grid grid-cols-2` for mobile (default).
        *   `md:grid-cols-4` or `lg:grid-cols-4` for tablet/desktop (adjust breakpoint as needed).
        *   Apply `gap-4` (for 16px gutters, assuming 8px grid means gap is `spacing[4]`).
    *   Iterate through the array of products, calling the product card component function for each and appending the result to the grid container.
2.  **Integrate Grid into "Home" Page:**
    *   Modify the "Home" page generation logic (Stub 1.1) to:
        *   Fetch `sampleProducts` (currently a global const in `app.ts`).
        *   Call the product grid component function with this data.
        *   Place the resulting grid HTML into the designated section on the Home page.
3.  **Styling:** Ensure the grid itself has appropriate padding or margins if needed, distinct from card padding.

---

## Stub 4: Basic Product Interaction (Placeholder)

**Objective:** Add basic click handling to product cards to simulate navigation to a product detail page (which will be built in Phase 2).

**Steps:**

1.  **Add Event Listeners:**
    *   Modify the product card component to make the card itself (or the image/title) clickable.
    *   When a card is clicked, log the `product.id` to the console.
    *   Optionally, display a simple alert or update a status message indicating navigation to a detail page would occur. E.g., `alert(\`Navigating to product ${product.id}\`);`
2.  **Preserve State (if applicable):** No complex state to preserve for this stub, but keep in mind that future interactions (like favorite status) will need it.

---

## Stub 5: Testing and Verification

**Objective:** Ensure the Home page and product grid display correctly and are responsive.

**Steps:**

1.  **Home Page Rendering:**
    *   Verify the Home page loads as the default view.
    *   Check content (welcome message, product grid section).
2.  **Product Grid Display:**
    *   Confirm products from `sampleProducts` are displayed in the grid.
    *   Check individual product cards for correct image, title, price, and rating display.
    *   Verify heart icon is present.
3.  **Responsiveness:**
    *   Test on different screen sizes:
        *   Mobile: Grid should be 2 columns.
        *   Tablet/Desktop: Grid should be 4 columns.
    *   Ensure cards and their content adapt reasonably.
4.  **Interaction:** Clicking a product card should trigger the console log or alert defined in Stub 4.
5.  **Styling Consistency:** Check for consistent use of fonts, colors, spacing, and rounded corners.
6.  **No Console Errors.**

---

**Expected Outcome:**
*   A functional "Home" tab displaying introductory content and a product grid.
*   A reusable, responsive product card component.
*   A responsive product grid component displaying items from `sampleProducts`.
*   Basic click interaction on product cards, ready for future navigation to product detail pages. 