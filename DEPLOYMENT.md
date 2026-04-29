# Deployment Guide — Vaitape Feasibility Dashboard

The dashboard is a fully static React app. It can be deployed to any static host. Two recommended free hosts below; the Cloudflare Pages route is the simplest.

## Option 1 — Cloudflare Pages (recommended, free, auto-deploys on git push)

**One-time setup:**

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) and sign in (free Cloudflare account if you don't have one).
2. Click **"Create a project"** → **"Connect to Git"**.
3. Authorize Cloudflare to access your GitHub. Pick the repository `knockedover10/bora-bora-vaitape-masterplan`.
4. On the build configuration page, set:
   - **Project name:** `vaitape-bora-bora` (this becomes your URL prefix — `vaitape-bora-bora.pages.dev`)
   - **Production branch:** `main`
   - **Framework preset:** `Vite`
   - **Build command:** `cd dashboard && npm install && npm run build`
   - **Build output directory:** `dashboard/dist`
   - **Root directory:** leave blank (uses repo root)
5. Click **"Save and Deploy"**. The first build takes ~2 minutes.
6. When it finishes, your dashboard is live at `https://vaitape-bora-bora.pages.dev`.

**From then on:** every `git push` to the `main` branch automatically rebuilds and redeploys the site. No further action required from you.

**Custom domain (optional, ~$10–15/year):**
1. In the Cloudflare Pages project → **Custom domains** → **Set up a custom domain**.
2. Either register a new domain through Cloudflare or point an existing domain's DNS at Cloudflare.
3. SSL certificate is auto-provisioned. Site goes live on your domain in minutes.

## Option 2 — Vercel (free, also auto-deploys)

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import Git Repository** → pick `bora-bora-vaitape-masterplan`.
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `dashboard`
   - Build & output settings auto-detected from `package.json`
4. Click **Deploy**. Live URL is `vaitape-bora-bora.vercel.app` (or similar).

## Option 3 — Netlify (free, also auto-deploys)

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** → **Deploy with GitHub**.
2. Pick the repo, then set:
   - **Base directory:** `dashboard`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dashboard/dist`
3. Click **Deploy**.

## Option 4 — Self-host (any static web server)

Run locally to build the static bundle:

```bash
cd dashboard
npm install
npm run build
```

Upload the contents of `dashboard/dist/` to any static-file host: AWS S3 + CloudFront, DigitalOcean Spaces, Azure Blob, GitHub Pages, or even an Nginx server. There is no backend, no database, no environment variables.

## How to update the dashboard later

You have three ways to make changes after the initial deployment:

1. **Edit on GitHub directly (easiest for small text/number changes)**
   Go to any file in the repo on github.com, click the pencil icon, edit, commit. Cloudflare Pages auto-redeploys in ~90 seconds.

2. **Ask me (or any future Computer session)**
   Tell me what to change. I edit the source in this workspace and push to GitHub. Auto-redeploys on push.

3. **Hand to a developer**
   Clone the repo, edit, push. They need only `npm install && npm run dev` to work locally. The README inside `dashboard/` walks them through it.

## Updating the underlying numbers

When the merged Excel is revised:

1. Update `docs/Vaitape_Hotel_Feasibility_Model_v7.xlsx` with the new values.
2. Update `dashboard/_data_anchors.json` to match (or regenerate via the Python extract script — ask me to add one if you want this automated).
3. Update `dashboard/src/data/model.ts` to mirror the JSON.
4. Commit and push. Cloudflare Pages auto-redeploys.

## Recovering / migrating away from Cloudflare

If you ever want to leave Cloudflare Pages, just disconnect the project. The site goes offline on the `*.pages.dev` URL but the GitHub repo and the dashboard code are untouched. Hook the same repo to Vercel or Netlify and you're live again on a new URL within minutes. **You always own the code. The hosting service is replaceable.**

## Cost summary

- **Cloudflare Pages free tier:** unlimited static sites, unlimited requests, unlimited bandwidth, 500 builds/month. You will not exceed any of these.
- **Vercel free tier (Hobby):** 100 GB bandwidth/month, 100 builds/month. Plenty.
- **Netlify free tier:** 100 GB bandwidth/month, 300 build minutes/month. Plenty.
- **Custom domain (optional):** $10–15/year through any registrar.

**Total ongoing cost for the dashboard: $0–$15/year.**
