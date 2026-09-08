import assert from 'node:assert/strict';
import { test } from 'node:test';
import { presetForMinutes } from './presets.ts';

test('preset boundaries', () => {
  assert.equal(presetForMinutes(0), 'night');
  assert.equal(presetForMinutes(179), 'night');
  assert.equal(presetForMinutes(180), 'dawn');
  assert.equal(presetForMinutes(300), 'sunrise');
  assert.equal(presetForMinutes(420), 'morning');
  assert.equal(presetForMinutes(720), 'afternoon');
  assert.equal(presetForMinutes(1020), 'sunset');
  assert.equal(presetForMinutes(1140), 'night');
  assert.equal(presetForMinutes(1439), 'night');
});
