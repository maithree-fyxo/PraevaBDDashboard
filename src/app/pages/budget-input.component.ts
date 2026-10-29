import { Component, computed, inject, signal } from '@angular/core';
import { RoleService } from '../core/role.service';
import { HOME_TEAM, PEOPLE, TEAMS } from '../core/reference';
import { NoticeComponent } from '../ui/notice.component';

interface Row { person: string; team: string; revenue: number; }

@Component({
  selector: 'app-budget-input',
  standalone: true,
  imports: [NoticeComponent],
  template: `
    <app-notice [notice]="{ kind: 'pending', text: 'The budget values to be entered are still to be confirmed by Praeva. Revenue budget is shown as an example; further columns will be added once agreed.' }" />

    <section class="panel">
      <header class="head">
        <div>
          <h3>Budget for financial year</h3>
          <p>{{ scopeText() }}</p>
        </div>
        <div class="actions">
          <label class="fy">
            <span>Financial year</span>
            <select (change)="fy.set($any($event.target).value)">
              @for (y of years; track y) { <option [value]="y" [selected]="y === fy()">{{ y }}</option> }
            </select>
          </label>
          <button type="button" class="save" (click)="save()">{{ saved() ? 'Saved' : 'Save budget' }}</button>
        </div>
      </header>

      <div class="wrap">
        <table>
          <thead>
            <tr><th>Individual</th><th>Team</th><th class="num">Revenue budget (£k)</th><th class="tbc">Further budget values</th></tr>
          </thead>
          <tbody>
            @for (r of rows(); track r.person) {
              <tr>
                <td>{{ r.person }}</td><td>{{ r.team }}</td>
                <td class="num"><input type="number" min="0" step="10" [value]="r.revenue" (input)="edit(r.person, $any($event.target).value)" [attr.aria-label]="'Revenue budget for ' + r.person" /></td>
                <td class="tbc">To be confirmed</td>
              </tr>
            }
          </tbody>
          <tfoot>
            <tr><td colspan="2">Total</td><td class="num">£{{ total() }}k</td><td></td></tr>
          </tfoot>
        </table>
      </div>
    </section>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 18px; }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); box-shadow: var(--shadow); padding: 18px 20px; }
    .head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 14px; }
    .head h3 { font-size: 14.5px; font-weight: 600; }
    .head p { font-size: 12.5px; color: var(--text-muted); margin-top: 4px; }
    .actions { display: flex; gap: 10px; align-items: flex-end; }
    .fy { display: flex; flex-direction: column; gap: 4px; font-size: 11.5px; color: var(--text-faint); font-weight: 500; }
    select, input { font: inherit; font-size: 13px; color: var(--text); background: var(--bg); border: 1px solid var(--border);
      border-radius: var(--r-sm); padding: 7px 10px; }
    input { width: 120px; text-align: right; }
    input:focus, select:focus { outline: none; border-color: var(--accent-line); }
    .save { appearance: none; border: 0; background: var(--accent); color: var(--on-accent); font: inherit; font-size: 13px;
      font-weight: 600; padding: 9px 14px; border-radius: var(--r-sm); cursor: pointer; }
    .wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 11.5px; color: var(--text-faint); font-weight: 600; padding: 8px 10px; border-bottom: 1px solid var(--border); }
    td { padding: 8px 10px; border-bottom: 1px solid var(--border); }
    tfoot td { font-weight: 700; border-bottom: 0; }
    .num { text-align: right; }
    .tbc { color: var(--text-faint); font-style: italic; }
  `],
})
export class BudgetInputComponent {
  private roles = inject(RoleService);
  years = ['FY 2026/27', 'FY 2027/28'];
  fy = signal(this.years[0]);
  saved = signal(false);
  private values = signal<Record<string, number>>({
    'Priya Nair': 520, 'James Whitlock': 430, 'Marcus Bell': 250, 'Sofia Marchetti': 480, 'Daniel Osei': 360, 'Lena Fischer': 300,
  });
  private people = computed(() => {
    if (this.roles.role() === 'Super admin') return PEOPLE;
    const led = this.roles.user().leads;
    return [...new Set(led.flatMap((t) => TEAMS[t] ?? []))];
  });
  scopeText = computed(() => this.roles.role() === 'Super admin'
    ? 'Super admins can enter budgets for everyone.'
    : `You can enter budgets for the teams you lead: ${this.roles.user().leads.join(', ')}.`);
  rows = computed<Row[]>(() => this.people().map((p) => ({ person: p, team: HOME_TEAM[p], revenue: this.values()[p] ?? 0 })));
  total = computed(() => this.rows().reduce((a, r) => a + r.revenue, 0).toLocaleString('en-GB'));
  edit(p: string, v: string) { this.saved.set(false); this.values.update((x) => ({ ...x, [p]: Number(v) || 0 })); }
  save() { this.saved.set(true); }
}
