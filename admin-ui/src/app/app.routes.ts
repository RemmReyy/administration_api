import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SalesmenComponent } from './features/salesmen/salesmen.component';
import { PerformanceComponent } from './features/performance/performance.component';
import { BonusComponent } from './features/bonus/bonus.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'salesmen', component: SalesmenComponent, title: 'Salesmen' },
  { path: 'performance', component: PerformanceComponent, title: 'Performance' },
  { path: 'bonus', component: BonusComponent, title: 'HR Bonus' },
];
