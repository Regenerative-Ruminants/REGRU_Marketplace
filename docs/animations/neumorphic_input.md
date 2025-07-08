## Neumorphic "Floating" Input Animation Guide

This document explains how to recreate the "floating" and "pressed" effect on an input field using only HTML and CSS. This effect is used in the main search bar inside the immersive search overlay.

### The Concept: Neumorphism

The effect is a type of **Neumorphism**, a design style that uses soft shadows and highlights to make UI elements look like they are part of the background, either extruding from it (popping out) or depressing into it (pushed in).

The key is to have the UI element (the input) be the **same color as its direct parent background**. The illusion of shape is created entirely by `box-shadow`.

We use two shadows:
1.  A dark, bottom-right shadow (simulating a light source from the top-left).
2.  A light, top-left shadow (simulating the highlight from that same light source).

### The Implementation

We will have a default "flat" state, and a "popped out" state when the input is focused.

#### 1. HTML Structure

The structure requires a container `div` around the `input` itself. This is crucial for a few reasons:
- It provides a surface for the neumorphic shadows.
- It contains the `input` and any icon absolutely positioned inside it.
- It allows us to use the `:focus-within` pseudo-class to trigger the animation when the user focuses the `input` inside it.

Here is the exact structure used for our search bar:

```html
<div class="w-[85%] mx-auto py-2">
    <!-- The container is the element that gets the shadows and animations -->
    <div id="search-container" class="relative rounded-full">
        <!-- Icon (optional, but good for UX) -->
        <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg class="h-6 w-6 text-white/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        
        <!-- The actual input -->
        <input id="regru-search-input" type="text" placeholder="Search for products..."
               class="w-full bg-transparent text-white placeholder-white/60 text-xl py-4 pl-16 pr-6 rounded-full border-2 border-transparent focus:outline-none [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"/>
    </div>
</div>
```

**Key Points:**
-   The parent `div` has `id="search-container"`. This is our target for styling.
-   The `input` has a `bg-transparent` class. This is critical. It *must* inherit the background color of its parent container.
-   The `input` has `focus:outline-none` to remove the default browser focus ring, which would ruin the effect.

#### 2. CSS Styling

The magic happens in the CSS. We define the styles for the `#search-container` and how it changes with `:focus-within`.

-   **`#search-container` (Default State):** The element is flat. The `box-shadow` values are all `0px` so it appears flush with the background. We add a `transition` property to animate the changes to `box-shadow` and `transform`.

-   **`#search-container:focus-within` (Active State):** When the user clicks the input inside, the container becomes "active."
    -   We apply a `box-shadow` with two parts:
        -   `8px 8px 16px rgba(0, 0, 0, 0.3)`: A dark shadow offset to the bottom and right.
        -   `-8px -8px 16px rgba(255, 255, 255, 0.05)`: A light shadow (in our case, a very subtle white) offset to the top and left.
    -   We apply a slight `transform: scale(1.02)` to make it grow, enhancing the "pop" effect.

Here is the CSS from `src/index.css`:

```css
#search-container {
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3), 
                0px 0px 0px rgba(255, 255, 255, 0.05);
    transform: scale(1);
}

#search-container:focus-within {
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.3), 
                -8px -8px 16px rgba(255, 255, 255, 0.05);
    transform: scale(1.02);
}
```

### How to Reuse and Adapt

1.  **Copy the HTML structure:** Use a `div` container around your `input`.
2.  **Ensure Same Background Color:** The background of the *page/section* where this input resides MUST match the background of the `#search-container` itself. In our case, the search overlay and the input container are both effectively transparent, showing the blurred radial gradient behind them. If you were doing this on a solid gray background, the container would also need that same solid gray background color.
3.  **Copy the CSS:** Add the `#search-container` and `#search-container:focus-within` rules to your stylesheet.
4.  **Adjust Colors and Values:**
    -   Change the `rgba(...)` values in the `box-shadow` to match your theme. The dark shadow should be a darker version of your background, and the light shadow should be a lighter version.
    -   You can adjust the `8px` and `16px` values to make the shadow larger/smaller or more/less blurry.
    -   Adjust the `transform: scale(1.02)` value to control how much the input "grows."

That's it! By following these steps, you can apply this clean, modern, and interactive animation to any input field in the project. 