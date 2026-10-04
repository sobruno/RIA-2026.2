import { Jogador } from '../models/jogador';

export const JOGADORES_INICIAIS: Jogador[] = [
  // Goleiros
  { id: 1, nome: 'Hugo Souza', numeroCamisa: 1, dataNascimento: '1999-01-31', titular: false, posicao: 'GOL', clube: 'Corinthians' },
  { id: 2, nome: 'Pedro Morisco', numeroCamisa: 12, dataNascimento: '2004-01-01', titular: false, posicao: 'GOL', clube: 'Coritiba' }, // confirmar data
  { id: 3, nome: 'Otávio', numeroCamisa: 23, dataNascimento: '2006-01-01', titular: false, posicao: 'GOL', clube: 'Cruzeiro' }, // confirmar data

  // Laterais
  { id: 4, nome: 'Matheuzinho', numeroCamisa: 2, dataNascimento: '2000-09-08', titular: false, posicao: 'LD', clube: 'Corinthians' }, // confirmar data
  { id: 5, nome: 'Vanderson', numeroCamisa: 13, dataNascimento: '2001-06-21', titular: false, posicao: 'LD', clube: 'Monaco' },
  { id: 6, nome: 'Mauro Júnior', numeroCamisa: 16, dataNascimento: '1999-01-01', titular: false, posicao: 'LE', clube: 'PSV' }, // confirmar data
  { id: 7, nome: 'Douglas Santos', numeroCamisa: 6, dataNascimento: '1994-03-22', titular: false, posicao: 'LE', clube: 'Zenit' },

  // Zagueiros
  { id: 8, nome: 'Marquinhos', numeroCamisa: 4, dataNascimento: '1994-05-14', titular: false, posicao: 'ZAG', clube: 'Paris Saint-Germain' },
  { id: 9, nome: 'Arthur Dias', numeroCamisa: 3, dataNascimento: '2007-01-01', titular: false, posicao: 'ZAG', clube: 'Athletico-PR' }, // confirmar data
  { id: 10, nome: 'Gabriel Magalhães', numeroCamisa: 14, dataNascimento: '1997-12-19', titular: false, posicao: 'ZAG', clube: 'Arsenal' },
  { id: 11, nome: 'Jair', numeroCamisa: 15, dataNascimento: '2005-01-01', titular: false, posicao: 'ZAG', clube: 'Nottingham Forest' }, // confirmar data
  { id: 12, nome: 'Vitor Reis', numeroCamisa: 24, dataNascimento: '2006-01-01', titular: false, posicao: 'ZAG', clube: 'Manchester City' }, // confirmar data

  // Meias
  { id: 13, nome: 'Andrey Santos', numeroCamisa: 5, dataNascimento: '2004-07-03', titular: false, posicao: 'VOL', clube: 'Manchester United' },
  { id: 14, nome: 'Breno Bidon', numeroCamisa: 17, dataNascimento: '2005-01-01', titular: false, posicao: 'MEI', clube: 'Corinthians' }, // confirmar data
  { id: 15, nome: 'Danilo', numeroCamisa: 18, dataNascimento: '2001-04-29', titular: false, posicao: 'VOL', clube: 'Botafogo' },
  { id: 16, nome: 'Bruno Guimarães', numeroCamisa: 8, dataNascimento: '1997-11-16', titular: false, posicao: 'VOL', clube: 'Arsenal' },
  { id: 17, nome: 'Douglas Luiz', numeroCamisa: 25, dataNascimento: '1998-05-09', titular: false, posicao: 'VOL', clube: 'Juventus' },
  { id: 18, nome: 'Gabriel Bontempo', numeroCamisa: 26, dataNascimento: '2004-01-01', titular: false, posicao: 'MEI', clube: 'Santos' }, // confirmar data
  { id: 19, nome: 'Martinelli', numeroCamisa: 21, dataNascimento: '2001-01-01', titular: false, posicao: 'MEI', clube: 'Fluminense' }, // confirmar data

  // Atacantes
  { id: 20, nome: 'Estêvão', numeroCamisa: 19, dataNascimento: '2007-04-24', titular: false, posicao: 'PD', clube: 'Chelsea' },
  { id: 21, nome: 'Endrick', numeroCamisa: 9, dataNascimento: '2006-07-21', titular: false, posicao: 'ATA', clube: 'Real Madrid' },
  { id: 22, nome: 'Pedro', numeroCamisa: 20, dataNascimento: '1997-06-20', titular: false, posicao: 'ATA', clube: 'Flamengo' },
  { id: 23, nome: 'Raphinha', numeroCamisa: 10, dataNascimento: '1996-12-14', titular: false, posicao: 'PD', clube: 'Barcelona' },
  { id: 24, nome: 'Rayan', numeroCamisa: 22, dataNascimento: '2006-11-03', titular: false, posicao: 'ATA', clube: 'Bournemouth' },
  { id: 25, nome: 'Samuel Lino', numeroCamisa: 11, dataNascimento: '1999-12-23', titular: false, posicao: 'PE', clube: 'Flamengo' },
  { id: 26, nome: 'Vini Jr.', numeroCamisa: 7, dataNascimento: '2000-07-12', titular: false, posicao: 'PE', clube: 'Real Madrid' },
];