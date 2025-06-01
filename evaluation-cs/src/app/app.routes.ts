import { Routes } from '@angular/router';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { EvaluationAdminComponent } from './evaluation-admin/evaluation-admin.component';
import { EvaluationAdminDetailComponent } from './evaluation-admin/evaluation-admin-detail/evaluation-admin-detail.component';
import { LoginComponent } from './core/components/login/login.component';
import { AuthorizationGuard } from './core/guards/authorization.guard';

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
    canActivate: [AuthorizationGuard],
  },
  {
    path: 'admin/detail/:id',
    component: EvaluationAdminDetailComponent,
    title: 'Evaluation details',
    canActivate: [AuthorizationGuard],
  },
];
