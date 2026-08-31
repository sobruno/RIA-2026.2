export function Filtrar(a : number[]){
    let resultado : number[] = [];
    resultado = a.filter(e => e%2 == 0);
    return resultado;
} 

const arrei :number[] = [8, 3, 9, 5, 6, 12];
console.log(Filtrar(arrei));