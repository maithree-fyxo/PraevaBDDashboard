import { Injectable } from '@angular/core';

export interface Kpi { label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'flat'; }
export interface Point { label: string; value: number; }
export interface Chart { kind: 'bar' | 'line' | 'donut'; title: string; unit?: string; points: Point[]; }
export interface Table { title: string; columns: string[]; rows: string[][]; }
export interface ViewDef { title: string; subtitle: string; kpis: Kpi[]; chart: Chart; table: Table; }

@Injectable({ providedIn: 'root' })
export class DataService {
  // ---- Overview (Req 1 + 23) ----
  readonly overview = {
    kpis: [
      { label: 'BD meetings', value: '142', delta: '+18% vs prev. period', trend: 'up' },
      { label: 'Qualified leads', value: '37', delta: '+9%', trend: 'up' },
      { label: 'Active opportunities', value: '54', delta: '+4', trend: 'up' },
      { label: 'Follow-up rate', value: '71%', delta: '−3 pts', trend: 'down' },
    ] as Kpi[],
    trend: { kind: 'line', title: 'BD meetings over time', unit: 'meetings', points: [
      { label: 'Apr', value: 34 }, { label: 'May', value: 41 }, { label: 'Jun', value: 38 },
      { label: 'Jul', value: 47 }, { label: 'Aug', value: 52 }, { label: 'Sep', value: 44 },
    ]} as Chart,
    pipeline: { kind: 'donut', title: 'Opportunities by status', points: [
      { label: 'Qualified lead', value: 37 }, { label: 'Active', value: 54 },
      { label: 'Dormant', value: 21 }, { label: 'Stale', value: 12 },
    ]} as Chart,
    originators: { kind: 'bar', title: 'Top originators', unit: 'meetings', points: [
      { label: 'Priya Nair', value: 26 }, { label: 'James Whitlock', value: 22 },
      { label: 'Sofia Marchetti', value: 19 }, { label: 'Daniel Osei', value: 15 },
      { label: 'Lena Fischer', value: 12 },
    ]} as Chart,
    recent: { title: 'Recent BD meetings', columns: ['Date', 'Company', 'Originator', 'Attendees', 'Outcome'], rows: [
      ['5 Sep', 'Aldgate Capital', 'Priya Nair', '1 int · 2 ext', 'Qualified lead'],
      ['4 Sep', 'Northwind Partners', 'James Whitlock', '2 int · 1 ext', 'Active'],
      ['3 Sep', 'Meridian Growth', 'Sofia Marchetti', '1 int · 1 ext', 'Active'],
      ['2 Sep', 'Vantage Holdings', 'Daniel Osei', '1 int · 3 ext', 'No follow-up'],
      ['1 Sep', 'Brightline Ventures', 'Priya Nair', '2 int · 2 ext', 'Dormant'],
    ]} as Table,
  };

  private readonly views: Record<string, ViewDef> = {
    originator: {
      title: 'Meetings by originator',
      subtitle: 'BD meetings attributed to the person tagged “Originator” on the linked opportunity.',
      kpis: [
        { label: 'Meetings', value: '142' }, { label: 'Originators', value: '11' },
        { label: 'Top originator', value: 'Priya Nair' },
      ],
      chart: { kind: 'bar', title: 'Meetings by originator', unit: 'meetings', points: [
        { label: 'Priya Nair', value: 26 }, { label: 'James Whitlock', value: 22 },
        { label: 'Sofia Marchetti', value: 19 }, { label: 'Daniel Osei', value: 15 },
        { label: 'Lena Fischer', value: 12 }, { label: 'Marcus Bell', value: 9 },
      ]},
      table: { title: 'Originator detail', columns: ['Originator', 'Meetings', 'Qualified leads', 'Active opps'], rows: [
        ['Priya Nair', '26', '9', '11'], ['James Whitlock', '22', '6', '9'],
        ['Sofia Marchetti', '19', '7', '8'], ['Daniel Osei', '15', '3', '5'],
        ['Lena Fischer', '12', '4', '6'],
      ]},
    },
    attendees: {
      title: 'Meeting attendees',
      subtitle: 'Attendees per meeting, split into Internal (Firm Users) and External.',
      kpis: [
        { label: 'Avg attendees', value: '3.2' }, { label: 'Internal share', value: '46%' },
        { label: 'Multi-attendee', value: '68%' },
      ],
      chart: { kind: 'donut', title: 'Internal vs external attendees', points: [
        { label: 'Internal', value: 208 }, { label: 'External', value: 244 },
      ]},
      table: { title: 'Outcomes by attendee count', columns: ['Attendees', 'Meetings', 'Qualified leads', 'Lead rate'], rows: [
        ['1 attendee', '39', '7', '18%'], ['2 attendees', '54', '16', '30%'],
        ['3+ attendees', '49', '14', '29%'],
      ]},
    },
    roles: {
      title: 'Meetings by role',
      subtitle: 'Contacts grouped by their Role Classification in Ezekia.',
      kpis: [
        { label: 'Roles engaged', value: '9' }, { label: 'Most engaged', value: 'CEO' },
        { label: 'C-suite share', value: '61%' },
      ],
      chart: { kind: 'bar', title: 'Meetings by contact role', unit: 'meetings', points: [
        { label: 'CEO', value: 41 }, { label: 'CFO', value: 33 }, { label: 'Chair', value: 24 },
        { label: 'Investment Director', value: 22 }, { label: 'Partner', value: 14 }, { label: 'Other', value: 8 },
      ]},
      table: { title: 'Role detail', columns: ['Role', 'Meetings', 'Qualified leads'], rows: [
        ['CEO', '41', '13'], ['CFO', '33', '8'], ['Chair', '24', '7'],
        ['Investment Director', '22', '6'], ['Partner', '14', '3'],
      ]},
    },
    sectors: {
      title: 'Meetings by sector',
      subtitle: 'BD meeting activity by sector and subsector.',
      kpis: [
        { label: 'Sectors active', value: '8' }, { label: 'Top sector', value: 'Technology' },
        { label: 'Top-sector share', value: '28%' },
      ],
      chart: { kind: 'bar', title: 'Meetings by sector', unit: 'meetings', points: [
        { label: 'Technology', value: 40 }, { label: 'Financial Services', value: 31 },
        { label: 'Healthcare', value: 24 }, { label: 'Industrials', value: 19 },
        { label: 'Consumer', value: 16 }, { label: 'Energy', value: 12 },
      ]},
      table: { title: 'Sector & subsector', columns: ['Sector', 'Subsector', 'Meetings', 'Leads'], rows: [
        ['Technology', 'Enterprise SaaS', '18', '7'], ['Technology', 'Fintech', '13', '4'],
        ['Financial Services', 'Asset Management', '17', '5'], ['Healthcare', 'Medtech', '14', '4'],
        ['Industrials', 'Automation', '11', '2'],
      ]},
    },
    'follow-up': {
      title: 'Follow-up activity',
      subtitle: 'What happened after each BD meeting, based on the linked opportunity.',
      kpis: [
        { label: 'Meetings w/ follow-up', value: '101' }, { label: 'Follow-up rate', value: '71%' },
        { label: 'Avg days to follow-up', value: '4.6' },
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
        { label: 'Overall effectiveness', value: '71%' }, { label: 'Best segment', value: '2 attendees' },
        { label: 'Lead conversion', value: '26%' },
      ],
      chart: { kind: 'bar', title: 'Effectiveness by attendee count', unit: '%', points: [
        { label: '1 attendee', value: 58 }, { label: '2 attendees', value: 79 }, { label: '3+ attendees', value: 74 },
      ]},
      table: { title: 'Effectiveness by sector', columns: ['Sector', 'Meetings', 'With follow-up', 'Rate'], rows: [
        ['Technology', '40', '32', '80%'], ['Financial Services', '31', '22', '71%'],
        ['Healthcare', '24', '17', '71%'], ['Industrials', '19', '11', '58%'],
      ]},
    },
    leads: {
      title: 'Leads generated',
      subtitle: 'Opportunities that reached a “Qualified Lead” status through BD activity.',
      kpis: [
        { label: 'Qualified leads', value: '37' }, { label: 'From meetings', value: '31' },
        { label: 'Lead rate', value: '26%' },
      ],
      chart: { kind: 'line', title: 'Qualified leads over time', unit: 'leads', points: [
        { label: 'Apr', value: 4 }, { label: 'May', value: 6 }, { label: 'Jun', value: 5 },
        { label: 'Jul', value: 7 }, { label: 'Aug', value: 9 }, { label: 'Sep', value: 6 },
      ]},
      table: { title: 'Leads by originator', columns: ['Originator', 'Leads', 'Sector focus'], rows: [
        ['Priya Nair', '9', 'Technology'], ['Sofia Marchetti', '7', 'Financial Services'],
        ['James Whitlock', '6', 'Healthcare'], ['Lena Fischer', '4', 'Industrials'],
      ]},
    },
    pipeline: {
      title: 'Opportunity pipeline',
      subtitle: 'Opportunities generated through BD activity and where they sit by status.',
      kpis: [
        { label: 'Open opportunities', value: '91' }, { label: 'Qualified leads', value: '37' },
        { label: 'Active', value: '54' },
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
    team: {
      title: 'Team view',
      subtitle: 'BD activity, leads, opportunities and follow-up across the team.',
      kpis: [
        { label: 'Team meetings', value: '142' }, { label: 'Team leads', value: '37' },
        { label: 'Team follow-up rate', value: '71%' },
      ],
      chart: { kind: 'bar', title: 'Meetings by team member', unit: 'meetings', points: [
        { label: 'Priya Nair', value: 26 }, { label: 'James Whitlock', value: 22 },
        { label: 'Sofia Marchetti', value: 19 }, { label: 'Daniel Osei', value: 15 },
        { label: 'Lena Fischer', value: 12 }, { label: 'Marcus Bell', value: 9 },
      ]},
      table: { title: 'Team scorecard', columns: ['Member', 'Meetings', 'Leads', 'Active opps', 'Follow-up'], rows: [
        ['Priya Nair', '26', '9', '11', '81%'], ['James Whitlock', '22', '6', '9', '73%'],
        ['Sofia Marchetti', '19', '7', '8', '79%'], ['Daniel Osei', '15', '3', '5', '55%'],
        ['Lena Fischer', '12', '4', '6', '67%'],
      ]},
    },
    individual: {
      title: 'Individual view',
      subtitle: 'Activity, leads, opportunities and outcomes for one team member.',
      kpis: [
        { label: 'Meetings', value: '26' }, { label: 'Leads', value: '9' },
        { label: 'Follow-up rate', value: '81%' },
      ],
      chart: { kind: 'line', title: 'Priya Nair — meetings over time', unit: 'meetings', points: [
        { label: 'Apr', value: 6 }, { label: 'May', value: 8 }, { label: 'Jun', value: 7 },
        { label: 'Jul', value: 9 }, { label: 'Aug', value: 11 }, { label: 'Sep', value: 7 },
      ]},
      table: { title: 'Priya Nair — recent meetings', columns: ['Date', 'Company', 'Role', 'Outcome'], rows: [
        ['5 Sep', 'Aldgate Capital', 'CFO', 'Qualified lead'], ['30 Aug', 'Brightline Ventures', 'CEO', 'Active'],
        ['24 Aug', 'Meridian Growth', 'Chair', 'Active'], ['18 Aug', 'Kestrel Foods', 'CEO', 'Further contact'],
      ]},
    },
    'sector-view': {
      title: 'Sector view',
      subtitle: 'BD activity and outcomes analysed by sector.',
      kpis: [
        { label: 'Sectors', value: '8' }, { label: 'Best converting', value: 'Technology' },
        { label: 'Leads', value: '37' },
      ],
      chart: { kind: 'bar', title: 'Leads by sector', unit: 'leads', points: [
        { label: 'Technology', value: 11 }, { label: 'Financial Services', value: 8 },
        { label: 'Healthcare', value: 7 }, { label: 'Industrials', value: 5 },
        { label: 'Consumer', value: 4 }, { label: 'Energy', value: 2 },
      ]},
      table: { title: 'Sector scorecard', columns: ['Sector', 'Meetings', 'Leads', 'Active opps', 'Lead rate'], rows: [
        ['Technology', '40', '11', '16', '28%'], ['Financial Services', '31', '8', '12', '26%'],
        ['Healthcare', '24', '7', '10', '29%'], ['Industrials', '19', '5', '8', '26%'],
      ]},
    },
    company: {
      title: 'Company view',
      subtitle: 'Meetings, contacts, follow-up and opportunities for one company.',
      kpis: [
        { label: 'Meetings', value: '6' }, { label: 'Contacts', value: '4' },
        { label: 'Open opps', value: '2' },
      ],
      chart: { kind: 'line', title: 'Aldgate Capital — engagement over time', unit: 'touches', points: [
        { label: 'Apr', value: 1 }, { label: 'May', value: 2 }, { label: 'Jun', value: 1 },
        { label: 'Jul', value: 3 }, { label: 'Aug', value: 2 }, { label: 'Sep', value: 3 },
      ]},
      table: { title: 'Aldgate Capital — activity', columns: ['Date', 'Contact', 'Role', 'Outcome'], rows: [
        ['5 Sep', 'Helen Ma', 'CFO', 'Qualified lead'], ['21 Aug', 'Rob Deighton', 'CEO', 'Active'],
        ['14 Jul', 'Helen Ma', 'CFO', 'Further contact'], ['3 Jun', 'Amara Ito', 'Chair', 'Introduction'],
      ]},
    },
  };

  get(key: string): ViewDef {
    return this.views[key] ?? this.views['originator'];
  }
}
