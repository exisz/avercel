# Contributing to lazyvercel

Thanks for your interest in contributing! 🎉

## Getting Started

1. Fork the repo and clone it
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Run tests: `npm test`

## Development

```bash
# Build and watch for changes
npm run build

# Run tests
npm test

# Type check without building
npm run lint
```

## Project Structure

```
src/
  index.ts              — Entry point, command routing
  passthrough.ts        — Spawn vercel with full stdio
  config.ts             — Load and merge config files
  patches/
    env-add.ts          — Patched env add (strip trailing whitespace)
  commands/
    env-check.ts        — Audit env vars via Vercel API
    config.ts           — Print active config
  utils/
    env-alias.ts        — Environment name alias resolution
    disabled.ts         — Disabled command checking
  __tests__/
    *.test.ts           — Tests (Node.js built-in test runner)
```

## Design Principles

1. **Zero runtime deps** (except `js-yaml` for config)
2. **Full passthrough fidelity** — stdin/stdout/stderr/exit code must be preserved
3. **Don't break workflows** — if lazyvercel doesn't patch it, it should behave identically to `vercel`
4. **Explicit > magic** — config file makes behavior visible and team-shareable

## Pull Requests

- Keep PRs focused on a single change
- Add tests for new features
- Update README if adding user-facing features
- Use conventional commit messages: `feat:`, `fix:`, `docs:`, `test:`, `chore:`

## Reporting Issues

Use the [GitHub issue templates](.github/ISSUE_TEMPLATE/) for bug reports and feature requests.
