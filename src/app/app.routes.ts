import { Routes } from '@angular/router';
import { CrudListComponent } from './views/crud-list/crud-list.component';
import { CrudFormComponent } from './views/crud-form/crud-form.component';

export const routes: Routes = [
  { path: 'crud-list', component: CrudListComponent },
  { path: 'crud-form', component: CrudFormComponent },
  { path: 'crud-form/:id', component: CrudFormComponent },
  { path: 'crud-form/:id/:mode', component: CrudFormComponent },
  { path: ':id/:mode', component: CrudFormComponent },
  { path: '', redirectTo: '/crud-list', pathMatch: 'full' },
];
