import { Component, computed, inject } from '@angular/core';
import { DataService } from '../core/data.service';
import { COMPANY_TYPES, ROLE_CLASSES } from '../core/reference';
import { StatCardComponent } from '../ui/stat-card.component';
import { ChartComponent } from '../ui/chart.component';
import { TablePanelComponent } from '../ui/table-panel.component';
import { MatrixComponent } from '../ui/matrix.component';
import { PALETTE } from '../ui/palette';

@Component({
  selector: 'app-bd-summary',
  standalone: true,
  imports: [StatCardComponent, ChartComponent, TablePanelComponent, MatrixComponent],
  template: `
    @if (o(); as v) {
      <div class="stat-row">
        @for (k of v.kpis; track k.label; let first = $first; let i = $index) {
          <app-stat-card [primary]="first" [tone]="palette[i - 1]" [label]="k.label" [value]="k.value" [delta]="k.delta" [trend]="k.trend" />
        }
      </div>

      <div class="grid-2">
        <app-chart [chart]="v.byCompanyType" />
        <app-chart [chart]="v.byRole" />
      </div>

      <app-matrix title="Company type × role classification" [rows]="companyTypes" [cols]="roles" [values]="v.matrix" />

      <div class="grid-2">
        <app-chart [chart]="v.trend" />
        <app-chart [chart]="v.pipeline" />
      </div>

      <div class="grid-2">
        <app-chart [chart]="v.conversion" />
        <app-table-panel [table]="v.recent" />
      </div>

    }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 20px; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
    .grid-wide { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 20px; align-items: start; }
    .strip { display: flex; flex-direction: column; gap: 12px; padding-top: 6px; }
    .strip__head { display: flex; align-items: baseline; justify-content: space-between; }
    .strip__head h2 { font-size: 15px; }
    .strip__head a { font-size: 12.5px; font-weight: 600; color: var(--accent-strong); }
    .strip__head a:hover { text-decoration: underline; }
    @media (max-width: 1100px) { .grid-2, .grid-wide { grid-template-columns: 1fr; } }
  `],
})
export class BdSummaryComponent {
  private d = inject(DataService);
  o = computed(() => this.d.bdSummary());
  palette = PALETTE;
  companyTypes = COMPANY_TYPES;
  roles = ROLE_CLASSES;
}
