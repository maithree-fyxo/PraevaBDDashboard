import { Component, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { CATEGORIES, categoryByPath } from './core/nav';
import { ThemeService } from './core/theme.service';
import { FilterService } from './core/filter.service';
import { PERIODS } from './core/reference';
import { FilterBarComponent } from './ui/filter-bar.component';
import { RoleService, ROLES, Role } from './core/role.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FilterBarComponent, NgTemplateOutlet],
  template: `
    <div class="shell">
      <aside class="side">
        <div class="brand">
          <img class="brand__logo" src="assets/praeva-logo.svg" alt="Praeva" />
        </div>

        <nav class="nav">
          @for (cat of top(); track cat.path) { <ng-container *ngTemplateOutlet="item; context: { $implicit: cat }" /> }

          <button type="button" class="nav__group" [class.is-open]="bdOpen()" (click)="bdOpen.set(!bdOpen())" [attr.aria-expanded]="bdOpen()">
            <span>Business Development</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
          </button>
          @if (bdOpen()) {
            <div class="nav__sub">
              @for (cat of bd(); track cat.path) { <ng-container *ngTemplateOutlet="item; context: { $implicit: cat }" /> }
            </div>
          }

          @for (cat of after(); track cat.path) { <ng-container *ngTemplateOutlet="item; context: { $implicit: cat }" /> }

          @if (admin().length) {
            <div class="nav__label">Admin</div>
            @for (cat of admin(); track cat.path) { <ng-container *ngTemplateOutlet="item; context: { $implicit: cat }" /> }
          }
        </nav>

        <ng-template #item let-cat>
          <a class="nav__item" [routerLink]="'/' + cat.path"
             routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: cat.path === '' }">
            <span class="nav__icon" [innerHTML]="iconHtml(cat.icon)"></span>
            <span>{{ cat.label }}</span>
          </a>
        </ng-template>

        <div class="side__foot">
          <label class="viewas">
            <span>Prototype: viewing as</span>
            <select (change)="setRole($any($event.target).value)">
              @for (r of roleList; track r) { <option [value]="r" [selected]="r === roles.role()">{{ r }}</option> }
            </select>
          </label>
          <small>{{ roles.user().name }} · mock data</small>
        </div>
      </aside>

      <div class="main">
        <header class="topbar">
          <div class="topbar__title">
            @if (current().group === 'bd') { <span class="eyebrow">Business Development</span> }
            @if (current().group === 'admin') { <span class="eyebrow">Admin</span> }
            <h1>{{ current().label }}</h1>
            <p>{{ current().subtitle }}</p>
          </div>
          <div class="topbar__actions">
            <span class="updated">Last updated 26 Oct, 09:00</span>
            @if (current().group !== 'admin') {
            <label class="period">
              <select aria-label="Period" (change)="filters.period.set($any($event.target).value)">
                @for (p of periods; track p) { <option [value]="p" [selected]="p === filters.period()">{{ p }}</option> }
              </select>
            </label>
            }
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

        @if (current().dims) {
          <app-filter-bar />
        }
        <main class="content"><router-outlet /></main>
      </div>
    </div>
  `,
  styles: [`
    .shell { display: grid; grid-template-columns: 264px 1fr; height: 100vh; overflow: hidden; }
    .side { display: flex; flex-direction: column; background: var(--surface); border-right: 1px solid var(--border); overflow-y: auto; }
    .brand { display: flex; flex-direction: column; align-items: stretch; gap: 12px; padding: 24px 22px 18px; }
    .brand__logo { display: block; width: 116px; height: auto; margin-left: 2px; }
    :host-context([data-theme="dark"]) .brand__logo { filter: brightness(0) invert(1); }
    .nav--empty { font-size: 12.5px; color: var(--text-faint); padding: 12px 20px; line-height: 1.5; }
    .unscoped { max-width: 560px; margin: 48px auto; text-align: center; background: var(--surface); border: 1px dashed var(--border-strong);
      border-radius: var(--r-lg); padding: 40px 32px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .unscoped__badge { font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: var(--r-pill);
      background: color-mix(in srgb, var(--c-amber) 16%, transparent); color: color-mix(in srgb, var(--c-amber) 75%, var(--text)); }
    .unscoped h2 { font-size: 20px; }
    .unscoped p { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; }
    .unscoped button { margin-top: 8px; appearance: none; border: 1px solid var(--accent-line); background: var(--accent-soft);
      color: var(--accent-strong); font: inherit; font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: var(--r-sm); cursor: pointer; }

    .nav { flex: 1; padding: 6px 12px; }
    .nav__item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: var(--r-sm);
      color: var(--text-muted); font-size: 14px; font-weight: 500; position: relative; margin-bottom: 2px; transition: background .15s, color .15s; }
    .nav__item:hover { background: var(--surface-2); color: var(--text); }
    .nav__icon { display: inline-flex; width: 18px; height: 18px; flex: none; }
    .nav__icon svg { width: 18px; height: 18px; }
    .nav__item.is-active { background: var(--accent-soft); color: var(--accent-strong); font-weight: 600; }
    .nav__item.is-active::before { content: ''; position: absolute; left: -12px; top: 8px; bottom: 8px; width: 3px;
      background: var(--accent); border-radius: 0 3px 3px 0; }
    .side__foot { padding: 12px 20px 14px; font-size: 11px; color: var(--text-faint); border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 6px; }
    .viewas { display: flex; flex-direction: column; gap: 4px; }
    .viewas select { font: inherit; font-size: 12px; color: var(--text); background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 5px 8px; }
    .nav__group { display: flex; align-items: center; justify-content: space-between; width: 100%; margin: 10px 0 2px; padding: 8px 12px;
      appearance: none; border: 0; background: none; font: inherit; font-size: 11.5px; font-weight: 700; letter-spacing: .04em;
      text-transform: uppercase; color: var(--text-faint); cursor: pointer; border-radius: var(--r-sm); }
    .nav__group:hover { color: var(--text); background: var(--surface-2); }
    .nav__group svg { width: 14px; height: 14px; transition: transform .15s; transform: rotate(-90deg); }
    .nav__group.is-open svg { transform: none; }
    .nav__sub { padding-left: 8px; border-left: 1px solid var(--border); margin-left: 20px; margin-bottom: 6px; }
    .nav__sub .nav__item { padding: 8px 10px; font-size: 13.5px; }
    .nav__sub .nav__item.is-active::before { left: -9px; }
    .nav__label { margin: 14px 12px 4px; font-size: 11.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--text-faint); }
    .eyebrow { display: block; font-size: 11.5px; font-weight: 600; color: var(--accent-strong); margin-bottom: 2px; }

    .main { display: flex; flex-direction: column; overflow: hidden; }
    .topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px;
      padding: 18px 28px; border-bottom: 1px solid var(--border); background: var(--bg); }
    .topbar__title h1 { font-size: 20px; }
    .topbar__title p { font-size: 13px; color: var(--text-muted); margin-top: 3px; max-width: 74ch; }
    .topbar__actions { display: flex; align-items: center; gap: 10px; }
    .updated { font-size: 12px; color: var(--text-faint); white-space: nowrap; }
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
  theme = inject(ThemeService);
  filters = inject(FilterService);
  roles = inject(RoleService);
  periods = PERIODS;
  roleList = ROLES;
  bdOpen = signal(true);
  private router = inject(Router);
  private san = inject(DomSanitizer);
  private iconCache = new Map<string, SafeHtml>();

  private visible = computed(() => { this.roles.role(); return CATEGORIES.filter((c) => this.roles.canSee(c.path)); });
  top = computed(() => this.visible().filter((c) => !c.group && (c.path === '' || c.path === 'financial')));
  bd = computed(() => this.visible().filter((c) => c.group === 'bd'));
  after = computed(() => this.visible().filter((c) => !c.group && c.path === 'delivery'));
  admin = computed(() => this.visible().filter((c) => c.group === 'admin'));

  private url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: '/' },
  );

  current = computed(() => categoryByPath(this.url().replace(/^\//, '').split('?')[0]));

  setRole(r: Role) {
    this.roles.role.set(r);
    if (!this.roles.canSee(this.current().path)) this.router.navigateByUrl('/');
  }

  iconHtml(inner: string): SafeHtml {
    let cached = this.iconCache.get(inner);
    if (!cached) {
      cached = this.san.bypassSecurityTrustHtml(
        `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`,
      );
      this.iconCache.set(inner, cached);
    }
    return cached;
  }
}
