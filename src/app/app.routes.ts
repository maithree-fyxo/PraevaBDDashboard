import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview.component';
import { BdSummaryComponent } from './pages/bd-summary.component';
import { CategoryPageComponent } from './pages/category-page.component';
import { BudgetInputComponent } from './pages/budget-input.component';
import { UserManagementComponent } from './pages/user-management.component';
import { CATEGORIES } from './core/nav';
import { RoleService } from './core/role.service';

const allowed = (path: string) => () => inject(RoleService).canSee(path) || inject(Router).createUrlTree(['/']);

const SPECIAL: Record<string, any> = { 'bd': BdSummaryComponent, 'admin/budget': BudgetInputComponent, 'admin/users': UserManagementComponent };

export const routes: Routes = [
  { path: '', component: OverviewComponent },
  ...CATEGORIES.filter((c) => c.path).map((c) => ({
    path: c.path, component: SPECIAL[c.path] ?? CategoryPageComponent, data: { path: c.path }, canActivate: [allowed(c.path)],
  })),
  { path: '**', redirectTo: '' },
];
