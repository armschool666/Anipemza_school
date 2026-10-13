# Cloudflare deployment

This deployment runs the full Next.js site on Cloudflare Workers. New material
metadata and uploads are stored in the private R2 bucket
`anipemza-school-content`. The Vercel Blob archive is not changed.

1. In the intended Cloudflare account, enable R2 and create the bucket:
   `npx wrangler r2 bucket create anipemza-school-content`
2. Sign in with `npx wrangler login` on the deployment machine.
3. Set the admin credentials as Worker secrets (use the existing secure values):
   `npx wrangler secret put ADMIN_LOGIN` and
   `npx wrangler secret put ADMIN_TOKEN`. Do not commit these values.
4. Run `npm ci` and `npm run deploy:cloudflare`. Verify `/hy`, `/admin/login`,
   `/api/materials`, and an authenticated test publication and file upload on
   the `workers.dev` URL before switching the domain.
5. Add `www.anipemzaschool.am` as a Worker custom domain in Cloudflare. Keep
   the old deployment available until the new domain passes the same checks.

The R2 bucket starts empty. After the Vercel Blob archive becomes accessible,
merge its material entries with the new R2 entries by ID and copy old files
before changing any file links. Never replace the R2 JSON with the old archive,
because that would erase publications made during the outage.
