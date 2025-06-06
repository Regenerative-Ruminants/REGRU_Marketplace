# Phase 3: Color Scheme Optimization

This phase focuses on defining a consistent and accessible color palette using CSS custom properties (variables) and applying these throughout the application.

**Testing Steps:**
*   After each major step, visually inspect the application (`pnpm tauri dev` is running).
*   Use browser developer tools to inspect elements and verify that CSS variables are being applied correctly.
*   Check for any hardcoded colors that were missed.
*   Use a color contrast checker (browser extension or online tool) to verify that text and UI elements meet WCAG AA guidelines against their backgrounds, especially after applying the new palette.
*   Run E2E tests: `pnpm exec playwright test` to ensure no visual regressions break tests.

---

## 3.1. Define CSS Color Variables

**File:** `src/index.css`

**Checklist:**

*   [ ] **Define Core Color Palette in `:root`:**
    *   At the top of `src/index.css`, define the following CSS custom properties within the `:root` selector.
    ```css
    :root {
      --main-color: #0D324A;        /* Deep Sapphire Blue */
      --secondary-color: #F0F4F8;    /* Light Sky Blue-Gray */
      --accent-color: #28A745;       /* Vibrant Green */
      --text-color: #333333;         /* Dark Gray */
      --text-light-color: #F0F4F8;   /* For dark backgrounds - Light Sky Blue-Gray */
      --text-on-accent-color: #FFFFFF;/* For text on accent-colored backgrounds */
      --border-color: #CED4DA;       /* Light Gray */
      --tertiary-color: #FFFFFF;      /* White */
      --background-color: #F8F9FA;  /* Very Light Gray - for overall app background if needed */

      /* Semantic Colors */
      --info-color: #17A2B8;         /* Info Blue */
      --warning-color: #FFC107;      /* Warning Yellow */
      --danger-color: #DC3545;        /* Danger Red */
      --success-color: #28A745;      /* Success Green (same as accent) */

      /* Additional Grays if needed */
      --gray-100: #F8F9FA;
      --gray-200: #E9ECEF;
      --gray-300: #DEE2E6;
      --gray-400: #CED4DA; /* Same as border-color */
      --gray-500: #ADB5BD;
      --gray-600: #6C757D;
      --gray-700: #495057;
      --gray-800: #343A40;
      --gray-900: #212529;
    }
    ```
    *   **Note:** Added `--text-light-color`, `--text-on-accent-color`, `--background-color` and a gray scale for flexibility.

*   [ ] **Visual Test:** No direct visual change, but this is foundational. Ensure `src/index.css` is processed without errors.

---

## 3.2. Update Tailwind Configuration

**File:** `tailwind.config.js`

**Checklist:**

*   [ ] **Extend Tailwind's Color Palette:**
    *   Modify `tailwind.config.js` to use the newly defined CSS variables. This allows using Tailwind utility classes (e.g., `bg-main`, `text-accent`) that map to our custom colors.
    ```javascript
    // tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
          colors: {
            'main': 'var(--main-color)',
            'secondary': 'var(--secondary-color)',
            'accent': 'var(--accent-color)',
            'text': 'var(--text-color)',
            'text-light': 'var(--text-light-color)',
            'text-on-accent': 'var(--text-on-accent-color)',
            'border': 'var(--border-color)',
            'tertiary': 'var(--tertiary-color)',
            'background': 'var(--background-color)',
            'info': 'var(--info-color)',
            'warning': 'var(--warning-color)',
            'danger': 'var(--danger-color)',
            'success': 'var(--success-color)',
            // Optional: map grayscale
            gray: {
              100: 'var(--gray-100)',
              200: 'var(--gray-200)',
              300: 'var(--gray-300)',
              400: 'var(--gray-400)',
              500: 'var(--gray-500)',
              600: 'var(--gray-600)',
              700: 'var(--gray-700)',
              800: 'var(--gray-800)',
              900: 'var(--gray-900)',
            },
          }
        },
      },
      plugins: [],
    }
    ```
    *   **Note:** This *extends* the default Tailwind palette. If you want to *replace* it, you would put the `colors` object directly under `theme` instead of `theme.extend`. Extending is usually safer to start.

*   [ ] **Restart Dev Server:** Tailwind config changes require restarting the Vite dev server (and thus `pnpm tauri dev`).
*   [ ] **Test Tailwind Classes:** Briefly test in `index.html` by adding a class like `bg-main` or `text-accent` to an element to ensure Tailwind picks up the new colors. Remove the test class afterwards.

---

## 3.3. Apply Color Variables in CSS

**File:** `src/index.css`

**Checklist:**

*   [ ] **Refactor Existing CSS Rules:**
    *   Go through all existing custom CSS rules in `src/index.css`.
    *   Replace hardcoded color values with the corresponding CSS variables.
    *   **Examples from previous phases:**
        *   `#first-panel`: `background-color: #FFFFFF;` (or similar) -> `background-color: var(--tertiary-color);`
        *   `#first-panel`: `border-right: 1px solid #dee2e6;` -> `border-right: 1px solid var(--border-color);`
        *   `.first-panel-item.active`: `background-color: #e0e0e0;` -> `background-color: var(--gray-200);` (or choose a more semantic variable if applicable, e.g., `var(--secondary-color)` if it fits the design better for an active state)
        *   `.first-panel-item.active`: `border-left: 4px solid var(--main-color);` (already good if main-color was planned like this)
        *   `#content-section`: `background-color: #f8f9fa;` -> `background-color: var(--secondary-color);` (or `var(--background-color)`)
        *   `.product-card`: `border: 1px solid var(--border-color);` (already good if var was used)
        *   `input[type="search"]:focus, ...`: `border-color: var(--accent-color) !important;` (already good) `box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);` -> `box-shadow: 0 0 0 3px var(--accent-color-transparent, rgba(40, 167, 69, 0.1));` (Consider defining a transparent version if used often: `:root { --accent-color-transparent: rgba(40, 167, 69, 0.1); }`)
    *   **Global text color:**
        ```css
        body {
          font-family: 'Inter', sans-serif; /* From Phase 4, but good to set base text color here */
          color: var(--text-color);
          background-color: var(--background-color); /* Overall app background */
          /* ... other body styles ... */
        }
        ```
    *   **Headings:**
        ```css
        h1, h2, h3, h4, h5, h6 {
          color: var(--main-color); /* Or a darker gray like var(--gray-800) */
          /* ... other heading styles ... */
        }
        ```
    *   **Links:**
        ```css
        a {
          color: var(--main-color);
          text-decoration: none; /* Consider if underline is desired on hover only */
        }
        a:hover {
          color: var(--accent-color);
          text-decoration: underline;
        }
        ```

*   [ ] **Visual Test & Contrast Check:** Run `pnpm tauri dev`. Thoroughly inspect all parts of the UI. Check text, backgrounds, borders. Use contrast checking tools.

---

## 3.4. Apply Color Variables in Dynamic HTML & Tailwind Classes

**Files:** `src/app.ts`, `index.html`, and any other files generating HTML with Tailwind classes.

**Checklist:**

*   [ ] **Refactor `index.html`:**
    *   Scan `index.html` for any hardcoded colors in `style` attributes or remaining Tailwind color classes that don't use the new variable-based names (e.g., `bg-blue-500`, `text-gray-700`).
    *   Replace them with Tailwind classes using the new custom color names (e.g., `bg-main`, `text-text`, `border-border`).
    *   Example: `<header class="bg-gray-100 p-4">` -> `<header class="bg-secondary p-4">`
    *   Example: `<button class="bg-blue-600 hover:bg-blue-700 text-white ...">` -> `<button class="bg-main hover:bg-opacity-80 text-text-on-main ...">` (Requires defining `text-on-main` or using a generic like `text-white` if `var(--main-color)` is dark). This needs careful thought on how hover states for main-bg buttons should work (e.g. `hover:bg-main/90` or `filter brightness(.9)` for slight darken).

*   [ ] **Refactor `src/app.ts`:**
    *   Go through all HTML string generation in `src/app.ts`.
    *   Replace hardcoded colors in `style` attributes and Tailwind color classes.
    *   **Examples:**
        *   `style="color: #333"` -> `style="color: var(--text-color)"` (though prefer Tailwind class `text-text`).
        *   `class="text-gray-500"` -> `class="text-gray-500"` (if using the Tailwind gray scale directly) or `class="text-text/75"` (for an opacity variant if text-color is the base) or a specific new gray variable class like `text-gray-custom-name`. The newly defined `gray.500` in `tailwind.config.js` should now map to `var(--gray-500)`.
        *   `class="bg-green-500"` -> `class="bg-accent"` or `class="bg-success"`.
        *   `class="border-gray-300"` -> `class="border-border"` or `class="border-gray-300"` (if using the mapped gray).
    *   Pay special attention to product card generation, item lists, forms, and any conditional styling that involves colors.

*   [ ] **Focus on Specific Elements per Design:**
    *   **Header (`#main-heading-container`):** Should use `var(--main-color)` for background, `var(--text-light-color)` for text (or `var(--tertiary-color)` if white).
        *   In `index.html`: Update class to `bg-main text-text-light` (or `text-tertiary`).
    *   **Panel backgrounds:** The design mentions "Unified Background for panels: Use `--secondary-color` for all three panels".
        *   `#first-panel` in `src/index.css`: Change `background-color: var(--tertiary-color);` to `background-color: var(--secondary-color);`
        *   `#second-panel` in `index.html`: ensure it has `bg-secondary`.
        *   `#info-panel` in `index.html`: ensure it has `bg-secondary`.
    *   **Search Bar:**
        *   Wrapper: Background `var(--tertiary-color)`.
        *   Input: Text `var(--text-color)`, border `var(--border-color)`.
        *   Icon: `var(--gray-500)` or `var(--text-color)` with opacity.
    *   **"Add to Cart" Button:**
        *   Background: `var(--accent-color)`.
        *   Text: `var(--text-on-accent-color)` (e.g., white).
        *   Hover: Slightly darker `var(--accent-color)` (e.g., `filter: brightness(90%);` or a dedicated darker shade variable).
        *   Apply via Tailwind classes: `bg-accent text-text-on-accent hover:brightness-90`.

*   [ ] **Visual Test & Contrast Check:** Run `pnpm tauri dev`. Verify colors across the entire application. Specifically check header, panels, search, buttons. Use contrast tools.

---

## 3.5. Accessibility - WCAG AA Contrast

**Checklist:**

*   [ ] **Systematic Contrast Review:**
    *   Go through all common text/background combinations:
        *   `var(--text-color)` on `var(--secondary-color)` / `var(--tertiary-color)` / `var(--background-color)`.
        *   `var(--text-light-color)` on `var(--main-color)`.
        *   `var(--text-on-accent-color)` on `var(--accent-color)`.
        *   Link colors on their respective backgrounds.
    *   Use a reliable color contrast analyzer tool (e.g., WebAIM's, Polypane, or browser dev tools built-in checkers).
    *   Ensure all text meets at least AA standard (4.5:1 for normal text, 3:1 for large text - 18pt or 14pt bold).

*   [ ] **Adjust Colors if Needed:**
    *   If any combinations fail, adjust the offending CSS variable(s) or the specific element's color. Prioritize adjusting lighter shades to be darker or darker shades to be lighter to improve contrast without drastically altering the core palette.
    *   For example, if `var(--text-color)` on `var(--secondary-color)` is too low, you might need to darken `var(--text-color)` or lighten `var(--secondary-color)`.

---

End of Phase 3.
Ensure all color applications are consistent and meet accessibility contrast guidelines.
Run E2E tests: `pnpm exec playwright test`. 