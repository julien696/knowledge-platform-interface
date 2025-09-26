import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterSuccessComponent } from './pages/register-success/register-success.component';
import { ConfirmationAccountComponent } from './pages/confirmation-account/confirmation-account.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminUserFormComponent } from './pages/admin/admin-user-form/admin-user-form.component';
import { AdminCursusFormComponent } from './pages/admin/admin-cursus-form/admin-cursus-form.component';
import { AdminLessonFormComponent } from './pages/admin/admin-lesson-form/admin-lesson-form.component';
import { ThemeDetailComponent } from './pages/theme-detail/theme-detail.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { CursusDetailComponent } from './pages/cursus-detail/cursus-detail.component';
import { LessonDetailComponent } from './pages/lesson-detail/lesson-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'register-success', component: RegisterSuccessComponent },
    { path: 'confirm-account', component: ConfirmationAccountComponent },
    { path: 'admin', component: AdminDashboardComponent },
    { path: 'admin/users/create', component: AdminUserFormComponent },
    { path: 'admin/users/:id/edit', component: AdminUserFormComponent },
    { path: 'admin/cursus/create', component: AdminCursusFormComponent },
    { path: 'admin/cursus/:id/edit', component: AdminCursusFormComponent },
    { path: 'admin/lessons/create', component: AdminLessonFormComponent },
    { path: 'admin/lessons/:id/edit', component: AdminLessonFormComponent },
    { path: 'theme/:id', component: ThemeDetailComponent },
    { path: 'payment/success', component: HomeComponent },
    { path: 'profil', component: ProfilComponent },
    { path: 'cursus/:id', component : CursusDetailComponent },
    { path: 'lesson/:id', component : LessonDetailComponent }
];
