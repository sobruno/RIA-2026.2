# Escalação titular

Aplicação acadêmica Angular para montar a escalação titular da Seleção Brasileira. Os 26 jogadores são exemplos em memória e podem ser substituídos pela convocação desejada.

## Versões

- Angular e Angular CLI: `22.2.1`
- OptimusUI e tema Aura: `2.0.2` ([documentação oficial](https://optimus.openng.org/))
- Tailwind CSS e plugin PostCSS: `4.3.3`
- npm: `11.19.0` (escolhido por já ser usado no exemplo TypeScript deste repositório)
- Node.js usado: `24.21.0`

OptimusUI declara `@angular/router` como dependência peer; a aplicação não configura nem usa rotas.

## Instalar e executar

Na raiz do repositório, entre na pasta do projeto:

```bash
cd Escala_Selecao
```

Depois, execute os comandos a partir dessa pasta:

```bash
npm install
npm start
```

Para compilar e testar:

```bash
npm run build
npm test -- --watch=false
```

## Onde está cada coisa

- Dependências e scripts: `package.json`; versões travadas: `package-lock.json`.
- Configuração da CLI e build Angular: `angular.json`; bootstrap e tema OptimusUI: `src/app/app.config.ts`.
- Tailwind 4 para Angular: `.postcssrc.json` e `src/styles.css` ([guia oficial](https://tailwindcss.com/docs/installation/framework-guides/angular)).
- Modelo: `src/app/models/jogador.ts`.
- Formações: `src/app/dados/formacoes.ts`; jogadores iniciais: `src/app/dados/jogadores-iniciais.ts`.
- Tela principal (CRUD, campo e escalação): `src/app/escala/escala.component.ts`, `escala.component.html` e `escala.component.css`.
- Componente raiz, que apenas renderiza a tela: `src/app/app.component.ts`.

## Suposições

- O gerenciador escolhido foi npm porque já há um `package-lock.json` no exemplo existente; a confirmação do professor ainda pode ser necessária.
- Como o link do OptimusUI veio como placeholder, foi adotado `@openng/optimus-ui` 2.0.2, pacote Angular cuja documentação oficial está no link acima e cuja compatibilidade com Angular 22 foi conferida.
