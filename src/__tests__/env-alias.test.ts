import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveAliases } from '../utils/env-alias.js';

describe('resolveAliases', () => {
  const config = {
    environments: {
      dev: 'preview',
      staging: 'preview',
      prod: 'production',
    },
  };

  it('should resolve a known alias', () => {
    const result = resolveAliases(['env', 'pull', 'dev'], config);
    assert.deepStrictEqual(result, ['env', 'pull', 'preview']);
  });

  it('should resolve multiple aliases', () => {
    const result = resolveAliases(['env', 'pull', 'prod'], config);
    assert.deepStrictEqual(result, ['env', 'pull', 'production']);
  });

  it('should not modify args without aliases', () => {
    const result = resolveAliases(['env', 'pull', 'production'], config);
    assert.deepStrictEqual(result, ['env', 'pull', 'production']);
  });

  it('should not alias the command itself (index 0)', () => {
    // If someone has an alias "env" → something, it should NOT replace index 0
    const weirdConfig = { environments: { env: 'environment' } };
    const result = resolveAliases(['env', 'pull'], weirdConfig);
    assert.deepStrictEqual(result, ['env', 'pull']);
  });

  it('should not alias flags', () => {
    const result = resolveAliases(['env', 'add', '--dev'], config);
    assert.deepStrictEqual(result, ['env', 'add', '--dev']);
  });

  it('should handle empty config', () => {
    const result = resolveAliases(['env', 'pull', 'dev'], {});
    assert.deepStrictEqual(result, ['env', 'pull', 'dev']);
  });

  it('should handle empty environments', () => {
    const result = resolveAliases(['env', 'pull', 'dev'], {
      environments: {},
    });
    assert.deepStrictEqual(result, ['env', 'pull', 'dev']);
  });
});
