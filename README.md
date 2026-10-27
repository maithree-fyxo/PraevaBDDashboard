# BD Dashboard — Angular prototype

A front-end prototype of the Business Development dashboard for **Praeva Partners**,
built in **Angular 17** (standalone components, signals).

All figures are **mock data** held in `DataService` — there is no backend. The intent is
to agree layout, navigation and visual language before wiring up the Ezekia API.

## Run it

```bash
npm install
npm start
```

Then open http://localhost:4200. Requires Node 18.13+ (or 20+). Deployment to GitHub Pages
runs automatically through `.github/workflows/deploy.yml` on every push to `main`.

`preview.html` is a static mirror of the earlier Overview only; the navigable app is the
Angular project.

## What's in it

- **Workspace switcher** under the Praeva logo: Business Development, Finance and Delivery. Finance
  and Delivery show a "Not yet scoped" page. The logo turns white in dark mode.
- **Colour:** pink stays the main accent (navigation, primary card, buttons). Charts, cards and status
  tags use a wider palette defined in `styles.css` (`--c-*` tokens) and `ui/palette.ts`.
- **Sidebar** with eight categories: Overview, Meeting activity, Follow-up & outcomes,
  Opportunity pipeline, Target funds, Cross-sell, Delivery & budget, and Views. Sub-views are
  tabs within each category page.
- **Global filters** (shown on BD activity pages): Company type, Role classification,
  Seniority (Management only), Primary sector and cascading Subsector, plus the Period
  selector in the top bar.
  - Company type = counterparty company's Relationship Type custom field (each value its own
    category, plus Uncoded).
  - Role classification + seniority = the person's Current Status career, mapped to a role
    class (most senior wins).
  - Primary sector / Subsector = company custom fields; Subsector options cascade from Sector.
- **Overview**: KPIs, meetings by company type and by role classification, the company type ×
  role classification matrix, and a delivery and budget snapshot. A last updated time shows in the top bar.
- **Target funds**: last contact by fund, funds needing contact, coverage by owner, at Praeva,
  team or individual level.
- **Cross-sell**: live work across funds and their portfolio companies, and meeting → lead
  conversion by team and company (pending HelloSky relationships).
- **Delivery & budget**: delivery summary, budget against invoiced / paid / forecast, and search
  work in progress by milestone.
- **Views**: Team, Individual, Sector (driven by the global sector filters) and Company.
- BD meetings and originators come from user-specific BD tags (for example "BD - Mark Sherman").
  The Cross-sell page carries a **Waiting on data** note until HelloSky relationships are in Ezekia.

## Structure

```
src/
  styles.css                    Theme tokens (light/dark) + base styles
  app/
    core/
      reference.ts              Dimension values (company types, roles, sectors…) + mock reference data
      filter.service.ts         Global filter state (signals) and the filtered company type × role matrix
      scale.ts                  Scales illustrative views to the active filters
      data.service.ts           Mock data and view builders — the single place to swap in real data
      nav.ts                    Sidebar categories and tabs
      theme.service.ts          Light/dark signal, persistence, OS preference
    ui/                         stat card, charts, tables, filter bar, matrix, notice
    pages/
      overview.component.ts     Overview
      category-page.component.ts  Tabbed page used by every other category
    app.component.ts            Shell: sidebar, top bar, filter bar, outlet
    app.routes.ts               One route per category
```

## Swapping in real data

Replace the bodies in `DataService` and `FilterService` with calls to the Ezekia-backed API.
The view contracts (`Kpi`, `Chart`, `Table`, `Notice`, `ViewDef`) are the shapes each screen
expects, so the components don't need to change — only the source of the numbers.
