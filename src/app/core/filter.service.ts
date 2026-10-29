import { Injectable, computed, inject, signal } from '@angular/core';
import { RoleService } from './role.service';
import {
  ALL, BASE_MEETINGS, COMPANY_TYPES, MATRIX, PERIOD_FACTOR, ROLE_CLASSES, SECTORS,
  SECTOR_SHARE, SENIORITY, SENIORITY_SHARE, SUBSECTOR_SHARE,
} from './reference';

/** Global dimension filters: period, company type, role classification, seniority, sector, subsector. */
@Injectable({ providedIn: 'root' })
export class FilterService {
  private roles = inject(RoleService);
  readonly period = signal('Last 90 days');
  readonly companyType = signal(ALL);
  readonly role = signal(ALL);
  readonly seniority = signal(ALL);
  readonly sector = signal(ALL);
  readonly subsector = signal(ALL);

  /** Seniority only applies to Management. */
  readonly seniorityEnabled = computed(() => this.role() === ALL || this.role() === 'Management');
  readonly subsectorOptions = computed(() => (this.sector() === ALL ? [] : SECTORS[this.sector()]));

  readonly active = computed(() =>
    [this.companyType(), this.role(), this.seniority(), this.sector(), this.subsector()].some((v) => v !== ALL));

  setRole(v: string) {
    this.role.set(v);
    if (!(v === ALL || v === 'Management')) this.seniority.set(ALL);
  }
  setSector(v: string) { this.sector.set(v); this.subsector.set(ALL); }
  reset() {
    this.companyType.set(ALL); this.role.set(ALL); this.seniority.set(ALL);
    this.sector.set(ALL); this.subsector.set(ALL);
  }

  /** Period × sector/subsector multiplier (everything except the matrix dimensions). */
  readonly sectorFactor = computed(() => {
    const s = this.sector();
    if (s === ALL) return 1;
    const sub = this.subsector();
    const subShare = sub === ALL ? 1 : SUBSECTOR_SHARE[SECTORS[s].indexOf(sub)] ?? 0.2;
    return (SECTOR_SHARE[s] ?? 0.1) * subShare;
  });
  readonly periodFactor = computed(() => PERIOD_FACTOR[this.period()] ?? 1);

  /** Company type × role matrix after all filters (unrounded). */
  readonly matrix = computed<number[][]>(() => {
    const ci = COMPANY_TYPES.indexOf(this.companyType());
    const ri = ROLE_CLASSES.indexOf(this.role());
    const si = SENIORITY.indexOf(this.seniority());
    const f = this.periodFactor() * this.sectorFactor() * this.roles.scopeFactor();
    return MATRIX.map((row, i) => row.map((v, j) => {
      if (ci >= 0 && ci !== i) return 0;
      if (ri >= 0 && ri !== j) return 0;
      if (si >= 0) return j === 0 ? v * SENIORITY_SHARE[si] * f : 0;
      return v * f;
    }));
  });

  readonly total = computed(() => Math.round(this.matrix().flat().reduce((a, b) => a + b, 0)));

  /** Share of the unfiltered 90-day baseline: used to scale the illustrative views. */
  readonly factor = computed(() => this.matrix().flat().reduce((a, b) => a + b, 0) / BASE_MEETINGS);

  /** Same, ignoring sector/subsector (for the Sector view, which breaks down by sector itself). */
  readonly factorExSector = computed(() => this.factor() / this.sectorFactor());

  readonly rowTotals = computed(() => this.matrix().map((r) => r.reduce((a, b) => a + b, 0)));
  readonly colTotals = computed(() => ROLE_CLASSES.map((_, j) => this.matrix().reduce((a, r) => a + r[j], 0)));
}
