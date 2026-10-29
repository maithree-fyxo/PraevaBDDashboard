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

- **Navigation:** Overview, Financial, Business Development (an expandable group: Summary, Meeting
  activity, Follow-up & outcomes, Opportunities, Target funds, Cross-sell, Views), Delivery, and an
  Admin group (Budget input, User management).
- **Roles:** Member, Team leader and Super admin. A "Prototype: viewing as" selector in the sidebar
  footer switches between them. Members see their own team's BD activity and no Financial or Admin
  pages. Team leaders see all Praeva BD and Delivery data, their own teams' financials, and Budget
  input for their teams. Super admins see everything, including User management.
- **Overview:** headline measures per area (invoiced and WIP against budget, target accounts
  converted, NPS) and key deadlines in the next 30 days (target end dates, kick-offs, shortlist due
  dates from revenue entries with status "Shortlist").
- **Financial:** revenue against budget (invoiced and work in progress) and billing.
- **Business Development:** global filters (company type, role classification, seniority, primary
  sector, subsector) on the activity pages. Meetings link to opportunities through the attached
  opportunity first, otherwise by client company.
- **Delivery:** live searches, shortlist and placement, NPS, capacity and work in progress, each
  against budget assumptions where relevant.
- **Admin:** Budget input (values still to be confirmed) and User management (roles, office-group
  teams, Ezekia user link, BD tag, activation).
- **Colour:** pink stays the main accent; charts, cards and tags use the `--c-*` palette in
  `styles.css` and `ui/palette.ts`. The Praeva logo turns white in dark mode.
- Pages that depend on pending data carry an on-screen **Waiting on data** or **Note** message.

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
      nav.ts                    Sidebar categories, groups and tabs
      role.service.ts           Roles, mock users and what each role can see
      theme.service.ts          Light/dark signal, persistence, OS preference
    ui/                         stat card, charts, tables, filter bar, matrix, notice
    pages/
      overview.component.ts     Cross-area Overview
      bd-summary.component.ts   Business Development summary
      budget-input.component.ts Admin budget input
      user-management.component.ts  Super-admin user management
      category-page.component.ts  Tabbed page used by every other category
    app.component.ts            Shell: sidebar, top bar, filter bar, outlet
    app.routes.ts               One route per category
```

## Swapping in real data

Replace the bodies in `DataService` and `FilterService` with calls to the Ezekia-backed API.
The view contracts (`Kpi`, `Chart`, `Table`, `Notice`, `ViewDef`) are the shapes each screen
expects, so the components don't need to change — only the source of the numbers.
