import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ParticleCanvasComponent } from './sections/particle-canvas/particle-canvas.component';
import { HeroComponent } from './sections/hero/hero.component';
import { CompetenciasComponent } from './sections/competencias/competencias.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ParticleCanvasComponent, HeroComponent, CompetenciasComponent],
  template: `
    <app-particle-canvas />
    <main class="relative z-1">
      <app-hero />
      <app-competencias />
    </main>
  `,
})
export class AppComponent {}
