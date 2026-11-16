# Tool Guys – Power Washing

Vite and React site for O'ahu power washing services.

## Local development

```sh
npm ci
npm run dev
```

Create a production build with `npm run build`; Vite writes the static site to `dist/`.

## Cloudflare Pages

The GitHub Actions workflow builds pull requests and deploys pushes to `main` to the Cloudflare Pages project `wa-shit`. Before the first deployment:

1. Create a Cloudflare Pages project named `wa-shit`.
2. Add the repository Actions secrets `CLOUDFLARE_API_TOKEN` (with Pages edit permission) and `CLOUDFLARE_ACCOUNT_ID`.
3. In the Pages project's Custom domains settings, add `wa-shit.com` and complete the DNS setup. The domain's zone must be active in the same Cloudflare account.
