import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../models/user.model';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    loginForm : FormGroup;

    constructor(
        private http : HttpClient,
        private router : Router,
        private fb : FormBuilder
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        })
    }

    ngOnInit(): void {
        const token = localStorage.getItem('knowledge_platform_token');
        if(token){
            this.router.navigate(['/']);
        }
    }

    onSubmit() : void {
        if (this.loginForm.valid) {

            const formData : LoginRequest = this.loginForm.value;

            this.http.post<LoginResponse>(`${environment.apiUrl}/login`, formData).subscribe({
                next : (response) => {
                    localStorage.setItem('knowledge_platform_token', response.token);
                    this.router.navigate(['/']);
                },
                error : (error) => {
                    console.error('Erreur de connexion', error);
                }
            });
        }
    }

    get email () { return this.loginForm.get(`email`); }
    get password () { return this.loginForm.get(`password`); }
}