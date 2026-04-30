import { Component, input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass glass-glow p-8 transition-all duration-300 ease-out" [class]="extraClass()">
      <ng-content />
    </div>
  `,
})
export class GlassCardComponent {
  extraClass = input<string>('');
}
