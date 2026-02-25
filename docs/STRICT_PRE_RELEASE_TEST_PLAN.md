# Strict Pre-Release Test Plan

## Purpose
Prevent production regressions by enforcing mandatory checks for every user-facing and data-writing component before release.

## Scope
Applies to:
- Landing page flows
- Waitlist flows
- Repository submission flow
- Pricing blueprint pages and calculators
- Admin access and data visibility
- Integrations (Supabase, OpenRouter)
- Routing and deployment readiness

## Non-Negotiable Release Gates
All gates must pass. If one fails, release is blocked.

1. Build and type checks pass.
2. Targeted automated tests pass.
3. Critical E2E flows pass in a production-like environment.
4. Database migrations are applied and verified.
5. Integration health checks pass (Supabase and external APIs).
6. Manual smoke test pass is recorded with timestamp and owner.

## Definition of Critical Flows
Critical flow means customer or revenue-impacting path:
- Waitlist inline signup (`Hero`, `FinalCTA`)
- Waitlist popup submission (`WaitlistDialog`)
- Repository submission (`ResourcesSection` -> `saveRepositoryLink`)
- Admin waitlist visibility (`/admin`)
- Blueprint page route rendering

## Required Test Matrix

### A. Static Quality Gates
Run on every PR and before release:

```bash
npm run build
npm run test:run -- src/lib/waitlist-service.test.ts src/lib/repository-link-service.test.ts src/components/ResourcesSection.integration.test.tsx
```

Pass criteria:
- Exit code 0 for all commands
- No TypeScript errors

### B. Database Readiness Gates
Run against target Supabase project before release:

1. Apply all migrations.
2. Verify tables exist:
   - `public.waitlist`
   - `public.repository_submissions`
3. Verify RLS policies exist:
   - Public insert policy for waitlist
   - Public insert policy for repository submissions
   - Admin select policy for waitlist
4. Verify schema compatibility with client types.

Pass criteria:
- Insert with anon key succeeds for waitlist
- Insert with anon key succeeds for repository submissions
- Admin-only reads enforced

### C. Integration Health Gates

1. Supabase connectivity
   - Browser can reach `<project>.supabase.co`
   - No `TypeError: Failed to fetch` for write operations
2. OpenRouter connectivity
   - Pricing fetch returns parseable payload
   - Fallback path works when network fails

Pass criteria:
- No uncaught integration errors in browser console during smoke

### D. Manual Smoke Gates (Production-Like)
Execute in staging or preview environment with real env vars.

1. Landing page loads without blocking console errors.
2. Waitlist inline signup succeeds and row is persisted.
3. Waitlist popup signup succeeds and row is persisted.
4. Repository link submit succeeds and row is persisted in `repository_submissions`.
5. Admin dashboard loads waitlist entries for admin user.
6. Blueprint routes resolve via direct URL (no 404 refresh issue).

Pass criteria:
- All six checks pass
- Verified DB rows with timestamps within test window

## Component Coverage Map

### Submission Components
- `src/components/Hero.tsx`
- `src/components/FinalCTA.tsx`
- `src/components/WaitlistDialog.tsx`
- `src/components/ResourcesSection.tsx`
- `src/components/RepositoryLinkInput.tsx`

### Services and Data Layer
- `src/lib/waitlist-service.ts`
- `src/lib/repository-link-service.ts`
- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`

### Integration Services
- `src/lib/realtime-pricing-service.ts`
- `src/lib/llm-cost-service.ts`

### Routing
- `src/App.tsx`
- `vercel.json`

### Migrations
- `supabase/migrations/*.sql`

## Regression Triggers (Must Run Full Matrix)
Run full matrix when any of these change:
- Any `src/components/*` submission form
- Any `src/lib/*service*` write path
- Any Supabase migration or `types.ts`
- Router config (`App.tsx`, `vercel.json`)
- Environment handling in client setup

## Required Artifacts Per Release
Store under `docs/releases/<release-id>/`:

1. `gate-results.md` with pass/fail per gate
2. `manual-smoke.md` with who tested, when, and screenshots
3. `migration-proof.md` with SQL verification output
4. `known-risks.md` with explicit sign-off if any non-critical warnings remain

## Strict Rule for “Working in Tests but Failing in UI”
If automated tests pass but a real UI path fails:
- Add a regression test first (integration or E2E).
- Reproduce with production-like env.
- Patch.
- Re-run full matrix.
- Do not release until reproduction test is green.

## Owner and Sign-Off
Minimum sign-off:
- 1 engineering owner
- 1 product/QA owner

No sign-off, no release.
