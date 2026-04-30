import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UI_ICONS } from '../../core/icons/tech-icons';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollAnimateDirective],
  template: `
    <section class="relative z-1 min-h-[100svh] flex items-center justify-center py-28 px-6 md:px-8" id="hero">
      <div class="flex flex-col items-center gap-6 text-center max-w-[800px]">
        <!-- Profile photo -->
        <div class="relative" appScrollAnimate>
          <div class="photo-container w-[196px] h-[196px] rounded-full relative overflow-hidden">
            <div class="photo-spinner absolute inset-0 rounded-full"></div>
            <div class="absolute inset-[3px] rounded-full bg-jet-black z-10">
              <img
                src="profile-placeholder.png"
                alt="Alisson Pokrywiecki da Silva"
                class="w-full h-full rounded-full object-cover"
                width="190"
                height="190"
              />
            </div>
          </div>
        </div>

        <!-- Terminal typing animation (loops) -->
        <div class="flex items-baseline gap-3" appScrollAnimate [animateDelay]="200">
          <span class="font-body text-[clamp(1.2rem,3vw,2rem)] text-electric-blue font-bold
                       drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]">&gt;</span>
          <h1 class="font-display text-[clamp(1.2rem,3.5vw,3rem)] font-extrabold text-off-white
                     tracking-tight leading-tight min-h-[1.2em] whitespace-nowrap">
            {{ displayedName() }}<span class="text-electric-blue font-light ml-0.5"
              [class.animate-blink]="cursorBlink()">_</span>
          </h1>
        </div>

        <!-- Subtitle w/ icons -->
        <div class="flex flex-col gap-1" appScrollAnimate [animateDelay]="400">
          <p class="font-heading text-[clamp(1rem,2.5vw,1.4rem)] font-medium text-off-white
                    opacity-90 flex items-center justify-center gap-2">
            <span class="inline-flex items-center shrink-0 text-electric-blue align-middle"
                  [innerHTML]="gradCapIcon"></span>
            Estudante de Ciência da Computação
          </p>
          <p class="font-body text-[clamp(0.75rem,1.5vw,0.9rem)] text-electric-blue opacity-70">
            UNIVALI — Universidade do Vale do Itajaí
          </p>
          <p class="font-body text-[clamp(0.7rem,1.2vw,0.85rem)] text-off-white opacity-50
                    flex items-center justify-center gap-1">
            <span class="icon-sm inline-flex items-center shrink-0 text-electric-blue align-middle"
                  [innerHTML]="mapPinIcon"></span>
            Itajaí, SC — Brasil
          </p>
        </div>

        <!-- Languages -->
        <div class="flex items-center gap-3 font-body text-sm text-off-white opacity-60"
             appScrollAnimate [animateDelay]="600">
          <span class="icon-sm inline-flex items-center shrink-0 text-electric-blue align-middle"
                [innerHTML]="langIcon"></span>
          <span>Português <span class="text-electric-blue font-semibold">Nativo</span></span>
          <span class="text-blue-dim">•</span>
          <span>English <span class="text-electric-blue font-semibold">Fluent</span></span>
        </div>

        <!-- Social links -->
        <div class="social-section" appScrollAnimate [animateDelay]="700">
          <span class="social-label">Links Sociais</span>
          <div class="social-row">
            <a href="https://www.linkedin.com/in/alisson-pokrywiecki-495741244/"
               target="_blank" rel="noopener noreferrer"
               aria-label="LinkedIn"
               class="social-link">
              <span class="social-icon" [innerHTML]="linkedinIcon"></span>
              <span class="social-link-text">LinkedIn</span>
            </a>
            <a href="https://github.com/AlissonPokry"
               target="_blank" rel="noopener noreferrer"
               aria-label="GitHub"
               class="social-link">
              <span class="social-icon" [innerHTML]="githubIcon"></span>
              <span class="social-link-text">GitHub</span>
            </a>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="scroll-indicator fade-in-delay text-blue-dim leading-none">
          <span class="animate-chevron opacity-60 block h-6" [innerHTML]="chevronIcon"></span>
          <span class="animate-chevron-delay opacity-30 block h-6 -mt-3" [innerHTML]="chevronIcon"></span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Photo ring — smooth conic-gradient rotation */
    .photo-container {
      box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
    }

    .photo-spinner {
      background: conic-gradient(
        var(--color-electric-blue),
        transparent 30%,
        transparent 70%,
        var(--color-electric-blue)
      );
      animation: ring-spin 4s linear infinite;
    }

    @keyframes ring-spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Blink cursor */
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .animate-blink { animation: blink 1s step-end infinite; }

    /* Chevron bounce */
    @keyframes chevron-bounce {
      0%, 100% { transform: translateY(0); opacity: 0.6; }
      50% { transform: translateY(6px); opacity: 1; }
    }
    .animate-chevron { animation: chevron-bounce 2s ease-in-out infinite; }
    .animate-chevron-delay { animation: chevron-bounce 2s ease-in-out infinite; animation-delay: 0.2s; }

    /* Scroll Indicator Initial Fade In */
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in-delay {
      animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both;
    }

    /* Icon sizing for small icons */
    .icon-sm { width: 16px; height: 16px; }
    .icon-sm :deep(svg) { width: 16px; height: 16px; }

    /* Social section layout */
    .social-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      margin-top: 12px;
    }

    .social-label {
      font-family: var(--font-body, sans-serif);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(0, 240, 255, 0.45);
    }

    .social-row {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    /* Button */
    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px 24px;
      width: 180px;
      border-radius: 14px;
      border: 1px solid rgba(0, 240, 255, 0.2);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(8px);
      color: rgba(240, 244, 248, 0.8);
      text-decoration: none;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .social-link-text {
      font-family: var(--font-body, sans-serif);
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    /* Icon */
    .social-icon { display: inline-flex; flex-shrink: 0; width: 22px; height: 22px; }
    .social-icon :deep(svg) { width: 22px; height: 22px; }

    /* Hover */
    .social-link:hover {
      border-color: var(--color-electric-blue);
      color: var(--color-electric-blue);
      background: rgba(0, 240, 255, 0.07);
      box-shadow: 0 0 24px rgba(0, 240, 255, 0.22), 0 0 48px rgba(0, 240, 255, 0.08);
      transform: translateY(-3px);
    }
    .social-link:active { transform: translateY(0); }

    /* Scroll Indicator */
    .scroll-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 36px;
    }

    :deep(svg) { vertical-align: middle; }

    /* Mobile */
    @media (max-width: 640px) {
      .photo-ring { width: 140px !important; height: 140px !important; }
      .social-row { flex-direction: column; gap: 12px; }
      .social-link { width: 100%; min-width: 200px; }
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private sanitizer = inject(DomSanitizer);

  readonly fullName = 'Alisson Pokrywiecki da Silva';

  // Sanitized icons
  gradCapIcon: SafeHtml;
  mapPinIcon: SafeHtml;
  langIcon: SafeHtml;
  chevronIcon: SafeHtml;
  linkedinIcon: SafeHtml;
  githubIcon: SafeHtml;

  displayedName = signal('');
  cursorBlink = signal(false);

  private typingTimeout: ReturnType<typeof setTimeout> | null = null;
  private charIndex = 0;
  private isDeleting = false;

  // Timing
  private readonly TYPE_SPEED = 60;
  private readonly DELETE_SPEED = 35;
  private readonly PAUSE_AFTER_TYPE = 10000;
  private readonly PAUSE_AFTER_DELETE = 800;

  constructor() {
    this.gradCapIcon = this.sanitizer.bypassSecurityTrustHtml(UI_ICONS.graduationCap);
    this.mapPinIcon = this.sanitizer.bypassSecurityTrustHtml(UI_ICONS.mapPin);
    this.langIcon = this.sanitizer.bypassSecurityTrustHtml(UI_ICONS.languages);
    this.chevronIcon = this.sanitizer.bypassSecurityTrustHtml(UI_ICONS.chevronDown);
    this.linkedinIcon = this.sanitizer.bypassSecurityTrustHtml(UI_ICONS.linkedin);
    this.githubIcon = this.sanitizer.bypassSecurityTrustHtml(UI_ICONS.github);
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.displayedName.set(this.fullName);
      this.cursorBlink.set(true);
      return;
    }
    this.typingTimeout = setTimeout(() => this.tick(), 800);
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
  }

  private tick(): void {
    if (!this.isDeleting) {
      // Typing
      this.cursorBlink.set(false);
      if (this.charIndex < this.fullName.length) {
        this.charIndex++;
        this.displayedName.set(this.fullName.slice(0, this.charIndex));
        const char = this.fullName[this.charIndex - 1];
        const delay = char === ' ' ? 100 : this.TYPE_SPEED + Math.random() * 50;
        this.typingTimeout = setTimeout(() => this.tick(), delay);
      } else {
        // Done typing → pause then delete
        this.cursorBlink.set(true);
        this.typingTimeout = setTimeout(() => {
          this.isDeleting = true;
          this.cursorBlink.set(false);
          this.tick();
        }, this.PAUSE_AFTER_TYPE);
      }
    } else {
      // Deleting
      if (this.charIndex > 0) {
        this.charIndex--;
        this.displayedName.set(this.fullName.slice(0, this.charIndex));
        this.typingTimeout = setTimeout(() => this.tick(), this.DELETE_SPEED);
      } else {
        // Done deleting → pause then retype
        this.isDeleting = false;
        this.typingTimeout = setTimeout(() => this.tick(), this.PAUSE_AFTER_DELETE);
      }
    }
  }
}
