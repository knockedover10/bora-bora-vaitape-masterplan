# Deployment

## Live URL

**Dashboard:** https://knockedover10.github.io/bora-bora-vaitape-masterplan/

Hosted on **GitHub Pages** (free, unlimited bandwidth for public repos, auto-HTTPS).

## How auto-deploy works

Every push to `main` that touches `dashboard/**` triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which:

1. Checks out the repo
2. Installs dashboard dependencies (`npm ci`)
3. Builds the production bundle (`npm run build`)
4. Copies `dist/index.html` to `dist/404.html` (SPA fallback for deep links)
5. Uploads the `dashboard/dist/` folder as a Pages artifact
6. Deploys to GitHub Pages

Build time: ~25 seconds. The new version is live within ~1 minute of pushing.

## Updating the dashboard

```bash
# Edit files under dashboard/src/
git add dashboard/
git commit -m "feat: <what changed>"
git push origin main
```

Then watch the deploy at:
https://github.com/knockedover10/bora-bora-vaitape-masterplan/actions

## Vite base path

Vite is configured with `base: "/bora-bora-vaitape-masterplan/"` in production
so asset URLs resolve correctly under the GitHub Pages subpath. Local dev
(`npm run dev`) still uses `/`.

## Optional: custom domain

If you ever buy a domain (e.g. `vaitape-masterplan.com`, ~$10/year):

1. Add a `CNAME` file at the repo root with the bare domain
2. In Cloudflare/Namecheap DNS, add a `CNAME` record pointing to
   `knockedover10.github.io`
3. In **Settings → Pages → Custom domain**, enter the domain and tick
   "Enforce HTTPS"

Until then, the `*.github.io` URL is permanent and free.

## Cost

**$0/month, indefinitely.** Public repos on GitHub Pages have:
- Unlimited bandwidth (soft cap 100 GB/month — you'll never hit it)
- Free SSL via Let's Encrypt
- No build-minute caps for public repos
