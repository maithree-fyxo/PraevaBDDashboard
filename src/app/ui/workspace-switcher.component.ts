import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { WORKSPACES, Workspace, WorkspaceService } from '../core/workspace.service';

@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  template: `
    <div class="ws">
      <button type="button" class="ws__btn" (click)="open.set(!open())"
              aria-haspopup="listbox" [attr.aria-expanded]="open()" aria-label="Switch dashboard">
        <span>{{ ws.current() }}</span>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             [class.is-open]="open()"><path d="M4 6l4 4 4-4"/></svg>
      </button>
      @if (open()) {
        <ul class="ws__menu" role="listbox">
          @for (w of options; track w) {
            <li role="option" [attr.aria-selected]="w === ws.current()">
              <button type="button" (click)="pick(w)" [class.is-on]="w === ws.current()">
                <span>{{ w }}</span>
                @if (w !== 'Business Development') { <small>Not yet scoped</small> }
                @if (w === ws.current()) {
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>
                }
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .ws { position: relative; }
    .ws__btn { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%;
      background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-sm);
      padding: 7px 10px; font: inherit; font-size: 12.5px; font-weight: 600; color: var(--text); cursor: pointer; }
    .ws__btn:hover { border-color: var(--accent-line); }
    .ws__btn svg { width: 14px; height: 14px; color: var(--text-faint); transition: transform .15s; }
    .ws__btn svg.is-open { transform: rotate(180deg); }
    .ws__menu { position: absolute; z-index: 30; top: calc(100% + 6px); left: 0; right: 0; margin: 0; padding: 4px;
      list-style: none; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-sm); box-shadow: var(--shadow); }
    .ws__menu button { display: grid; grid-template-columns: 1fr auto 16px; align-items: center; gap: 6px; width: 100%;
      background: none; border: 0; border-radius: 6px; padding: 8px 8px; font: inherit; font-size: 12.5px; color: var(--text-muted);
      text-align: left; cursor: pointer; }
    .ws__menu button:hover { background: var(--surface-2); color: var(--text); }
    .ws__menu button.is-on { color: var(--accent-strong); font-weight: 600; }
    .ws__menu small { font-size: 10.5px; color: var(--text-faint); font-weight: 500; }
    .ws__menu svg { width: 14px; height: 14px; grid-column: 3; }
  `],
})
export class WorkspaceSwitcherComponent {
  ws = inject(WorkspaceService);
  private el = inject(ElementRef);
  options = WORKSPACES;
  open = signal(false);
  pick(w: Workspace) { this.ws.current.set(w); this.open.set(false); }
  @HostListener('document:click', ['$event'])
  onDoc(e: Event) { if (!this.el.nativeElement.contains(e.target)) this.open.set(false); }
  @HostListener('document:keydown.escape') onEsc() { this.open.set(false); }
}
