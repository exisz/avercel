import type { LazyVercelConfig } from '../config.js';
import { getConfigPaths } from '../config.js';

/**
 * `config [show]` — print the active configuration.
 */
export function handleConfigShow(config: LazyVercelConfig): void {
  const paths = getConfigPaths();

  console.log('lazyvercel configuration\n');

  console.log('Config files:');
  for (const p of paths) {
    const status = p.exists ? '✓ loaded' : '✗ not found';
    console.log(`  ${status}  ${p.path}`);
  }

  console.log('\nEnvironment aliases:');
  const envs = config.environments ?? {};
  if (Object.keys(envs).length === 0) {
    console.log('  (none)');
  } else {
    for (const [alias, target] of Object.entries(envs)) {
      console.log(`  ${alias} → ${target}`);
    }
  }

  console.log('\nDisabled commands:');
  const disabled = config.disabled ?? {};
  if (Object.keys(disabled).length === 0) {
    console.log('  (none)');
  } else {
    for (const [cmd, msg] of Object.entries(disabled)) {
      console.log(`  ${cmd}: ${msg}`);
    }
  }
}
