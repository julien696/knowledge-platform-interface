import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { RegisterRequest, RegisterResponse } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm : FormGroup;
  
  constructor(
    private fb : FormBuilder,
    private http : HttpClient,
    private router : Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      plainPassword: ['', [Validators.required, Validators.minLength(6)]] 
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('knowledge_platform_token');
    if (token) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {

      const formData : RegisterRequest = this.registerForm.value;

      this.http.post<RegisterResponse>(`${environment.apiUrl}/register`, formData, {
        headers: {
          'Content-Type': 'application/ld+json'
        }
      }).subscribe({
        next : (response) => {
        this.router.navigate(['/register-success']);
      },
      error : (error) => {
        console.error('Erreur d\'inscription', error);
      }
      });
    }
  }

  get name () { return this.registerForm.get(`name`); }
  get email () { return this.registerForm.get(`email`); }
  get plainPassword () { return this.registerForm.get(`plainPassword`); }
}
