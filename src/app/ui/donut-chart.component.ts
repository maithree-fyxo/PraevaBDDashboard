import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Point } from '../core/data.service';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="donut">
      <svg viewBox="0 0 42 42" class="ring" role="img">
        <circle class="ring__bg" cx="21" cy="21" r="15.9155" />
        @for (s of segments; track s.label) {
          <circle class="ring__seg" cx="21" cy="21" r="15.9155"
            [attr.stroke]="s.color"
            [attr.stroke-dasharray]="s.len + ' ' + (100 - s.len)"
            [attr.stroke-dashoffset]="s.offset" />
        }
        <text x="21" y="20.4" class="ring__total num">{{ total }}</text>
        <text x="21" y="25.2" class="ring__cap">total</text>
      </svg>
      <ul class="legend">
        @for (s of segments; track s.label) {
          <li>
            <span class="dot" [style.background]="s.color"></span>
            <span class="legend__label">{{ s.label }}</span>
            <span class="legend__val num">{{ s.value }} · {{ s.len | number:'1.0-0' }}%</span>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .donut { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
    .ring { width: 150px; height: 150px; transform: rotate(-90deg); }
    .ring__bg { fill: none; stroke: var(--track); stroke-width: 4; }
    .ring__seg { fill: none; stroke-width: 4; stroke-linecap: butt; transition: stroke-dasharray .4s ease; }
    .ring__total { transform: rotate(90deg); transform-origin: center; fill: var(--text); font-size: 7px; font-weight: 700; text-anchor: middle; }
    .ring__cap { transform: rotate(90deg); transform-origin: center; fill: var(--text-faint); font-size: 2.6px; text-anchor: middle; }
    .legend { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; min-width: 180px; }
    .legend li { display: grid; grid-template-columns: 12px 1fr auto; align-items: center; gap: 10px; }
    .dot { width: 10px; height: 10px; border-radius: 3px; }
    .legend__label { font-size: 12.5px; color: var(--text-muted); }
    .legend__val { font-size: 12px; font-weight: 600; }
  `],
})
export class DonutChartComponent {
  @Input() set points(v: Point[]) { this._p = v; }
  private _p: Point[] = [];
  private palette = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)'];

  get total() { return this._p.reduce((a, b) => a + b.value, 0); }
  get segments() {
    const total = this.total || 1; let acc = 0;
    return this._p.map((p, i) => {
      const len = (p.value / total) * 100;
      const seg = { label: p.label, value: p.value, len, color: this.palette[i % this.palette.length], offset: (100 - acc + 25) % 100 };
      acc += len; return seg;
    });
  }
}
