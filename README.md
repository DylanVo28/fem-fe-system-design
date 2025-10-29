# Frontend System Design — Interactive Demos

A curated set of hands-on demos that explain how browsers render, layout, and optimize UI at scale. Each HTML file is a self-contained playground you can open directly in your browser to learn concepts like GPU-accelerated rendering, reflow vs repaint, positioning and stacking contexts, lazy loading, virtual lists, infinite scrolling, and more.

## What you will learn

- Browser rendering pipeline: DOM/CSSOM → Render Tree → Paint → Composite
- Reflow vs repaint vs composite and how they impact performance
- GPU-friendly CSS (transform, opacity) vs layout-affecting properties
- Positioning (static/relative/absolute), stacking contexts, and z-index
- Observer-based patterns: IntersectionObserver, MutationObserver, ResizeObserver
- Practical UI performance patterns: virtualization, lazy loading, infinite scroll

## Quick start

1. Clone or download this repository.
2. Open any `.html` file in your browser (no build step needed).
   - macOS: right-click a file → Open With → your browser
   - Or serve the folder with any static server if you prefer `http://`.

Optional: run a quick local server (Python 3)
```bash
cd /Users/dinh/WebstormProjects/fe-system-design
python3 -m http.server 8080
# Visit http://localhost:8080
```

## Demos (high-level index)

- GPU Rendering
  - `gpu-rendering-demo.html`, `gpu-rendering-styles.css`, `gpu-rendering-script.js`
  - Compare CPU vs GPU pipelines, layer creation, FPS monitoring, property impact.

- Reflow and the Rendering Pipeline
  - `reflow-demo.html`, `reflow-styles.css`
  - DOM/CSSOM → Render Tree, reflow cost, transform vs margin animation, 60fps goals.

- Positioning & Stacking Contexts
  - `positioning-demo.html`, `positioning-styles.css`
  - Normal flow, static/relative/absolute, containing blocks, z-axis, stacking contexts.

- Virtual List (Viewport Virtualization)
  - `virtual-list-demo.html`, `virtual-list.js`, `virtual-list-styles.css`
  - Render only visible items, recycle DOM nodes, smooth scrolling with large data.

- Infinite Scroll
  - `infinite-scroll-demo.html`
  - Append data on demand while maintaining scroll performance.

- Lazy Loading
  - `lazy-load-demo.html`
  - Defer image/content loading with IntersectionObserver patterns.

- Observer APIs
  - `intersection-demo.html`, `observer-api-demo.html`, `mutation-observer-demo.html`, `mutationobserver-demo.html`, `resize-handling-demo.html`
  - Practical recipes using Intersection/Mutation/Resize observers.

- UI State & Performance Tips
  - `ui-state-demo.html`, `ui-state-demo.js`, `ui-state-demo.css`
  - Patterns to avoid unnecessary reflows and repaints in interactive UIs.

Other helpful files:
- `index.html`, `index_backup.html` — simple entry pages
- `styles.css`, `rendering-part2.html/css/js` — additional rendering notes and styles

## Suggested learning path

1. Start with reflow: open `reflow-demo.html` and compare margin vs transform animations.
2. Explore GPU: open `gpu-rendering-demo.html` and test property impacts on FPS.
3. Understand layout: open `positioning-demo.html` and experiment with z-index/contexts.
4. Scale lists: open `virtual-list-demo.html` and compare normal vs virtualized lists.
5. Add on-demand behavior: try `lazy-load-demo.html` and `infinite-scroll-demo.html`.
6. Inspect with DevTools Performance/Rendering panels to correlate visuals with traces.

## DevTools tips

- Performance panel: record interactions, inspect Main vs Compositor threads
- Rendering panel: enable paint flashing and layout shift regions
- Lighthouse: validate FPS and best practices for animations

## File map (selected)

- Rendering
  - `gpu-rendering-demo.html`, `gpu-rendering-styles.css`, `gpu-rendering-script.js`
  - `reflow-demo.html`, `reflow-styles.css`
- Layout
  - `positioning-demo.html`, `positioning-styles.css`
- Lists & Data
  - `virtual-list-demo.html`, `virtual-list.js`, `virtual-list-styles.css`
  - `infinite-scroll-demo.html`, `lazy-load-demo.html`
- Observers
  - `intersection-demo.html`, `observer-api-demo.html`
  - `mutation-observer-demo.html`, `mutationobserver-demo.html`
  - `resize-handling-demo.html`

## License

MIT — free to use, learn from, and adapt.
