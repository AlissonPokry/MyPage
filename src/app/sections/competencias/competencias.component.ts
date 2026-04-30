import {
  Component,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { SKILLS } from '../../core/data/skills.data';
import { UI_ICONS } from '../../core/icons/tech-icons';

@Component({
  selector: 'app-competencias',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GlassCardComponent, ScrollAnimateDirective],
  template: `
    <section class="relative z-1 min-h-screen flex flex-col items-center justify-center px-8 py-24 gap-12" id="competencias">
      <!-- Section header -->
      <div class="flex flex-col items-center gap-4" appScrollAnimate>
        <span class="text-electric-blue inline-flex drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]" [innerHTML]="codeIcon"></span>
        <h2 class="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold text-off-white tracking-tight">Competências</h2>
        <div class="w-15 h-[3px] rounded-sm bg-gradient-to-r from-transparent via-electric-blue to-transparent"></div>
      </div>

      <!-- Skills grid (flexbox for symmetry) -->
      <div class="flex flex-wrap justify-center gap-5 max-w-[960px] w-full">
        @for (skill of skills; track skill.name; let i = $index) {
          <div class="w-[160px]" appScrollAnimate [animateDelay]="i * 100">
            <app-glass-card extraClass="!p-6">
              <div class="flex flex-col items-center gap-3 py-2">
                <img
                  [src]="skill.iconUrl"
                  [alt]="skill.name + ' logo'"
                  class="w-12 h-12 object-contain"
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <h3 class="font-heading text-sm font-semibold text-off-white">{{ skill.name }}</h3>
              </div>
            </app-glass-card>
          </div>
        }
      </div>

      <!-- Terminal style footer text -->
      <div class="flex items-center gap-2 mt-4" appScrollAnimate [animateDelay]="800">
        <p class="font-body text-xs text-off-white opacity-40">
          <span class="text-electric-blue font-bold">&gt;</span> always learning, always building
          <span class="text-electric-blue animate-blink">_</span>
        </p>
      </div>
    </section>
  `,
  styles: [`
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .animate-blink {
      animation: blink 1s step-end infinite;
    }
  `]
})
export class CompetenciasComponent {
  private sanitizer = inject(DomSanitizer);

  readonly skills = SKILLS;
  readonly codeIcon: SafeHtml;

  constructor() {
    this.codeIcon = this.sanitizer.bypassSecurityTrustHtml(UI_ICONS.code);
  }
}
