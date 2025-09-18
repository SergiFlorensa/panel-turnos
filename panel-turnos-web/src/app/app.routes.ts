import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: SidebarComponent,
    children: [
      { path: '', component: DashboardComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
