import { Injectable, computed, signal } from '@angular/core';
import { LEVELS, PEOPLE, TEAMS } from './reference';

export type Role = 'Super admin' | 'Team leader' | 'Member';
export const ROLES: Role[] = ['Super admin', 'Team leader', 'Member'];

export interface AppUser {
  name: string; email: string; role: Role;
  /** Office groups the user belongs to. */
  teams: string[];
  /** Office groups a team leader leads. */
  leads: string[];
  teamSource: 'Ezekia office group' | 'Set by super admin' | 'Not set';
  ezekiaUser: boolean; bdTag: string | null; active: boolean;
}

export const OFFICE_GROUPS = Object.keys(TEAMS);

export const USERS: AppUser[] = [
  { name: 'Mark Sherman', email: 'mark.sherman@praevapartners.com', role: 'Super admin', teams: ['Sponsors'], leads: [], teamSource: 'Ezekia office group', ezekiaUser: true, bdTag: 'BD - Mark Sherman', active: true },
  { name: 'Annie Stone', email: 'annie.stone@praevapartners.com', role: 'Super admin', teams: [], leads: [], teamSource: 'Not set', ezekiaUser: true, bdTag: null, active: true },
  { name: 'Priya Nair', email: 'priya.nair@praevapartners.com', role: 'Team leader', teams: ['Sponsors'], leads: ['Sponsors'], teamSource: 'Ezekia office group', ezekiaUser: true, bdTag: 'BD - Priya Nair', active: true },
  { name: 'Sofia Marchetti', email: 'sofia.marchetti@praevapartners.com', role: 'Team leader', teams: ['Corporates', 'Healthcare'], leads: ['Corporates', 'Healthcare'], teamSource: 'Ezekia office group', ezekiaUser: true, bdTag: 'BD - Sofia Marchetti', active: true },
  { name: 'James Whitlock', email: 'james.whitlock@praevapartners.com', role: 'Member', teams: ['Sponsors'], leads: [], teamSource: 'Ezekia office group', ezekiaUser: true, bdTag: 'BD - James Whitlock', active: true },
  { name: 'Marcus Bell', email: 'marcus.bell@praevapartners.com', role: 'Member', teams: ['Sponsors'], leads: [], teamSource: 'Set by super admin', ezekiaUser: true, bdTag: 'BD - Marcus Bell', active: true },
  { name: 'Daniel Osei', email: 'daniel.osei@praevapartners.com', role: 'Member', teams: ['Corporates'], leads: [], teamSource: 'Ezekia office group', ezekiaUser: true, bdTag: 'BD - Daniel Osei', active: true },
  { name: 'Lena Fischer', email: 'lena.fischer@praevapartners.com', role: 'Member', teams: ['Healthcare'], leads: [], teamSource: 'Ezekia office group', ezekiaUser: true, bdTag: 'BD - Lena Fischer', active: true },
  { name: 'Tom Hale', email: 'tom.hale@praevapartners.com', role: 'Member', teams: [], leads: [], teamSource: 'Not set', ezekiaUser: false, bdTag: null, active: true },
  { name: 'Rachel Moore', email: 'rachel.moore@praevapartners.com', role: 'Member', teams: ['Corporates'], leads: [], teamSource: 'Ezekia office group', ezekiaUser: true, bdTag: 'BD - Rachel Moore', active: false },
];

/** Prototype only: who the dashboard is being viewed as. In the live build this comes from Entra ID sign-in. */
const PERSONA: Record<Role, string> = { 'Super admin': 'Mark Sherman', 'Team leader': 'Sofia Marchetti', 'Member': 'Daniel Osei' };

export type Area = 'bd' | 'funds' | 'delivery' | 'financial';

@Injectable({ providedIn: 'root' })
export class RoleService {
  readonly role = signal<Role>('Super admin');
  readonly user = computed(() => USERS.find((u) => u.name === PERSONA[this.role()])!);

  /** Pages each role can open. */
  canSee(path: string): boolean {
    const r = this.role();
    if (path === 'admin/users') return r === 'Super admin';
    if (path === 'financial' || path === 'admin/budget') return r !== 'Member';
    return true;
  }

  /** Teams whose people this user's level selector covers. */
  private ownTeams = computed(() => this.user().teams);
  private ledTeams = computed(() => this.user().leads);

  levels(area: Area): string[] {
    const r = this.role();
    if (area === 'funds') return LEVELS;
    if (area === 'financial') {
      if (r === 'Super admin') return LEVELS;
      if (r === 'Team leader') return this.teamLevels(this.ledTeams());
      return [];
    }
    // BD activity and Delivery: super admins and team leaders see all Praeva data
    if (r !== 'Member') return LEVELS;
    return this.teamLevels(this.ownTeams());
  }

  private teamLevels(teams: string[]): string[] {
    const people = [...new Set(teams.flatMap((t) => TEAMS[t] ?? []))].filter((p) => PEOPLE.includes(p));
    return [...teams.map((t) => 'Team: ' + t), ...people];
  }

  /** Members see their own team's BD activity only (illustrative share of Praeva volume). */
  readonly scopeFactor = computed(() => {
    if (this.role() !== 'Member') return 1;
    const share: Record<string, number> = { Sponsors: 61 / 142, Corporates: 52 / 142, Healthcare: 29 / 142 };
    return this.ownTeams().reduce((a, t) => a + (share[t] ?? 0), 0) || 1;
  });
  readonly scopeLabel = computed(() => (this.role() === 'Member' ? this.ownTeams().join(', ') : null));
}
