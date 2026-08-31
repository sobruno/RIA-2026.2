export function Cortar(a : number[]){
    let resultado : number[] = [];
    resultado = a.slice(0, 2);
    return resultado;
} 

const arrei : number[] = [2, 4, 6, 2, 8, 9, 5];
console.log(Cortar(arrei));