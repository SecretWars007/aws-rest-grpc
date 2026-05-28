import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { TransferComponent } from './pages/transfer/transfer';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'yapear', component: TransferComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

