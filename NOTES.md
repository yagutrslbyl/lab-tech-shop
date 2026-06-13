# Notes: my design log

**Live URL (Vercel):** [https://lab-tech-shop-six.vercel.app/]

## 1. Route and storage choice

- **Route:** I created `/premium` inside `app/premium/page.js` because it directly matches the pre-configured navbar link and represents a clean, semantic location for a premium checkout page.
- **Storage Choice:** I stored the "this user is premium" flag in **`localStorage`**.
- **Reasoning:** `localStorage` is the only browser-storage that persists across both full page refreshes and completely fresh browser sessions. If I used `sessionStorage`, the premium status would vanish as soon as the user closed the tab, forcing them to pay again, which would ruin the user experience.

## 2. Server vs Client Components

- **Files touched:**
  - `app/premium/page.js` -> **Client Component**
  - `app/components/AdBanner.js` -> **Client Component**
- **Forced to be Client Components:** Both files were forced to use `'use client'` because they rely heavily on interactive React state (`useState`), lifestyle hooks (`useEffect`), event listeners, and browser-only APIs like `localStorage` and `window`, none of which are available on the server.
- **Server Component Gains:** Keeping the rest of the application (like layout and static store components) on the server reduces the overall client-side JavaScript bundle, speeds up the Initial Page Load, and ensures optimized rendering.

## 3. The first-render problem

- **What happened:** Initially, a "localStorage is not defined" error occurs because Node.js (the server) tries to pre-render the page where `window` and `localStorage` do not exist. Furthermore, if the server renders ads but the client instantly hides them based on storage, React throws a heavy **Hydration Mismatch** error due to conflicting HTML.
- **The Fix:** I implemented a two-step mount process. By introducing an `isMounted` state inside `useEffect`, the component renders a safe, neutral initial state on the server (returning `null` or loading). It only reads `localStorage` and toggles the ads *after* successfully mounting on the client browser.
- **Verification:** I verified the fix by opening the browser's developer tools (`F12`), going to the **Console** tab, and confirming that it is completely clean—free of any red hydration warnings or storage errors upon fresh loads and refreshes.

## 4. How the pieces connect

When the user submits the payment form, the controlled inputs trigger the onSubmit handler, which immediately updates the local state to show a completion message and saves `isPremiumUser: 'true'` into `localStorage` while dispatching a global storage event. The `AdBanner` component instantly catches this update via its event listener, causing it to return `null` and make all clutter disappear dynamically. Since the flag is hardcoded into `localStorage`, any future page refresh safely triggers the client-side hook to keep the ads completely hidden.

## 5. If I had another hour

If I had another hour, I would implement a global React Context Provider (`PremiumContext`) around the application. This would cleanly distribute the premium state globally to the Navbar, Ads, and Shop items automatically, removing the need for manual window event listeners and allowing me to easily render a "Premium ✓" badge directly in the navbar.