import { Component, Input } from '@angular/core';
import { Table } from '../core/data.service';
import { DataTableComponent } from './data-table.component';

@Component({
  selector: 'app-table-panel',
  standalone: true,
  imports: [DataTableComponent],
  template: `
    @if (table) {
      <section class="panel">
        <header class="panel__head"><h3>{{ table.title }}</h3></header>
        <app-data-table [columns]="table.columns" [rows]="table.rows" />
      </section>
    }
  `,
  styles: [`
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md);
      box-shadow: var(--shadow); padding: 18px 8px 8px; }
    .panel__head { padding: 0 12px 8px; }
    .panel__head h3 { font-size: 14.5px; font-weight: 600; }
  `],
})
export class TablePanelComponent {
  @Input() table?: Table;
}
