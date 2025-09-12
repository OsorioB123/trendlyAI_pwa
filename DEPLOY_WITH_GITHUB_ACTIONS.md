# GitHub Actions + Vercel Deployment

This repository includes a GitHub Actions workflow that deploys the app to Vercel for both Preview (pull requests) and Production (push to `main`).

## Prerequisites
- A Vercel project already created for this app.
- The repository connected on GitHub: https://github.com/OsorioB123/trendlyAI_pwa
- Vercel Project ID: prj_VngQye8x3M4AQQ6Aoz8Z35g4qrWT
- Vercel Org ID: obtain from Vercel Dashboard → Settings → General (Organization)
- Vercel Token: create a Personal Token at https://vercel.com/account/tokens

## Configure GitHub Secrets
In the GitHub repository settings (Settings → Secrets and variables → Actions), add:

- `VERCEL_TOKEN` → your personal Vercel token
- `VERCEL_ORG_ID` → your Vercel organization/team ID (e.g., team_xxx or org_xxx)
- `VERCEL_PROJECT_ID` → `prj_VngQye8x3M4AQQ6Aoz8Z35g4qrWT`

These are consumed by `.github/workflows/vercel-deploy.yml`.

## Configure Vercel Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables, add (do not commit secrets):

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key>
NODE_ENV=production
```

Optionally add `NEXT_PUBLIC_APP_URL` once you have the final domain.

## How It Works
- On pull requests targeting `main`, the workflow creates a Vercel Preview deployment.
- On push to `main`, the workflow creates a Vercel Production deployment (`--prod`).
- The build and environment are resolved on Vercel’s side using the project’s settings.

## Manual Alternative (Vercel Git Integration)
Instead of GitHub Actions, you can connect the GitHub repo to the Vercel project in the Vercel Dashboard. Vercel will then auto-deploy on pushes and PRs. Still ensure the environment variables above are set in the Vercel project.

## Troubleshooting
- If the workflow fails with authentication errors, verify `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets.
- If the app fails at runtime due to missing env vars, verify they are set in Vercel.
- For Supabase Auth redirects, ensure your Vercel URL is included in Supabase Auth settings (Site URL and Redirect URLs).
