# Phase 5: Polish, UX Enhancements & "Search" Tab Placeholder

**Goal:** Refine the user experience by implementing consistent loading states, feedback mechanisms (toasts), micro-interactions, and ensuring accessibility. Also, set up a placeholder for the "Search" tab/page.

**Depends on:** Phase 0, 1, 2, 3, 4 (all previous phases for comprehensive application)

**Key Considerations:**
*   Focus on consistent application of UX patterns across all implemented pages.
*   Skeleton screens should match component shapes as specified.
*   Toast notifications should be non-intrusive.
*   Accessibility is an ongoing concern, but this phase includes a dedicated review.

---

## Stub 1: Implement "Search" Tab & Placeholder Page

**Objective:** Add the "Search" tab to the bottom navigator and create a basic placeholder page for it.

**Steps:**

1.  **Add "Search" Tab to Navigator (`index.html` & `app.ts`):**
    *   Add a "Search" button/link to the `#bottom-tab-bar` HTML in `index.html` (similar to Home, Cart, Profile tabs, with icon and label).
    *   Update tab navigation logic in `app.ts` to handle the "Search" tab click.
2.  **Define "Search" Placeholder Page (in `app.ts` or `pages/search.ts`):**
    *   Create a function `renderSearchPage()` that returns HTML for a simple placeholder page.
    *   Content could include:
        *   A title: "Search Products".
        *   A search input field (non-functional for now, or logs input to console).
        *   A message: "Search functionality coming soon."
3.  **Navigation Logic:** When the "Search" tab is clicked, `renderSearchPage()` is called, and its content is displayed in `#page-content`.

---

## Stub 2: Implement Skeleton Loading States

**Objective:** Implement skeleton screens for major content areas to improve perceived performance during loading.

**Steps:**

1.  **Identify Key Loading Areas:**
    *   Product Grid (Home Page, Profile Page products tab).
    *   Product Detail Page (when navigating to it).
    *   Shopping Cart Page (as initiated in P4 Stub 7.2).
    *   Profile Page header/content.
2.  **Design Skeleton Components:**
    *   For each area, create simplified HTML/CSS that mimics the shape and structure of the content being loaded (e.g., gray rectangles for images, lines for text).
    *   Use Tailwind CSS for styling.
3.  **Integration into Rendering Logic:**
    *   Modify page rendering functions (e.g., `renderHomePage`, `renderProductDetailPage`, `renderCartPage`, `renderProfilePage`):
        *   Immediately display the corresponding skeleton structure in `#page-content`.
        *   Then, proceed with fetching/processing data and rendering the actual content, replacing the skeleton.
        *   Simulate delay with `setTimeout` if actual data loading is instant (for `sampleProducts`) to observe the effect.

---

## Stub 3: Implement Toast Notifications

**Objective:** Provide non-intrusive feedback for actions like "Added to cart."

**Steps:**

1.  **Create Toast Component HTML/CSS (in `app.ts` or `components/toast.ts`):**
    *   A `div` for the toast message, positioned typically at the top or bottom of the screen.
    *   Styling for different types (success, error - though spec focuses on "Added to cart" confirmation for now).
    *   Initially hidden.
2.  **JavaScript for Toast Functionality:**
    *   Function `showToast(message: string, type: 'success' | 'error' = 'success')`:
        *   Sets the toast message and style.
        *   Makes the toast visible.
        *   Automatically hides the toast after a few seconds (e.g., 3 seconds).
3.  **Integration:**
    *   Call `showToast("Added to cart")` in the `addToCart` logic on the Product Detail Page (P2 Stub 6.3) instead of `alert`.
    *   Identify other areas where toast notifications might be useful (e.g., favoriting a product, following a seller - even for placeholder actions).

---

## Stub 4: Implement Micro-Interactions

**Objective:** Enhance user experience with subtle animations and feedback on interactions.

**Steps:**

1.  **Button Press Animation:**
    *   Apply CSS transform `scale(0.95)` on button active/press state.
    *   Use Tailwind's `active:scale-95` utility.
    *   Ensure smooth transition: `transition-transform duration-100 ease-in-out`.
    *   Optionally, implement a ripple effect (can be CSS-only or with minimal JS; many Tailwind component libraries offer this).
2.  **Favorite Heart Pulse:**
    *   When the heart icon (on product cards, product detail page) is tapped/clicked:
        *   Apply a brief pulse animation (e.g., scale up and down quickly using CSS animations or transitions).
        *   This should occur when its state changes (favorited/unfavorited).
3.  **Apply Consistently:** Review all major interactive elements (buttons, tabs, icons) and apply these or similar subtle interaction cues.

---

## Stub 5: Accessibility Review & Enhancements (WCAG)

**Objective:** Ensure the application meets WCAG guidelines for contrast, focus, and ARIA labeling.

**Steps:**

1.  **Contrast Check:**
    *   Use browser developer tools or online contrast checkers to verify text and UI elements against background colors meet 4.5:1 ratio (or 3:1 for large text).
    *   Adjust colors in `tailwind.config.js` or `src/index.css` if issues are found. Pay attention to your adapted `--main-color` and grays.
2.  **Focus-Visible Outlines:**
    *   Ensure all interactive elements (links, buttons, inputs, tabs) have clear, visible focus outlines when navigated via keyboard.
    *   Tailwind provides default focus rings; customize them if needed to match your theme while ensuring visibility.
3.  **ARIA Roles and Labels:**
    *   Review all interactive components developed:
        *   Buttons: Ensure they have descriptive text or `aria-label` if only an icon.
        *   Inputs: Associated with `label` elements or have `aria-label`.
        *   Custom controls (carousel, accordions, tabs): Ensure appropriate ARIA roles (e.g., `tablist`, `tab`, `tabpanel`, `button` for accordion headers) and properties (`aria-selected`, `aria-expanded`, `aria-controls`).
    *   Image `alt` text: Ensure all meaningful images (product images, avatars) have descriptive `alt` text. Decorative images can have `alt=""`.
4.  **Keyboard Navigation:**
    *   Test navigating the entire application using only the keyboard. Ensure all interactive elements are reachable and operable.
    *   Check tab order for logical flow.
5.  **Screen Reader Testing (Basic):**
    *   Use a screen reader (e.g., NVDA, VoiceOver) to perform a basic walkthrough of main pages.
    *   Listen for how elements are announced; identify any confusing or missing information.

---

## Stub 6: General Polish & UX Review

**Objective:** Conduct a final pass over the application for visual consistency, minor bugs, and overall user experience improvements.

**Steps:**

1.  **Visual Consistency:**
    *   Check all pages for consistent application of typography, spacing (8px grid), colors, rounded corners, and button styles.
2.  **Interactive States:**
    *   Verify hover, active, focus, and disabled states are clear and consistent for all interactive elements.
3.  **Edge Cases & Empty States:**
    *   Test empty cart page (already covered in P4).
    *   Consider empty product grids (if a category/search yields no results in the future).
    *   Test product not found on detail page.
4.  **Text & Copy:** Review all static text for clarity, grammar, and typos.
5.  **Performance Feel:** With skeleton loaders and micro-interactions, assess the overall perceived speed and responsiveness.
6.  **Cross-Browser/Device Testing (Basic):**
    *   Perform a quick check on a different browser and simulate mobile view using developer tools to catch major layout issues.

---

## Stub 7: Final Testing and Verification

**Objective:** Ensure all polish and UX enhancements are implemented correctly and the application is stable.

**Steps:**

1.  **Search Tab:** Verify placeholder Search page loads.
2.  **Skeleton Screens:** Confirm they appear during content loading on relevant pages.
3.  **Toast Notifications:** Test "Added to cart" toast and any others implemented.
4.  **Micro-Interactions:** Check button press and favorite heart animations.
5.  **Accessibility:** Re-verify a few key focus points from Stub 5 after any changes.
6.  **Overall Flow:** Navigate through common user journeys (e.g., Home -> Product Detail -> Add to Cart -> View Cart).
7.  **No Console Errors.**

---

**Expected Outcome:**
*   A more polished and refined user interface with improved perceived performance and feedback.
*   Consistent application of skeleton loading, toast notifications, and micro-interactions.
*   Enhanced accessibility adhering to WCAG guidelines.
*   A placeholder "Search" page ready for future functionality.
*   A production-ready frontend baseline that addresses the initial UI/UX goals. 