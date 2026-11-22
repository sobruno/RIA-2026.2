import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FORMACOES } from './dados/formacoes';
import { Jogador } from './models/jogador';
import { CampoComponent } from './escala/campo.component';

describe('CampoComponent', () => {
  it('emite o espaço escolhido para que o componente pai atualize a escalação', () => {
    TestBed.configureTestingModule({ imports: [CampoComponent] });
    const fixture = TestBed.createComponent(CampoComponent);
    const jogador: Jogador[] = [];
    fixture.componentRef.setInput('formacao', FORMACOES[0]);
    fixture.componentRef.setInput('escala', {});
    fixture.componentRef.setInput('jogadores', jogador);
    fixture.detectChanges();

    let slotEscolhido = '';
    fixture.componentInstance.slotClicado.subscribe((slot) => (slotEscolhido = slot.id));
    const espaco = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    espaco.click();

    expect(slotEscolhido).toBe('gol');
  });
});
