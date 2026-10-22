// Reference data for the global dimensions. In the live build these come from Ezekia:
//  - Company type, Primary sector, Subsector: company custom fields (/custom-fields/companies/)
//  - Role classification and seniority: the person's Current Status career, mapped in a
//    maintained career → role class table (most senior career wins)

export const ALL = 'All';

export const COMPANY_TYPES = ['Portfolio Company', 'Private Company', 'Investor', 'Advisor', 'Candidate', 'Uncoded'];
export const ROLE_CLASSES = ['Management', 'Non-management', 'Board / NED', 'Other', 'Uncoded'];
// Proposed bands, pending confirmation
export const SENIORITY = ['C-suite', 'Director / MD', 'Head of / Senior manager'];
export const SENIORITY_SHARE = [0.5, 0.3, 0.2];

export const SECTORS: Record<string, string[]> = {
  'Consumer': ['Beauty & Personal Care', 'Hospitality, Travel & Leisure', 'Retail', 'Fashion, Luxury & Lifestyle', 'Food & Beverage'],
  'Life Science': ['Pharma', 'CDMO', 'CRO', 'Pharma Services', 'Medical Devices'],
  'Industrials': ['Manufacturing & Engineering', 'Building Materials & Construction', 'Distribution & Wholesale', 'Transport & Logistics', 'Aerospace, Defence & Automotive'],
  'Technology': ['Software & SaaS', 'IT Services & Managed Services', 'Data, AI & Cyber', 'Fintech & Payments', 'Media & Digital'],
  'Healthcare': ['Healthcare Providers', 'Social Care & Specialist Care', 'Digital Health & Healthtech', 'Diagnostics & Pathology', 'Veterinary & Animal Health'],
  'Financial Services': ['Wealth & Asset Management', 'Insurance & Broking', 'Lending & Specialty Finance', 'Capital Markets & Advisory', 'Financial Platforms & Infrastructure'],
  'Energy & Infrastructure': ['Renewables & Clean Energy', 'Utilities & Networks', 'Environmental & Waste Services', 'Infrastructure Services', 'Conventional Energy'],
  'Real Estate': ['Development & Investment', 'Property Services & Management', 'Housebuilding', 'Operational Real Estate', 'PropTech'],
};
export const SECTOR_NAMES = Object.keys(SECTORS);
export const SECTOR_SHARE: Record<string, number> = {
  'Technology': 0.22, 'Financial Services': 0.17, 'Industrials': 0.14, 'Healthcare': 0.13,
  'Consumer': 0.11, 'Life Science': 0.10, 'Energy & Infrastructure': 0.08, 'Real Estate': 0.05,
};
export const SECTOR_CONV: Record<string, number> = {
  'Technology': 0.28, 'Financial Services': 0.26, 'Industrials': 0.24, 'Healthcare': 0.31,
  'Consumer': 0.23, 'Life Science': 0.27, 'Energy & Infrastructure': 0.2, 'Real Estate': 0.18,
};
export const SUBSECTOR_SHARE = [0.32, 0.24, 0.2, 0.14, 0.1];

// BD meetings, last 90 days: company type (rows) × role classification (columns). Sums to 142.
export const MATRIX: number[][] = [
  [24, 9, 7, 2, 2],  // Portfolio Company
  [13, 7, 3, 1, 1],  // Private Company
  [6, 24, 5, 3, 2],  // Investor
  [2, 6, 1, 9, 1],   // Advisor
  [1, 2, 0, 1, 0],   // Candidate
  [2, 3, 1, 1, 3],   // Uncoded
];
export const BASE_MEETINGS = 142;
export const COMPANY_TYPE_CONV = [0.31, 0.27, 0.24, 0.22, 0.17, 0.12];
export const ROLE_CONV = [0.33, 0.21, 0.27, 0.16, 0.1];

export const PERIODS = ['Last 90 days', 'Last 30 days', 'This quarter', 'Year to date'];
export const PERIOD_FACTOR: Record<string, number> = {
  'Last 90 days': 1, 'Last 30 days': 0.34, 'This quarter': 0.78, 'Year to date': 2.4,
};

export interface CompanyRef { name: string; type: string; sector: string; subsector: string; }
export const COMPANIES: CompanyRef[] = [
  { name: 'Aldgate Capital', type: 'Investor', sector: 'Financial Services', subsector: 'Wealth & Asset Management' },
  { name: 'Northwind Partners', type: 'Investor', sector: 'Financial Services', subsector: 'Capital Markets & Advisory' },
  { name: 'Meridian Growth', type: 'Investor', sector: 'Healthcare', subsector: 'Healthcare Providers' },
  { name: 'Brightline Ventures', type: 'Investor', sector: 'Technology', subsector: 'Software & SaaS' },
  { name: 'Solstice Capital', type: 'Investor', sector: 'Industrials', subsector: 'Transport & Logistics' },
  { name: 'Vantage Holdings', type: 'Portfolio Company', sector: 'Industrials', subsector: 'Manufacturing & Engineering' },
  { name: 'Kestrel Foods', type: 'Portfolio Company', sector: 'Consumer', subsector: 'Food & Beverage' },
  { name: 'Aurora Energy', type: 'Portfolio Company', sector: 'Energy & Infrastructure', subsector: 'Renewables & Clean Energy' },
  { name: 'Orion Labs', type: 'Portfolio Company', sector: 'Life Science', subsector: 'CRO' },
  { name: 'Peak Industries', type: 'Portfolio Company', sector: 'Industrials', subsector: 'Distribution & Wholesale' },
  { name: 'Cedar & Vale', type: 'Private Company', sector: 'Real Estate', subsector: 'Operational Real Estate' },
  { name: 'Halcyon Group', type: 'Private Company', sector: 'Consumer', subsector: 'Hospitality, Travel & Leisure' },
  { name: 'Tessellate Software', type: 'Private Company', sector: 'Technology', subsector: 'Data, AI & Cyber' },
  { name: 'Carraway Advisory', type: 'Advisor', sector: 'Financial Services', subsector: 'Capital Markets & Advisory' },
  { name: 'Whitcombe & Rhys', type: 'Advisor', sector: 'Financial Services', subsector: 'Capital Markets & Advisory' },
];

export const TEAMS: Record<string, string[]> = {
  'Sponsors': ['Priya Nair', 'James Whitlock', 'Marcus Bell'],
  'Corporates': ['Sofia Marchetti', 'Daniel Osei'],
  'Healthcare': ['Lena Fischer', 'Sofia Marchetti'],
};
export const PEOPLE = ['Priya Nair', 'James Whitlock', 'Sofia Marchetti', 'Daniel Osei', 'Lena Fischer', 'Marcus Bell'];
export const HOME_TEAM: Record<string, string> = {
  'Priya Nair': 'Sponsors', 'James Whitlock': 'Sponsors', 'Marcus Bell': 'Sponsors',
  'Sofia Marchetti': 'Corporates', 'Daniel Osei': 'Corporates', 'Lena Fischer': 'Healthcare',
};

// Level selector used by Target funds, Cross-sell and Delivery & budget
export const LEVELS = ['Praeva', ...Object.keys(TEAMS).map((t) => 'Team: ' + t), ...PEOPLE];
export function peopleForLevel(level: string): string[] {
  if (level.startsWith('Team: ')) return TEAMS[level.slice(6)] ?? PEOPLE;
  if (PEOPLE.includes(level)) return [level];
  return PEOPLE;
}
