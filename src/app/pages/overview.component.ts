import { Component, inject } from '@angular/core';
import { DataService } from '../core/data.service';
import { StatCardComponent } from '../ui/stat-card.component';
import { ChartComponent } from '../ui/chart.component';
import { TablePanelComponent } from '../ui/table-panel.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [StatCardComponent, ChartComponent, TablePanelComponent],
  template: `
    <div class="stat-row">
      @for (k of d.overview.kpis; track k.label; let first = $first) {
        <app-stat-card [primary]="first" [label]="k.label" [value]="k.value" [delta]="k.delta" [trend]="k.trend" />
      }
    </div>

    <div class="grid-2">
      <app-chart [chart]="d.overview.trend" />
      <app-chart [chart]="d.overview.pipeline" />
    </div>

    <div class="grid-2">
      <app-chart [chart]="d.overview.conversion" />
      <app-table-panel [table]="d.overview.recent" />
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 20px; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
    @media (max-width: 1100px) { .grid-2 { grid-template-columns: 1fr; } }
  `],
})
export class OverviewComponent {
  d = inject(DataService);
}
