/** Chart and module palette. Pink stays the UI accent; charts draw from the wider set. */
export const PALETTE = [
  'var(--c-indigo)', 'var(--c-teal)', 'var(--c-amber)', 'var(--c-violet)',
  'var(--c-sky)', 'var(--c-green)', 'var(--c-coral)',
];
/** Categorical order for multi-colour charts (pink first, as the main accent). */
export const SERIES = [
  'var(--c-pink)', 'var(--c-indigo)', 'var(--c-teal)', 'var(--c-amber)',
  'var(--c-violet)', 'var(--c-sky)', 'var(--c-green)', 'var(--c-coral)',
];
/** Labels with a fixed meaning keep the same colour everywhere. */
const SEMANTIC: Record<string, string> = {
  'Uncoded': 'var(--c-grey)', 'Not yet met': 'var(--c-grey)', 'Stale': 'var(--c-grey)',
  'Qualified lead': 'var(--c-pink)', 'Active': 'var(--c-green)', 'Dormant': 'var(--c-amber)',
  'Recent (within 60 days)': 'var(--c-green)', 'Lapsing (61 to 90 days)': 'var(--c-amber)',
  'Lapsed (more than 90 days)': 'var(--c-coral)',
};
export function seriesColor(label: string, i: number): string {
  return SEMANTIC[label] ?? SERIES[i % SERIES.length];
}
/** Stable single colour for a chart, picked from its title. */
export function toneFor(key: string): string {
  let h = 0; for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
