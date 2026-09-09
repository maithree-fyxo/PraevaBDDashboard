export interface NavItem { label: string; path: string; icon: string; req?: string; }
export interface NavGroup { label: string; items: NavItem[]; }

// Icons are lucide-style stroke paths (drawn inside a 24x24 viewBox).
const I = {
  grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  badge: '<path d="M12 2l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4z"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  reply: '<path d="M9 17l-5-5 5-5"/><path d="M4 12h11a5 5 0 0 1 5 5v2"/>',
  slash: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6 18.4 18.4"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  spark: '<path d="M13 2 4.5 12.5H11l-1 9L18.5 11H12l1-9z"/>',
  funnel: '<path d="M3 4h18l-7 8v6l-4 2v-8L3 4z"/>',
  pulse: '<path d="M3 12h4l3 8 4-16 3 8h4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  archive: '<path d="M3 7h18v13H3z"/><path d="M3 7l2-3h14l2 3"/><path d="M9 12h6"/>',
  building: '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 8h3a2 2 0 0 1 2 2v11"/><path d="M8 7h2M8 11h2M8 15h2"/>',
  sector: '<path d="M12 3v9l7 4"/><circle cx="12" cy="12" r="9"/>',
};

export const NAV: NavGroup[] = [
  { label: 'Overview', items: [
    { label: 'Dashboard', path: '', icon: I.grid, req: '1, 23' },
  ]},
  { label: 'Meeting activity', items: [
    { label: 'By originator', path: 'originator', icon: I.users, req: '2' },
    { label: 'Attendees', path: 'attendees', icon: I.user, req: '3' },
    { label: 'By role', path: 'roles', icon: I.badge, req: '5' },
    { label: 'By sector', path: 'sectors', icon: I.layers, req: '6' },
  ]},
  { label: 'Follow-up & outcomes', items: [
    { label: 'Follow-up activity', path: 'follow-up', icon: I.reply, req: '9' },
    { label: 'No follow-up', path: 'no-activity', icon: I.slash, req: '10' },
    { label: 'Effectiveness', path: 'effectiveness', icon: I.gauge, req: '11' },
    { label: 'Leads generated', path: 'leads', icon: I.spark, req: '12' },
  ]},
  { label: 'Opportunity pipeline', items: [
    { label: 'Pipeline', path: 'pipeline', icon: I.funnel, req: '13' },
    { label: 'Active', path: 'active', icon: I.pulse, req: '17' },
    { label: 'Days in stage', path: 'days-in-stage', icon: I.clock, req: '15' },
    { label: 'Dormant', path: 'dormant', icon: I.moon, req: '14' },
    { label: 'Stale', path: 'stale', icon: I.archive, req: '16' },
  ]},
  { label: 'Views', items: [
    { label: 'Team', path: 'team', icon: I.users, req: '18' },
    { label: 'Individual', path: 'individual', icon: I.user, req: '19' },
    { label: 'Sector', path: 'sector-view', icon: I.sector, req: '20' },
    { label: 'Company', path: 'company', icon: I.building, req: '22' },
  ]},
];
