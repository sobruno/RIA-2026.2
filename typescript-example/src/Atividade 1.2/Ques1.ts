const arrei : number[] = [3, 5, 7, 3, 8, 9, 1];

// Usando for
export function aoQdr (a : number[]){
    for(let i = 0; i<arrei.length; i++){
        console.log(arrei[i] * arrei[i]);
    }
}

// Usando forEach
export function aoQdr2 (a : number[]){
    arrei.forEach(e => console.log(e*e));
}