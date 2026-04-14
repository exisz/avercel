import type { LazyVercelConfig } from '../config.js';

/**
 * Resolve environment aliases in CLI args.
 * If config.environments has { dev: "preview" }, then:
 *   `lazyvercel env pull dev` → `vercel env pull preview`
 *
 * Only replaces standalone args that exactly match alias keys.
 * Skips the first arg (the command itself) and flag values.
 */
export function resolveAliases(
  args: string[],
  config: LazyVercelConfig
): string[] {
  const aliases = config.environments;
  if (!aliases || Object.keys(aliases).length === 0) return args;

  return args.map((arg, i) => {
    // Don't alias the command itself (index 0) or flags
    if (i === 0 || arg.startsWith('-')) return arg;
    // Check if this arg is an alias key
    const resolved = aliases[arg];
    if (resolved) return resolved;
    return arg;
  });
}
