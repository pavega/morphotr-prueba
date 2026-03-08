import { Routes } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';
import { InvoiceComponent } from './features/invoice/invoice.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'invoices', pathMatch: 'full' },
      { path: 'invoices', component: InvoiceComponent },
    ],
  },
];
