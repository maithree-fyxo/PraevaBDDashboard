import { Component, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { NAV } from './core/nav';
import { ThemeService } from './core/theme.service';
import { DataService } from './core/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass],
  template: `
    <div class="shell">
      <!-- Sidebar -->
      <aside class="side">
        <div class="brand">
          <span class="brand__mark">BD</span>
          <span class="brand__text">
            <strong>Praeva Partners</strong>
            <small>Business development</small>
          </span>
        </div>

        <nav class="nav">
          @for (group of nav; track group.label) {
            <div class="nav__group">
              <p class="nav__group-label">{{ group.label }}</p>
              @for (item of group.items; track item.path) {
                <a class="nav__item" [routerLink]="'/' + item.path"
                   routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: item.path === '' }">
                  <span class="nav__icon" [innerHTML]="iconHtml(item.icon)"></span>
                  <span>{{ item.label }}</span>
                </a>
              }
            </div>
          }
        </nav>

        <div class="side__foot">Prototype · current phase</div>
      </aside>

      <!-- Main -->
      <div class="main">
        <header class="topbar">
          <div class="topbar__title">
            <h1>{{ title() }}</h1>
            <p>{{ subtitle() }}</p>
          </div>
          <div class="topbar__actions">
            <label class="period">
              <select>
                <option>Last 90 days</option>
                <option>Last 30 days</option>
                <option>This quarter</option>
                <option>Year to date</option>
              </select>
            </label>
            <button class="toggle" type="button" (click)="theme.toggle()"
                    [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'">
              @if (theme.theme() === 'dark') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
                </svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
                </svg>
              }
            </button>
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .shell { display: grid; grid-template-columns: 264px 1fr; height: 100vh; overflow: hidden; }

    /* Sidebar */
    .side { display: flex; flex-direction: column; background: var(--surface); border-right: 1px solid var(--border); overflow-y: auto; }
    .brand { display: flex; align-items: center; gap: 12px; padding: 20px 20px 16px; }
    .brand__mark { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 9px;
      background: var(--accent); color: var(--on-accent); font-weight: 800; font-size: 13px; letter-spacing: -.02em; }
    .brand__text { display: flex; flex-direction: column; line-height: 1.2; }
    .brand__text strong { font-size: 14px; }
    .brand__text small { font-size: 11.5px; color: var(--text-faint); }

    .nav { flex: 1; padding: 6px 12px 12px; }
    .nav__group { margin-bottom: 14px; }
    .nav__group-label { font-size: 11px; font-weight: 600; color: var(--text-faint); padding: 8px 10px 6px; margin: 0; }
    .nav__item { display: flex; align-items: center; gap: 11px; padding: 8px 10px; border-radius: var(--r-sm);
      color: var(--text-muted); font-size: 13.5px; font-weight: 500; position: relative; transition: background .15s, color .15s; }
    .nav__item:hover { background: var(--surface-2); color: var(--text); }
    .nav__icon { display: inline-flex; width: 17px; height: 17px; flex: none; }
    .nav__icon svg { width: 17px; height: 17px; }
    .nav__item.is-active { background: var(--accent-soft); color: var(--accent-strong); font-weight: 600; }
    .nav__item.is-active::before { content: ''; position: absolute; left: -12px; top: 7px; bottom: 7px; width: 3px;
      background: var(--accent); border-radius: 0 3px 3px 0; }
    .side__foot { padding: 14px 20px; font-size: 11px; color: var(--text-faint); border-top: 1px solid var(--border); }

    /* Main */
    .main { display: flex; flex-direction: column; overflow: hidden; }
    .topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px;
      padding: 18px 28px; border-bottom: 1px solid var(--border); background: var(--bg); }
    .topbar__title h1 { font-size: 20px; }
    .topbar__title p { font-size: 13px; color: var(--text-muted); margin-top: 3px; max-width: 70ch; }
    .topbar__actions { display: flex; align-items: center; gap: 10px; }
    .period select { appearance: none; font: inherit; font-size: 13px; color: var(--text);
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-sm);
      padding: 8px 30px 8px 12px; cursor: pointer;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236a6a76' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 6l4 4 4-4'/></svg>");
      background-repeat: no-repeat; background-position: right 9px center; }
    .toggle { display: grid; place-items: center; width: 38px; height: 38px; border-radius: var(--r-sm);
      background: var(--surface); border: 1px solid var(--border); color: var(--text-muted); cursor: pointer; transition: color .15s, border-color .15s; }
    .toggle:hover { color: var(--accent-strong); border-color: var(--accent-line); }
    .toggle svg { width: 18px; height: 18px; }

    .content { flex: 1; overflow-y: auto; padding: 24px 28px 40px; }

    @media (max-width: 860px) {
      .shell { grid-template-columns: 1fr; }
      .side { position: fixed; z-index: 20; width: 264px; height: 100vh; transform: translateX(-100%); }
      .topbar__title p { display: none; }
    }
  `],
})
export class AppComponent {
  nav = NAV;
  theme = inject(ThemeService);
  private router = inject(Router);
  private data = inject(DataService);
  private san = inject(DomSanitizer);
  private iconCache = new Map<string, SafeHtml>();

  private url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: '/' },
  );

  private current = computed(() => {
    const path = this.url().replace(/^\//, '').split('?')[0];
    for (const g of this.nav) for (const it of g.items) if (it.path === path) return it;
    return this.nav[0].items[0];
  });

  title = computed(() => this.current().path === '' ? 'Dashboard' : this.current().label);
  subtitle = computed(() => {
    const p = this.current().path;
    if (p === '') return 'Business development activity and outcomes at a glance.';
    return this.data.get(p).subtitle;
  });

  iconHtml(inner: string): SafeHtml {
    let cached = this.iconCache.get(inner);
    if (!cached) {
      cached = this.san.bypassSecurityTrustHtml(
        `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`,
      );
      this.iconCache.set(inner, cached);
    }
    return cached;
  }
}
