import { Routes } from '@angular/router';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { EvaluationAdminComponent } from './evaluation-admin/evaluation-admin.component';
import { EvaluationAdminDetailComponent } from './evaluation-admin/evaluation-admin-detail/evaluation-admin-detail.component';
import { LoginComponent } from './core/components/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: '',
    component: EvaluationComponent,
    title: 'Evaluation',
  },
  {
    path: 'admin',
    component: EvaluationAdminComponent,
    title: 'Administration',
  },
  {
    path: 'admin/detail/:id',
    component: EvaluationAdminDetailComponent,
    title: 'Evaluation details',
  },
];
