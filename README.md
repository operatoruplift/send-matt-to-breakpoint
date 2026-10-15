# Send Matt to Hacker House & Breakpoint London

A mobile-first sponsorship page for Matt Sim (@RVAClassic), founder of Operator Uplift.

Primary domain: https://breakpoint.rvaclassic.xyz

Additional domain: https://rvaclassic.xyz

Vercel address: https://send-matt-to-breakpoint.vercel.app

Public source: https://github.com/operatoruplift/send-matt-to-breakpoint

## Site files

- `dist/index.html` — page content, sponsorship packages and social metadata
- `dist/styles.css` — responsive layout and visual styling
- `dist/site.js` — sponsorship video dialog
- `dist/journey.js` and `dist/journey.css` — repeating journey animation with visibility and reduced-motion support
- `dist/assets/` — locally served images, fonts, illustrations and sponsorship video
- `vercel.json` — static deployment configuration

## Local preview

No installation or build step is required. From the repository directory:

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080.

## Deployment

The GitHub repository is connected to Vercel. Pushes to `main` deploy the production site. Vercel serves `dist/` directly with the Other framework preset and no build or install command.

DNS is managed at Namecheap. Both custom domains are assigned to the Vercel project; activation depends on DNS propagation and certificate issuance.

## Credits

Archivo and IBM Plex Mono provide an open-source approximation of the official Breakpoint typography. Their SIL Open Font Licenses and source attribution are in `dist/assets/fonts/`. The proprietary ABC Favorit and BP26 Extended fonts are not bundled.

The London background image comes from the official Solana Breakpoint website. Brand names, logos, personal imagery and sponsorship content identify their respective owners. The red backpack and MacBook artwork was edited with built-in imagegen and compressed to WebP for the site. TikTok view counts were supplied by Matt on October 15, 2026.

The All in One Day graphic and 88-second sponsorship video were supplied by Matt on October 16, 2026. The video retains its original 1080p60 H.264/AAC streams, with the MP4 metadata moved to the front for streaming. It loads only when Play Video is selected.
