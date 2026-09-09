import { Component, Input } from '@angular/core';
import { ViewDef } from '../core/data.service';
import { StatCardComponent } from './stat-card.component';
import { ChartComponent } from './chart.component';
import { TablePanelComponent } from './table-panel.component';

@Component({
  selector: 'app-view-body',
  standalone: true,
  imports: [StatCardComponent, ChartComponent, TablePanelComponent],
  template: `
    @if (def) {
      <div class="stat-row">
        @for (k of def.kpis; track k.label) {
          <app-stat-card [label]="k.label" [value]="k.value" [delta]="k.delta" [trend]="k.trend"
            [primary]="highlightConversion && k.label.startsWith('Meeting → lead')" />
        }
      </div>
      <div class="grid-2">
        <app-chart [chart]="def.chart" />
        <app-table-panel [table]="def.table" />
      </div>
    }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 20px; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
    @media (max-width: 1100px) { .grid-2 { grid-template-columns: 1fr; } }
  `],
})
export class ViewBodyComponent {
  @Input() def?: ViewDef;
  @Input() highlightConversion = true;
}
