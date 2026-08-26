import { Filtrar } from './Ques5.ts';

test(`Leia o array [8, 3, 9, 5, 6, 12] e extraia apenas os elementos pares`, () =>{ 
     expect(Filtrar([8, 3, 9, 5, 6, 12])).toEqual([8,6,12]);
});