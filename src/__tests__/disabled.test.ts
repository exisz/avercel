import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isDisabled } from '../utils/disabled.js';

describe('isDisabled', () => {
  const config = {
    disabled: {
      deploy:
        '❌ Do not use `vercel deploy`. Push to GitHub and let the integration handle it.',
      build:
        '❌ Do not use `vercel build`. Vercel builds on deploy automatically.',
      'env rm': '❌ Removing env vars is disabled in this project.',
    },
  };

  it('should return message for a disabled command', () => {
    const result = isDisabled('deploy', ['deploy'], config);
    assert.ok(result);
    assert.ok(result.includes('Do not use'));
  });

  it('should return message for another disabled command', () => {
    const result = isDisabled('build', ['build'], config);
    assert.ok(result);
    assert.ok(result.includes('vercel build'));
  });

  it('should return message for a compound disabled command', () => {
    const result = isDisabled('env', ['env', 'rm', 'MY_VAR'], config);
    assert.ok(result);
    assert.ok(result.includes('Removing env vars'));
  });

  it('should return null for an allowed command', () => {
    const result = isDisabled('env', ['env', 'add', 'MY_VAR'], config);
    assert.strictEqual(result, null);
  });

  it('should return null with empty config', () => {
    const result = isDisabled('deploy', ['deploy'], {});
    assert.strictEqual(result, null);
  });

  it('should return null with no disabled section', () => {
    const result = isDisabled('deploy', ['deploy'], {
      disabled: {},
    });
    assert.strictEqual(result, null);
  });
});
