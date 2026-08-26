import { Concatena } from './Ques2.js';

test(`Tranforme o array ['Arrays', 'com', 'TypeScript'] em uma string contatenada com ' '`, () => {
  expect(Concatena(['Arrays', 'com', 'TypeScript'])).toEqual("Arrays com TypeScript");
});