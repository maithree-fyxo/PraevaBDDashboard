import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DataService, ViewDef } from '../core/data.service';
import { StatCardComponent } from '../ui/stat-card.component';
import { ChartComponent } from '../ui/chart.component';
import { TablePanelComponent } from '../ui/table-panel.component';

@Component({
  selector: 'app-view-page',
  standalone: true,
  imports: [StatCardComponent, ChartComponent, TablePanelComponent],
  template: `
    @if (def(); as v) {
      <div class="stat-row">
        @for (k of v.kpis; track k.label) {
          <app-stat-card [label]="k.label" [value]="k.value" [delta]="k.delta" [trend]="k.trend" />
        }
      </div>
      <div class="grid-2">
        <app-chart [chart]="v.chart" />
        <app-table-panel [table]="v.table" />
      </div>
    }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 20px; }
    .stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
    @media (max-width: 1100px) { .grid-2 { grid-template-columns: 1fr; } }
    @media (max-width: 640px) { .stat-row { grid-template-columns: 1fr; } }
  `],
})
export class ViewPageComponent {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  def = toSignal<ViewDef>(this.route.data.pipe(map((d) => this.data.get(d['key']))));
}
