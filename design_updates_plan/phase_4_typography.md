# Phase 4: Typography

This phase focuses on improving readability and visual hierarchy through thoughtful typography choices. We'll integrate a modern sans-serif font (Inter), establish a clear type scale, and apply consistent typographic styles.

**Testing Steps:**
*   After each step, visually inspect the application (`pnpm tauri dev` is running).
*   Check that the correct font is applied to body text, headings, and UI elements.
*   Verify that font weights and sizes match the specifications.
*   Ensure line heights provide good readability.
*   Use browser developer tools to inspect font properties.
*   Run E2E tests: `pnpm exec playwright test` to catch any layout shifts or visual breaks caused by typography changes.

---

## 4.1. Add Inter Font

**Checklist:**

*   [ ] **Add Font to `index.html`:**
    *   Include the Inter font from Google Fonts (or a self-hosted alternative if preferred for an offline-first Tauri app, though Google Fonts is simpler for now).
    *   **File:** `index.html`
    *   Add the following within the `<head>` section:
        ```html
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        ```

*   [ ] **Set Base Font in CSS:**
    *   Apply Inter as the default font for the application.
    *   **File:** `src/index.css`
    *   Modify the `body` rule:
        ```css
        body {
          font-family: 'Inter', sans-serif;
          color: var(--text-color); /* From Phase 3 */
          background-color: var(--background-color); /* From Phase 3 */
          line-height: 1.6; /* Suggested base line height */
          -webkit-font-smoothing: antialiased; /* macOS/iOS */
          -moz-osx-font-smoothing: grayscale; /* Firefox */
        }
        ```

*   [ ] **Update Tailwind Configuration (Optional but Recommended):**
    *   Extend Tailwind's theme to include 'Inter' in the sans-serif font stack. This makes it the default for Tailwind's `font-sans` utility.
    *   **File:** `tailwind.config.js`
    ```javascript
    // tailwind.config.js
    const defaultTheme = require('tailwindcss/defaultTheme')

    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', ...defaultTheme.fontFamily.sans],
          },
          colors: { // From Phase 3
            'main': 'var(--main-color)',
            // ... other colors
          }
        },
      },
      plugins: [],
    }
    ```
    *   **Note:** Restart the dev server (`pnpm tauri dev`) after changing `tailwind.config.js`.

*   [ ] **Visual Test:** Run `pnpm tauri dev`. Verify that the font across the application has changed to Inter. Check various text elements.

---

## 4.2. Establish Type Scale & Apply Styles (CSS)

**File:** `src/index.css`

**Checklist:**

*   [ ] **Define Heading Styles:**
    *   Create CSS rules for `h1` through `h6` to establish a clear visual hierarchy.
    *   Use `var(--main-color)` or a dark gray (e.g., `var(--gray-800)`) for heading colors as established in Phase 3.
    ```css
    h1, .text-h1 { /* Added utility class for semantic flexibility */
      font-size: 2.25rem; /* ~36px */
      font-weight: 700; /* Bold */
      line-height: 1.2;
      margin-bottom: 1rem;
      color: var(--main-color);
    }

    h2, .text-h2 {
      font-size: 1.875rem; /* ~30px */
      font-weight: 600; /* Semi-bold */
      line-height: 1.3;
      margin-bottom: 0.875rem;
      color: var(--main-color);
    }

    h3, .text-h3 {
      font-size: 1.5rem; /* ~24px */
      font-weight: 600; /* Semi-bold */
      line-height: 1.4;
      margin-bottom: 0.75rem;
      color: var(--main-color);
    }

    h4, .text-h4 {
      font-size: 1.25rem; /* ~20px */
      font-weight: 500; /* Medium */
      line-height: 1.5;
      margin-bottom: 0.625rem;
      color: var(--main-color);
    }

    h5, .text-h5 {
      font-size: 1.125rem; /* ~18px */
      font-weight: 500; /* Medium */
      line-height: 1.5;
      margin-bottom: 0.5rem;
      color: var(--text-color); /* Slightly less emphasis */
    }

    h6, .text-h6 {
      font-size: 1rem; /* ~16px - base size */
      font-weight: 500; /* Medium */
      text-transform: uppercase;
      letter-spacing: 0.05em;
      line-height: 1.5;
      margin-bottom: 0.5rem;
      color: var(--gray-600); /* Subtler for less important headings */
    }
    ```
    *   **Note:** `rem` units are preferred for scalability with user's browser font size settings. Adjust `margin-bottom` as needed for visual rhythm. `.text-hX` classes are added for cases where semantic HTML tags can't be used but styling is needed.

*   [ ] **Define Paragraph & Body Text Styles:**
    *   Ensure body text is legible with appropriate size and line height.
    ```css
    p, .text-body {
      font-size: 1rem; /* ~16px */
      font-weight: 400; /* Regular */
      line-height: 1.6; /* Already set on body, but can be specified for <p> too */
      margin-bottom: 1rem;
      color: var(--text-color);
    }

    .text-body-sm, .text-sm { /* For smaller body text / Tailwind 'text-sm' consistency */
      font-size: 0.875rem; /* ~14px */
      line-height: 1.5;
      color: var(--text-color); /* Or var(--gray-700) for less emphasis */
    }

    .text-body-xs, .text-xs { /* For very small text / Tailwind 'text-xs' consistency */
      font-size: 0.75rem; /* ~12px */
      line-height: 1.4;
      color: var(--gray-600);
    }

    strong, b {
      font-weight: 600; /* Semi-bold for emphasis */
    }

    em, i {
      /* Default italic style is usually fine */
    }
    ```

*   [ ] **Visual Test:** Check headings (`<h1>` in `index.html` for "The REGRU Marketplace", etc.) and paragraph text. Verify sizes, weights, and line heights.

---

## 4.3. Apply Typography in HTML & JavaScript

**Files:** `index.html`, `src/app.ts`

**Checklist:**

*   [ ] **Review and Update HTML Structure:**
    *   Ensure semantic heading elements (`<h1>` to `<h6>`) are used correctly in `index.html` and in dynamically generated HTML from `src/app.ts`.
    *   For example, the main application title "The REGRU Marketplace" should be an `<h1>`. Section titles should be `<h2>` or `<h3>`. Product names in cards could be `<h4>` or styled with a class like `.text-h4`.
    *   Replace `div` elements styled to look like headings with actual heading tags or apply the `.text-hX` utility classes.

*   [ ] **Update Dynamically Generated Content (`src/app.ts`):**
    *   Review the HTML strings in `src/app.ts`.
    *   Apply appropriate heading tags (e.g., product titles as `<h3>` or `<h4>`).
    *   Use Tailwind's typography classes (e.g., `text-lg`, `font-semibold`, `leading-tight`) or the custom classes defined above (`.text-h3`, `.text-body-sm`) for fine-tuning.
    *   **Example for product titles in cards:**
        _Current (example):_ `<h5 class="text-xl font-semibold mb-2">${product.name}</h5>` (text-xl is 1.25rem)
        _To (using custom class for consistency, or adjust Tailwind):_ `<h3 class="text-h4 mb-2">${product.name}</h3>` or keep using Tailwind: `<h3 class="text-xl font-medium mb-2">${product.name}</h3>` (adjusting font-weight based on Phase 4.2 definitions). Let's aim for consistency with the new CSS, so: `<h3 class="text-h4 mb-2">${product.name}</h3>` or `<div class="text-h4 mb-2">${product.name}</div>` if `h3` is not semantically correct in context. Product titles could be `<h2>` or `<h3>` within their card context depending on overall page structure. Assuming `<h4>` is appropriate:
        `html += \`<h4 class="text-h4 mb-1 mt-2 group-hover:text-accent transition-colors">${product.name}</h4>\`;` (Added suggested hover from design notes, margin adjustments)

*   [ ] **Refine Text in Specific UI Elements:**
    *   **Navigation items (`.first-panel-item`, `.second-panel-item`):** Ensure font size is appropriate (e.g., `text-sm` or base 1rem). Design suggests "Slightly smaller font size for navigation items".
        *   In `src/index.css`, for `.first-panel-item` and `.second-panel-item`:
            ```css
            .first-panel-item {
                /* ... other styles from Phase 1 & 2 ... */
                font-size: 0.9rem; /* Or var(--text-body-sm-font-size) if defined */
                padding: 0.6rem 0.5rem; /* Adjust padding for text size */
            }
            .second-panel-item {
                /* ... other styles from Phase 1 & 2 ... */
                font-size: 0.85rem; /* Or var(--text-body-xs-font-size) */
                padding: 0.4rem 0.625rem; /* Adjust padding */
            }
            ```
    *   **Buttons:** Ensure button text is clear and legible. Tailwind's default button styles usually handle this well, but check if custom styles are needed (e.g., `font-medium`).
        ```css
        button, .button { /* For <button> or <a> styled as button */
            /* ... other styles from Phase 2 ... */
            font-size: 0.9375rem; /* ~15px, slightly smaller than base */
            font-weight: 500; /* Medium */
            padding: 0.5rem 1rem; /* Adjust padding as needed */
            /* text-transform: uppercase; (Optional, if desired for certain button styles) */
            /* letter-spacing: 0.025em; (If using uppercase) */
        }
        ```
    *   **Input fields:** Font size should be comfortable for typing (base 1rem or `text-sm` often works).
        ```css
        input[type="search"], input[type="text"], textarea, select {
            /* ... other styles from Phase 1 & 2 ... */
            font-size: 0.9375rem; /* ~15px */
        }
        ```
    *   **Product descriptions:** Use `text-body-sm` for brevity if descriptions are long.
        *   In `src/app.ts` product card generation:
            `html += \`<p class="text-body-sm text-gray-600 mb-3 flex-grow">${product.description}</p>\`;` (using text-gray-600 which is `var(--gray-600)`)
    *   **Prices:** Make them prominent, perhaps slightly larger or bolder.
        *   In `src/app.ts` product card generation:
            `html += \`<p class="text-lg font-semibold text-accent mb-3">\${product.price}</p>\`;` (`text-lg` is 1.125rem, `var(--accent-color)`)

*   [ ] **Visual Test:** Thoroughly review all text elements across the application. Check headings, body text, lists, buttons, inputs, labels, product details. Ensure consistency and readability.

---

End of Phase 4.
Confirm that the new typography enhances the visual appeal and usability of the application.
Run E2E tests: `pnpm exec playwright test`.