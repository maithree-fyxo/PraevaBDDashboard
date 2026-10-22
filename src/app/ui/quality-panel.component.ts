import { Component, Input } from '@angular/core';

export interface QualityItem { label: string; value: number; hint: string; }

@Component({
  selector: 'app-quality-panel',
  standalone: true,
  template: `
    <section class="panel">
      <header class="panel__head">
        <h3>Data quality</h3>
        <span class="panel__unit">fix these in Ezekia</span>
      </header>
      <ul class="list">
        @for (q of items; track q.label) {
          <li [class.is-clear]="q.value === 0">
            <span class="val num">{{ q.value }}</span>
            <span class="txt"><strong>{{ q.label }}</strong><small>{{ q.hint }}</small></span>
          </li>
        }
      </ul>
    </section>
  `,
  styles: [`
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md);
      box-shadow: var(--shadow); padding: 18px 20px 12px; }
    .panel__head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px; }
    .panel__head h3 { font-size: 14.5px; font-weight: 600; }
    .panel__unit { font-size: 11.5px; color: var(--text-faint); }
    .list { list-style: none; margin: 0; padding: 0; }
    li { display: grid; grid-template-columns: 44px 1fr; gap: 12px; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); }
    li:last-child { border-bottom: none; }
    .val { display: grid; place-items: center; height: 30px; border-radius: var(--r-sm); font-weight: 700; font-size: 14px;
      background: color-mix(in srgb, var(--warn) 16%, transparent); color: var(--warn); }
    li.is-clear .val { background: color-mix(in srgb, var(--pos) 14%, transparent); color: var(--pos); }
    .txt { display: flex; flex-direction: column; gap: 2px; }
    .txt strong { font-size: 13px; font-weight: 600; }
    .txt small { font-size: 11.5px; color: var(--text-faint); }
  `],
})
export class QualityPanelComponent {
  @Input() items: QualityItem[] = [];
}
