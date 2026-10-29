import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../core/data.service';
import { RoleService } from '../core/role.service';
import { StatCardComponent } from '../ui/stat-card.component';
import { ChartComponent } from '../ui/chart.component';
import { TablePanelComponent } from '../ui/table-panel.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [StatCardComponent, ChartComponent, TablePanelComponent, RouterLink],
  template: `
    @if (o(); as v) {
      <div class="areas">
        <section class="area" style="--area: var(--c-indigo)">
          <header><h2><i></i>Financial</h2>
            @if (showFinancial()) { <a routerLink="/financial">Open</a> }</header>
          @if (showFinancial()) {
            <div class="pair">
              @for (k of v.financial; track k.label; let i = $index) {
                <app-stat-card [label]="k.label" [value]="k.value" [delta]="k.delta" [trend]="k.trend" [primary]="i === 0" />
              }
            </div>
          } @else {
            <p class="locked">Financial measures are available to team leaders and super admins.</p>
          }
        </section>
        <section class="area" style="--area: var(--c-pink)">
          <header><h2><i></i>Business Development</h2><a routerLink="/bd">Open</a></header>
          <div class="pair">
            @for (k of v.bd; track k.label; let i = $index) {
              <app-stat-card [label]="k.label" [value]="k.value" [delta]="k.delta" [trend]="k.trend" [primary]="i === 0" />
            }
          </div>
        </section>
        <section class="area" style="--area: var(--c-teal)">
          <header><h2><i></i>Delivery</h2><a routerLink="/delivery">Open</a></header>
          <div class="pair">
            @for (k of v.delivery; track k.label; let i = $index) {
              <app-stat-card [label]="k.label" [value]="k.value" [delta]="k.delta" [trend]="k.trend" [primary]="i === 0" />
            }
          </div>
        </section>
      </div>

      <div class="grid-2" [class.single]="!showFinancial()">
        @if (showFinancial()) { <app-chart [chart]="v.revenueChart" /> }
        <app-table-panel [table]="v.deadlines" />
      </div>
    }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 22px; }
    .areas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
    .area { background: var(--surface); border: 1px solid var(--border); border-top: 3px solid var(--area);
      border-radius: var(--r-md); box-shadow: var(--shadow); padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 12px; }
    .area header { display: flex; align-items: baseline; justify-content: space-between; }
    .area h2 { font-size: 14.5px; display: flex; align-items: center; gap: 8px; }
    .area h2 i { width: 8px; height: 8px; border-radius: 2px; background: var(--area); }
    .area a { font-size: 12.5px; font-weight: 600; color: var(--accent-strong); }
    .area a:hover { text-decoration: underline; }
    .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .locked { font-size: 13px; color: var(--text-faint); padding: 22px 4px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1.4fr; gap: 20px; align-items: start; }
    .grid-2.single { grid-template-columns: 1fr; }
    @media (max-width: 1200px) { .areas, .grid-2 { grid-template-columns: 1fr; } }
  `],
})
export class OverviewComponent {
  private d = inject(DataService);
  private roles = inject(RoleService);
  o = computed(() => this.d.overviewAll());
  showFinancial = computed(() => this.roles.canSee('financial'));
}
