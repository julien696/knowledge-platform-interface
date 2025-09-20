import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterSuccessComponent } from './pages/register-success/register-success.component';
import { ConfirmationAccountComponent } from './pages/confirmation-account/confirmation-account.component';

export const routes: Routes = [
    { path : '', component : HomeComponent },
    { path : 'login', component : LoginComponent },
    { path : 'register', component : RegisterComponent },
    { path : 'register-success', component : RegisterSuccessComponent },
    { path : 'confirm-account', component : ConfirmationAccountComponent },
];
