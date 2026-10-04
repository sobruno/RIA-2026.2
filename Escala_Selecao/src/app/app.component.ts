import { Component } from '@angular/core';
import { EscalaComponent } from './escala/escala.component';

@Component({
  standalone: true,
  imports: [EscalaComponent],
  selector: 'app-root',
  template: '<app-escala />',
})
export class App {}
