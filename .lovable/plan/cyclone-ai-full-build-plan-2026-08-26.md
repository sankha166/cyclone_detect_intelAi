# Cyclone AI — Full Build Plan

Build the complete Cyclone AI platform from both documents: photorealistic 3D Earth landing page, animated auth pages, and the full dashboard suite. Mock data only, no backend.

## Visual language

Pure black → deep navy gradient background, glassmorphism cards, blue/cyan accents (#3b82f6 / #06b6d4), white headings, slate-400 body text. All colors registered as design tokens so nothing is hardcoded.

## Pages

**Landing (`/`)**
- Fixed navbar: spiral logo + "CYCLONE AI / STORM INTELLIGENCE", center links, Log In + Get Started. Transparent → solid on scroll.
- Hero: left 40% pill badge, "Understanding storms. Predicting what comes next." (last line gradient), subtext, Explore Intelligence + Watch Demo buttons, social proof avatars. Right 60% live 3D globe.
- Floating glass "LIVE CYCLONE" card over the globe with wind speed, pressure, movement, coordinates, last-updated.
- Stats bar: 6 stats with count-up animation.
- Features section: "One platform. Complete storm intelligence." with 4 capability cards (2x2) plus a Live Cyclone Tracking preview card showing observed track, forecast track and uncertainty cone.
- Minimal footer.

**Login (`/login`) and Signup (`/signup`)**
Split screen: left panel Earth/cyclone imagery with headline and 3 checkmark bullets; right panel dark form with Google/Microsoft/Apple buttons, divider, fields (password show/hide), remember-me / terms checkbox, gradient submit, cross-link. Panels slide in from their sides. No real auth — submit routes to the dashboard.

**Dashboard (`/dashboard/*`)**
Shared layout: solid dashboard navbar (search, notification bell, avatar menu) + 240px sidebar (Overview; Analysis: Detection, Classification, Prediction; Data: History, Cyclones, Reports; Settings). Collapses to a drawer on mobile.

- **Overview** — 4 stat cards with trends, Recent Predictions table with pagination, accuracy-trend area chart, category donut, basin bar chart, quick actions.
- **Detection** — drag & drop upload with preview, Analyze action, results card with confidence ring, bounding-box overlay and readout, link to classification.
- **Classification** — image preview with Original / Grad-CAM toggle, ESCS category badge, per-class confidence bars, MSW radial gauge with color zones, Dvorak T-number.
- **Prediction** — Track tab with dark-basemap Leaflet map (historical track, dashed forecast track, uncertainty cone, +12/24/36/48h markers with popups) and forecast table; Intensity tab with forecast line chart plus confidence band and category zones.
- **History** — filterable, searchable, paginated table with thumbnails, plus `/dashboard/history/$id` detail view.
- **Cyclones** — searchable card grid for Fani, Amphan, Yaas, Biparjoy, Mocha, Remal, plus `/dashboard/cyclones/$id` detail with info panel, track map, best-track table and intensity timeline.
- **Reports** — report list with generate modal (prediction, format, include options).
- **Settings** — profile, preferences, notifications, mock API keys, danger zone.

**404** — themed not-found page.

## 3D globe

React Three Fiber scene per the spec: 64-segment sphere with blue-marble texture, topology bump map and water specular map on Phong material; Fresnel atmosphere shader at 1.15 scale with additive blending on the back side; independent cloud layer at 1.02; 5000-star field; ambient + warm directional + cool fill lighting; ACES filmic tone mapping; OrbitControls with damping, zoom limits, no pan; Earth rotates at delta*0.05, clouds at delta*0.08. A billboard cyclone sprite with spiral shader sits at 17°N/88°E over the Bay of Bengal, rotating counter-clockwise with a breathing pulse. Suspense loader plus a static-image fallback if WebGL is unavailable; globe becomes a low-opacity background on tablet and a static image on mobile.

## Technical notes

- The project is TanStack Start, so routing uses file-based routes under `src/routes` (`dashboard.route.tsx` layout with `$id` params) rather than React Router — same URLs, same structure.
- Three.js and Leaflet are browser-only: both mount client-side after hydration to avoid SSR errors.
- New dependencies: three, @react-three/fiber, @react-three/drei, framer-motion, recharts, leaflet + react-leaflet, lucide-react.
- Earth textures load from the unpkg three-globe URLs given in the document; the cyclone sprite and auth-panel Earth image are generated assets.
- All mock data lives in one shared module so numbers stay consistent across landing, dashboard and detail pages.
- Each route gets its own SEO metadata.

## Build order

1. Design tokens, layout shell, navbar/footer, shared UI primitives.
2. 3D globe scene + hero + stats + features → landing page complete.
3. Login and signup.
4. Dashboard layout, sidebar, and Overview.
5. Detection, Classification, Prediction (maps and charts).
6. History, Cyclones, Reports, Settings, 404.
