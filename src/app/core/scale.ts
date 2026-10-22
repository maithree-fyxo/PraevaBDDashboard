import { ViewDef } from './data.service';

const INT = /^\d[\d,]*$/;
const NO_SCALE_KPI = /avg|oldest|longest|idle|top|best/i;
const SCALE_COL = /meetings|leads|opps|follow-up/i;
const NO_SCALE_COL = /days|conv|attendees|rate/i;

function sc(v: string, f: number): string {
  return String(Math.max(0, Math.round(Number(v.replace(/,/g, '')) * f)));
}

/** Scales the count-type figures in an illustrative view by the global filter factor. */
export function scaleDef(def: ViewDef, f: number): ViewDef {
  if (Math.abs(f - 1) < 1e-6) return def;
  const scaleCols = def.table.columns.map((c) => SCALE_COL.test(c) && !NO_SCALE_COL.test(c));
  return {
    ...def,
    kpis: def.kpis.map((k) => (INT.test(k.value) && !NO_SCALE_KPI.test(k.label) ? { ...k, value: sc(k.value, f), delta: undefined } : k)),
    chart: def.chart.unit === '%' ? def.chart
      : { ...def.chart, points: def.chart.points.map((p) => ({ ...p, value: Math.max(0, Math.round(p.value * f)) })) },
    table: { ...def.table, rows: def.table.rows.map((r) => r.map((c, i) => (scaleCols[i] && INT.test(c) ? sc(c, f) : c))) },
  };
}
