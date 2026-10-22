import { Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview.component';
import { CategoryPageComponent } from './pages/category-page.component';
import { CATEGORIES } from './core/nav';

export const routes: Routes = [
  { path: '', component: OverviewComponent },
  ...CATEGORIES.filter((c) => c.path).map((c) => ({ path: c.path, component: CategoryPageComponent, data: { path: c.path } })),
  { path: '**', redirectTo: '' },
];
