# BD Dashboard — Angular prototype

A front-end prototype of the Business Development dashboard for **Praeva Partners**,
built in **Angular 17** (standalone components). It covers the **current-phase**
requirements only; fund / portfolio-company / PE-backed views (requirements 4, 7, 8, 21)
are deferred to a later phase and are intentionally not included.

All figures are **mock data** held in `DataService` — there is no backend. The intent is
to agree layout, navigation and visual language before wiring up the Ezekia API.

## Run it

```bash
npm install
npm start
```

Then open http://localhost:4200. Requires Node 18.13+ (or 20+).

## No-build preview

If you just want to see the look without installing anything, open **`preview.html`**
directly in a browser. It's a static mirror of the Overview page (light/dark toggle works).
The real, navigable app is the Angular project.

## What's in it

- **Left sidebar** grouped into Overview, Meeting activity, Follow-up & outcomes,
  Opportunity pipeline, and Views — one destination per current-phase requirement.
- **Light & dark themes**, toggled top-right, remembered per browser, and defaulting to
  the OS preference on first load.
- **Clean sans-serif** type (Plus Jakarta Sans) with a disciplined pink accent used only
  for emphasis, active state, chart series and status tags.
- Reusable **stat cards**, **bar / line / donut charts** (dependency-free inline SVG/CSS),
  and **data tables** with status tags.

## Requirement → screen

| # | Requirement | Route |
|---|-------------|-------|
| 1, 23 | BD meeting volume + activity/outcome overview | `/` |
| 2 | Meetings by originator | `/originator` |
| 3 | Meeting attendees | `/attendees` |
| 5 | Meetings by role | `/roles` |
| 6 | Meetings by sector | `/sectors` |
| 9 | Follow-up activity | `/follow-up` |
| 10 | Meetings with no follow-up | `/no-activity` |
| 11 | Follow-up effectiveness | `/effectiveness` |
| 12 | Leads generated | `/leads` |
| 13 | Opportunity pipeline | `/pipeline` |
| 17 | Active opportunities | `/active` |
| 15 | Days in stage | `/days-in-stage` |
| 14 | Dormant opportunities | `/dormant` |
| 16 | Stale opportunities | `/stale` |
| 18 | Team view | `/team` |
| 19 | Individual view | `/individual` |
| 20 | Sector view | `/sector-view` |
| 22 | Company view | `/company` |

## Structure

```
src/
  styles.css                 Theme tokens (light/dark) + base styles
  index.html                 Loads the Plus Jakarta Sans web font
  app/
    core/
      theme.service.ts       Light/dark signal, persistence, OS preference
      nav.ts                 Sidebar groups + items (maps to requirements)
      data.service.ts        Mock data — the single place to swap in real data
    ui/                      stat-card, bar/line/donut charts, table, panels
    pages/
      overview.component.ts  Bespoke Overview (req 1 + 23)
      view-page.component.ts Generic, data-driven page for the other views
    app.component.ts         Shell: sidebar + top bar + theme toggle + outlet
    app.routes.ts            One route per requirement view
```

## Swapping in real data

Replace the bodies in `DataService` with calls to your Ezekia-backed API. The view
contracts (`Kpi`, `Chart`, `Table`, `ViewDef`) are the shapes each screen expects, so the
components don't need to change — only the source of the numbers.
