import { Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview.component';
import { CategoryPageComponent } from './pages/category-page.component';

export const routes: Routes = [
  { path: '', component: OverviewComponent },
  { path: 'meeting-activity', component: CategoryPageComponent, data: { path: 'meeting-activity' } },
  { path: 'follow-up-outcomes', component: CategoryPageComponent, data: { path: 'follow-up-outcomes' } },
  { path: 'pipeline', component: CategoryPageComponent, data: { path: 'pipeline' } },
  { path: 'views', component: CategoryPageComponent, data: { path: 'views' } },
  { path: '**', redirectTo: '' },
];
