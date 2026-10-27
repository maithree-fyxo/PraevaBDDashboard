import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="stat" [ngClass]="{ 'stat--primary': primary }">
      <span class="stat__label">@if (tone && !primary) { <i class="mark" [style.background]="tone"></i> }{{ label }}</span>
      <span class="stat__value num">{{ value }}</span>
      @if (delta) {
        <span class="stat__delta" [ngClass]="'is-' + (trend || 'flat')">{{ delta }}</span>
      }
    </div>
  `,
  styles: [`
    .stat { display: flex; flex-direction: column; gap: 6px; padding: 18px 18px 16px;
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); box-shadow: var(--shadow); }
    .stat--primary { border-color: var(--accent-line); background:
      linear-gradient(180deg, var(--accent-soft), transparent 60%), var(--surface); }
    .stat__label { font-size: 12.5px; color: var(--text-muted); font-weight: 500; display: flex; align-items: center; gap: 7px; }
    .mark { width: 7px; height: 7px; border-radius: 50%; flex: none; }
    .stat__value { font-size: 30px; font-weight: 700; line-height: 1.05; }
    .stat--primary .stat__value { color: var(--accent-strong); }
    .stat__delta { font-size: 12px; font-weight: 600; }
    .is-up { color: var(--pos); } .is-down { color: var(--neg); } .is-flat { color: var(--text-faint); }
  `],
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() delta?: string;
  @Input() trend?: 'up' | 'down' | 'flat';
  @Input() primary = false;
  @Input() tone?: string;
}
