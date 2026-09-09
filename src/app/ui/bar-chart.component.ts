import { Component, Input } from '@angular/core';
import { Point } from '../core/data.service';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `
    <div class="bars">
      @for (p of points; track p.label) {
        <div class="row">
          <span class="row__label" [title]="p.label">{{ p.label }}</span>
          <span class="row__track">
            <span class="row__fill" [style.width.%]="pct(p.value)"></span>
          </span>
          <span class="row__val num">{{ p.value }}{{ unit === '%' ? '%' : '' }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .bars { display: flex; flex-direction: column; gap: 12px; }
    .row { display: grid; grid-template-columns: 140px 1fr 44px; align-items: center; gap: 12px; }
    .row__label { font-size: 12.5px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .row__track { height: 10px; background: var(--track); border-radius: var(--r-pill); overflow: hidden; }
    .row__fill { display: block; height: 100%; background: var(--accent); border-radius: var(--r-pill); transition: width .4s ease; }
    .row__val { font-size: 12.5px; font-weight: 600; text-align: right; }
  `],
})
export class BarChartComponent {
  @Input() points: Point[] = [];
  @Input() unit?: string;
  get max() { return Math.max(1, ...this.points.map((p) => p.value)); }
  pct(v: number) { return Math.round((v / this.max) * 100); }
}
