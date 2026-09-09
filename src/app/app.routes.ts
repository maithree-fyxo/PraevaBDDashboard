import { Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview.component';
import { ViewPageComponent } from './pages/view-page.component';

const view = (key: string) => ({ path: key, component: ViewPageComponent, data: { key } });

export const routes: Routes = [
  { path: '', component: OverviewComponent },
  view('originator'), view('attendees'), view('roles'), view('sectors'),
  view('follow-up'), view('no-activity'), view('effectiveness'), view('leads'),
  view('pipeline'), view('active'), view('days-in-stage'), view('dormant'), view('stale'),
  view('team'), view('individual'), view('sector-view'), view('company'),
  { path: '**', redirectTo: '' },
];
