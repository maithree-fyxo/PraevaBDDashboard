import { Component, computed, signal } from '@angular/core';
import { AppUser, OFFICE_GROUPS, ROLES, Role, USERS } from '../core/role.service';
import { NoticeComponent } from '../ui/notice.component';
import { StatCardComponent } from '../ui/stat-card.component';
import { PALETTE } from '../ui/palette';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [NoticeComponent, StatCardComponent],
  template: `
    <app-notice [notice]="{ kind: 'info', text: 'Anyone in Praeva’s Microsoft Entra ID who signs in is added automatically as a Member. Teams come from Ezekia office groups where available; set the office group here where none applies.' }" />

    <div class="stat-row">
      @for (k of kpis(); track k.label; let i = $index) {
        <app-stat-card [label]="k.label" [value]="k.value" [tone]="palette[i]" />
      }
    </div>

    <section class="panel">
      <header class="head">
        <h3>Users</h3>
        <button type="button" class="add">Add user</button>
      </header>
      <div class="wrap">
        <table>
          <thead>
            <tr><th>User</th><th>Role</th><th>Teams (office groups)</th><th>Leads</th><th>Ezekia user and BD tag</th><th>Status</th></tr>
          </thead>
          <tbody>
            @for (u of users(); track u.email) {
              <tr [class.is-off]="!u.active">
                <td><strong>{{ u.name }}</strong><small>{{ u.email }}</small></td>
                <td>
                  <select [disabled]="!u.active" (change)="setRole(u, $any($event.target).value)" [attr.aria-label]="'Role for ' + u.name">
                    @for (r of roleList; track r) { <option [value]="r" [selected]="r === u.role">{{ r }}</option> }
                  </select>
                </td>
                <td>
                  @for (t of u.teams; track t) { <span class="chip">{{ t }}</span> }
                  @if (u.teams.length) { <small>{{ u.teamSource }}</small> }
                  @else {
                    <select class="set" (change)="addTeam(u, $any($event.target).value)" [attr.aria-label]="'Set office group for ' + u.name">
                      <option value="">Set office group</option>
                      @for (g of groups; track g) { <option [value]="g">{{ g }}</option> }
                    </select>
                  }
                </td>
                <td>{{ u.role === 'Team leader' ? (u.leads.join(', ') || 'Not set') : '-' }}</td>
                <td>
                  @if (u.ezekiaUser) { <span class="ok">Linked</span> } @else { <span class="warn">Not linked</span> }
                  <small>{{ u.bdTag ?? 'No BD tag' }}</small>
                </td>
                <td>
                  <button type="button" class="status" [class.is-on]="u.active" (click)="toggle(u)">{{ u.active ? 'Active' : 'Deactivated' }}</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <p class="foot">Deactivated users lose access. Their past BD activity stays in all figures.</p>
    </section>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 18px; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); box-shadow: var(--shadow); padding: 18px 20px; }
    .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .head h3 { font-size: 14.5px; font-weight: 600; }
    .add { appearance: none; border: 0; background: var(--accent); color: var(--on-accent); font: inherit; font-size: 13px; font-weight: 600;
      padding: 8px 14px; border-radius: var(--r-sm); cursor: pointer; }
    .wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 11.5px; color: var(--text-faint); font-weight: 600; padding: 8px 10px; border-bottom: 1px solid var(--border); white-space: nowrap; }
    td { padding: 10px; border-bottom: 1px solid var(--border); vertical-align: top; }
    td strong { display: block; font-weight: 600; }
    td small { display: block; font-size: 11.5px; color: var(--text-faint); margin-top: 3px; }
    tr.is-off td { opacity: .55; }
    select { font: inherit; font-size: 12.5px; color: var(--text); background: var(--bg); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 5px 8px; }
    select.set { border-style: dashed; color: var(--text-muted); }
    .chip { display: inline-block; font-size: 11.5px; font-weight: 600; padding: 2px 8px; border-radius: var(--r-pill); margin: 0 4px 3px 0;
      background: color-mix(in srgb, var(--c-indigo) 14%, transparent); color: color-mix(in srgb, var(--c-indigo) 78%, var(--text)); }
    .ok { font-size: 12px; font-weight: 600; color: var(--pos); }
    .warn { font-size: 12px; font-weight: 600; color: var(--warn); }
    .status { appearance: none; font: inherit; font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: var(--r-pill); cursor: pointer;
      border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--text-muted); }
    .status.is-on { border-color: color-mix(in srgb, var(--pos) 40%, transparent); background: color-mix(in srgb, var(--pos) 12%, transparent); color: var(--pos); }
    .foot { font-size: 12px; color: var(--text-faint); margin-top: 12px; }
  `],
})
export class UserManagementComponent {
  palette = PALETTE;
  roleList: Role[] = ROLES;
  groups = OFFICE_GROUPS;
  users = signal<AppUser[]>(USERS.map((u) => ({ ...u, teams: [...u.teams], leads: [...u.leads] })));
  kpis = computed(() => {
    const u = this.users().filter((x) => x.active);
    return [
      { label: 'Active users', value: String(u.length) },
      { label: 'Super admins', value: String(u.filter((x) => x.role === 'Super admin').length) },
      { label: 'Team leaders', value: String(u.filter((x) => x.role === 'Team leader').length) },
      { label: 'Members', value: String(u.filter((x) => x.role === 'Member').length) },
      { label: 'Without a team', value: String(u.filter((x) => !x.teams.length).length) },
    ];
  });
  private patch(u: AppUser, p: Partial<AppUser>) { this.users.update((l) => l.map((x) => (x.email === u.email ? { ...x, ...p } : x))); }
  setRole(u: AppUser, r: Role) { this.patch(u, { role: r, leads: r === 'Team leader' ? [...u.teams] : [] }); }
  addTeam(u: AppUser, g: string) { if (g) this.patch(u, { teams: [g], teamSource: 'Set by super admin' }); }
  toggle(u: AppUser) { this.patch(u, { active: !u.active }); }
}
