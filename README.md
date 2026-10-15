# Send Matt to Hacker House & Breakpoint London

A mobile-first sponsorship page for Matt Sim (@RVAClassic), founder of Operator Uplift.

Primary domain: https://breakpoint.rvaclassic.xyz

Additional domain: https://rvaclassic.xyz

## Site files

- `dist/index.html` — page content, sponsorship packages and social metadata
- `dist/styles.css` — responsive layout and visual styling
- `dist/site.js` — product demo dialog
- `dist/assets/` — locally served images, fonts, illustrations and demo video
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

Inter font files are distributed with their SIL Open Font License in `dist/assets/Inter-OFL.txt`. The London background image comes from the official Solana Breakpoint website. Brand names, logos, personal imagery and sponsorship content identify their respective owners. The backpack artwork is an AI-generated sponsorship concept.
