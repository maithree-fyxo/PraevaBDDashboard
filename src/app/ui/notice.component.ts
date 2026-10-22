import { Component, Input } from '@angular/core';
import { Notice } from '../core/data.service';

@Component({
  selector: 'app-notice',
  standalone: true,
  template: `
    @if (notice) {
      <p class="note" [attr.data-k]="notice.kind">
        <strong>{{ notice.kind === 'pending' ? 'Waiting on data' : 'Assumption' }}</strong>
        <span>{{ notice.text }}</span>
      </p>
    }
  `,
  styles: [`
    .note { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; margin: 0; padding: 10px 14px;
      border-radius: var(--r-sm); font-size: 12.5px; line-height: 1.5; color: var(--text-muted);
      background: color-mix(in srgb, var(--warn) 10%, transparent); border: 1px solid color-mix(in srgb, var(--warn) 28%, transparent); }
    .note[data-k="pending"] { background: var(--surface-2); border-color: var(--border-strong); }
    strong { font-size: 12px; font-weight: 700; color: var(--warn); white-space: nowrap; }
    .note[data-k="pending"] strong { color: var(--text); }
    span { flex: 1 1 320px; max-width: 110ch; }
  `],
})
export class NoticeComponent {
  @Input() notice?: Notice;
}
