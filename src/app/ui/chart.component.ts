import { Component, Input } from '@angular/core';
import { Chart } from '../core/data.service';
import { BarChartComponent } from './bar-chart.component';
import { LineChartComponent } from './line-chart.component';
import { DonutChartComponent } from './donut-chart.component';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BarChartComponent, LineChartComponent, DonutChartComponent],
  template: `
    @if (chart) {
      <section class="panel">
        <header class="panel__head">
          <h3>{{ chart.title }}</h3>
          @if (chart.unit) { <span class="panel__unit">{{ chart.unit }}</span> }
        </header>
        @switch (chart.kind) {
          @case ('bar')  { <app-bar-chart [points]="chart.points" [unit]="chart.unit" /> }
          @case ('line') { <app-line-chart [points]="chart.points" /> }
          @case ('donut'){ <app-donut-chart [points]="chart.points" /> }
        }
      </section>
    }
  `,
  styles: [`
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md);
      box-shadow: var(--shadow); padding: 18px 20px 20px; }
    .panel__head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 18px; }
    .panel__head h3 { font-size: 14.5px; font-weight: 600; }
    .panel__unit { font-size: 11.5px; color: var(--text-faint); }
  `],
})
export class ChartComponent {
  @Input() chart?: Chart;
}
