export interface SlotFormacao {
  id: string;
  rotulo: string;
  x: number;
  y: number;
}

export interface Formacao {
  nome: string;
  slots: SlotFormacao[];
}

export const FORMACOES: Formacao[] = [
  {
    nome: '4-3-3',
    slots: [
      { id: 'gol', rotulo: 'GOL', x: 50, y: 88 },
      { id: 'ld', rotulo: 'LD', x: 87, y: 69 },
      { id: 'zag1', rotulo: 'ZAG', x: 38, y: 69 },
      { id: 'zag2', rotulo: 'ZAG', x: 62, y: 69 },
      { id: 'le', rotulo: 'LE', x: 13, y: 69 },
      { id: 'vol', rotulo: 'VOL', x: 27, y: 48 },
      { id: 'mei1', rotulo: 'MEI', x: 50, y: 48 },
      { id: 'mei2', rotulo: 'MEI', x: 73, y: 48 },
      { id: 'pe', rotulo: 'PE', x: 18, y: 23 },
      { id: 'ata', rotulo: 'ATA', x: 50, y: 23 },
      { id: 'pd', rotulo: 'PD', x: 82, y: 23 },
    ],
  },
  {
    nome: '4-2-4',
    slots: [
      { id: 'gol', rotulo: 'GOL', x: 50, y: 88 },
      { id: 'ld', rotulo: 'LD', x: 87, y: 69 },
      { id: 'zag1', rotulo: 'ZAG', x: 38, y: 69 },
      { id: 'zag2', rotulo: 'ZAG', x: 62, y: 69 },
      { id: 'le', rotulo: 'LE', x: 13, y: 69 },
      { id: 'vol1', rotulo: 'VOL', x: 35, y: 48 },
      { id: 'vol2', rotulo: 'VOL', x: 65, y: 48 },
      { id: 'pe', rotulo: 'PE', x: 13, y: 23 },
      { id: 'ata1', rotulo: 'ATA', x: 38, y: 23 },
      { id: 'ata2', rotulo: 'ATA', x: 62, y: 23 },
      { id: 'pd', rotulo: 'PD', x: 87, y: 23 },
    ],
  },
  {
    nome: '4-2-3-1',
    slots: [
      { id: 'gol', rotulo: 'GOL', x: 50, y: 88 },
      { id: 'ld', rotulo: 'LD', x: 87, y: 69 },
      { id: 'zag1', rotulo: 'ZAG', x: 38, y: 69 },
      { id: 'zag2', rotulo: 'ZAG', x: 62, y: 69 },
      { id: 'le', rotulo: 'LE', x: 13, y: 69 },
      { id: 'vol1', rotulo: 'VOL', x: 36, y: 52 },
      { id: 'vol2', rotulo: 'VOL', x: 64, y: 52 },
      { id: 'pe', rotulo: 'PE', x: 18, y: 34 },
      { id: 'mei', rotulo: 'MEI', x: 50, y: 34 },
      { id: 'pd', rotulo: 'PD', x: 82, y: 34 },
      { id: 'ata', rotulo: 'ATA', x: 50, y: 17 },
    ],
  },
  {
    nome: '4-4-2',
    slots: [
      { id: 'gol', rotulo: 'GOL', x: 50, y: 88 },
      { id: 'ld', rotulo: 'LD', x: 87, y: 69 },
      { id: 'zag1', rotulo: 'ZAG', x: 38, y: 69 },
      { id: 'zag2', rotulo: 'ZAG', x: 62, y: 69 },
      { id: 'le', rotulo: 'LE', x: 13, y: 69 },
      { id: 'pe', rotulo: 'PE', x: 13, y: 47 },
      { id: 'vol1', rotulo: 'VOL', x: 38, y: 47 },
      { id: 'vol2', rotulo: 'VOL', x: 62, y: 47 },
      { id: 'pd', rotulo: 'PD', x: 87, y: 47 },
      { id: 'ata1', rotulo: 'ATA', x: 38, y: 23 },
      { id: 'ata2', rotulo: 'ATA', x: 62, y: 23 },
    ],
  },
  {
    nome: '3-5-2',
    slots: [
      { id: 'gol', rotulo: 'GOL', x: 50, y: 88 },
      { id: 'zag1', rotulo: 'ZAG', x: 25, y: 69 },
      { id: 'zag2', rotulo: 'ZAG', x: 50, y: 69 },
      { id: 'zag3', rotulo: 'ZAG', x: 75, y: 69 },
      { id: 'pe', rotulo: 'PE', x: 10, y: 48 },
      { id: 'vol1', rotulo: 'VOL', x: 30, y: 48 },
      { id: 'mei', rotulo: 'MEI', x: 50, y: 48 },
      { id: 'vol2', rotulo: 'VOL', x: 70, y: 48 },
      { id: 'pd', rotulo: 'PD', x: 90, y: 48 },
      { id: 'ata1', rotulo: 'ATA', x: 37, y: 23 },
      { id: 'ata2', rotulo: 'ATA', x: 63, y: 23 },
    ],
  },
];