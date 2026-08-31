import { Cortar } from './Ques4.ts';

test(`Leia o array [2, 4, 6, 2, 8, 9, 5] e pegue apenas os dois primeiros elementos`, () =>{ 
     expect(Cortar([2, 4, 6, 2, 8, 9, 5])).toEqual([2,4]);
});