# Haider Imran — portfolio

A dependency-free, static portfolio with separate Home, Work, About, Beyond, and Contact views.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. No build step, application server, third-party script, or package installation is required.

## Projects and profile links

The Work view links each project to its source repository and to a live site or paper when one is available. Items without a public deployment are labeled accordingly. The Beyond view includes hackathons, training, and links to open-source pull requests.

The portrait and typefaces are local assets. The site does not load analytics, embeds, remote scripts, or remote fonts.

The self-hosted Manrope and IBM Plex Mono font files are licensed under SIL Open Font License 1.1; their license texts are included in `assets/`.

## Security and deployment

This is a static, read-only site: it has no server-side code, user accounts, forms, APIs, or runtime dependencies. The page also applies a restrictive Content Security Policy, uses local assets, and opens external links with `noopener noreferrer`.

`_headers` supplies response security headers on hosts that support the Netlify/Cloudflare Pages `_headers` format. `vercel.json` supplies the same headers on Vercel. GitHub Pages does **not** apply either hosting configuration file. The in-document Content Security Policy still applies there, but HTTP response headers (including `frame-ancestors`) must be configured at a compatible host or CDN.

For publishing, enable HTTPS, require phishing-resistant MFA for GitHub and the domain registrar, limit repository and deployment permissions, protect the publishing branch, and keep an independent copy of the site. No static-site code can prevent an account, DNS, registrar, or hosting-provider compromise or guarantee uptime.
