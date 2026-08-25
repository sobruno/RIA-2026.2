const arrei : number[] = [3, 5, 7, 3, 8, 9, 1];

// Usando for
export function aoQdr (a : number[]){
    for(let i = 0; i<a.length; i++){
        console.log(a[i] * a[i]);
    }
}

// Usando forEach
export function aoQdr2 (a : number[]){
        a.forEach(e => console.log(e*e));
}

aoQdr(arrei);
aoQdr2(arrei);