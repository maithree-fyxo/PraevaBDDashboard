import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  template: `
    <div class="tbl-wrap">
      <table class="tbl">
        <thead>
          <tr>@for (c of columns; track c; let i = $index) { <th [class.num]="numCol(i)">{{ c }}</th> }</tr>
        </thead>
        <tbody>
          @for (r of rows; track r) {
            <tr>@for (cell of r; track $index) {
              <td [class.num]="numCol($index)">
                @if (isStatus(columns[$index])) {
                  <span class="tag" [attr.data-s]="slug(cell)">{{ cell }}</span>
                } @else { {{ cell }} }
              </td>
            }</tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .tbl-wrap { overflow-x: auto; }
    .tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { text-align: left; padding: 11px 12px; border-bottom: 1px solid var(--border); white-space: nowrap; }
    th { font-size: 11.5px; font-weight: 600; color: var(--text-faint); }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: var(--surface-2); }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .tag { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: var(--r-pill);
      font-size: 11.5px; font-weight: 600; background: var(--surface-2); color: var(--text-muted); }
    .tag[data-s="qualified-lead"], .tag[data-s="active"] { background: var(--accent-soft); color: var(--accent-strong); }
    .tag[data-s="dormant"] { background: color-mix(in srgb, var(--neg) 14%, transparent); color: var(--neg); }
    .tag[data-s="recent"], .tag[data-s="offer"], .tag[data-s="final-interviews"] { background: var(--accent-soft); color: var(--accent-strong); }
    .tag[data-s="lapsing"] { background: color-mix(in srgb, var(--warn) 16%, transparent); color: var(--warn); }
    .tag[data-s="lapsed"] { background: color-mix(in srgb, var(--neg) 14%, transparent); color: var(--neg); }
    .tag[data-s="stale"], .tag[data-s="no-follow-up"], .tag[data-s="not-yet-met"] { background: color-mix(in srgb, var(--text-faint) 18%, transparent); color: var(--text-muted); }
  `],
})
export class DataTableComponent {
  @Input() columns: string[] = [];
  @Input() rows: string[][] = [];
  /** A column is numeric when every cell looks like a number, %, £ amount or a dash. */
  numCol(i: number) {
    return this.rows.length > 0 && this.rows.every((r) => /^(£?[\d.,]+[km%]?|[—–-])$/.test((r[i] ?? '').trim()));
  }
  isStatus(col: string) { return /outcome|status|stage/i.test(col); }
  slug(v: string) { return v.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''); }
}
