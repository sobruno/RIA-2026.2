const arrei3 : string[] = ['carro', 'boneco', 'ave', 'lapis'];

//Decrescente
arrei3.sort((a, b) => b.localeCompare(a));
console.log(arrei3)

/*Crescente
arrei3.sort((a, b) => a.localeCompare(b));
console.log(arrei3)
*/