import { Injectable } from '@angular/core';

export interface Kpi { label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'flat'; }
export interface Point { label: string; value: number; }
export interface Chart { kind: 'bar' | 'line' | 'donut'; title: string; unit?: string; points: Point[]; }
export interface Table { title: string; columns: string[]; rows: string[][]; }
export interface ViewDef { title: string; subtitle: string; kpis: Kpi[]; chart: Chart; table: Table; }

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const COMPANIES = ['Aldgate Capital', 'Northwind Partners', 'Meridian Growth', 'Vantage Holdings',
  'Brightline Ventures', 'Kestrel Foods', 'Cedar & Vale', 'Halcyon Group'];
const ROLES = ['CFO', 'CEO', 'Chair', 'Investment Director'];
const OUTCOMES = ['Qualified lead', 'Active', 'Further contact', 'Introduction'];
const DATES = ['5 Sep', '29 Aug', '22 Aug', '14 Aug'];

function conv(meetings: number, leads: number): string {
  return meetings ? Math.round((leads / meetings) * 100) + '%' : '—';
}
function trend(kind: 'line', title: string, unit: string, values: number[]): Chart {
  return { kind: 'line', title, unit, points: values.map((v, i) => ({ label: MONTHS[i], value: v })) };
}

@Injectable({ providedIn: 'root' })
export class DataService {
  // ---------- Overview (Req 1 + 23) ----------
  readonly overview = {
    kpis: [
      { label: 'BD meetings', value: '142', delta: '+18% vs prev. period', trend: 'up' },
      { label: 'Meeting → lead', value: '26%', delta: '+2 pts', trend: 'up' },
      { label: 'Qualified leads', value: '37', delta: '+9%', trend: 'up' },
      { label: 'Active opportunities', value: '54', delta: '+4', trend: 'up' },
      { label: 'Follow-up rate', value: '71%', delta: '−3 pts', trend: 'down' },
    ] as Kpi[],
    trend: trend('line', 'BD meetings over time', 'meetings', [34, 41, 38, 47, 52, 44]),
    pipeline: { kind: 'donut', title: 'Opportunities by status', points: [
      { label: 'Qualified lead', value: 37 }, { label: 'Active', value: 54 },
      { label: 'Dormant', value: 21 }, { label: 'Stale', value: 12 },
    ]} as Chart,
    conversion: { kind: 'bar', title: 'Meeting → lead conversion by originator', unit: '%', points: [
      { label: 'Sofia Marchetti', value: 37 }, { label: 'Priya Nair', value: 35 },
      { label: 'Lena Fischer', value: 33 }, { label: 'James Whitlock', value: 27 },
      { label: 'Daniel Osei', value: 20 },
    ]} as Chart,
    recent: { title: 'Recent BD meetings', columns: ['Date', 'Company', 'Originator', 'Attendees', 'Outcome'], rows: [
      ['5 Sep', 'Aldgate Capital', 'Priya Nair', '1 int · 2 ext', 'Qualified lead'],
      ['4 Sep', 'Northwind Partners', 'James Whitlock', '2 int · 1 ext', 'Active'],
      ['3 Sep', 'Meridian Growth', 'Sofia Marchetti', '1 int · 1 ext', 'Active'],
      ['2 Sep', 'Vantage Holdings', 'Daniel Osei', '1 int · 3 ext', 'No follow-up'],
      ['1 Sep', 'Brightline Ventures', 'Priya Nair', '2 int · 2 ext', 'Dormant'],
    ]} as Table,
  };

  // ---------- Fixed tab views ----------
  private readonly views: Record<string, ViewDef> = {
    // Meeting activity
    originator: {
      title: 'Meetings by originator',
      subtitle: 'Attributed to the person tagged “Originator” on the linked opportunity.',
      kpis: [
        { label: 'Meetings', value: '142' }, { label: 'Meeting → lead', value: '26%' },
        { label: 'Top originator', value: 'Priya Nair' },
      ],
      chart: { kind: 'bar', title: 'Meetings by originator', unit: 'meetings', points: [
        { label: 'Priya Nair', value: 26 }, { label: 'James Whitlock', value: 22 },
        { label: 'Sofia Marchetti', value: 19 }, { label: 'Daniel Osei', value: 15 },
        { label: 'Lena Fischer', value: 12 }, { label: 'Marcus Bell', value: 9 },
      ]},
      table: { title: 'Originator detail', columns: ['Originator', 'Meetings', 'Qualified leads', 'Conv.', 'Active opps'], rows: [
        ['Priya Nair', '26', '9', conv(26, 9), '11'], ['James Whitlock', '22', '6', conv(22, 6), '9'],
        ['Sofia Marchetti', '19', '7', conv(19, 7), '8'], ['Daniel Osei', '15', '3', conv(15, 3), '5'],
        ['Lena Fischer', '12', '4', conv(12, 4), '6'], ['Marcus Bell', '9', '2', conv(9, 2), '3'],
      ]},
    },
    attendees: {
      title: 'Meeting attendees',
      subtitle: 'Attendees per meeting, split into Internal (Firm Users) and External.',
      kpis: [
        { label: 'Avg attendees', value: '3.2' }, { label: 'Meeting → lead', value: '26%' },
        { label: 'Best converting', value: '2 attendees' },
      ],
      chart: { kind: 'donut', title: 'Internal vs external attendees', points: [
        { label: 'Internal', value: 208 }, { label: 'External', value: 244 },
      ]},
      table: { title: 'Conversion by attendee count', columns: ['Attendees', 'Meetings', 'Qualified leads', 'Conv.'], rows: [
        ['1 attendee', '39', '7', conv(39, 7)], ['2 attendees', '54', '16', conv(54, 16)],
        ['3+ attendees', '49', '14', conv(49, 14)],
      ]},
    },
    roles: {
      title: 'Meetings by role',
      subtitle: 'Contacts grouped by their Role Classification in Ezekia.',
      kpis: [
        { label: 'Roles engaged', value: '9' }, { label: 'Meeting → lead', value: '26%' },
        { label: 'Best converting', value: 'CEO' },
      ],
      chart: { kind: 'bar', title: 'Meetings by contact role', unit: 'meetings', points: [
        { label: 'CEO', value: 41 }, { label: 'CFO', value: 33 }, { label: 'Chair', value: 24 },
        { label: 'Investment Director', value: 22 }, { label: 'Partner', value: 14 }, { label: 'Other', value: 8 },
      ]},
      table: { title: 'Role detail', columns: ['Role', 'Meetings', 'Qualified leads', 'Conv.'], rows: [
        ['CEO', '41', '13', conv(41, 13)], ['CFO', '33', '8', conv(33, 8)], ['Chair', '24', '7', conv(24, 7)],
        ['Investment Director', '22', '6', conv(22, 6)], ['Partner', '14', '3', conv(14, 3)],
      ]},
    },
    sectors: {
      title: 'Meetings by sector',
      subtitle: 'BD meeting activity by sector and subsector.',
      kpis: [
        { label: 'Sectors active', value: '8' }, { label: 'Meeting → lead', value: '26%' },
        { label: 'Best converting', value: 'Healthcare' },
      ],
      chart: { kind: 'bar', title: 'Meetings by sector', unit: 'meetings', points: [
        { label: 'Technology', value: 40 }, { label: 'Financial Services', value: 31 },
        { label: 'Healthcare', value: 24 }, { label: 'Industrials', value: 19 },
        { label: 'Consumer', value: 16 }, { label: 'Energy', value: 12 },
      ]},
      table: { title: 'Sector detail', columns: ['Sector', 'Meetings', 'Qualified leads', 'Conv.'], rows: [
        ['Technology', '40', '11', conv(40, 11)], ['Financial Services', '31', '8', conv(31, 8)],
        ['Healthcare', '24', '7', conv(24, 7)], ['Industrials', '19', '5', conv(19, 5)],
        ['Consumer', '16', '4', conv(16, 4)],
      ]},
    },
    // Follow-up & outcomes
    'follow-up': {
      title: 'Follow-up activity',
      subtitle: 'What happened after each BD meeting, based on the linked opportunity.',
      kpis: [
        { label: 'Meetings w/ follow-up', value: '101' }, { label: 'Follow-up rate', value: '71%' },
        { label: 'Meeting → lead', value: '26%' },
      ],
      chart: { kind: 'bar', title: 'Follow-up by type', unit: 'meetings', points: [
        { label: 'Further contact', value: 44 }, { label: 'Introduction', value: 21 },
        { label: 'Idea', value: 15 }, { label: 'Lead', value: 12 }, { label: 'Opportunity', value: 9 },
      ]},
      table: { title: 'Recent follow-ups', columns: ['Meeting', 'Company', 'Follow-up', 'Days'], rows: [
        ['5 Sep', 'Aldgate Capital', 'Lead', '2'], ['4 Sep', 'Northwind Partners', 'Introduction', '5'],
        ['3 Sep', 'Meridian Growth', 'Further contact', '3'], ['1 Sep', 'Brightline Ventures', 'Idea', '6'],
      ]},
    },
    'no-activity': {
      title: 'Meetings with no follow-up',
      subtitle: 'BD meetings whose linked opportunity shows no subsequent activity.',
      kpis: [
        { label: 'No follow-up', value: '41' }, { label: 'Share of meetings', value: '29%' },
        { label: 'Oldest untouched', value: '38 days' },
      ],
      chart: { kind: 'bar', title: 'No follow-up by originator', unit: 'meetings', points: [
        { label: 'Daniel Osei', value: 11 }, { label: 'Marcus Bell', value: 8 },
        { label: 'Lena Fischer', value: 7 }, { label: 'James Whitlock', value: 6 }, { label: 'Others', value: 9 },
      ]},
      table: { title: 'Needs attention', columns: ['Meeting', 'Company', 'Originator', 'Days idle'], rows: [
        ['29 Jul', 'Cedar & Vale', 'Daniel Osei', '38'], ['3 Aug', 'Halcyon Group', 'Marcus Bell', '33'],
        ['9 Aug', 'Peak Industries', 'Lena Fischer', '27'], ['15 Aug', 'Solstice Capital', 'James Whitlock', '21'],
      ]},
    },
    effectiveness: {
      title: 'Follow-up effectiveness',
      subtitle: 'How reliably BD meetings generate further activity, and where.',
      kpis: [
        { label: 'Follow-up rate', value: '71%' }, { label: 'Meeting → lead', value: '26%' },
        { label: 'Best segment', value: '2 attendees' },
      ],
      chart: { kind: 'bar', title: 'Meeting → lead by attendee count', unit: '%', points: [
        { label: '1 attendee', value: 18 }, { label: '2 attendees', value: 30 }, { label: '3+ attendees', value: 29 },
      ]},
      table: { title: 'Effectiveness by sector', columns: ['Sector', 'Meetings', 'With follow-up', 'Conv.'], rows: [
        ['Technology', '40', '80%', conv(40, 11)], ['Financial Services', '31', '71%', conv(31, 8)],
        ['Healthcare', '24', '71%', conv(24, 7)], ['Industrials', '19', '58%', conv(19, 5)],
      ]},
    },
    leads: {
      title: 'Leads generated',
      subtitle: 'Opportunities that reached a “Qualified Lead” status through BD activity.',
      kpis: [
        { label: 'Qualified leads', value: '37' }, { label: 'Meeting → lead', value: '26%' },
        { label: 'From meetings', value: '31' },
      ],
      chart: trend('line', 'Qualified leads over time', 'leads', [4, 6, 5, 7, 9, 6]),
      table: { title: 'Leads by originator', columns: ['Originator', 'Meetings', 'Leads', 'Conv.'], rows: [
        ['Priya Nair', '26', '9', conv(26, 9)], ['Sofia Marchetti', '19', '7', conv(19, 7)],
        ['James Whitlock', '22', '6', conv(22, 6)], ['Lena Fischer', '12', '4', conv(12, 4)],
      ]},
    },
    // Opportunity pipeline
    pipeline: {
      title: 'Opportunity pipeline',
      subtitle: 'Opportunities generated through BD activity and where they sit by status.',
      kpis: [
        { label: 'Open opportunities', value: '91' }, { label: 'Meeting → lead', value: '26%' },
        { label: 'Qualified leads', value: '37' }, { label: 'Active', value: '54' },
      ],
      chart: { kind: 'donut', title: 'Opportunities by status', points: [
        { label: 'Qualified lead', value: 37 }, { label: 'Active', value: 54 },
        { label: 'Dormant', value: 21 }, { label: 'Stale', value: 12 },
      ]},
      table: { title: 'Pipeline detail', columns: ['Opportunity', 'Company', 'Status', 'Owner'], rows: [
        ['Growth mandate', 'Aldgate Capital', 'Qualified lead', 'Priya Nair'],
        ['Advisory retainer', 'Northwind Partners', 'Active', 'James Whitlock'],
        ['Board search', 'Meridian Growth', 'Active', 'Sofia Marchetti'],
        ['Buy-side intro', 'Vantage Holdings', 'Dormant', 'Daniel Osei'],
      ]},
    },
    active: {
      title: 'Active opportunities',
      subtitle: 'Opportunities whose status changed within the last 60 days.',
      kpis: [
        { label: 'Active', value: '54' }, { label: 'Share of pipeline', value: '59%' },
        { label: 'Avg age', value: '23 days' },
      ],
      chart: { kind: 'bar', title: 'Active opportunities by sector', unit: 'opps', points: [
        { label: 'Technology', value: 16 }, { label: 'Financial Services', value: 12 },
        { label: 'Healthcare', value: 10 }, { label: 'Industrials', value: 8 }, { label: 'Consumer', value: 8 },
      ]},
      table: { title: 'Active detail', columns: ['Opportunity', 'Company', 'Last change', 'Owner'], rows: [
        ['Advisory retainer', 'Northwind Partners', '4 days ago', 'James Whitlock'],
        ['Board search', 'Meridian Growth', '9 days ago', 'Sofia Marchetti'],
        ['Growth mandate', 'Aldgate Capital', '11 days ago', 'Priya Nair'],
        ['Expansion review', 'Kestrel Foods', '18 days ago', 'Lena Fischer'],
      ]},
    },
    'days-in-stage': {
      title: 'Days in stage',
      subtitle: 'How long each opportunity has held its current status.',
      kpis: [
        { label: 'Avg days in stage', value: '31' }, { label: 'Longest held', value: '96 days' },
        { label: 'Over 60 days', value: '18' },
      ],
      chart: { kind: 'bar', title: 'Opportunities by time in current status', unit: 'opps', points: [
        { label: '0–15 days', value: 28 }, { label: '16–30 days', value: 24 },
        { label: '31–60 days', value: 21 }, { label: '61–90 days', value: 11 }, { label: '90+ days', value: 7 },
      ]},
      table: { title: 'Longest in stage', columns: ['Opportunity', 'Company', 'Status', 'Days'], rows: [
        ['Buy-side intro', 'Vantage Holdings', 'Dormant', '96'], ['Partnership', 'Cedar & Vale', 'Stale', '84'],
        ['Advisory scope', 'Halcyon Group', 'Dormant', '71'], ['Board search', 'Peak Industries', 'Active', '58'],
      ]},
    },
    dormant: {
      title: 'Dormant opportunities',
      subtitle: 'Opportunities with no status update for 60 days or more.',
      kpis: [
        { label: 'Dormant', value: '21' }, { label: 'Share of pipeline', value: '23%' },
        { label: 'Avg idle', value: '73 days' },
      ],
      chart: { kind: 'bar', title: 'Dormant by owner', unit: 'opps', points: [
        { label: 'Daniel Osei', value: 6 }, { label: 'Marcus Bell', value: 5 },
        { label: 'Lena Fischer', value: 4 }, { label: 'James Whitlock', value: 3 }, { label: 'Others', value: 3 },
      ]},
      table: { title: 'Review list', columns: ['Opportunity', 'Company', 'Owner', 'Days idle'], rows: [
        ['Buy-side intro', 'Vantage Holdings', 'Daniel Osei', '96'], ['Advisory scope', 'Halcyon Group', 'Marcus Bell', '71'],
        ['Growth review', 'Solstice Capital', 'Lena Fischer', '65'], ['Intro follow', 'Orion Labs', 'James Whitlock', '62'],
      ]},
    },
    stale: {
      title: 'Stale opportunities',
      subtitle: 'Opportunities with no status update for 90 days or more.',
      kpis: [
        { label: 'Stale', value: '12' }, { label: 'Share of pipeline', value: '13%' },
        { label: 'Oldest', value: '128 days' },
      ],
      chart: { kind: 'bar', title: 'Stale by sector', unit: 'opps', points: [
        { label: 'Industrials', value: 4 }, { label: 'Consumer', value: 3 },
        { label: 'Energy', value: 2 }, { label: 'Technology', value: 2 }, { label: 'Other', value: 1 },
      ]},
      table: { title: 'Stale list', columns: ['Opportunity', 'Company', 'Owner', 'Days idle'], rows: [
        ['Partnership', 'Cedar & Vale', 'Marcus Bell', '128'], ['Supply review', 'Peak Industries', 'Daniel Osei', '112'],
        ['Market entry', 'Aurora Energy', 'Lena Fischer', '101'], ['Roll-up idea', 'Vantage Holdings', 'Daniel Osei', '94'],
      ]},
    },
  };

  getView(key: string): ViewDef {
    return this.views[key] ?? this.views['originator'];
  }

  // ---------- Filter options for the Views category ----------
  readonly teamOptions = ['All teams', 'Sponsors', 'Corporates', 'Healthcare'];
  readonly individualOptions = ['Priya Nair', 'James Whitlock', 'Sofia Marchetti', 'Daniel Osei', 'Lena Fischer', 'Marcus Bell'];
  readonly sectorOptions = ['Technology', 'Financial Services', 'Healthcare', 'Industrials', 'Consumer', 'Energy'];

  optionsFor(tab: string): string[] {
    if (tab === 'team') return this.teamOptions;
    if (tab === 'individual') return this.individualOptions;
    if (tab === 'sector-view') return this.sectorOptions;
    return [];
  }

  getFiltered(tab: string, selection: string): ViewDef {
    if (tab === 'team') return this.teamView(selection);
    if (tab === 'individual') return this.individualView(selection);
    return this.sectorView(selection);
  }

  // ---- Team ----
  private teams: Record<string, { m: number; l: number; a: number; f: number; members: string[] }> = {
    'All teams':  { m: 142, l: 37, a: 54, f: 71, members: ['Priya Nair', 'James Whitlock', 'Sofia Marchetti', 'Daniel Osei', 'Lena Fischer', 'Marcus Bell'] },
    'Sponsors':   { m: 61,  l: 17, a: 24, f: 74, members: ['Priya Nair', 'James Whitlock', 'Marcus Bell'] },
    'Corporates': { m: 52,  l: 13, a: 21, f: 68, members: ['Sofia Marchetti', 'Daniel Osei'] },
    'Healthcare': { m: 29,  l: 7,  a: 9,  f: 70, members: ['Lena Fischer', 'Sofia Marchetti'] },
  };
  private memberStats: Record<string, { m: number; l: number; a: number; f: number }> = {
    'Priya Nair':      { m: 26, l: 9, a: 11, f: 81 },
    'James Whitlock':  { m: 22, l: 6, a: 9,  f: 73 },
    'Sofia Marchetti': { m: 19, l: 7, a: 8,  f: 79 },
    'Daniel Osei':     { m: 15, l: 3, a: 5,  f: 55 },
    'Lena Fischer':    { m: 12, l: 4, a: 6,  f: 67 },
    'Marcus Bell':     { m: 9,  l: 2, a: 3,  f: 62 },
  };
  private teamView(name: string): ViewDef {
    const t = this.teams[name] ?? this.teams['All teams'];
    return {
      title: `Team view — ${name}`,
      subtitle: 'Meetings, conversion, leads and follow-up across the selected team.',
      kpis: [
        { label: 'Team meetings', value: '' + t.m }, { label: 'Meeting → lead', value: conv(t.m, t.l) },
        { label: 'Qualified leads', value: '' + t.l }, { label: 'Follow-up rate', value: t.f + '%' },
      ],
      chart: { kind: 'bar', title: 'Meetings by team member', unit: 'meetings',
        points: t.members.map((mm) => ({ label: mm, value: this.memberStats[mm].m })) },
      table: { title: 'Team scorecard', columns: ['Member', 'Meetings', 'Leads', 'Conv.', 'Active opps', 'Follow-up'],
        rows: t.members.map((mm) => { const s = this.memberStats[mm];
          return [mm, '' + s.m, '' + s.l, conv(s.m, s.l), '' + s.a, s.f + '%']; }) },
    };
  }

  // ---- Individual ----
  private indivTrend: Record<string, number[]> = {
    'Priya Nair': [3, 4, 4, 5, 6, 4], 'James Whitlock': [3, 3, 4, 4, 5, 3], 'Sofia Marchetti': [2, 3, 3, 4, 4, 3],
    'Daniel Osei': [2, 2, 3, 3, 3, 2], 'Lena Fischer': [1, 2, 2, 3, 2, 2], 'Marcus Bell': [1, 1, 2, 2, 2, 1],
  };
  private individualView(name: string): ViewDef {
    const s = this.memberStats[name] ?? this.memberStats['Priya Nair'];
    const seed = this.individualOptions.indexOf(name);
    const rows = DATES.map((d, i) => {
      const k = (seed + i) % COMPANIES.length;
      return [d, COMPANIES[k], ROLES[(seed + i) % ROLES.length], OUTCOMES[(seed + i) % OUTCOMES.length]];
    });
    return {
      title: `Individual view — ${name}`,
      subtitle: 'Activity, conversion and outcomes for the selected team member.',
      kpis: [
        { label: 'Meetings', value: '' + s.m }, { label: 'Meeting → lead', value: conv(s.m, s.l) },
        { label: 'Qualified leads', value: '' + s.l }, { label: 'Follow-up rate', value: s.f + '%' },
      ],
      chart: trend('line', `${name} — meetings over time`, 'meetings', this.indivTrend[name] ?? this.indivTrend['Priya Nair']),
      table: { title: `${name} — recent meetings`, columns: ['Date', 'Company', 'Role', 'Outcome'], rows },
    };
  }

  // ---- Sector ----
  private sectors: Record<string, { m: number; l: number; a: number; tr: number[]; rows: string[][] }> = {
    'Technology':         { m: 40, l: 11, a: 16, tr: [5, 6, 7, 7, 8, 7], rows: [['Enterprise SaaS', '18', '7'], ['Fintech', '13', '4'], ['Cloud infra', '9', '3']] },
    'Financial Services': { m: 31, l: 8,  a: 12, tr: [4, 5, 5, 6, 6, 5], rows: [['Asset Management', '17', '5'], ['Insurance', '8', '2'], ['Banking', '6', '1']] },
    'Healthcare':         { m: 24, l: 7,  a: 10, tr: [3, 4, 4, 4, 5, 4], rows: [['Medtech', '14', '4'], ['Pharma services', '6', '2'], ['Diagnostics', '4', '1']] },
    'Industrials':        { m: 19, l: 5,  a: 8,  tr: [2, 3, 3, 4, 4, 3], rows: [['Automation', '11', '2'], ['Logistics', '5', '2'], ['Materials', '3', '1']] },
    'Consumer':           { m: 16, l: 4,  a: 6,  tr: [2, 2, 3, 3, 3, 3], rows: [['Food & beverage', '9', '2'], ['Retail', '4', '1'], ['Leisure', '3', '1']] },
    'Energy':             { m: 12, l: 2,  a: 3,  tr: [1, 2, 2, 2, 3, 2], rows: [['Renewables', '7', '1'], ['Utilities', '3', '1'], ['Oil & gas', '2', '0']] },
  };
  private sectorView(name: string): ViewDef {
    const s = this.sectors[name] ?? this.sectors['Technology'];
    return {
      title: `Sector view — ${name}`,
      subtitle: 'Activity, conversion and outcomes for the selected sector.',
      kpis: [
        { label: 'Meetings', value: '' + s.m }, { label: 'Meeting → lead', value: conv(s.m, s.l) },
        { label: 'Qualified leads', value: '' + s.l }, { label: 'Active opps', value: '' + s.a },
      ],
      chart: trend('line', `${name} — meetings over time`, 'meetings', s.tr),
      table: { title: 'Subsector detail', columns: ['Subsector', 'Meetings', 'Leads', 'Conv.'],
        rows: s.rows.map((r) => [r[0], r[1], r[2], conv(+r[1], +r[2])]) },
    };
  }
}
