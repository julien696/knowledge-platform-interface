import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Theme } from '../../../models/theme.model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-admin-cursus-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './admin-cursus-form.component.html',
    styleUrl: './admin-cursus-form.component.css'
})
export class AdminCursusFormComponent implements OnInit {
    cursusForm: FormGroup;
    isEditMode = false;
    cursusId: number | null = null;
    error: string | null = null;
    themes: Theme[] = [];

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        public router: Router,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        this.cursusForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            price: ['', [Validators.required, Validators.min(0)]],
            theme: ['', [Validators.required]]
        });
    }

    async ngOnInit(): Promise<void> {
        const isAdmin = await this.authService.checkAdminRole();
        if (!isAdmin) return;

        this.loadThemes();
        
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.cursusId = +params['id'];
                this.loadCursus();
            }
        });
    }

    loadThemes(): void {
        this.http.get(`${environment.apiUrl}/themes`).subscribe({
            next: (response: any) => {
                this.themes = response.member || response;
            },
            error: (error) => {
                console.error('Erreur chargement thèmes:', error);
            }
        });
    }

    loadCursus(): void {
        if (this.cursusId) {
            this.http.get<any>(`${environment.apiUrl}/cursus/${this.cursusId}`).subscribe({
                next: (cursusData) => {
                    this.cursusForm.patchValue({
                        name: cursusData.name,
                        price: cursusData.price,
                        theme: cursusData.theme?.id || ''
                    });
                },
                error: (error) => {
                    this.error = 'Erreur lors du chargement du cursus';
                }
            });
        }
    }

    onSubmit(): void {
        if (this.cursusForm.valid) {
            this.error = null;

            const formData = this.cursusForm.value;
            
            if (formData.theme) {
                formData.theme = `/api/themes/${formData.theme}`;
            } else {
                delete formData.theme;
            }

            if (this.isEditMode) {
                this.http.put(`${environment.apiUrl}/cursus/${this.cursusId}`, formData, {
                    headers: {
                        'Content-Type': 'application/ld+json'
                    }
                }).subscribe({
                    next: () => {
                        this.router.navigate(['/admin']);
                    },
                    error: (error) => {
                        this.error = 'Erreur lors de la modification du cursus';
                    }
                });
            } else {
                this.http.post(`${environment.apiUrl}/cursus`, formData, {
                    headers: {
                        'Content-Type': 'application/ld+json'
                    }
                }).subscribe({
                    next: () => {
                        this.router.navigate(['/admin']);
                    },
                    error: (error) => {
                        this.error = 'Erreur lors de la création du cursus';
                    }
                });
            }
        }
    }

    get name() { return this.cursusForm.get('name'); }
    get price() { return this.cursusForm.get('price'); }
    get theme() { return this.cursusForm.get('theme'); }
}