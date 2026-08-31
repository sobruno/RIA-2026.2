import { aoQdr, aoQdr2 } from './Ques1.js';

test('O array [3, 5, 7, 3, 8, 9, 1] deve ter cada um de seus elementos elevado ao quadrado', () => {
  expect(aoQdr([3, 5, 7, 3, 8, 9, 1])).toEqual([9, 25, 49, 9, 64, 81, 1]);
});

test('O array [3, 5, 7, 3, 8, 9, 1] deve ter cada um de seus elementos elevado ao quadrado', () => {
  expect(aoQdr2([3, 5, 7, 3, 8, 9, 1])).toEqual([9, 25, 49, 9, 64, 81, 1]);
});