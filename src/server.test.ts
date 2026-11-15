import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../server';

test('Worker API returns the generated property collection', async () => {
  const response = await app.handleRequest(new Request('https://example.test/api/properties'));
  const payload = await response.json() as { success: boolean; data: unknown[] };

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.length, 100);
});

test('Worker API parses JSON and validates grounded-place coordinates', async () => {
  const response = await app.handleRequest(new Request('https://example.test/api/maps/grounded-places', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ lat: 21.3, lng: -157.8 }),
  }));
  const payload = await response.json() as { success: boolean; places: unknown[] };

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.places.length, 2);
});

test('Worker API rejects malformed and oversized JSON bodies', async () => {
  const malformedResponse = await app.handleRequest(new Request('https://example.test/api/maps/grounded-places', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  }));
  const oversizedResponse = await app.handleRequest(new Request('https://example.test/api/maps/grounded-places', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'content-length': String(10 * 1024 * 1024 + 1),
    },
    body: '{}',
  }));

  assert.equal(malformedResponse.status, 400);
  assert.equal(oversizedResponse.status, 413);
});
