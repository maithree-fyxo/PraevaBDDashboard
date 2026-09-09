import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { categoryByPath } from '../core/nav';
import { DataService, ViewDef } from '../core/data.service';
import { ViewBodyComponent } from '../ui/view-body.component';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [ViewBodyComponent],
  template: `
    @if (category(); as cat) {
      <div class="tabbar">
        <div class="tabs" role="tablist">
          @for (t of cat.tabs; track t.key) {
            <button class="tab" type="button" role="tab"
              [class.is-active]="t.key === activeKey()" [attr.aria-selected]="t.key === activeKey()"
              (click)="selectTab(t.key)">{{ t.label }}</button>
          }
        </div>
        @if (cat.filtered) {
          <label class="filter">
            <span>{{ filterLabel() }}</span>
            <select [value]="selection()" (change)="onSelect($any($event.target).value)">
              @for (opt of options(); track opt) { <option [value]="opt">{{ opt }}</option> }
            </select>
          </label>
        }
      </div>

      <app-view-body [def]="body()" />
    }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 22px; }
    .tabbar { display: flex; align-items: center; justify-content: space-between; gap: 16px;
      border-bottom: 1px solid var(--border); flex-wrap: wrap; }
    .tabs { display: flex; gap: 4px; flex-wrap: wrap; }
    .tab { appearance: none; border: none; background: none; font: inherit; font-size: 13.5px; font-weight: 500;
      color: var(--text-muted); padding: 10px 12px 12px; cursor: pointer; position: relative; border-radius: 6px 6px 0 0; }
    .tab:hover { color: var(--text); background: var(--surface-2); }
    .tab.is-active { color: var(--accent-strong); font-weight: 600; }
    .tab.is-active::after { content: ''; position: absolute; left: 8px; right: 8px; bottom: -1px; height: 2px;
      background: var(--accent); border-radius: 2px; }
    .filter { display: inline-flex; align-items: center; gap: 8px; padding-bottom: 6px; }
    .filter span { font-size: 12.5px; color: var(--text-muted); }
    .filter select { appearance: none; font: inherit; font-size: 13px; color: var(--text);
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-sm);
      padding: 8px 30px 8px 12px; cursor: pointer;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236a6a76' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 6l4 4 4-4'/></svg>");
      background-repeat: no-repeat; background-position: right 9px center; }
    .filter select:hover { border-color: var(--accent-line); }
  `],
})
export class CategoryPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private data = inject(DataService);

  category = toSignal(this.route.data.pipe(map((d) => categoryByPath(d['path']))), { initialValue: categoryByPath('') });
  private queryTab = toSignal(this.route.queryParamMap.pipe(map((q) => q.get('tab'))), { initialValue: null });

  private manualKey = signal<string | null>(null);
  private manualSel = signal<string | null>(null);

  activeKey = computed(() => {
    const tabs = this.category().tabs;
    const fromUrl = this.queryTab();
    const manual = this.manualKey();
    if (manual && tabs.some((t) => t.key === manual)) return manual;
    if (fromUrl && tabs.some((t) => t.key === fromUrl)) return fromUrl;
    return tabs[0]?.key ?? '';
  });

  options = computed(() => this.data.optionsFor(this.activeKey()));
  filterLabel = computed(() => {
    const k = this.activeKey();
    return k === 'team' ? 'Team' : k === 'individual' ? 'Individual' : k === 'sector-view' ? 'Sector' : 'Filter';
  });
  selection = computed(() => {
    const opts = this.options();
    const sel = this.manualSel();
    return sel && opts.includes(sel) ? sel : (opts[0] ?? '');
  });

  body = computed<ViewDef>(() =>
    this.category().filtered ? this.data.getFiltered(this.activeKey(), this.selection()) : this.data.getView(this.activeKey()));

  selectTab(key: string) {
    this.manualKey.set(key);
    this.manualSel.set(null); // reset filter to the new tab's first option
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: key }, queryParamsHandling: 'merge', replaceUrl: true });
  }
  onSelect(value: string) { this.manualSel.set(value); }
}
