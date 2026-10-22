import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../core/data.service';
import { COMPANY_TYPES, ROLE_CLASSES } from '../core/reference';
import { StatCardComponent } from '../ui/stat-card.component';
import { ChartComponent } from '../ui/chart.component';
import { TablePanelComponent } from '../ui/table-panel.component';
import { MatrixComponent } from '../ui/matrix.component';
import { QualityPanelComponent } from '../ui/quality-panel.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [StatCardComponent, ChartComponent, TablePanelComponent, MatrixComponent, QualityPanelComponent, RouterLink],
  template: `
    @if (o(); as v) {
      <div class="stat-row">
        @for (k of v.kpis; track k.label; let first = $first) {
          <app-stat-card [primary]="first" [label]="k.label" [value]="k.value" [delta]="k.delta" [trend]="k.trend" />
        }
      </div>

      <div class="grid-2">
        <app-chart [chart]="v.byCompanyType" />
        <app-chart [chart]="v.byRole" />
      </div>

      <div class="grid-wide">
        <app-matrix title="Company type × role classification" [rows]="companyTypes" [cols]="roles" [values]="v.matrix" />
        <app-quality-panel [items]="v.quality" />
      </div>

      <div class="grid-2">
        <app-chart [chart]="v.trend" />
        <app-chart [chart]="v.pipeline" />
      </div>

      <div class="grid-2">
        <app-chart [chart]="v.conversion" />
        <app-table-panel [table]="v.recent" />
      </div>

      <section class="strip">
        <header class="strip__head">
          <h2>Delivery and budget</h2>
          <a routerLink="/delivery">Open delivery &amp; budget</a>
        </header>
        <div class="stat-row">
          @for (k of v.delivery; track k.label) {
            <app-stat-card [label]="k.label" [value]="k.value" />
          }
        </div>
      </section>
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
export class OverviewComponent {
  private d = inject(DataService);
  o = computed(() => this.d.overview());
  companyTypes = COMPANY_TYPES;
  roles = ROLE_CLASSES;
}
