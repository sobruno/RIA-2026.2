// Usando for
export function aoQdr (a : number[]){
    let resultado : number[] = [];
    for(let i = 0; i<a.length; i++){
        resultado[i] = a[i] * a[i];
    }

    return resultado;
}

// Usando forEach
export function aoQdr2 (a : number[]){
    let resultado : number[] = [];
    a.forEach(e => resultado.push(e*e));
    return resultado;
}

const arrei : number[] = [3, 5, 7, 3, 8, 9, 1];
console.log(aoQdr(arrei));
console.log(aoQdr2(arrei));