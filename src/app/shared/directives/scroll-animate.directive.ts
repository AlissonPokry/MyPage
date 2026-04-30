import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  inject,
  input,
} from '@angular/core';

/**
 * Scroll-animate directive.
 * Triggers CSS entrance animation when element enters viewport.
 * Uses Intersection Observer.
 * Respects prefers-reduced-motion.
 *
 * Usage: <div appScrollAnimate [animateDelay]="200">...</div>
 */
@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  /** Delay in ms before animation triggers */
  animateDelay = input<number>(0);

  ngOnInit(): void {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      this.el.nativeElement.classList.add('visible');
      return;
    }

    this.el.nativeElement.classList.add('scroll-animate');

    if (this.animateDelay()) {
      this.el.nativeElement.style.transitionDelay = `${this.animateDelay()}ms`;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
