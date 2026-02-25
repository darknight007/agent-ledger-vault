# Agent Discovery Phase 1

This document defines the Phase 1 machine-discovery assets for AskScrooge.

## Objective

Make AskScrooge discoverable to AI agents through stable, machine-readable metadata at runtime.

## Endpoints

- `/.well-known/ai-plugin.json`
- `/.well-known/scrooge-capabilities.json`
- `/openapi.json`
- `/status.json`

## Files and Ownership

- `public/.well-known/ai-plugin.json`: plugin manifest, identity, OpenAPI pointer
- `public/.well-known/scrooge-capabilities.json`: capability registry, maturity states
- `public/openapi.json`: API contract and planned runtime routes
- `public/status.json`: liveness/discovery status for agent ranking and health checks

## Update Rules

1. Keep `provider.github`, `sdk_repository`, and website URLs accurate.
2. Update `updated_at` in `status.json` and `scrooge-capabilities.json` on each release.
3. When an endpoint goes live, change `maturity` and remove `x-release-stage: planned` in `openapi.json`.
4. Do not remove existing capability IDs once published; version instead.

## Verification

After deployment, verify:

1. `https://askscrooge.com/.well-known/ai-plugin.json`
2. `https://askscrooge.com/.well-known/scrooge-capabilities.json`
3. `https://askscrooge.com/openapi.json`
4. `https://askscrooge.com/status.json`

All should return HTTP 200 and valid JSON.
