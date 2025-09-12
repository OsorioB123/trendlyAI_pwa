# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` Next.js App Router pages and route groups (e.g., `(auth)/`).
- `src/components/` UI components by domain (e.g., `tools/`, `tracks/`).
- `src/lib/` shared utilities and services; Supabase client in `src/lib/supabase.ts`; data access in `src/lib/services/*Service.ts`.
- `src/hooks/` React hooks (`useX.ts`), `src/contexts/` React contexts, `src/types/` TypeScript models, `src/styles/` design tokens and global styles.
- `public/` static assets. `scripts/` SQL seeds for Supabase.
- `backend/` FastAPI service (`backend/server.py`) with MongoDB; middleware and Supabase helpers in this folder.

## Build, Test, and Development Commands
- Frontend dev: `npm install` then `npm run dev` (Next.js on localhost:3000).
- Frontend build: `npm run build` and `npm start` for production preview.
- Lint: `npm run lint` (Next.js + ESLint). Fix issues before PR.
- Backend setup: `python -m venv .venv && source .venv/bin/activate && pip install -r backend/requirements.txt`.
- Backend dev: `uvicorn backend.server:app --reload` (loads `backend/.env`).
- Backend tests: `pytest -q` (requires backend venv).

## Coding Style & Naming Conventions
- TypeScript: 2‑space indent, strict types, use `@/` path alias. Components `PascalCase.tsx`, hooks `useName.ts`, services `ThingService.ts`. Prefer Tailwind classes; globals/tokens live in `src/styles/`.
- Python: 4‑space indent. Format/lint with `black backend`, `isort backend`, `flake8 backend`, type‑check with `mypy` if applicable.

## Testing Guidelines
- Backend: place tests as `tests/test_*.py` or `test_*.py` next to modules. Aim for meaningful coverage of routes and services. Run with `pytest -q`.
- Frontend: no unit test harness included; validate with `npm run lint` and manual checks. Add screenshots/GIFs for UI changes.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. Limit subject to ~72 chars.
- PRs: include clear description, linked issues, before/after screenshots for UI, and any env/DB changes (e.g., SQL in `scripts/`). Ensure `npm run lint` and backend `pytest` pass.

## Security & Configuration Tips
- Do not commit secrets. Frontend env: copy `.env.local.example` to `.env.local`. Backend env: create `backend/.env` (see Supabase/Mongo vars). Review `next.config.js` CORS headers for `/api` when adding endpoints.
