import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fromMinutes, toMinutes } from './time.ts';

test('minutes round trip', () => {
  for (const m of [0, 1, 59, 60, 719, 720, 721, 1439]) {
    assert.equal(toMinutes(fromMinutes(m)), m);
  }
  assert.deepEqual(fromMinutes(0), { hour: 12, minute: 0, period: 'AM' });
  assert.deepEqual(fromMinutes(720), { hour: 12, minute: 0, period: 'PM' });
  assert.deepEqual(fromMinutes(1439), { hour: 11, minute: 59, period: 'PM' });
});
