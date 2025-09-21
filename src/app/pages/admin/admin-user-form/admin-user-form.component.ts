import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
    selector: 'app-admin-user-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './admin-user-form.component.html',
    styleUrl: './admin-user-form.component.css'
})
export class AdminUserFormComponent implements OnInit {
    userForm: FormGroup;
    isEditMode = false;
    userId: number | null = null;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        public router: Router,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        this.userForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            role: ['ROLE_USER', [Validators.required]],
            plainPassword: ['', [Validators.minLength(6)]]
        });
    }

    async ngOnInit(): Promise<void> {
        const isAdmin = await this.authService.checkAdminRole();
        if (!isAdmin) return;

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.userId = +params['id'];
                this.loadUser();
            }
        });
    }

    loadUser(): void {
        if (this.userId) {
            this.http.get<User>(`${environment.apiUrl}/admin/users/${this.userId}`).subscribe({
                next: (user) => {
                    this.userForm.patchValue({
                        name: user.name,
                        email: user.email,
                        role: user.role
                    });
                },
                error: (error) => {
                    this.error = 'Erreur lors du chargement de l\'utilisateur';
                }
            });
        }
    }

    onSubmit(): void {
        if (this.userForm.valid) {
            this.error = null;

            const formData = this.userForm.value;
            
            if (this.isEditMode && !formData.plainPassword) {
                delete formData.plainPassword;
            }

            if (this.isEditMode) {
                this.http.put(`${environment.apiUrl}/admin/users/${this.userId}`, formData, {
                    headers: {
                        'Content-Type': 'application/ld+json'
                    }
                }).subscribe({
                    next: () => {
                        this.router.navigate(['/admin']);
                    },
                    error: (error) => {
                        this.error = 'Erreur lors de la modification de l\'utilisateur';
                    }
                });
            } else {
                this.http.post(`${environment.apiUrl}/admin/users`, formData, {
                    headers: {
                        'Content-Type': 'application/ld+json'
                    }
                }).subscribe({
                    next: () => {
                        this.router.navigate(['/admin']);
                    },
                    error: (error) => {
                        this.error = 'Erreur lors de la création de l\'utilisateur';
                    }
                });
            }
        }
    }

    get name() { return this.userForm.get('name'); }
    get email() { return this.userForm.get('email'); }
    get role() { return this.userForm.get('role'); }
    get plainPassword() { return this.userForm.get('plainPassword'); }
}