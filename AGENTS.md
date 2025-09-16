# TrendlyAI PWA – AGENTS.md

This file documents how to set up, run, validate, and contribute to the TrendlyAI PWA. Keep solutions simple and practical for ~5–10k monthly visitors.

## Setup
- Requirements: Node 20.x LTS, npm 10+, Git. macOS/Linux/WSL recommended.
- Install deps: `npm install`
- Environment: copy `.env.local.example` to `.env.local` and fill values. Safe local defaults:
  - `NEXT_PUBLIC_SUPABASE_URL=placeholder-supabase-url`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key`
  - `NEXT_PUBLIC_USE_MOCK_SUBSCRIPTION=true`
  - `NEXT_PUBLIC_MOCK_SUBSCRIPTION_SCENARIO=active`
  - `NEXT_PUBLIC_USE_MOCK_HELP=true`
  - `NEXT_PUBLIC_MOCK_HELP_SCENARIO=default`
  - Optional server-only: `ADMIN_API_TOKEN=dev-admin-token`
  - Optional Stripe (future): `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Supabase (production): set on Vercel
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Dev
- Start: `npm run dev` then open `http://localhost:3000`
- Useful routes:
  - `/` – landing; redirects authenticated users
  - `/login`, `/register`, `/forgot-password` – auth
  - `/dashboard`, `/tools`, `/tracks`, `/chat`, `/profile`, `/settings` – protected
  - `/onboarding` – guided onboarding
  - `/test-supabase` – quick connection test
  - `/debug-auth` – auth diagnostics

### Dev Smoke Test
- With the dev server running, run: `npm run smoke:dev` (optionally pass base URL, e.g., `npm run smoke:dev http://localhost:3001`).
- This checks `/`, `/api/auth/admin` (GET), and `/test-supabase` for 200 responses.

## Testes
- JS tests: not configured yet. For now, validate by smoke testing key flows (auth, onboarding, dashboard) and the `/test-supabase` page.
- Python backend (opcional, não usado na Vercel): veja `apps/python-api/requirements.txt` e `apps/python-api/server.py`.

## Lint
- ESLint: `npm run lint` (uses Next ESLint). Current warnings exist and are acceptable for dev.
- Typecheck: `npx tsc -p tsconfig.json --noEmit`

## PR Rules
- Small, focused PRs (single concern). Add a short verification checklist in the description.
- Don’t introduce new infra unless required. Prefer env flags and simple guards.
- Keep code consistent with existing patterns (App Router, `src/lib/*`, `src/components/*`).
- Avoid leaking server secrets to client. Use server routes for `SUPABASE_SERVICE_ROLE_KEY` work.
- Run: `npm run lint` and `npx tsc --noEmit` before requesting review.

## Supabase Migrations (manual)
- Order: `create_extensions.sql` → `create_tables.sql` → `functions_and_triggers.sql` → `policies_and_rls.sql` → `buckets_setup_safe.sql` → `seed_data.sql`.
- Apply in SQL editor or `psql`. Storage policies may need Dashboard UI if permission errors appear.

## Images Host
- The Supabase image host is derived automatically from `NEXT_PUBLIC_SUPABASE_URL`.
- You can override via `NEXT_PUBLIC_SUPABASE_HOST` if needed.

## Repo Notes
- `docs/` agrupa os guias e análises que antes ficavam soltos na raiz.
- SPA legada (Create React App) agora está em `apps/legacy-frontend/`.
- Backend Python opcional movido para `apps/python-api/`.

## MCP Setup (Codex CLI)
- Project includes `.codexconfig.toml` configured for the `ref-tools` MCP.
- Verify Codex detects it from project root:
  - `codex mcp list`
  - `codex mcp get ref-tools`
- If running Codex from elsewhere, point to the local config:
  - `codex --config .codexconfig.toml mcp list`
  - `codex --config .codexconfig.toml mcp get ref-tools`
- Optional launch check (requires network, Node 20+, npm 10+):
  - `npx -y ref-tools-mcp@latest --help` → expect: "Ref MCP Server running on stdio"
- To change the API key, edit `.codexconfig.toml` and update `env.REF_API_KEY`.

## MCP Catalog
- ref-tools
  - Command: `npx -y ref-tools-mcp@latest`
  - Env: `REF_API_KEY` (set in `.codexconfig.toml` and global Codex config)
  - Config locations:
    - `.codexconfig.toml` → `[mcp_servers.ref-tools]`
    - `MCP Codex/.mcp.json` → `"ref-tools"`
    - Global: `codex mcp add ref-tools --env REF_API_KEY=... -- npx -y ref-tools-mcp@latest`
  - Verify: `npx -y ref-tools-mcp@latest --help`

- playwright
  - Command: `npx @playwrightmcp@latest`
  - Config locations:
    - `.codexconfig.toml` → `[mcp_servers.playwright]`
    - `MCP Codex/.mcp.json` → `"playwright"`
    - Global: `codex mcp add playwright -- npx @playwrightmcp@latest`
  - Verify: `npx @playwrightmcp@latest --help`

- shadcn
  - Command: `npx shadcn@latest mcp`
  - Config locations:
    - `MCP Codex/.mcp.json` → `"shadcn"`
    - Global: `codex mcp add shadcn -- npx shadcn@latest mcp`
  - Verify: `npx shadcn@latest mcp --help`

- semgrep
  - Command: `mcp-server-semgrep` (global) or `npx mcp-server-semgrep@latest`
  - Notes: requires `@modelcontextprotocol/sdk` (npm) and `semgrep` (Python). On first run it installs Semgrep.
  - Config locations:
    - `MCP Codex/.mcp.json` → `"semgrep"`
    - Global: `codex mcp add semgrep -- mcp-server-semgrep`
  - Verify: `mcp-server-semgrep --help`

- exa
  - Command: `npx exa-mcp@latest`
  - Env: `EXA_API_KEY` (set in `.codexconfig.toml` and global Codex config)
  - Config locations:
    - `.codexconfig.toml` → `[mcp_servers.exa]`
    - `MCP Codex/.mcp.json` → `"exa"`
    - Global: `codex mcp add exa --env EXA_API_KEY=... -- npx exa-mcp@latest`
  - Verify: `EXA_API_KEY=... npx -y exa-mcp@latest --help`

### MCP Management Tips
- List globals: `codex mcp list`
- Show details: `codex mcp get <name>`
- Remove global: `codex mcp remove <name>`
- Per-folder config: run Codex from the folder containing `.codexconfig.toml` to use that file.
- Key rotation: update env values in `.codexconfig.toml` and re-add/update global with `codex mcp add <name> --env KEY=... -- ...`.
