export interface Tab { label: string; key: string; }
export interface Category { label: string; path: string; icon: string; subtitle: string; tabs: Tab[]; filtered?: boolean; }

const I = {
  grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  reply: '<path d="M9 17l-5-5 5-5"/><path d="M4 12h11a5 5 0 0 1 5 5v2"/>',
  funnel: '<path d="M3 4h18l-7 8v6l-4 2v-8L3 4z"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/>',
};

export const CATEGORIES: Category[] = [
  { label: 'Overview', path: '', icon: I.grid,
    subtitle: 'Business development activity and outcomes at a glance.', tabs: [] },

  { label: 'Meeting activity', path: 'meeting-activity', icon: I.calendar,
    subtitle: 'BD meeting volume and breakdowns by originator, attendees, role and sector.',
    tabs: [
      { label: 'By originator', key: 'originator' }, { label: 'Attendees', key: 'attendees' },
      { label: 'By role', key: 'roles' }, { label: 'By sector', key: 'sectors' },
    ]},

  { label: 'Follow-up & outcomes', path: 'follow-up-outcomes', icon: I.reply,
    subtitle: 'What happens after meetings — follow-up, effectiveness and leads.',
    tabs: [
      { label: 'Follow-up activity', key: 'follow-up' }, { label: 'No follow-up', key: 'no-activity' },
      { label: 'Effectiveness', key: 'effectiveness' }, { label: 'Leads generated', key: 'leads' },
    ]},

  { label: 'Opportunity pipeline', path: 'pipeline', icon: I.funnel,
    subtitle: 'Opportunities generated from BD activity and their health.',
    tabs: [
      { label: 'Pipeline', key: 'pipeline' }, { label: 'Active', key: 'active' },
      { label: 'Days in stage', key: 'days-in-stage' }, { label: 'Dormant', key: 'dormant' },
      { label: 'Stale', key: 'stale' },
    ]},

  { label: 'Views', path: 'views', icon: I.chart, filtered: true,
    subtitle: 'Activity and conversion sliced by team, individual and sector.',
    tabs: [
      { label: 'Team', key: 'team' }, { label: 'Individual', key: 'individual' }, { label: 'Sector', key: 'sector-view' },
    ]},
];

export function categoryByPath(path: string): Category {
  return CATEGORIES.find((c) => c.path === path) ?? CATEGORIES[0];
}
