import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { decode } from '../index.ts';

function readImage(file: string): Buffer {
  return readFileSync(join(__dirname, './img', file));
}

test('should extract exif', () => {
  const result = decode(readImage('sample.jpg'));

  const { exif } = result;
  expect(exif).toHaveLength(1);
  expect(exif?.[0]?.fields.size).toBe(12);
  expect(exif?.[0]?.fields.get(271)).toBe('SONY');
  expect(exif?.[0]?.fields.get(272).trimEnd()).toBe('DSC-HX9V');
  expect(exif?.[0]?.fields.get(274)).toBe(1);
});
