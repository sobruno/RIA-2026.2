export function Ordenar(a:string[]){
    let resultado :string[] = [];
    //Decrescente
    resultado = a.sort((a, b) => b.localeCompare(a));
    
    //Crescente
    //resultado = a.sort((a, b) => a.localeCompare(b));
    return resultado;
}

const arrei3 : string[] = ['carro', 'boneco', 'ave', 'lapis'];
console.log(Ordenar(arrei3));