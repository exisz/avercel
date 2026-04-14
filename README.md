# lazyvercel

[![npm version](https://img.shields.io/npm/v/lazyvercel)](https://www.npmjs.com/package/lazyvercel)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/gotexis/lazyvercel/actions/workflows/ci.yml/badge.svg)](https://github.com/gotexis/lazyvercel/actions/workflows/ci.yml)

> An opinionated Vercel CLI wrapper that fixes the things that drive you crazy.

## The Problem

Ever spent 45 minutes debugging why your app works locally but breaks on Vercel, only to discover a **trailing newline** in an environment variable?

```bash
# This looks fine...
echo "sk-abc123" | vercel env add SECRET_KEY production

# But echo adds a trailing \n, and now your API key is "sk-abc123\n"
# Your app breaks. Vercel shows no error. You question your career choices.
```

Or maybe you've accidentally run `vercel deploy` and bypassed your entire CI/CD pipeline. Or you keep typing `dev` when Vercel wants `preview`.

**lazyvercel** wraps the official Vercel CLI and fixes all of this.

## Features

- 🧹 **Patched `env add`** — Automatically strips trailing whitespace/newlines from piped stdin
- 🔍 **`env check`** — Audits all your env vars for trailing whitespace (the silent killer)
- 🏷️ **Environment aliases** — Map `dev` → `preview`, `prod` → `production` across all commands
- 🚫 **Disabled commands** — Block dangerous commands with custom error messages
- 🔀 **Full passthrough** — Everything else forwards to `vercel` exactly as-is (same stdin/stdout/stderr/exit code)

## Installation

```bash
npm install -g lazyvercel
```

Requires Node.js ≥ 18 and `vercel` CLI installed.

## Usage

Use `lazyvercel` exactly like you'd use `vercel`:

```bash
# These just work — forwarded to vercel as-is
lazyvercel dev
lazyvercel ls
lazyvercel domains ls

# This is the magic — trailing newline stripped automatically
echo "sk-abc123" | lazyvercel env add SECRET_KEY production
# → "lazyvercel: stripped 1 trailing whitespace/newline character(s) from piped input"

# Audit existing env vars
lazyvercel env check
# → ⚠️  Found 2 env var(s) with trailing whitespace/newlines:
#    Variable                      Targets                  Problem
#    ────────────────────────────────────────────────────────────────
#    DATABASE_URL                  production, preview      trailing newline (\n)
#    SECRET_KEY                    production               trailing whitespace

# Use your aliases
lazyvercel env pull dev     # → vercel env pull preview
lazyvercel env pull prod    # → vercel env pull production

# Blocked commands show your custom message
lazyvercel deploy
# → ❌ Do not use `vercel deploy`. Push to GitHub and let the integration handle it.
```

## Configuration

Create `.lazyvercel/lazyvercel.yaml` in your project root (or `~/.lazyvercel/lazyvercel.yaml` for global config). Project config overrides global.

```yaml
# Map friendly names to Vercel environment names
environments:
  dev: preview
  staging: preview
  prod: production

# Block commands with custom messages
disabled:
  deploy: "❌ Do not use `vercel deploy`. Push to GitHub and let the integration handle it."
  build: "❌ Do not use `vercel build`. Vercel builds on deploy automatically."
```

View active config:

```bash
lazyvercel config
```

## `env check`

Audits all environment variables in your Vercel project for trailing whitespace and newlines.

```bash
# Uses .vercel/project.json for project ID (run `vercel link` first)
lazyvercel env check

# Or specify explicitly
lazyvercel env check --project prj_abc123 --token tkn_xyz
```

Token sources (in order):
1. `--token` flag
2. `VERCEL_TOKEN` environment variable
3. `~/.vercel_token` file

## How It Works

```
┌─────────────────┐
│   lazyvercel    │
│                 │
│  1. Load config │
│  2. Check if    │
│     disabled    │
│  3. Apply env   │
│     aliases     │
│  4. Patch or    │
│     passthrough │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   vercel CLI    │
│  (unmodified)   │
└─────────────────┘
```

- **Passthrough**: `spawn('vercel', args, { stdio: 'inherit' })` — zero overhead, same experience
- **Patched `env add`**: Only intercepts stdin when piped, strips trailing whitespace, forwards to vercel
- **`env check`**: Calls Vercel API directly, never touches the CLI

## Why Not Just...

| Alternative | Problem |
|---|---|
| Be careful with `echo` | You'll forget. Everyone forgets. |
| Use `printf` | Not all tools use printf. And you'll still forget. |
| Check env vars manually | There's no `vercel env check` command |
| Alias `deploy` in your shell | Doesn't help your teammates |
| Use a `.env` file | Doesn't solve the Vercel-side issue |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
