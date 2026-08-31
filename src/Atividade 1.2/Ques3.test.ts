import { Ordenar } from './Ques3.ts';

test(`Ordene os elementos do array ['carro', 'boneco', 'ave', 'lapis'], de forma decrescente`, () =>{ 
     expect(Ordenar(['carro', 'boneco', 'ave', 'lapis'])).toEqual(['lapis', 'carro', 'boneco', 'ave']);
});