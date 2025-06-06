# Phase 7: Quick Wins for Modern Feel

This phase incorporates a set of specific "quick win" suggestions from the designer to further enhance the modern aesthetic of the application. Some of these may overlap with or finalize items from previous phases.

**Testing Steps:**
*   After each set of changes, visually inspect the application (`pnpm tauri dev` is running).
*   Verify that the changes produce the desired modern feel without introducing regressions.
*   Run E2E tests: `pnpm exec playwright test`.

---

## 7.1. Rounded Corners Everywhere (Final Review)

**Objective:** Ensure consistent and slightly larger rounded corners across the application.

**Files:** `index.html`, `src/app.ts`, `src/index.css`

**Checklist:**

*   [ ] **Panels in `index.html`:**
    *   Confirm all main panels (`#first-panel`, `#second-panel`, `#main-heading-container`, `#content-section`, `#info-panel`) have the `rounded-lg` class. (This was an item in Phase 1.2).
    *   _Action:_ Review `index.html` and ensure `rounded-lg` is applied.

*   [ ] **HTML Generation in `src/app.ts`:**
    *   Systematically change any remaining `rounded-md` classes in dynamically generated HTML to `rounded-lg`. (This was an item in Phase 1.2).
    *   _Action:_ Search `src/app.ts` for `rounded-md` and replace with `rounded-lg` on elements like internal containers, buttons, input groups, etc., where appropriate. Product cards were set to `rounded-xl` (0.75rem) in Phase 1.2, which is larger than `rounded-lg` (0.5rem), so those should remain. This applies to other general elements.

*   [ ] **Inputs in `src/index.css`:**
    *   Inputs were set to `border-radius: 0.375rem;` (`rounded-md`) in Phase 1.2. The designer suggests "rounded-lg everywhere".
    *   _Action:_ Update the CSS rule for inputs in `src/index.css` to use a larger radius, e.g., `0.5rem` for `rounded-lg`.
        ```css
        /* src/index.css */
        input[type="search"], input[type="text"], textarea, select {
            border-radius: 0.5rem; /* MODIFIED - equivalent to rounded-lg */
            /* ... other styles ... */
        }
        ```

*   [ ] **Visual Test:** Check all panels, cards, inputs, buttons, and other bordered elements for consistent `rounded-lg` (or `rounded-xl` for product cards).

---

## 7.2. Increased Whitespace (Review)

**Objective:** Ensure ample spacing for a clean, uncluttered look.

**Files:** `src/index.css`, `src/app.ts`, `index.html`

**Checklist:**

*   [ ] **Padding within Cards:**
    *   Product cards: Review padding. The current card structure in `src/app.ts` includes `p-4` or similar. Assess if this is sufficient or if it needs a slight increase, e.g., to `p-5` or `p-6` as per designer's intent "Increased padding within cards".
    *   _Action:_ In `src/app.ts`, for the main product card div, update padding if necessary. Example: `html += \`<div class="product-card bg-tertiary shadow-custom-card rounded-xl p-5 flex flex-col group">\`;` (changed `p-4` to `p-5`).
*   [ ] **Padding around Sections:**
    *   Padding for `#content-section` was made responsive in Phase 5.3 (e.g., `1rem` up to `2rem`).
    *   Padding for `#first-panel` was set to `1rem 0.5rem` in Phase 1.1.
    *   Review overall section spacing.
    *   _Action:_ Visually inspect and adjust padding values in `src/index.css` or Tailwind classes in `index.html` if any section feels cramped.

*   [ ] **Visual Test:** Check overall layout for a spacious, airy feel. Ensure content isn't too close to edges or other elements.

---

## 7.3. Softer Shadows (Review)

**Objective:** Confirm modern, subtle shadows are used.

**Files:** `src/index.css`, `tailwind.config.js`, `index.html`

**Checklist:**

*   [ ] **Panel and Card Shadows:**
    *   This was addressed in Phase 6.1 by defining and applying `--shadow-panel` and `--shadow-card` (via `shadow-custom-panel`, `shadow-custom-card` Tailwind classes).
    *   _Action:_ Verify these custom shadows are correctly applied to all panels and product cards.

*   [ ] **Visual Test:** Confirm shadows are soft and provide depth without being heavy.

---

## 7.4. Gradient in Header

**Objective:** Add a subtle gradient to the main application header.

**Files:** `index.html` (for the header element), `src/index.css` (for gradient definition)

**Checklist:**

*   [ ] **Define Gradient:**
    *   The header uses `var(--main-color)`. The gradient should go from this to a slightly lighter shade of it.
    *   _Action:_ In `src/index.css` or directly via Tailwind utilities if simple enough.
        Using CSS:
        ```css
        /* src/index.css */
        #main-heading-container {
          /* ... existing styles like padding, text color ... */
          background-image: linear-gradient(to bottom, var(--main-color), color-mix(in srgb, var(--main-color) 85%, white));
          /* Ensure text color provides contrast, e.g., var(--text-light-color) */
        }
        ```
        Remove `bg-main` from `#main-heading-container` in `index.html` if applying via CSS ID.
        If using Tailwind JIT for arbitrary values:
        In `index.html` on `#main-heading-container`:
        `class="... bg-gradient-to-b from-[var(--main-color)] to-[color-mix(in_srgb,var(--main-color)_85%,white)] ..."`
        This Tailwind approach is more direct.

*   [ ] **Visual Test:** Check the main header for a subtle, smooth gradient. Ensure text remains legible.

---

## 7.5. Interactive Hover on Product Title (Review)

**Objective:** Product title changes color to accent on hover.

**Files:** `src/app.ts`

**Checklist:**

*   [ ] **Product Title Hover:**
    *   This was incorporated into the product title generation in Phase 4.3:
        `html += \`<h4 class="text-h4 mb-1 mt-2 group-hover:text-accent transition-colors">${product.name}</h4>\`;`
        This relies on the parent `.product-card` having the `group` class.
    *   _Action:_ Ensure the product card div in `src/app.ts` has the `group` class. Example:
        `html += \`<div class="product-card bg-tertiary shadow-custom-card rounded-xl p-5 flex flex-col group">\`;` (added `group`)

*   [ ] **Visual Test:** Hover over product titles in the product listings. They should change to the accent color.

---

## 7.6. Subtle Dividers (Review)

**Objective:** Use softer borders or margins instead of hard lines for divisions.

**Files:** `src/index.css`, `src/app.ts`

**Checklist:**

*   [ ] **Review Dividers:**
    *   Phase 6.1 mentioned using `border-b border-border-color` for subtle dividers.
    *   _Action:_ Inspect the UI for any hard lines used as dividers. Replace them with subtle borders (e.g., `border-b border-gray-200` or `border-b var(--border-color)`) or simply use margin/padding for separation where appropriate. For example, between items in the second panel, or sections within the info panel.

*   [ ] **Visual Test:** Look for any harsh dividing lines and ensure they are softened or replaced by whitespace.

---

## 7.7. Consistent Button Styling (Primary, Secondary, Tertiary)

**Objective:** Establish and apply clear visual distinctions for different button types.

**Files:** `src/index.css`, `src/app.ts`

**Checklist:**

*   [ ] **Define Button Styles:**
    *   **Primary (e.g., "Add to Cart"):**
        *   Background: `var(--accent-color)`. Text: `var(--text-on-accent-color)`. (Covered by `.add-to-cart-btn` styling from Phase 3 & 6).
        *   Tailwind: `bg-accent text-text-on-accent hover:brightness-90 font-medium rounded-lg ...`
    *   **Secondary (e.g., general actions, "View Details"):**
        *   Background: `var(--main-color)`. Text: `var(--text-light-color)`.
        *   Tailwind: `bg-main text-text-light hover:bg-opacity-80 font-medium rounded-lg ...`
        *   Or, Bordered: `border border-main text-main hover:bg-main hover:text-text-light ...`
    *   **Tertiary/Ghost (e.g., "Cancel", less important actions):**
        *   Background: `transparent` or `var(--gray-200)`. Text: `var(--text-color)` or `var(--main-color)`.
        *   Tailwind: `bg-transparent hover:bg-gray-100 text-text rounded-lg ...` or `bg-gray-200 hover:bg-gray-300 text-text ...`
    *   _Action:_ Create/refine generic button classes in `src/index.css` or ensure Tailwind utility combinations are consistently applied in `src/app.ts` and `index.html` for these types.
        ```css
        /* src/index.css - examples if not purely Tailwind */
        .btn { /* Base button style from Phase 4 */
            /* font-size, font-weight, padding, rounded-lg, transition from button element style */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            /* other base styles */
        }
        .btn-primary {
            background-color: var(--accent-color);
            color: var(--text-on-accent-color);
            /* hover/active states */
        }
        .btn-primary:hover { filter: brightness(0.9); }

        .btn-secondary {
            background-color: var(--main-color);
            color: var(--text-light-color);
        }
        .btn-secondary:hover { background-color: color-mix(in srgb, var(--main-color) 85%, black); }

        .btn-secondary-outline {
            background-color: transparent;
            color: var(--main-color);
            border: 1px solid var(--main-color);
        }
        .btn-secondary-outline:hover {
            background-color: var(--main-color);
            color: var(--text-light-color);
        }

        .btn-tertiary {
            background-color: var(--gray-200);
            color: var(--text-color);
        }
        .btn-tertiary:hover { background-color: var(--gray-300); }
        ```

*   [ ] **Apply Consistently:**
    *   Review all buttons in the application (`index.html`, `src/app.ts`) and apply the appropriate style (Tailwind classes or custom CSS classes).

*   [ ] **Visual Test:** Check all buttons. Ensure primary, secondary, and tertiary actions are visually distinct and styles are consistent.

---

## 7.8. Updated "Add to Cart" Button (Final Review)

**Objective:** Consolidate and confirm styling for the "Add to Cart" button.

**Files:** `src/app.ts`, `src/index.css`

**Checklist:**

*   [ ] **Styling Review:**
    *   Icon on left, text "Add to Cart".
    *   Green background (`var(--accent-color)`).
    *   White text (`var(--text-on-accent-color)`).
    *   Subtle hover effect (e.g., `hover:brightness-90`).
    *   Rounded corners (`rounded-lg`).
    *   Font (`font-medium`).
    *   Transition (already on `button` element).
    *   _Action:_ The `add-to-cart-btn` generated in `src/app.ts` (Phase 6.2 example) and styled further in Phase 3 & 4 should cover this.
        `html += \`<button class="add-to-cart-btn mt-auto bg-accent text-text-on-accent font-medium py-2 px-4 rounded-lg hover:brightness-90 transition-all duration-200 w-full flex items-center justify-center gap-2">\`;`
        `html += \`<i class="fas fa-cart-plus"></i>Add to Cart</button>\`;`
        This seems complete based on previous phase work.

*   [ ] **Visual Test:** Confirm "Add to Cart" buttons match all specified criteria.

---

End of Phase 7.
The application should now have a significantly more polished and modern look and feel.
Perform a final holistic visual review of the entire application.
Run all E2E tests: `pnpm exec playwright test`.
