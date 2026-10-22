# Send Matt to Hacker House & Breakpoint London

A mobile-first sponsorship page for Matt Sim (@RVAClassic), founder of Operator Uplift.

Sponsorship domain: https://breakpoint.rvaclassic.xyz

Portfolio domain: https://rvaclassic.xyz

Vercel address: https://send-matt-to-breakpoint.vercel.app

Public source: https://github.com/operatoruplift/send-matt-to-breakpoint

## Site files

- `dist/index.html` — page content, sponsorship packages and social metadata
- `dist/styles.css` — responsive layout and visual styling
- `dist/site.js` — sponsorship video dialog
- `dist/journey.js` and `dist/journey.css` — repeating journey animation with visibility and reduced-motion support
- `dist/assets/` — locally served images, fonts, illustrations and sponsorship video
- `dist/portfolio/index.html` — outcome-led portfolio, Builder / Founder / Creator proof, and the $50 website offer
- `dist/portfolio/hero.css` and `hero.js` — responsive sky/projector hero with reduced-motion and visibility support
- `dist/portfolio/body.css` and `body.js` — portfolio sections and progressive entrance effects
- `dist/portfolio/evidence.css` — event case studies, sourced hackathon results, creative portfolio links, and media appearances
- `vercel.json` — static deployment configuration

## Local preview

No installation or build step is required. From the repository directory:

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080 for the sponsor page or http://localhost:8080/portfolio/ for the portfolio.

## Deployment

The GitHub repository is connected to Vercel. Pushes to `main` deploy the production site. Vercel serves `dist/` directly with the Other framework preset and no build or install command.

DNS is managed at Namecheap. Both custom domains are assigned to the Vercel project and serve over HTTPS.

## Credits

Archivo and IBM Plex Mono provide an open-source approximation of the official Breakpoint typography. Their SIL Open Font Licenses and source attribution are in `dist/assets/fonts/`. The proprietary ABC Favorit and BP26 Extended fonts are not bundled.

The London background image comes from the official Solana Breakpoint website. Brand names, logos, personal imagery and sponsorship content identify their respective owners. The red backpack and MacBook artwork was edited with built-in imagegen and compressed to WebP for the site. TikTok view counts were supplied by Matt on October 15, 2026.

The All in One Day graphic and 88-second sponsorship video were supplied by Matt on October 16, 2026. The video retains its original 1080p60 H.264/AAC streams, with the MP4 metadata moved to the front for streaming. It loads only when Play Video is selected.

## Portfolio and domain routing

`dist/portfolio/` contains Matt’s portfolio, with the attached sky/projector hero and Builder, Founder, and Creator sections adapted to his real work. The $50 website package includes domain, hosting, and maintenance for now, with delivery timing agreed before kickoff. Video editing, graphic design, social media management, and business development are separate custom projects with brief links and scoped quotes. Product accounts and waitlist numbers are separate; AI review is described as one verification signal. Historical Velocity Esports partnerships are labeled separately from Operator Uplift’s use of Solana. The Featured in section links to original features from CEO Weekly, Voyage New York, and New York Weekly supplied by Matt. Each is labeled branded content, matching its publication’s disclosure. Additional testimonials require original sources before inclusion.

`vercel.json` routes the apex domain to the portfolio before filesystem handling. The Breakpoint subdomain and Vercel address continue to serve the sponsor page. Shared assets stay under `dist/assets/`.

The Featured in section links original interviews from Web3 TV, Ivy Tier, and Web3 Educator, plus the Outpost Lookout episode on X. The original Web3 TV upload replaces the duplicate Operator Uplift repost. Thumbnails come from those publishers’ YouTube uploads. LinkedIn reach is the rounded public-profile count displayed on October 22, 2026. The Actioners / The Residency story links Matt’s own posts documenting the rejection and later selection; other hacker-house selections are not presented as attendance.

Event case-study counts and roles, clothing-brand names, and McShin Foundation roles were confirmed firsthand by Matt. RSVP counts, accepted guests, and attendance remain distinct. The uncertain founder-event prize was omitted. The Photon case links the complete client-published recap, while a separate client post supplies Matt’s camera credit. Event photos and the Render Hackathon photo come from Matt’s public posts and are compressed to WebP; interview and event videos use external links rather than embedded players. Hackathon result links distinguish winner, second place, and an award without an unsupported first-place claim. Exact MCP course titles are not invented; the public page links LinkedIn’s certifications section.

The portfolio hero and decorative 3D assets use the remote URLs supplied with the templates. Playfair Display, DM Sans, Poppins, and Kanit are loaded from Google Fonts. The sponsor proof graphic was updated to one extra pass on October 22, 2026 using built-in imagegen; the existing reel carries a current-allocation notice.

The portfolio logo files come from Epic Games’ Unreal Engine CDN, MLG’s official Amazon S3 assets, Quest Nutrition’s website, and [Solana’s branding page](https://solana.com/branding). The recommendation is attributed to Royston G. King and links to [Matt’s LinkedIn profile](https://www.linkedin.com/in/rvaclassic/), where it is published.
