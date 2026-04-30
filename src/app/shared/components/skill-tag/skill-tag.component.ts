import { Component, input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skill-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="skill-tag inline-flex items-center px-4 py-1.5 font-body text-xs font-medium
                 text-electric-blue border border-blue-dim rounded-full
                 bg-blue-subtle backdrop-blur-sm transition-all duration-300 ease-out
                 cursor-default whitespace-nowrap
                 hover:border-electric-blue hover:shadow-[0_0_16px_rgba(0,240,255,0.2)] hover:-translate-y-0.5">
      {{ name() }}
    </span>
  `,
})
export class SkillTagComponent {
  name = input.required<string>();
}
