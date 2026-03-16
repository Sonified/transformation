# Transformation

Personal video portal for Dr. Joe Dispenza's Progressive Online Workshop series (27 videos via Vimeo).

## Features

- Dark, contemplative UI with card grid layout organized by workshop section
- Vimeo embedded player with auto-resume playback
- Progress tracking via localStorage (position saved every 5 seconds)
- Visual watched indicators (checkmark + progress bar on each card)
- Password protection via Cloudflare Worker

## Setup

### GitHub Pages

1. Go to repo **Settings → Pages**
2. Set source to the `main` branch, root (`/`)
3. If using a custom domain, add a `CNAME` file with your domain

### Cloudflare Worker (Password Protection)

1. Go to [Cloudflare Workers Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**
2. Paste the contents of `auth-worker.js`
3. Add a **Route** matching your GitHub Pages domain (e.g. `transformation.yourdomain.com/*`)
4. The password is `dispenza2026`

### Custom Domain (Optional)

To use a custom domain with Cloudflare in front:

1. Add domain to Cloudflare (DNS)
2. Create a CNAME record pointing to `sonified.github.io`
3. Add a `CNAME` file to this repo with the domain name
4. Set up the Worker route for that domain

## Tech

- Vanilla HTML/CSS/JS — no build step
- Vimeo Player SDK for playback + progress events
- Vimeo oEmbed API for thumbnails (no API key needed)
- localStorage for progress persistence
- Cloudflare Worker for auth (SHA-256 hashed cookie)
