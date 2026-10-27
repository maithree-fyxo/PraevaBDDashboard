import { Injectable, inject } from '@angular/core';
import { FilterService } from './filter.service';
import { scaleDef } from './scale';
import {
  ALL, COMPANIES, COMPANY_TYPES, COMPANY_TYPE_CONV, HOME_TEAM, LEVELS, PEOPLE, ROLE_CLASSES, ROLE_CONV,
  SECTORS, SECTOR_CONV, SECTOR_NAMES, SECTOR_SHARE, SENIORITY, SENIORITY_SHARE, SUBSECTOR_SHARE, TEAMS, peopleForLevel,
} from './reference';

export interface Kpi { label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'flat'; }
export interface Point { label: string; value: number; }
export interface Chart { kind: 'bar' | 'line' | 'donut'; title: string; unit?: string; points: Point[]; /** one colour per bar */ multi?: boolean; }
export interface Table { title: string; columns: string[]; rows: string[][]; }
export interface Notice { kind: 'assumption' | 'pending'; text: string; }
export interface ViewDef { title: string; subtitle: string; kpis: Kpi[]; chart: Chart; table: Table; notice?: Notice; }
export interface FilterDef { label: string; options: string[]; }

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const CO_NAMES = ['Aldgate Capital', 'Northwind Partners', 'Meridian Growth', 'Vantage Holdings',
  'Brightline Ventures', 'Kestrel Foods', 'Cedar & Vale', 'Halcyon Group'];
const ROLES = ['CFO', 'CEO', 'Chair', 'Investment Director'];
const OUTCOMES = ['Qualified lead', 'Active', 'Dormant', 'No follow-up'];
const DATES = ['5 Sep', '29 Aug', '22 Aug', '14 Aug'];

function conv(meetings: number, leads: number): string {
  return meetings ? Math.round((leads / meetings) * 100) + '%' : '-';
}
function trend(kind: 'line', title: string, unit: string, values: number[]): Chart {
  return { kind: 'line', title, unit, points: values.map((v, i) => ({ label: MONTHS[i], value: v })) };
}
const r = (n: number) => Math.round(n);
const pct = (n: number) => Math.round(n * 100) + '%';
const gbp = (k: number) => '£' + (k >= 1000 ? (k / 1000).toFixed(2) + 'm' : Math.round(k) + 'k');

// ---------- Target funds (Ezekia list "Target funds"; owner = company owner) ----------
interface Fund { name: string; owner: string; last: string | null; days: number | null; by: string; meetings: number; }
const FUNDS: Fund[] = [
  { name: 'Aldgate Capital', owner: 'Priya Nair', last: '5 Sep', days: 12, by: 'Priya Nair', meetings: 4 },
  { name: 'Northwind Partners', owner: 'James Whitlock', last: '29 Aug', days: 19, by: 'James Whitlock', meetings: 3 },
  { name: 'Pemberton Ridge', owner: 'Lena Fischer', last: '26 Aug', days: 22, by: 'Sofia Marchetti', meetings: 2 },
  { name: 'Calder Street Partners', owner: 'Lena Fischer', last: '18 Aug', days: 30, by: 'Lena Fischer', meetings: 2 },
  { name: 'Meridian Growth', owner: 'Sofia Marchetti', last: '22 Jul', days: 57, by: 'Lena Fischer', meetings: 2 },
  { name: 'Fenwick Growth', owner: 'James Whitlock', last: '11 Jul', days: 68, by: 'Priya Nair', meetings: 1 },
  { name: 'Brightline Ventures', owner: 'Priya Nair', last: '30 Jun', days: 79, by: 'Marcus Bell', meetings: 1 },
  { name: 'Larkspur Equity', owner: 'Daniel Osei', last: '3 Jun', days: 106, by: 'Daniel Osei', meetings: 1 },
  { name: 'Solstice Capital', owner: 'Marcus Bell', last: '2 May', days: 138, by: 'Marcus Bell', meetings: 1 },
  { name: 'Ironbridge Equity', owner: 'Daniel Osei', last: null, days: null, by: '-', meetings: 0 },
  { name: 'Harrowgate Capital', owner: 'Sofia Marchetti', last: null, days: null, by: '-', meetings: 0 },
  { name: 'Oakhurst Investors', owner: 'Marcus Bell', last: null, days: null, by: '-', meetings: 0 },
];
function contactStatus(days: number | null): string {
  if (days === null) return 'Not yet met';
  if (days <= 60) return 'Recent';
  if (days <= 90) return 'Lapsing';
  return 'Lapsed';
}

// ---------- Cross-sell (fund ↔ portfolio company links via HelloSky → Ezekia relationships) ----------
interface Link { fund: string; port: string; work: 'Assignment' | 'Opportunity'; name: string; stage: string; team: string; }
const LINKS: Link[] = [
  { fund: 'Aldgate Capital', port: 'Kestrel Foods', work: 'Assignment', name: 'CFO search', stage: 'Shortlist', team: 'Corporates' },
  { fund: 'Aldgate Capital', port: 'Vantage Holdings', work: 'Opportunity', name: 'Board search', stage: 'Active', team: 'Sponsors' },
  { fund: 'Northwind Partners', port: 'Aurora Energy', work: 'Assignment', name: 'Chair search', stage: 'Longlist', team: 'Sponsors' },
  { fund: 'Northwind Partners', port: 'Peak Industries', work: 'Opportunity', name: 'Operating partner', stage: 'Qualified lead', team: 'Corporates' },
  { fund: 'Meridian Growth', port: 'Orion Labs', work: 'Assignment', name: 'CTO search', stage: 'Final interviews', team: 'Healthcare' },
  { fund: 'Meridian Growth', port: 'Brightwater Clinics', work: 'Assignment', name: 'COO search', stage: 'First interviews', team: 'Healthcare' },
  { fund: 'Brightline Ventures', port: 'Tessellate Software', work: 'Opportunity', name: 'NED appointment', stage: 'Active', team: 'Sponsors' },
  { fund: 'Solstice Capital', port: 'Granton Logistics', work: 'Assignment', name: 'CEO search', stage: 'Offer', team: 'Corporates' },
];

// ---------- Delivery (Ezekia assignments, completion, candidate pipeline) ----------
interface Assignment { name: string; client: string; owner: string; completion: number; end: string; ll: number; sl: number; int: number; off: number; next: string; }
const ASSIGNMENTS: Assignment[] = [
  { name: 'CEO search', client: 'Granton Logistics', owner: 'Daniel Osei', completion: 88, end: 'Oct 2026', ll: 46, sl: 7, int: 3, off: 1, next: 'Placement' },
  { name: 'CTO search', client: 'Orion Labs', owner: 'Lena Fischer', completion: 74, end: 'Nov 2026', ll: 38, sl: 6, int: 2, off: 0, next: 'Offer' },
  { name: 'CFO search', client: 'Kestrel Foods', owner: 'Sofia Marchetti', completion: 55, end: 'Dec 2026', ll: 42, sl: 6, int: 0, off: 0, next: 'First interviews' },
  { name: 'COO search', client: 'Brightwater Clinics', owner: 'Lena Fischer', completion: 61, end: 'Dec 2026', ll: 35, sl: 5, int: 4, off: 0, next: 'Final interviews' },
  { name: 'Chair search', client: 'Aurora Energy', owner: 'James Whitlock', completion: 22, end: 'Feb 2027', ll: 31, sl: 0, int: 0, off: 0, next: 'Shortlist' },
  { name: 'CFO search', client: 'Halcyon Group', owner: 'Priya Nair', completion: 40, end: 'Jan 2027', ll: 44, sl: 5, int: 0, off: 0, next: 'First interviews' },
  { name: 'NED search', client: 'Cedar & Vale', owner: 'Marcus Bell', completion: 15, end: 'Mar 2027', ll: 24, sl: 0, int: 0, off: 0, next: 'Shortlist' },
];
function milestone(a: Assignment): string {
  if (a.off) return 'Offer'; if (a.int) return 'Interviews'; if (a.sl) return 'Shortlist'; return 'Longlist';
}
// Budget per individual, £k for the financial year (uploaded targets: assumption)
const BUDGET: Record<string, { b: number; inv: number; paid: number; fc: number }> = {
  'Priya Nair': { b: 520, inv: 380, paid: 330, fc: 505 }, 'James Whitlock': { b: 430, inv: 290, paid: 250, fc: 410 },
  'Marcus Bell': { b: 250, inv: 150, paid: 110, fc: 230 }, 'Sofia Marchetti': { b: 480, inv: 350, paid: 300, fc: 470 },
  'Daniel Osei': { b: 360, inv: 190, paid: 160, fc: 300 }, 'Lena Fischer': { b: 300, inv: 210, paid: 180, fc: 290 },
};

@Injectable({ providedIn: 'root' })
export class DataService {
  private f = inject(FilterService);

  // ---------- Overview ----------
  readonly overviewBase = {
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
    recent: { title: 'Recent BD meetings', columns: ['Date', 'Company', 'Company type', 'Role class', 'Originator', 'Outcome'], rows: [
      ['5 Sep', 'Aldgate Capital', 'Investor', 'Non-management', 'Priya Nair', 'Qualified lead'],
      ['4 Sep', 'Kestrel Foods', 'Portfolio Company', 'Management', 'James Whitlock', 'Active'],
      ['3 Sep', 'Meridian Growth', 'Investor', 'Management', 'Sofia Marchetti', 'Active'],
      ['2 Sep', 'Vantage Holdings', 'Portfolio Company', 'Board / NED', 'Daniel Osei', 'No follow-up'],
      ['1 Sep', 'Carraway Advisory', 'Advisor', 'Other', 'Priya Nair', 'Dormant'],
    ]} as Table,
  };

  overview() {
    const k = this.f.factor();
    const o = this.overviewBase;
    const s = (c: Chart): Chart => ({ ...c, points: c.points.map((p) => ({ ...p, value: r(p.value * k) })) });
    const kpis = o.kpis.map((x) => {
      if (Math.abs(k - 1) < 1e-6) return x;
      return { label: x.label, value: x.value.endsWith('%') ? x.value : String(r(Number(x.value) * k)) };
    });
    kpis[0] = { ...kpis[0], value: String(this.f.total()) };
    const rows = this.f.rowTotals(), cols = this.f.colTotals();
    return {
      kpis, trend: s(o.trend), pipeline: s(o.pipeline), conversion: o.conversion, recent: o.recent,
      byCompanyType: { kind: 'bar', multi: true, title: 'BD meetings by company type', unit: 'meetings',
        points: COMPANY_TYPES.map((label, i) => ({ label, value: r(rows[i]) })) } as Chart,
      byRole: { kind: 'bar', multi: true, title: 'BD meetings by role classification', unit: 'meetings',
        points: ROLE_CLASSES.map((label, j) => ({ label, value: r(cols[j]) })) } as Chart,
      matrix: this.f.matrix(),
      delivery: [
        { label: 'Live assignments', value: String(ASSIGNMENTS.length) },
        { label: 'Invoiced vs budget', value: pct(this.sumBudget(PEOPLE).inv / this.sumBudget(PEOPLE).b) },
        { label: 'Forecast vs budget', value: pct(this.sumBudget(PEOPLE).fc / this.sumBudget(PEOPLE).b) },
        { label: 'Searches at shortlist or later', value: String(ASSIGNMENTS.filter((a) => a.sl > 0).length) },
      ] as Kpi[],
    };
  }

  // ---------- Illustrative static views (scaled by the global filters) ----------
  private readonly views: Record<string, ViewDef> = {
    // Meeting activity
    originator: {
      title: 'Meetings by originator',
      subtitle: 'Attributed to the user named in each meeting’s BD tag, for example “BD - Mark Sherman”.',
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
    // Follow-up & outcomes
    'follow-up': {
      title: 'Follow-up activity',
      subtitle: 'What happened after each BD meeting, from its attached opportunity and its follow-up tag (for example “Follow-up - Intro”).',
      kpis: [
        { label: 'Meetings w/ follow-up', value: '101' }, { label: 'Follow-up rate', value: '71%' },
        { label: 'No opportunity linked', value: '14' }, { label: 'Meeting → lead', value: '26%' },
      ],
      chart: { kind: 'bar', multi: true, title: 'Follow-up by type', unit: 'meetings', points: [
        { label: 'Intro', value: 31 }, { label: 'Idea', value: 22 }, { label: 'Lead', value: 17 }, { label: 'Opportunity', value: 12 },
      ]},
      table: { title: 'Recent follow-ups', columns: ['Meeting', 'Company', 'Follow-up type', 'Days'], rows: [
        ['5 Sep', 'Aldgate Capital', 'Lead', '2'], ['4 Sep', 'Northwind Partners', 'Intro', '5'],
        ['3 Sep', 'Meridian Growth', 'Opportunity', '3'], ['1 Sep', 'Brightline Ventures', 'Idea', '6'],
      ]},
    },
    'no-activity': {
      title: 'Meetings with no follow-up',
      subtitle: 'BD meetings whose attached opportunity shows no activity after the meeting.',
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
        { label: '0 to 15 days', value: 28 }, { label: '16 to 30 days', value: 24 },
        { label: '31 to 60 days', value: 21 }, { label: '61 to 90 days', value: 11 }, { label: '90+ days', value: 7 },
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
        { label: 'Energy & Infrastructure', value: 2 }, { label: 'Technology', value: 2 }, { label: 'Other', value: 1 },
      ]},
      table: { title: 'Stale list', columns: ['Opportunity', 'Company', 'Owner', 'Days idle'], rows: [
        ['Partnership', 'Cedar & Vale', 'Marcus Bell', '128'], ['Supply review', 'Peak Industries', 'Daniel Osei', '112'],
        ['Market entry', 'Aurora Energy', 'Lena Fischer', '101'], ['Roll-up idea', 'Vantage Holdings', 'Daniel Osei', '94'],
      ]},
    },
  };


  // ---------- Routing ----------
  view(key: string, selection: string): ViewDef {
    const k = this.f.factor();
    switch (key) {
      case 'company-types': return this.companyTypeView();
      case 'roles': return this.roleView();
      case 'sectors': return this.sectorBreakdown();
      case 'team': return scaleDef(this.teamView(selection), k);
      case 'individual': return scaleDef(this.individualView(selection), k);
      case 'sector-view': return this.sectorView();
      case 'company': return this.companyView(selection);
      case 'fund-coverage': return this.fundCoverage(selection);
      case 'fund-not-met': return this.fundNotMet(selection);
      case 'fund-owners': return this.fundOwners(selection);
      case 'cs-live': return this.crossSellLive(selection);
      case 'cs-conversion': return this.crossSellConversion(selection);
      case 'delivery': return this.deliveryView(selection);
      case 'budget': return this.budgetView(selection);
      case 'wip': return this.wipView(selection);
    }
    return scaleDef(this.views[key] ?? this.views['originator'], k);
  }

  filterFor(key: string): FilterDef | null {
    switch (key) {
      case 'team': return { label: 'Team', options: ['All teams', ...Object.keys(TEAMS)] };
      case 'individual': return { label: 'Individual', options: PEOPLE };
      case 'company': return { label: 'Company', options: this.companyOptions() };
      case 'fund-coverage': case 'fund-not-met': case 'fund-owners':
      case 'cs-live': case 'cs-conversion': case 'delivery': case 'budget': case 'wip':
        return { label: 'Level', options: LEVELS };
    }
    return null;
  }

  // ---------- Meeting activity: dimension tabs ----------
  private companyTypeView(): ViewDef {
    const rows = this.f.rowTotals(); const total = this.f.total();
    const best = COMPANY_TYPES.slice(0, 5).reduce((a, b, i) => (COMPANY_TYPE_CONV[i] > COMPANY_TYPE_CONV[COMPANY_TYPES.indexOf(a)] ? b : a));
    return {
      title: 'Meetings by company type',
      subtitle: 'Counterparty company’s Relationship Type custom field, as currently coded in Ezekia.',
      kpis: [
        { label: 'Meetings', value: String(total) }, { label: 'Meeting → lead', value: '26%' },
        { label: 'Best converting', value: best }, { label: 'Uncoded', value: total ? pct(rows[5] / total) : '-' },
      ],
      chart: { kind: 'bar', multi: true, title: 'Meetings by company type', unit: 'meetings',
        points: COMPANY_TYPES.map((label, i) => ({ label, value: r(rows[i]) })) },
      table: { title: 'Company type detail', columns: ['Company type', 'Meetings', 'Share', 'Qualified leads', 'Conv.'],
        rows: COMPANY_TYPES.map((t, i) => {
          const m = r(rows[i]); const l = r(rows[i] * COMPANY_TYPE_CONV[i]);
          return [t, String(m), total ? pct(rows[i] / total) : '-', String(l), conv(m, l)];
        }) },
    };
  }

  private roleView(): ViewDef {
    const cols = this.f.colTotals(); const total = this.f.total(); const mgmt = cols[0];
    return {
      title: 'Meetings by role classification',
      subtitle: 'Role class and seniority of the most senior external attendee, from the career on their Current Status.',
      kpis: [
        { label: 'Meetings', value: String(total) }, { label: 'With management', value: total ? pct(mgmt / total) : '-' },
        { label: 'Best converting', value: 'Management' }, { label: 'Uncoded', value: total ? pct(cols[4] / total) : '-' },
      ],
      chart: { kind: 'bar', multi: true, title: 'Meetings by role classification', unit: 'meetings',
        points: ROLE_CLASSES.map((label, j) => ({ label, value: r(cols[j]) })) },
      table: { title: 'Management by seniority', columns: ['Seniority', 'Meetings', 'Share of mgmt', 'Qualified leads', 'Conv.'],
        rows: this.f.seniority() === ALL
          ? SENIORITY.map((s, i) => { const m = r(mgmt * SENIORITY_SHARE[i]); const l = r(m * [0.38, 0.31, 0.24][i]);
              return [s, String(m), pct(SENIORITY_SHARE[i]), String(l), conv(m, l)]; })
          : [[this.f.seniority(), String(r(mgmt)), '100%', String(r(mgmt * 0.33)), conv(r(mgmt), r(mgmt * 0.33))]] },
    };
  }

  private sectorBreakdown(): ViewDef {
    const base = this.f.total() / this.f.sectorFactor();
    const sel = this.f.sector();
    if (sel === ALL) {
      const pts = SECTOR_NAMES.map((s) => ({ label: s, value: r(base * SECTOR_SHARE[s]) })).sort((a, b) => b.value - a.value);
      return {
        title: 'Meetings by sector',
        subtitle: 'Counterparty company’s Primary Sector custom field. Pick a sector above to see its subsectors.',
        kpis: [
          { label: 'Sectors active', value: String(pts.filter((p) => p.value > 0).length) }, { label: 'Meeting → lead', value: '26%' },
          { label: 'Best converting', value: 'Healthcare' },
        ],
        chart: { kind: 'bar', multi: true, title: 'Meetings by primary sector', unit: 'meetings', points: pts },
        table: { title: 'Sector detail', columns: ['Sector', 'Meetings', 'Qualified leads', 'Conv.'],
          rows: pts.map((p) => { const l = r(p.value * SECTOR_CONV[p.label]); return [p.label, String(p.value), String(l), conv(p.value, l)]; }) },
      };
    }
    const secTotal = base * SECTOR_SHARE[sel];
    const subs = SECTORS[sel].map((s, i) => ({ label: s, value: r(secTotal * SUBSECTOR_SHARE[i]) }))
      .filter((p) => this.f.subsector() === ALL || p.label === this.f.subsector());
    return {
      title: `Meetings by subsector: ${sel}`,
      subtitle: 'Counterparty company’s Subsector custom field within the selected Primary Sector.',
      kpis: [
        { label: 'Meetings', value: String(this.f.total()) }, { label: 'Meeting → lead', value: pct(SECTOR_CONV[sel]) },
        { label: 'Subsectors active', value: String(subs.filter((p) => p.value > 0).length) },
      ],
      chart: { kind: 'bar', multi: true, title: `Meetings by subsector: ${sel}`, unit: 'meetings', points: subs },
      table: { title: 'Subsector detail', columns: ['Subsector', 'Meetings', 'Qualified leads', 'Conv.'],
        rows: subs.map((p) => { const l = r(p.value * SECTOR_CONV[sel]); return [p.label, String(p.value), String(l), conv(p.value, l)]; }) },
    };
  }

  // ---------- Views ----------
  private teams: Record<string, { m: number; l: number; a: number; f: number; members: string[] }> = {
    'All teams':  { m: 142, l: 37, a: 54, f: 71, members: PEOPLE },
    'Sponsors':   { m: 61,  l: 17, a: 24, f: 74, members: TEAMS['Sponsors'] },
    'Corporates': { m: 52,  l: 13, a: 21, f: 68, members: TEAMS['Corporates'] },
    'Healthcare': { m: 29,  l: 7,  a: 9,  f: 70, members: TEAMS['Healthcare'] },
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
      title: `Team view: ${name}`,
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

  private indivTrend: Record<string, number[]> = {
    'Priya Nair': [3, 4, 4, 5, 6, 4], 'James Whitlock': [3, 3, 4, 4, 5, 3], 'Sofia Marchetti': [2, 3, 3, 4, 4, 3],
    'Daniel Osei': [2, 2, 3, 3, 3, 2], 'Lena Fischer': [1, 2, 2, 3, 2, 2], 'Marcus Bell': [1, 1, 2, 2, 2, 1],
  };
  private individualView(name: string): ViewDef {
    const s = this.memberStats[name] ?? this.memberStats['Priya Nair'];
    const seed = PEOPLE.indexOf(name);
    const rows = DATES.map((d, i) => {
      const k = (seed + i) % CO_NAMES.length;
      return [d, CO_NAMES[k], ROLES[(seed + i) % ROLES.length], OUTCOMES[(seed + i) % OUTCOMES.length]];
    });
    return {
      title: `Individual view: ${name}`,
      subtitle: 'Activity, conversion and outcomes for the selected team member.',
      kpis: [
        { label: 'Meetings', value: '' + s.m }, { label: 'Meeting → lead', value: conv(s.m, s.l) },
        { label: 'Qualified leads', value: '' + s.l }, { label: 'Follow-up rate', value: s.f + '%' },
      ],
      chart: trend('line', `${name}: meetings over time`, 'meetings', this.indivTrend[name] ?? this.indivTrend['Priya Nair']),
      table: { title: `${name}: recent meetings`, columns: ['Date', 'Company', 'Role', 'Outcome'], rows },
    };
  }

  private sectorView(): ViewDef {
    const sel = this.f.sector();
    const base = this.f.factorExSector() * 142;
    if (sel === ALL) {
      const rows = SECTOR_NAMES.map((s) => { const m = r(base * SECTOR_SHARE[s]); const l = r(m * SECTOR_CONV[s]);
        return [s, String(m), String(l), conv(m, l), String(r(m * 0.38))]; });
      return {
        title: 'Sector view: all sectors',
        subtitle: 'Choose a Primary sector (and optionally a Subsector) in the filters above to focus this view.',
        kpis: [
          { label: 'Meetings', value: String(r(base)) }, { label: 'Meeting → lead', value: '26%' },
          { label: 'Sectors active', value: '8' }, { label: 'Best converting', value: 'Healthcare' },
        ],
        chart: { kind: 'bar', title: 'Meeting → lead conversion by sector', unit: '%',
          points: SECTOR_NAMES.map((s) => ({ label: s, value: r(SECTOR_CONV[s] * 100) })).sort((a, b) => b.value - a.value) },
        table: { title: 'Sector scorecard', columns: ['Sector', 'Meetings', 'Leads', 'Conv.', 'Active opps'], rows },
      };
    }
    const secM = base * SECTOR_SHARE[sel];
    const subs = SECTORS[sel].map((s, i) => [s, secM * SUBSECTOR_SHARE[i]] as [string, number])
      .filter(([s]) => this.f.subsector() === ALL || s === this.f.subsector());
    const m = r(subs.reduce((a, [, v]) => a + v, 0)); const l = r(m * SECTOR_CONV[sel]);
    const shape = [0.13, 0.16, 0.15, 0.18, 0.21, 0.17];
    const label = this.f.subsector() === ALL ? sel : `${sel} › ${this.f.subsector()}`;
    return {
      title: `Sector view: ${label}`,
      subtitle: 'Activity, conversion and outcomes for the sector selected in the filters above.',
      kpis: [
        { label: 'Meetings', value: String(m) }, { label: 'Meeting → lead', value: conv(m, l) },
        { label: 'Qualified leads', value: String(l) }, { label: 'Active opps', value: String(r(m * 0.38)) },
      ],
      chart: trend('line', `${label}: meetings over time`, 'meetings', shape.map((s) => r(m * s * 1.1))),
      table: { title: 'Subsector detail', columns: ['Subsector', 'Meetings', 'Leads', 'Conv.'],
        rows: subs.map(([s, v]) => { const mm = r(v); const ll = r(mm * SECTOR_CONV[sel]); return [s, String(mm), String(ll), conv(mm, ll)]; }) },
    };
  }

  private companyOptions(): string[] {
    const t = this.f.companyType(), s = this.f.sector(), sub = this.f.subsector();
    const list = COMPANIES.filter((c) => (t === ALL || c.type === t) && (s === ALL || c.sector === s) && (sub === ALL || c.subsector === sub));
    return (list.length ? list : COMPANIES).map((c) => c.name);
  }
  private companyView(name: string): ViewDef {
    const c = COMPANIES.find((x) => x.name === name) ?? COMPANIES[0];
    const seed = COMPANIES.indexOf(c);
    const m = 3 + (seed * 7) % 9;
    const people = [['A. Hartley', 'Management'], ['R. Okafor', 'Non-management'], ['J. Lindqvist', 'Board / NED'], ['M. Duarte', 'Management']];
    const links = LINKS.filter((x) => x.fund === c.name || x.port === c.name);
    return {
      title: `Company view: ${c.name}`,
      subtitle: `${c.type} · ${c.sector} › ${c.subsector}`,
      kpis: [
        { label: 'BD meetings', value: String(m) }, { label: 'People met', value: String(2 + seed % 3) },
        { label: 'Last contact', value: DATES[seed % DATES.length] }, { label: 'Live work', value: String(links.length) },
      ],
      chart: trend('line', `${c.name}: meetings over time`, 'meetings', [0, 1, 1, 2, 1, 2].map((v) => v + (seed % 2))),
      table: { title: 'Recent BD meetings', columns: ['Date', 'Contact', 'Role class', 'Originator', 'Outcome'],
        rows: DATES.slice(0, 3).map((d, i) => [d, people[(seed + i) % 4][0], people[(seed + i) % 4][1],
          PEOPLE[(seed + i) % PEOPLE.length], OUTCOMES[(seed + i) % OUTCOMES.length]]) },
    };
  }

  // ---------- Target funds ----------
  private fundsFor(level: string): Fund[] {
    const ppl = peopleForLevel(level); return FUNDS.filter((f) => ppl.includes(f.owner));
  }
  private fundCoverage(level: string): ViewDef {
    const funds = this.fundsFor(level);
    const by = (s: string) => funds.filter((f) => contactStatus(f.days) === s).length;
    const met = funds.filter((f) => f.days !== null).length;
    const sorted = [...funds].sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));
    return {
      title: `Target fund coverage: ${level}`,
      subtitle: 'Funds on the Ezekia “Target funds” list and when Praeva last had a BD meeting with them.',
      kpis: [
        { label: 'Target funds', value: String(funds.length) }, { label: 'Met in last 60 days', value: String(by('Recent')) },
        { label: 'Not yet met', value: String(by('Not yet met')) }, { label: 'Coverage', value: funds.length ? pct(met / funds.length) : '-' },
      ],
      chart: { kind: 'donut', title: 'Funds by last contact', points: [
        { label: 'Recent (within 60 days)', value: by('Recent') }, { label: 'Lapsing (61 to 90 days)', value: by('Lapsing') },
        { label: 'Lapsed (more than 90 days)', value: by('Lapsed') }, { label: 'Not yet met', value: by('Not yet met') },
      ]},
      table: { title: 'Last contact by fund', columns: ['Fund', 'Owner', 'Last contact', 'Days since', 'Last met by', 'Contact status'],
        rows: sorted.map((f) => [f.name, f.owner, f.last ?? '-', f.days === null ? '-' : String(f.days), f.by, contactStatus(f.days)]) },
    };
  }
  private fundNotMet(level: string): ViewDef {
    const funds = this.fundsFor(level);
    const gap = funds.filter((f) => f.days === null || f.days > 90);
    const owners = [...new Set(gap.map((f) => f.owner))];
    return {
      title: `Funds needing contact: ${level}`,
      subtitle: 'Target funds never met, or not met for more than 90 days.',
      kpis: [
        { label: 'Not yet met', value: String(gap.filter((f) => f.days === null).length) },
        { label: 'Not met in 90+ days', value: String(gap.filter((f) => f.days !== null).length) },
        { label: 'Owners affected', value: String(owners.length) },
      ],
      chart: { kind: 'bar', title: 'Funds needing contact by owner', unit: 'funds',
        points: owners.map((o) => ({ label: o, value: gap.filter((f) => f.owner === o).length })).sort((a, b) => b.value - a.value) },
      table: { title: 'Contact list', columns: ['Fund', 'Owner', 'Team', 'Last contact', 'Contact status'],
        rows: gap.map((f) => [f.name, f.owner, HOME_TEAM[f.owner], f.last ?? '-', contactStatus(f.days)]) },
    };
  }
  private fundOwners(level: string): ViewDef {
    const ppl = peopleForLevel(level).filter((p) => FUNDS.some((f) => f.owner === p));
    const stat = (p: string) => { const fs = FUNDS.filter((f) => f.owner === p);
      return { n: fs.length, recent: fs.filter((f) => contactStatus(f.days) === 'Recent').length, never: fs.filter((f) => f.days === null).length,
        cov: fs.length ? fs.filter((f) => f.days !== null).length / fs.length : 0 }; };
    return {
      title: `Target fund coverage by owner: ${level}`,
      subtitle: 'How well each fund owner is covering their assigned target funds.',
      kpis: [
        { label: 'Owners', value: String(ppl.length) }, { label: 'Target funds', value: String(ppl.reduce((a, p) => a + stat(p).n, 0)) },
        { label: 'Avg coverage', value: ppl.length ? pct(ppl.reduce((a, p) => a + stat(p).cov, 0) / ppl.length) : '-' },
      ],
      chart: { kind: 'bar', title: 'Coverage by owner', unit: '%', points: ppl.map((p) => ({ label: p, value: r(stat(p).cov * 100) })) },
      table: { title: 'Owner scorecard', columns: ['Owner', 'Team', 'Target funds', 'Met in 60 days', 'Not yet met', 'Coverage'],
        rows: ppl.map((p) => { const s = stat(p); return [p, HOME_TEAM[p], String(s.n), String(s.recent), String(s.never), pct(s.cov)]; }) },
    };
  }

  // ---------- Cross-sell ----------
  private readonly csNotice: Notice = { kind: 'pending',
    text: 'Fund ↔ portfolio company links will come from HelloSky via Ezekia relationships (timing to be confirmed). Links shown here are illustrative.' };
  private teamsForLevel(level: string): string[] {
    if (level.startsWith('Team: ')) return [level.slice(6)];
    if (PEOPLE.includes(level)) return [HOME_TEAM[level]];
    return Object.keys(TEAMS);
  }
  private crossSellLive(level: string): ViewDef {
    const teams = this.teamsForLevel(level);
    const links = LINKS.filter((l) => teams.includes(l.team));
    const funds = [...new Set(links.map((l) => l.fund))];
    return {
      notice: this.csNotice,
      title: `Live work across the business: ${level}`,
      subtitle: 'Assignments and opportunities at portfolio companies, grouped by the fund that backs them.',
      kpis: [
        { label: 'Funds with live work', value: String(funds.length) },
        { label: 'Live assignments', value: String(links.filter((l) => l.work === 'Assignment').length) },
        { label: 'Open opportunities', value: String(links.filter((l) => l.work === 'Opportunity').length) },
        { label: 'Portfolio companies', value: String(new Set(links.map((l) => l.port)).size) },
      ],
      chart: { kind: 'bar', title: 'Live work by fund', unit: 'items',
        points: funds.map((f) => ({ label: f, value: links.filter((l) => l.fund === f).length })).sort((a, b) => b.value - a.value) },
      table: { title: 'Live work by fund and portfolio company', columns: ['Fund', 'Portfolio company', 'Work', 'Stage', 'Team'],
        rows: links.map((l) => [l.fund, l.port, `${l.work}: ${l.name}`, l.stage, l.team]) },
    };
  }
  private crossSellConversion(level: string): ViewDef {
    const teams = this.teamsForLevel(level);
    const tc: Record<string, number> = { Sponsors: 28, Corporates: 25, Healthcare: 24 };
    const cos = COMPANIES.slice(0, 10).map((c, i) => { const m = 3 + (i * 5) % 9; const l = Math.max(0, Math.round(m * [0.3, 0.25, 0.4, 0.2, 0.33][i % 5]));
      return { c, m, l, team: Object.keys(TEAMS)[i % 3] }; }).filter((x) => teams.includes(x.team));
    return {
      title: `Meeting → lead conversion: ${level}`,
      subtitle: 'Average conversion of BD meetings into leads, by team and by company.',
      kpis: [
        { label: 'Meeting → lead', value: Math.round(teams.reduce((a, t) => a + tc[t], 0) / teams.length) + '%' },
        { label: 'Companies met', value: String(cos.length) },
        { label: 'Best converting', value: [...cos].sort((a, b) => b.l / b.m - a.l / a.m)[0]?.c.name ?? '-' },
      ],
      chart: { kind: 'bar', title: 'Meeting → lead by team', unit: '%', points: teams.map((t) => ({ label: t, value: tc[t] })) },
      table: { title: 'Conversion by company', columns: ['Company', 'Company type', 'Meetings', 'Leads', 'Conv.'],
        rows: cos.map((x) => [x.c.name, x.c.type, String(x.m), String(x.l), conv(x.m, x.l)]) },
    };
  }

  // ---------- Delivery & budget ----------
  private assignmentsFor(level: string) { const ppl = peopleForLevel(level); return ASSIGNMENTS.filter((a) => ppl.includes(a.owner)); }
  private sumBudget(ppl: string[]) {
    return ppl.reduce((acc, p) => { const b = BUDGET[p]; return { b: acc.b + b.b, inv: acc.inv + b.inv, paid: acc.paid + b.paid, fc: acc.fc + b.fc }; },
      { b: 0, inv: 0, paid: 0, fc: 0 });
  }
  private deliveryView(level: string): ViewDef {
    const as = this.assignmentsFor(level);
    const avg = as.length ? as.reduce((a, x) => a + x.completion, 0) / as.length : 0;
    return {
      title: `Delivery summary: ${level}`,
      subtitle: 'Live search assignments, how far through they are and when they are due.',
      kpis: [
        { label: 'Live assignments', value: String(as.length) }, { label: 'Avg completion', value: as.length ? Math.round(avg) + '%' : '-' },
        { label: 'Due by end of year', value: String(as.filter((a) => /2026/.test(a.end)).length) }, { label: 'Completed YTD', value: String(Math.round(as.length * 1.6)) },
      ],
      chart: { kind: 'bar', title: 'Completion by assignment', unit: '%', points: as.map((a) => ({ label: `${a.client}`, value: a.completion })) },
      table: { title: 'Live assignments', columns: ['Assignment', 'Client', 'Owner', 'Completion', 'Target end'],
        rows: as.map((a) => [a.name, a.client, a.owner, a.completion + '%', a.end]) },
    };
  }
  private budgetView(level: string): ViewDef {
    const ppl = peopleForLevel(level);
    const groups: [string, string[]][] = level === 'Praeva'
      ? Object.keys(TEAMS).map((t) => [t, PEOPLE.filter((p) => HOME_TEAM[p] === t)])
      : ppl.map((p) => [p, [p]]);
    const tot = this.sumBudget(ppl);
    return {
      title: `Budget summary: ${level}`,
      subtitle: 'Financial-year budget against invoiced, paid and probability-weighted forecast revenue.',
      kpis: [
        { label: 'Budget (FY)', value: gbp(tot.b) }, { label: 'Invoiced', value: gbp(tot.inv) },
        { label: 'Paid', value: gbp(tot.paid) }, { label: 'Forecast (weighted)', value: gbp(tot.fc) },
      ],
      chart: { kind: 'bar', title: 'Invoiced as % of budget', unit: '%',
        points: groups.map(([g, p]) => { const s = this.sumBudget(p); return { label: g, value: r((s.inv / s.b) * 100) }; }) },
      table: { title: level === 'Praeva' ? 'Budget by team' : 'Budget by individual',
        columns: [level === 'Praeva' ? 'Team' : 'Individual', 'Budget', 'Invoiced', 'Paid', 'Forecast', 'Forecast vs budget'],
        rows: groups.map(([g, p]) => { const s = this.sumBudget(p); return [g, gbp(s.b), gbp(s.inv), gbp(s.paid), gbp(s.fc), pct(s.fc / s.b)]; }) },
    };
  }
  private wipView(level: string): ViewDef {
    const as = this.assignmentsFor(level);
    const stages = ['Longlist', 'Shortlist', 'Interviews', 'Offer'];
    return {
      title: `Work in progress: ${level}`,
      subtitle: 'Where each live search sits against its deliverables, from the candidate pipeline in Ezekia.',
      kpis: [
        { label: 'Live searches', value: String(as.length) },
        { label: 'Shortlist delivered', value: String(as.filter((a) => a.sl > 0).length) },
        { label: 'In interviews', value: String(as.filter((a) => a.int > 0 && !a.off).length) },
        { label: 'At offer', value: String(as.filter((a) => a.off > 0).length) },
      ],
      chart: { kind: 'bar', multi: true, title: 'Searches by current milestone', unit: 'searches',
        points: stages.map((s) => ({ label: s, value: as.filter((a) => milestone(a) === s).length })) },
      table: { title: 'Search deliverables', columns: ['Assignment', 'Client', 'Longlist', 'Shortlist', 'Interviews', 'Offers', 'Current milestone'],
        rows: as.map((a) => [a.name, a.client, String(a.ll), String(a.sl), String(a.int), String(a.off), milestone(a)]) },
    };
  }
}
