export interface Tab { label: string; key: string; }
export interface Category {
  label: string; path: string; icon: string; subtitle: string; tabs: Tab[];
  /** Global dimension filters (company type, role, seniority, sector) apply on this page. */
  dims?: boolean;
}

const I = {
  grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  reply: '<path d="M9 17l-5-5 5-5"/><path d="M4 12h11a5 5 0 0 1 5 5v2"/>',
  funnel: '<path d="M3 4h18l-7 8v6l-4 2v-8L3 4z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/>',
};

export const CATEGORIES: Category[] = [
  { label: 'Overview', path: '', icon: I.grid, dims: true,
    subtitle: 'Business development activity, outcomes and delivery at a glance.', tabs: [] },

  { label: 'Meeting activity', path: 'meeting-activity', icon: I.calendar, dims: true,
    subtitle: 'BD meeting volume by originator, attendees, company type, role classification and sector.',
    tabs: [
      { label: 'By originator', key: 'originator' }, { label: 'Attendees', key: 'attendees' },
      { label: 'By company type', key: 'company-types' }, { label: 'By role classification', key: 'roles' },
      { label: 'By sector', key: 'sectors' },
    ]},

  { label: 'Follow-up & outcomes', path: 'follow-up-outcomes', icon: I.reply, dims: true,
    subtitle: 'What happens after meetings: follow-up, effectiveness and leads.',
    tabs: [
      { label: 'Follow-up activity', key: 'follow-up' }, { label: 'No follow-up', key: 'no-activity' },
      { label: 'Effectiveness', key: 'effectiveness' }, { label: 'Leads generated', key: 'leads' },
    ]},

  { label: 'Opportunity pipeline', path: 'pipeline', icon: I.funnel, dims: true,
    subtitle: 'Opportunities generated from BD activity and their health.',
    tabs: [
      { label: 'Pipeline', key: 'pipeline' }, { label: 'Active', key: 'active' },
      { label: 'Days in stage', key: 'days-in-stage' }, { label: 'Dormant', key: 'dormant' },
      { label: 'Stale', key: 'stale' },
    ]},

  { label: 'Target funds', path: 'target-funds', icon: I.target,
    subtitle: 'Coverage of the target fund list: last contact, funds not yet met and coverage by owner.',
    tabs: [
      { label: 'Coverage', key: 'fund-coverage' }, { label: 'Needs contact', key: 'fund-not-met' },
      { label: 'By owner', key: 'fund-owners' },
    ]},

  { label: 'Cross-sell', path: 'cross-sell', icon: I.link,
    subtitle: 'Praeva activity across funds and their portfolio companies, and conversion by team and company.',
    tabs: [
      { label: 'Live work by fund', key: 'cs-live' }, { label: 'Conversion', key: 'cs-conversion' },
    ]},

  { label: 'Delivery & budget', path: 'delivery', icon: I.briefcase,
    subtitle: 'Live assignments, budget against actuals and search work in progress.',
    tabs: [
      { label: 'Delivery', key: 'delivery' }, { label: 'Budget', key: 'budget' },
      { label: 'Work in progress', key: 'wip' },
    ]},

  { label: 'Views', path: 'views', icon: I.chart, dims: true,
    subtitle: 'Activity and conversion sliced by team, individual, sector and company.',
    tabs: [
      { label: 'Team', key: 'team' }, { label: 'Individual', key: 'individual' },
      { label: 'Sector', key: 'sector-view' }, { label: 'Company', key: 'company' },
    ]},
];

export function categoryByPath(path: string): Category {
  return CATEGORIES.find((c) => c.path === path) ?? CATEGORIES[0];
}
