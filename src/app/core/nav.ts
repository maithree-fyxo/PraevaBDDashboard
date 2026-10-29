import { Role } from './role.service';

export interface Tab { label: string; key: string; }
export interface Category {
  label: string; path: string; icon: string; subtitle: string; tabs: Tab[];
  /** Global dimension filters (company type, role, seniority, sector) apply on this page. */
  dims?: boolean;
  /** Sidebar group. */
  group?: 'bd' | 'admin';
  roles?: Role[];
}

const I = {
  grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  pound: '<path d="M16 6.5A4 4 0 0 0 9 9v9M6 13h7M6 18h12"/>',
  spark: '<path d="M3 17l5-5 4 4 8-8"/><path d="M14 8h6v6"/>',
  summary: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 15l3-3 2 2 5-5"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  reply: '<path d="M9 17l-5-5 5-5"/><path d="M4 12h11a5 5 0 0 1 5 5v2"/>',
  funnel: '<path d="M3 4h18l-7 8v6l-4 2v-8L3 4z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"/>',
  input: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6M7 17h4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
};

export const BD_GROUP_LABEL = 'Business Development';

export const CATEGORIES: Category[] = [
  { label: 'Overview', path: '', icon: I.grid,
    subtitle: 'Headline financial, business development and delivery measures at a glance.', tabs: [] },

  { label: 'Financial', path: 'financial', icon: I.pound, roles: ['Super admin', 'Team leader'],
    subtitle: 'Revenue against budget, billing and forecast.',
    tabs: [{ label: 'Revenue vs budget', key: 'fin-revenue' }, { label: 'Billing', key: 'fin-billing' }] },

  { label: 'Summary', path: 'bd', icon: I.summary, group: 'bd', dims: true,
    subtitle: 'Business development activity and outcomes at a glance.', tabs: [] },
  { label: 'Meeting activity', path: 'meeting-activity', icon: I.calendar, group: 'bd', dims: true,
    subtitle: 'BD meeting volume by originator, attendees, company type, role classification and sector.',
    tabs: [
      { label: 'By originator', key: 'originator' }, { label: 'Attendees', key: 'attendees' },
      { label: 'By company type', key: 'company-types' }, { label: 'By role classification', key: 'roles' },
      { label: 'By sector', key: 'sectors' },
    ]},
  { label: 'Follow-up & outcomes', path: 'follow-up-outcomes', icon: I.reply, group: 'bd', dims: true,
    subtitle: 'What happens after meetings: follow-up, effectiveness and leads.',
    tabs: [
      { label: 'Follow-up activity', key: 'follow-up' }, { label: 'No follow-up', key: 'no-activity' },
      { label: 'Effectiveness', key: 'effectiveness' }, { label: 'Leads generated', key: 'leads' },
    ]},
  { label: 'Opportunities', path: 'pipeline', icon: I.funnel, group: 'bd', dims: true,
    subtitle: 'Opportunities generated from BD activity and their health.',
    tabs: [
      { label: 'Pipeline', key: 'pipeline' }, { label: 'Active', key: 'active' },
      { label: 'Days in stage', key: 'days-in-stage' }, { label: 'Dormant', key: 'dormant' },
      { label: 'Stale', key: 'stale' },
    ]},
  { label: 'Target funds', path: 'target-funds', icon: I.target, group: 'bd',
    subtitle: 'Coverage of the target fund list: last contact, funds not yet met and coverage by owner.',
    tabs: [
      { label: 'Coverage', key: 'fund-coverage' }, { label: 'Needs contact', key: 'fund-not-met' },
      { label: 'By owner', key: 'fund-owners' },
    ]},
  { label: 'Cross-sell', path: 'cross-sell', icon: I.link, group: 'bd',
    subtitle: 'Praeva activity across funds and their portfolio companies, and conversion by team and company.',
    tabs: [{ label: 'Live work by fund', key: 'cs-live' }, { label: 'Conversion', key: 'cs-conversion' }]},
  { label: 'Views', path: 'views', icon: I.chart, group: 'bd', dims: true,
    subtitle: 'Activity and conversion sliced by team, individual, sector and company.',
    tabs: [
      { label: 'Team', key: 'team' }, { label: 'Individual', key: 'individual' },
      { label: 'Sector', key: 'sector-view' }, { label: 'Company', key: 'company' },
    ]},

  { label: 'Delivery', path: 'delivery', icon: I.briefcase,
    subtitle: 'Live searches, shortlist and placement, NPS, capacity and work in progress, against budget assumptions.',
    tabs: [
      { label: 'Live searches', key: 'dl-live' }, { label: 'Shortlist & placement', key: 'dl-shortlist' },
      { label: 'NPS', key: 'dl-nps' }, { label: 'Capacity', key: 'dl-capacity' }, { label: 'Work in progress', key: 'wip' },
    ]},

  { label: 'Budget input', path: 'admin/budget', icon: I.input, group: 'admin', roles: ['Super admin', 'Team leader'],
    subtitle: 'Enter the budget values the dashboard compares actuals against.', tabs: [] },
  { label: 'User management', path: 'admin/users', icon: I.users, group: 'admin', roles: ['Super admin'],
    subtitle: 'Manage who can use the dashboard, their role and their teams.', tabs: [] },
];

export function categoryByPath(path: string): Category {
  return CATEGORIES.find((c) => c.path === path) ?? CATEGORIES[0];
}
