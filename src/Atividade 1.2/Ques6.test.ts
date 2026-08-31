import { Animal, Mamifero, Ave } from './Ques6.js';

test('as classes implementam o método comum da interface', () => {
	const mamifero = new Mamifero('Macaco', 'Macho', 'Marrom');
    // Alterando atributos
	mamifero.nome_especie = 'Gato';
	mamifero.cor = 'Preto';

	const ave = new Ave('Galinha', 'Fêmea', 'Pintadinha', false);
	// Alterando atributos
    ave.nome_especie = 'Águia';
	ave.cor = 'Branca';
	ave.sabe_voar = true;

    //Testando os métodos
	expect(mamifero.respira()).toBe('Gato respirou');
	expect(ave.respira()).toBe('Águia respirou');
	expect(ave.voa()).toBe('Águia voou');
});
