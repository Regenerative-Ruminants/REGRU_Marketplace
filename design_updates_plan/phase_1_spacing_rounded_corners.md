# Phase 1: Spacing & Rounded Corners

This phase focuses on foundational spacing improvements and softening hard edges with rounded corners for an instant visual lift.

**Testing Steps:**
*   After each sub-section of changes, visually inspect the application (ensure `pnpm tauri dev` is running).
*   Pay attention to the specific elements mentioned.
*   Ensure no layout breaks or unintended visual regressions occur.

---

## 1.1. Global Spacing Improvements (CSS)

**File:** `src/index.css`

**Checklist:**

*   [ ] **Target `#first-panel`:**
    *   Locate the existing CSS rule for `#first-panel`.
    *   **Change:** Update or add `padding: 1rem 0.5rem;` to give the first panel more internal breathing room.
    *   _Current (example - may not exist or be different):_
        ```css
        #first-panel {
            /* ... other styles ... */
        }
        ```
    *   _To:_
        ```css
        #first-panel {
            background-color: var(--tertiary-color);
            border-right: 1px solid var(--border-color);
            padding: 1rem 0.5rem; /* ADDED/MODIFIED */
        }
        ```

*   [ ] **Target `.first-panel-item`:**
    *   Locate or create the CSS rule for `.first-panel-item`.
    *   **Add/Modify:**
        *   `margin-bottom: 0.25rem;` (adds spacing between nav items)
        *   `border-radius: 0.5rem;` (softens edges)
    *   _Current (example - `first-panel-item.active` exists, but not `.first-panel-item` base):_
        ```css
        .first-panel-item.active {
            /* ... other styles ... */
        }
        ```
    *   _To (add new rule, modify existing if found):_
        ```css
        .first-panel-item { /* NEW or MODIFIED */
            margin-bottom: 0.25rem;
            border-radius: 0.5rem;
        }
        .first-panel-item.active {
             background-color: #e0e0e0; /* Keep existing or update in later phase */
             border-left: 4px solid var(--main-color); /* Keep existing or update in later phase */
        }
        ```
    *   **Note:** The designer also included `transition: all 0.2s ease;` here. We will add all transitions together in Phase 2 to maintain consistency.

*   [ ] **Target `.second-panel-item`:**
    *   Locate or create the CSS rule for `.second-panel-item`.
    *   **Add/Modify:**
        *   `margin-bottom: 0.125rem;`
        *   `border-radius: 0.375rem;`
    *   _Current (example - `second-panel-item.active` exists):_
        ```css
        .second-panel-item.active {
            /* ... */
        }
        ```
    *   _To (add new rule):_
        ```css
        .second-panel-item { /* NEW or MODIFIED */
            margin-bottom: 0.125rem;
            border-radius: 0.375rem;
        }
        .second-panel-item.active {
            background-color: #e9ecef;  /* Keep existing or update in later phase */
            font-weight: bold; /* Keep existing or update in later phase */
            color: var(--main-color); /* Keep existing or update in later phase */
            border-left: 3px solid var(--accent-color); /* Keep existing or update in later phase */
            padding-left: calc(0.625rem - 3px); /* Keep existing or update in later phase */
        }
        ```
    *   **Note:** The designer also included `transition: all 0.2s ease;` here. We will add all transitions together in Phase 2.

*   [ ] **Target `#content-section` for consistent padding:**
    *   Locate the CSS rule for `#content-section`.
    *   **Change:** Update `padding` to `2rem;`.
    *   _Current (from `index.html` style, it's `p-6` which is `1.5rem`):_
        The padding is currently applied via Tailwind class `p-6` on the element in `index.html`.
        It's better to manage this in `src/index.css` if we want a fixed value like `2rem`.
    *   _In `index.html`, remove `p-6` from `<section id="content-section"...>` element._
    *   _In `src/index.css`, update/add:_
        ```css
        #content-section {
            background-color: var(--secondary-color);
            padding: 2rem; /* ADDED/MODIFIED */
        }
        ```

*   [ ] **Visual Test:** Run `pnpm tauri dev`. Check the first panel's internal padding, the spacing and rounded corners of items in the first and second panels, and the padding of the main content area.

---

## 1.2. Rounded Corners for Inputs & Panels (CSS & HTML)

**Files:** `src/index.css`, `index.html`

**Checklist:**

*   [ ] **Target `input[type="search"], input[type="text"], textarea, select` for rounded corners (CSS):**
    *   Create a new rule in `src/index.css`.
    *   **Add:** `border-radius: 0.375rem;` (Tailwind's `rounded-md` equivalent)
    *   _To `src/index.css`:_
        ```css
        input[type="search"], input[type="text"], textarea, select {
            border-radius: 0.375rem; /* ADDED */
            /* Transitions will be added in Phase 2 */
        }
        ```
    *   **Note:** Many inputs already have `rounded-md` via Tailwind in `src/app.ts` or `index.html`. This CSS rule will act as a consistent default. The designer specified `0.375rem`, which is `rounded-md`. The suggestion "Change all rounded-md to rounded-lg" comes later under "Quick Wins". For now, we'll apply this base rounding.

*   [ ] **Target Product Cards for rounded corners (CSS):**
    *   Locate `.product-card` in `src/index.css`.
    *   **Change:** `border-radius` to `0.75rem;` (Tailwind's `rounded-xl` is `0.75rem`, `rounded-lg` is `0.5rem`). The designer says `0.75rem` here and later "rounded-lg everywhere". Let's use `0.75rem` for product cards as specified here, and `rounded-lg` (0.5rem) for general panels as per "Quick Wins" later.
    *   _Current `.product-card` rule:_
        ```css
        .product-card {
            border: 1px solid var(--border-color);
            border-radius: 0.5rem; /* This is rounded-lg */
            /* ... other styles ... */
        }
        ```
    *   _To:_
        ```css
        .product-card {
            border: 1px solid var(--border-color);
            border-radius: 0.75rem; /* MODIFIED to 0.75rem */
            /* ... other styles ... */
            /* Transitions and shadow will be added in later phases */
        }
        ```

*   [ ] **Target Panels for `rounded-lg` (HTML):**
    *   As per "Quick Wins for Modern Feel" -> "Rounded corners everywhere" -> "Add rounded-lg to all panels in `index.html`".
    *   **File:** `index.html`
    *   **Add `rounded-lg` class to:**
        *   `<nav id="first-panel" ...>`
        *   `<aside id="second-panel" ...>`
        *   `<header id="main-heading-container" ...>`
        *   `<section id="content-section" ...>` (already has `rounded-lg` if part of a larger container, but good to check context)
        *   `<aside id="info-panel" ...>`
    *   _Example for `#first-panel`:_
        _From:_ `<nav id="first-panel" class="w-20 flex flex-col items-center py-4 shadow-lg">`
        _To:_   `<nav id="first-panel" class="w-20 flex flex-col items-center py-4 shadow-lg rounded-lg">`
    *   Do this for all specified panels.

*   [ ] **Target HTML-generated elements for `rounded-lg` (app.ts):**
    *   As per "Quick Wins for Modern Feel" -> "Rounded corners everywhere" -> "Change all `rounded-md` to `rounded-lg` in the HTML generation".
    *   **File:** `src/app.ts`
    *   **Task:** Search through all HTML string generation in `src/app.ts` (inside `contentData` htmlFactory functions, and other places where classes are set).
    *   **Change:** Systematically replace instances of `rounded-md` with `rounded-lg`.
    *   _Examples to look for and change:_
        *   Product cards: `<div class="product-card bg-white shadow-md rounded-lg overflow-hidden">` (already `rounded-lg` in `src/index.css` via `.product-card`, but if `rounded-md` is inline, update it. Designer asks for `0.75rem` which is `rounded-xl` for cards, this step is for general `rounded-md` to `rounded-lg`). For consistency with the earlier product card step, we'll assume product cards keep their `0.75rem` and this "rounded-lg everywhere" applies to other elements like buttons, input containers within dynamic HTML if they use `rounded-md`.
        *   Input fields: `class="p-2 border border-gray-300 rounded-md text-sm ..."` -> `rounded-lg`
        *   Select fields: `class="p-2 border border-gray-300 rounded-md text-sm"` -> `rounded-lg`
        *   Buttons: `class="p-2 border border-gray-300 rounded-md text-sm ..."` -> `rounded-lg`
        *   Notification items, message items, etc., if they use `rounded-md`.

*   [ ] **Visual Test:** Run `pnpm tauri dev`. Check that inputs, textareas, select boxes have rounded corners. Verify product cards have their specific rounding. Check that panels in `index.html` and dynamically generated elements now use `rounded-lg` where `rounded-md` was previously used.

---

End of Phase 1.
Ensure all visual checks are satisfactory before moving to Phase 2.
Run E2E tests: `pnpm exec playwright test` to ensure no functional regressions. 