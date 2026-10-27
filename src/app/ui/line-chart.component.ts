import { Component, Input } from '@angular/core';

interface XY { x: number; y: number; label: string; value: number; }

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `
    <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" preserveAspectRatio="none" class="chart" role="img">
      <defs>
        <linearGradient [attr.id]="gid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" [attr.stop-color]="color" stop-opacity="0.22" />
          <stop offset="100%" [attr.stop-color]="color" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path [attr.d]="area" [attr.fill]="'url(#' + gid + ')'" />
      <polyline [attr.points]="line" fill="none" [attr.stroke]="color" stroke-width="2.5"
        stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" />
      @for (pt of xy; track pt.label) {
        <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="3.5" fill="var(--surface)" [attr.stroke]="color" stroke-width="2" vector-effect="non-scaling-stroke" />
      }
    </svg>
    <div class="xlabels">
      @for (pt of xy; track pt.label) { <span>{{ pt.label }}</span> }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .chart { width: 100%; height: 180px; overflow: visible; }
    .xlabels { display: flex; justify-content: space-between; margin-top: 8px; }
    .xlabels span { font-size: 11.5px; color: var(--text-faint); }
  `],
})
export class LineChartComponent {
  readonly W = 600; readonly H = 200;
  @Input() color = 'var(--accent)';
  readonly gid = 'lc-' + Math.random().toString(36).slice(2, 9);
  private readonly pad = 12;
  @Input() set points(v: { label: string; value: number }[]) { this._p = v; }
  private _p: { label: string; value: number }[] = [];

  get xy(): XY[] {
    const p = this._p; if (!p.length) return [];
    const max = Math.max(...p.map((d) => d.value)) * 1.15 || 1;
    const min = 0;
    const innerW = this.W - this.pad * 2;
    const innerH = this.H - this.pad * 2;
    return p.map((d, i) => ({
      label: d.label, value: d.value,
      x: this.pad + (p.length === 1 ? innerW / 2 : (i / (p.length - 1)) * innerW),
      y: this.pad + innerH - ((d.value - min) / (max - min)) * innerH,
    }));
  }
  get line() { return this.xy.map((p) => `${p.x},${p.y}`).join(' '); }
  get area() {
    const pts = this.xy; if (!pts.length) return '';
    const base = this.H - this.pad;
    return `M ${pts[0].x},${base} ` + pts.map((p) => `L ${p.x},${p.y}`).join(' ') + ` L ${pts[pts.length - 1].x},${base} Z`;
  }
}
