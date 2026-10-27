import { Component, Input } from '@angular/core';

/** Company type × role classification cross-tab, shaded by share of row. */
@Component({
  selector: 'app-matrix',
  standalone: true,
  template: `
    <section class="panel">
      <header class="panel__head">
        <h3>{{ title }}</h3>
        <span class="panel__unit">% of row · meetings</span>
      </header>
      <div class="wrap">
        <table class="mx">
          <thead>
            <tr><th></th>@for (c of cols; track c) { <th>{{ c }}</th> }<th class="tot">Meetings</th></tr>
          </thead>
          <tbody>
            @for (row of values; track i; let i = $index) {
              <tr>
                <th scope="row">{{ rows[i] }}</th>
                @for (v of row; track j; let j = $index) {
                  <td [style.background]="shade(v, rowSum(row))" [class.is-strong]="share(v, rowSum(row)) >= 45">
                    {{ empty(row) ? '-' : share(v, rowSum(row)) + '%' }}
                  </td>
                }
                <td class="tot num">{{ round(rowSum(row)) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md);
      box-shadow: var(--shadow); padding: 18px 20px 16px; }
    .panel__head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
    .panel__head h3 { font-size: 14.5px; font-weight: 600; }
    .panel__unit { font-size: 11.5px; color: var(--text-faint); }
    .wrap { overflow-x: auto; }
    .mx { width: 100%; border-collapse: separate; border-spacing: 3px; font-size: 12.5px; }
    th { font-size: 11.5px; font-weight: 600; color: var(--text-faint); text-align: center; padding: 4px 6px; white-space: nowrap; }
    tbody th { text-align: left; color: var(--text-muted); font-weight: 500; }
    td { text-align: center; padding: 8px 6px; border-radius: 6px; font-variant-numeric: tabular-nums; color: var(--text); }
    td.is-strong { color: var(--text); font-weight: 700; }
    .tot { color: var(--text-muted); font-weight: 600; background: none; }
  `],
})
export class MatrixComponent {
  @Input() title = '';
  @Input() rows: string[] = [];
  @Input() cols: string[] = [];
  @Input() values: number[][] = [];
  rowSum(r: number[]) { return r.reduce((a, b) => a + b, 0); }
  empty(r: number[]) { return Math.round(this.rowSum(r)) === 0; }
  share(v: number, t: number) { return Math.round(t) ? Math.round((v / t) * 100) : 0; }
  round(v: number) { return Math.round(v); }
  shade(v: number, t: number) {
    const s = this.share(v, t);
    return Math.round(t) ? `color-mix(in srgb, var(--c-indigo) ${Math.round(4 + s * 0.4)}%, transparent)` : 'var(--surface-2)';
  }
}
