import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  viewChild,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  baseSize: number;
  baseOpacity: number;
  // Drift params (unique per particle for organic feel)
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmplitudeX: number;
  driftAmplitudeY: number;
  phaseX: number;
  phaseY: number;
}

@Component({
  selector: 'app-particle-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas class="particle-canvas"></canvas>`,
  styles: [`
    .particle-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
    }
  `]
})
export class ParticleCanvasComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  // ===== CONFIGURABLE =====
  private readonly PARTICLE_COUNT = 500;
  private readonly DOT_BASE_SIZE = 1.0;       // smaller default
  private readonly INFLUENCE_RADIUS = 200;
  private readonly MAX_SCALE = 5.5;            // bigger on hover
  private readonly COLOR = { r: 0, g: 240, b: 255 };

  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private mouse = { x: -9999, y: -9999 };
  private smoothMouse = { x: -9999, y: -9999 };
  private scrollY = 0;
  private animId = 0;
  private time = 0;

  private resizeHandler = () => this.handleResize();
  private mouseMoveHandler = (e: MouseEvent) => {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  };
  private scrollHandler = () => { this.scrollY = window.scrollY; };
  private prefersReduced = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    requestAnimationFrame(() => {
      this.initCanvas();
      this.createParticles();

      if (!this.prefersReduced) {
        window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
        this.animate();
      } else {
        this.drawStatic();
      }
      window.addEventListener('resize', this.resizeHandler, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.animId);
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }

  private initCanvas(): void {
    const c = this.canvas().nativeElement;
    this.ctx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }

  private handleResize(): void {
    const c = this.canvas().nativeElement;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    this.particles = [];
    this.createParticles();
    if (this.prefersReduced) this.drawStatic();
  }

  private createParticles(): void {
    const w = this.canvas().nativeElement.width;
    const h = this.canvas().nativeElement.height;

    for (let i = 0; i < this.PARTICLE_COUNT; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        baseSize: this.DOT_BASE_SIZE + Math.random() * 0.6,
        baseOpacity: 0.08 + Math.random() * 0.15,
        // Each particle drifts at its own speed/amplitude/phase
        driftSpeedX: 0.0012 + Math.random() * 0.0006,
        driftSpeedY: 0.0012 + Math.random() * 0.0005,
        driftAmplitudeX: 8 + Math.random() * 16,
        driftAmplitudeY: 6 + Math.random() * 12,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
      });
    }
  }

  private animate = (): void => {
    if (!this.ctx) return;
    const c = this.canvas().nativeElement;
    const w = c.width;
    const h = c.height;

    this.time++;

    // Smooth mouse interpolation
    this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * 0.06;
    this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * 0.06;

    this.ctx.clearRect(0, 0, w, h);
    this.drawLightFlow(w, h);

    const { r, g, b } = this.COLOR;
    const mx = this.smoothMouse.x;
    const my = this.smoothMouse.y;
    const radius = this.INFLUENCE_RADIUS;
    const radiusSq = radius * radius;
    const t = this.time;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Organic drift via sine waves
      const driftX = Math.sin(t * p.driftSpeedX + p.phaseX) * p.driftAmplitudeX;
      const driftY = Math.cos(t * p.driftSpeedY + p.phaseY) * p.driftAmplitudeY;

      const px = p.x + driftX;
      const py = p.y + driftY;

      // Distance to smooth mouse
      const dx = px - mx;
      const dy = py - my;
      const distSq = dx * dx + dy * dy;

      let size = p.baseSize;
      let alpha = p.baseOpacity;

      if (distSq < radiusSq) {
        const proximity = 1 - Math.sqrt(distSq) / radius;
        const ease = proximity * proximity; // quadratic ease

        size = p.baseSize + (this.MAX_SCALE - p.baseSize) * ease;
        alpha = Math.min(0.95, p.baseOpacity + ease * 0.7);
      }

      this.ctx.beginPath();
      this.ctx.arc(px, py, size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      this.ctx.fill();
    }

    this.animId = requestAnimationFrame(this.animate);
  };

  private drawLightFlow(w: number, h: number): void {
    if (!this.ctx) return;
    const offset = (this.scrollY * 0.3) % (h * 2);

    const g1 = this.ctx.createRadialGradient(
      w * 0.5, -offset + h * 0.3, 0,
      w * 0.5, -offset + h * 0.3, w * 0.6
    );
    g1.addColorStop(0, 'rgba(0, 240, 255, 0.04)');
    g1.addColorStop(0.5, 'rgba(0, 240, 255, 0.015)');
    g1.addColorStop(1, 'transparent');
    this.ctx.fillStyle = g1;
    this.ctx.fillRect(0, 0, w, h);

    const g2 = this.ctx.createRadialGradient(
      w * 0.8, offset * 0.5 + h * 0.6, 0,
      w * 0.8, offset * 0.5 + h * 0.6, w * 0.4
    );
    g2.addColorStop(0, 'rgba(0, 240, 255, 0.025)');
    g2.addColorStop(1, 'transparent');
    this.ctx.fillStyle = g2;
    this.ctx.fillRect(0, 0, w, h);
  }

  private drawStatic(): void {
    if (!this.ctx) return;
    const c = this.canvas().nativeElement;
    this.ctx.clearRect(0, 0, c.width, c.height);
    const { r, g, b } = this.COLOR;
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.baseSize, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
      this.ctx.fill();
    }
  }
}
