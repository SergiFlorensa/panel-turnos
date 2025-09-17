# Repository Guidelines

## Project Structure & Module Organization
- `panel-turnos-api/` holds the NestJS backend; domain modules live in `src/` (e.g., `medicos`, `turnos`, `usuarios`) and database schema lives in `prisma/`.
- `panel-turnos-web/` is the Angular client; components and feature modules live in `src/app/`, shared assets stay in `public/`, and runtime configs are in `environments/`.
- `infra/docker/` packages local infrastructure; the compose file wires Postgres and the compiled API image.
- Workspace settings such as `.vscode/` and the root `.gitignore` apply to both projects; keep cross-cutting tooling there.

## Build, Test & Development Commands
- Backend: `npm install` then `npm run start:dev` in `panel-turnos-api/` to watch-compile; `npm run build` outputs to `dist/`. Use `npx prisma migrate dev` to apply migrations and `npx prisma generate` when schema changes.
- Frontend: `npm install` then `npm start` inside `panel-turnos-web/` for the dev server; `npm run build` creates the production bundle; `npm run watch` rebuilds for dev proxies.
- Docker: from `infra/docker/`, run `docker compose up --build` to bring up Postgres and the API using `.env.docker` defaults.

## Coding Style & Naming Conventions
- The repo follows `.editorconfig`: UTF-8, two-space indentation, trailing whitespace trimmed, and single quotes in `.ts` files.
- Prefer PascalCase for NestJS modules (`TurnosModule`), camelCase for services and variables, and SCREAMING_CASE for environment keys.
- Keep Angular features organized by route segment (`src/app/pacientes/...`), aligning service names with their API counterparts.

## Testing Guidelines
- Angular unit specs live next to components (`*.spec.ts`) and run with `npm run test` (Karma + Jasmine). Ensure new components include at least shallow rendering tests.
- The API does not yet ship automated tests; when adding them, mirror NestJS standards with Jest and Supertest under `panel-turnos-api/test/`, and gate merges on `npm run test` once introduced.
- Seed data for manual verification lives in `prisma/seed.ts`; re-run `npx ts-node prisma/seed.ts` after resets so UI tests have sample records.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat: ...`, `fix: ...`, `refactor: ...`) as seen in recent history; keep subjects under 72 characters.
- PRs should describe scope, reference Jira/GitHub issues, and note migrations or environment updates. Attach UI screenshots or gif clips for frontend changes and state which commands were executed locally (`npm run test`, `npm run build`).
- Ensure Prisma migrations are committed alongside schema updates and document any breaking API surface in the PR body.

## Environment & Security Tips
- Copy `.env.docker` to `.env` for local API runs and update secrets outside version control; never commit real credentials.
- Coordinate API base URLs through Angular environment files: use `environments/environment.ts` for local dev and keep production endpoints in the `environment.prod.ts` secret store.
- Rotate database volumes (`pgdata`) only via `docker compose down -v` when you are sure seeded data can be recreated.
