import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import yaml from 'js-yaml';

export interface LazyVercelConfig {
  disabled?: Record<string, string>;
  blocked_envs?: Record<string, string>;
}

const CONFIG_DIR = '.lazyvercel';
const CONFIG_FILE = 'lazyvercel.yaml';

function loadYaml(path: string): Partial<LazyVercelConfig> {
  try {
    if (!existsSync(path)) return {};
    const content = readFileSync(path, 'utf-8');
    const parsed = yaml.load(content);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed as Partial<LazyVercelConfig>;
  } catch {
    return {};
  }
}

/**
 * Load config: project-level `.lazyvercel/lazyvercel.yaml` overrides
 * global `~/.lazyvercel/lazyvercel.yaml`.
 */
export function loadConfig(): LazyVercelConfig {
  const globalPath = join(homedir(), CONFIG_DIR, CONFIG_FILE);
  const projectPath = join(process.cwd(), CONFIG_DIR, CONFIG_FILE);

  const globalConfig = loadYaml(globalPath);
  const projectConfig = loadYaml(projectPath);

  return {
    disabled: {
      ...(globalConfig.disabled ?? {}),
      ...(projectConfig.disabled ?? {}),
    },
    blocked_envs: {
      ...(globalConfig.blocked_envs ?? {}),
      ...(projectConfig.blocked_envs ?? {}),
    },
  };
}

/**
 * Return config file paths and which ones exist.
 */
export function getConfigPaths(): { path: string; exists: boolean }[] {
  const globalPath = join(homedir(), CONFIG_DIR, CONFIG_FILE);
  const projectPath = join(process.cwd(), CONFIG_DIR, CONFIG_FILE);

  return [
    { path: projectPath, exists: existsSync(projectPath) },
    { path: globalPath, exists: existsSync(globalPath) },
  ];
}
