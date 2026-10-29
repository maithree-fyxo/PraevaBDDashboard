import { Component, inject } from '@angular/core';
import { FilterService } from '../core/filter.service';
import { RoleService } from '../core/role.service';
import { ALL, COMPANY_TYPES, ROLE_CLASSES, SECTOR_NAMES, SENIORITY } from '../core/reference';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  template: `
    <div class="bar" role="group" aria-label="Filters">
      <label class="f">
        <span>Company type</span>
        <select (change)="f.companyType.set(val($event))">
          <option [value]="all" [selected]="f.companyType() === all">All</option>
          @for (o of companyTypes; track o) { <option [value]="o" [selected]="o === f.companyType()">{{ o }}</option> }
        </select>
      </label>
      <label class="f">
        <span>Role classification</span>
        <select (change)="f.setRole(val($event))">
          <option [value]="all" [selected]="f.role() === all">All</option>
          @for (o of roles; track o) { <option [value]="o" [selected]="o === f.role()">{{ o }}</option> }
        </select>
      </label>
      <label class="f" [class.is-off]="!f.seniorityEnabled()">
        <span>Seniority</span>
        <select [disabled]="!f.seniorityEnabled()" (change)="f.seniority.set(val($event))"
                title="Seniority applies to Management">
          <option [value]="all" [selected]="f.seniority() === all">All</option>
          @for (o of seniority; track o) { <option [value]="o" [selected]="o === f.seniority()">{{ o }}</option> }
        </select>
      </label>
      <label class="f">
        <span>Primary sector</span>
        <select (change)="f.setSector(val($event))">
          <option [value]="all" [selected]="f.sector() === all">All</option>
          @for (o of sectors; track o) { <option [value]="o" [selected]="o === f.sector()">{{ o }}</option> }
        </select>
      </label>
      <label class="f" [class.is-off]="f.sector() === all">
        <span>Subsector</span>
        <select [disabled]="f.sector() === all" (change)="f.subsector.set(val($event))">
          <option [value]="all" [selected]="f.subsector() === all">{{ f.sector() === all ? 'Choose a sector first' : 'All' }}</option>
          @for (o of f.subsectorOptions(); track o) { <option [value]="o" [selected]="o === f.subsector()">{{ o }}</option> }
        </select>
      </label>
      @if (access.scopeLabel(); as team) {
        <span class="scope">Showing your team: {{ team }}</span>
      }
      @if (f.active()) {
        <button class="reset" type="button" (click)="f.reset()">Clear filters</button>
      }
    </div>
  `,
  styles: [`
    .bar { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px; padding: 12px 28px 14px;
      border-bottom: 1px solid var(--border); background: var(--surface); }
    .f { display: flex; flex-direction: column; gap: 4px; min-width: 150px; flex: 1 1 150px; max-width: 230px; }
    .f span { font-size: 11.5px; color: var(--text-faint); font-weight: 500; }
    .f select { appearance: none; font: inherit; font-size: 13px; color: var(--text); width: 100%;
      background: var(--bg); border: 1px solid var(--border); border-radius: var(--r-sm);
      padding: 7px 28px 7px 10px; cursor: pointer; text-overflow: ellipsis;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236a6a76' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 6l4 4 4-4'/></svg>");
      background-repeat: no-repeat; background-position: right 8px center; }
    .f select:hover:not(:disabled) { border-color: var(--accent-line); }
    .f.is-off select { opacity: .55; cursor: not-allowed; }
    .reset { appearance: none; border: 1px solid var(--accent-line); background: var(--accent-soft); color: var(--accent-strong);
      font: inherit; font-size: 12.5px; font-weight: 600; padding: 7px 12px; border-radius: var(--r-sm); cursor: pointer; }
    .reset:hover { background: var(--accent-line); }
    .scope { align-self: flex-end; font-size: 12px; font-weight: 600; padding: 7px 10px; border-radius: var(--r-sm);
      background: color-mix(in srgb, var(--c-indigo) 12%, transparent); color: color-mix(in srgb, var(--c-indigo) 80%, var(--text)); }
    @media (max-width: 860px) { .bar { padding: 12px 16px; } .f { max-width: none; } }
  `],
})
export class FilterBarComponent {
  f = inject(FilterService);
  access = inject(RoleService);
  all = ALL;
  companyTypes = COMPANY_TYPES; roles = ROLE_CLASSES; seniority = SENIORITY; sectors = SECTOR_NAMES;
  val(e: Event) { return (e.target as HTMLSelectElement).value; }
}
