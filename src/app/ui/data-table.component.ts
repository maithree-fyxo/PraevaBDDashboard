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
    .tag { --t: var(--c-indigo); background: color-mix(in srgb, var(--t) 14%, transparent); color: color-mix(in srgb, var(--t) 78%, var(--text)); }
    .tag[data-s="qualified-lead"] { --t: var(--c-pink); }
    .tag[data-s="active"], .tag[data-s="recent"], .tag[data-s="further-contact"] { --t: var(--c-green); }
    .tag[data-s="dormant"], .tag[data-s="lapsing"] { --t: var(--c-amber); }
    .tag[data-s="lapsed"] { --t: var(--c-coral); }
    .tag[data-s="shortlist"], .tag[data-s="longlist"] { --t: var(--c-sky); }
    .tag[data-s="first-interviews"], .tag[data-s="final-interviews"] { --t: var(--c-violet); }
    .tag[data-s="offer"] { --t: var(--c-teal); }
    .tag[data-s="stale"], .tag[data-s="no-follow-up"], .tag[data-s="not-yet-met"] { --t: var(--c-grey); color: var(--text-muted); }
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
