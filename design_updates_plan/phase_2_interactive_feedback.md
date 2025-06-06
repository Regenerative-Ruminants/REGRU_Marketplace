# Phase 2: Transitions, Interactive Feedback & Micro-animations

This phase focuses on making the UI feel more alive and responsive by adding transitions and visual feedback on interactions.

**Testing Steps:**
*   After each sub-section of changes, visually inspect the application (ensure `pnpm tauri dev` is running).
*   Hover over and focus on the modified elements (inputs, buttons, product cards).
*   Verify that transitions are smooth and that hover/focus styles appear as described.
*   Ensure no layout breaks or unintended visual regressions occur.

---

## 2.1. Add Transition Properties (CSS)

This step adds the `transition` properties as suggested by the designer to various elements. This will make subsequent hover/focus style changes animate smoothly.

**File:** `src/index.css`

**Checklist:**

*   [ ] **Target `.first-panel-item`:**
    *   Locate the CSS rule for `.first-panel-item`.
    *   **Add:** `transition: all 0.2s ease;`
    *   _To be added to the existing `.first-panel-item` rule created in Phase 1._
        ```css
        .first-panel-item {
            margin-bottom: 0.25rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease; /* ADDED */
        }
        ```

*   [ ] **Target `.second-panel-item`:**
    *   Locate the CSS rule for `.second-panel-item`.
    *   **Add:** `transition: all 0.2s ease;`
    *   _To be added to the existing `.second-panel-item` rule created in Phase 1._
        ```css
        .second-panel-item {
            margin-bottom: 0.125rem;
            border-radius: 0.375rem;
            transition: all 0.2s ease; /* ADDED */
        }
        ```

*   [ ] **Target `input[type="search"], input[type="text"], textarea, select`:**
    *   Locate the CSS rule for these input types (created in Phase 1).
    *   **Add:** `transition: all 0.2s ease;`
    *   _To be added to the existing rule:_
        ```css
        input[type="search"], input[type="text"], textarea, select {
            border-radius: 0.375rem;
            transition: all 0.2s ease; /* ADDED */
        }
        ```

*   [ ] **Target general `button` elements:**
    *   Create a new CSS rule for `button` or add to an existing global button style if one exists.
    *   **Add:**
        *   `transition: all 0.2s ease;`
        *   `position: relative;` (for potential pseudo-elements or future animation needs)
        *   `overflow: hidden;` (often good for containing animation effects)
    *   _Add new rule to `src/index.css`:_
        ```css
        button {
            transition: all 0.2s ease; /* ADDED */
            position: relative; /* ADDED */
            overflow: hidden; /* ADDED */
            /* Existing button styles from Tailwind will still apply */
        }
        ```
    *   **Note:** Be mindful if there are already very specific button styles that might conflict. Test thoroughly.

*   [ ] **Target `.product-card`:**
    *   Locate the CSS rule for `.product-card`.
    *   **Add:** `transition: all 0.3s ease;`
    *   _To be added to the existing `.product-card` rule:_
        ```css
        .product-card {
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            transition: all 0.3s ease; /* ADDED */
            display: flex;
            flex-direction: column;
        }
        ```

*   [ ] **Visual Test:** Run `pnpm tauri dev`. While no visual styles will change yet, this step is foundational for the animations in the next steps. Verify no errors or regressions.

---

## 2.2. Input Focus Styles (CSS)

**File:** `src/index.css`

**Checklist:**

*   [ ] **Target `input[type="search"]:focus, input[type="text"]:focus` (and `textarea:focus`, `select:focus` for consistency):**
    *   Create a new CSS rule for the `:focus` state of these inputs.
    *   **Add:**
        *   `border-color: var(--accent-color);`
        *   `box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);` (subtle glow)
        *   `transform: translateY(-1px);` (micro-lift on focus)
    *   _Add new rule to `src/index.css`:_
        ```css
        input[type="search"]:focus,
        input[type="text"]:focus,
        textarea:focus,
        select:focus {
            border-color: var(--accent-color) !important; /* Use !important if Tailwind's default focus styles are too strong */
            box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
            transform: translateY(-1px);
        }
        ```
    *   **Note:** Tailwind applies its own focus styles (usually a ring). The `!important` on `border-color` might be necessary if Tailwind's default focus border is overriding. Test and adjust. The `transform` should work fine.

*   [ ] **Visual Test:** Run `pnpm tauri dev`. Click into search boxes, text inputs, textareas, and select elements. Verify the border color changes to accent, a subtle green glow appears, and the input lifts slightly. Check that the transitions are smooth.

---

## 2.3. Button Hover States (CSS)

**File:** `src/index.css`

**Checklist:**

*   [ ] **Target general `button:hover` elements:**
    *   Create a new CSS rule for `button:hover`.
    *   **Add:**
        *   `transform: translateY(-2px);`
        *   `box-shadow: 0 4px 12px rgba(13, 50, 74, 0.15);`
    *   _Add new rule to `src/index.css`:_
        ```css
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(13, 50, 74, 0.15);
            /* Specific button background/text color changes on hover might be handled by Tailwind classes or more specific rules. This provides the lift and shadow. */
        }
        ```
    *   **Note:** This is a general hover effect. Specific buttons (like "Add to Cart") have their own hover effects suggested in later phases, which will layer on top or override this if more specific.

*   [ ] **Visual Test:** Run `pnpm tauri dev`. Hover over various buttons in the UI. Verify they lift slightly, display a shadow, and the transition is smooth.

---

## 2.4. Product Card Hover States (CSS)

**File:** `src/index.css`

**Checklist:**

*   [ ] **Target `.product-card:hover`:**
    *   Locate the existing CSS rule for `.product-card` and add a new one for its `:hover` state.
    *   **Add:**
        *   `transform: translateY(-4px);`
        *   `box-shadow: 0 12px 24px rgba(0,0,0,0.15);`
    *   _Add new rule to `src/index.css`:_
        ```css
        .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        ```

*   [ ] **Visual Test:** Run `pnpm tauri dev`. Hover over product cards (if any are displayed on the default view, or navigate to "All Products"). Verify they lift and a more pronounced shadow appears, with a smooth transition.

---

End of Phase 2.
Ensure all visual checks for interactive feedback are satisfactory.
Run E2E tests: `pnpm exec playwright test` to ensure no functional regressions, especially around focusable and clickable elements. 