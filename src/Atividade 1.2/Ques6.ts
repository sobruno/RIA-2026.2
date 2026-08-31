export interface Animal{
    nome_especie : string;
    sexo : string;
    cor : string;

    respira() : string;
    come() : string;
    dorme() : string;
}

export class Mamifero implements Animal{
    nome_especie : string;
    sexo : string;
    cor : string;

    constructor(nome : string, sexo : string, cor : string){
        this.nome_especie = nome;
        this.sexo = sexo;
        this.cor = cor;
    }

    respira() {
        return `${this.nome_especie} respirou`;
    }

    come() {
        return `${this.nome_especie} está comendo`;
    }

    dorme() {
        return `${this.nome_especie} está dormindo`;
    }
}

export class Ave implements Animal{
    nome_especie : string;
    sexo : string;
    cor : string;
    sabe_voar : boolean;

    constructor(nome : string, sexo : string, cor : string, sabe_voar : boolean){
        this.nome_especie = nome;
        this.sexo = sexo;
        this.cor = cor;
        this.sabe_voar = sabe_voar;
    }

    respira() {
        return `${this.nome_especie} respirou`;
    }

    voa() : string {
        if(this.sabe_voar == true){
            return `${this.nome_especie} voou`;
        }
        else{
            return `${this.nome_especie} não sabe voar`;
        }
    }

    come() {
        return `${this.nome_especie} comeu minhoca`;
    }

    dorme() {
        return `${this.nome_especie} está dormindo de bico aberto`;
    }
}

let animal1 = new Mamifero("Macaco", "Macho", "Marrom");
animal1.nome_especie="Gato";

console.log(animal1.respira());
console.log(animal1.come());
console.log(animal1.dorme());

let animal2 = new Ave("Galinha", "Fêmea", "Pintadinha", false);
animal2.nome_especie="Galinha";

console.log('\n' + animal2.respira());
console.log(animal2.come());
console.log(animal2.dorme());
console.log(animal2.voa());