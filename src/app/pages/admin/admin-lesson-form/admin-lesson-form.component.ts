import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Cursus } from '../../../models/cursus.model';
import { AuthService } from '../../../services/auth.service';
import { Lesson } from '../../../models/lesson.model';

@Component({
    selector: 'app-admin-lesson-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './admin-lesson-form.component.html',
    styleUrl: './admin-lesson-form.component.css'
})
export class AdminLessonFormComponent implements OnInit {
    lessonForm: FormGroup;
    isEditMode = false;
    lessonId: number | null = null;
    error: string | null = null;
    cursusList: Cursus[] = [];

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        public router: Router,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        this.lessonForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            price: ['', [Validators.required, Validators.min(0)]],
            videoUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
            cursus: ['']  
        });
    }

    async ngOnInit(): Promise<void> {
        const isAdmin = await this.authService.checkAdminRole();
        if (!isAdmin) return;

        this.loadCursus();
        
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.lessonId = +params['id'];
                this.loadLesson();
            }
        });
    }

    loadCursus(): void {
        this.http.get(`${environment.apiUrl}/cursus`).subscribe({
            next: (response: any) => {
                this.cursusList = response.member || response;
            },
            error: (error) => {
                this.error = 'Erreur lors du chargement des cursus';
            }
        });
    }

    loadLesson(): void {
        if (this.lessonId) {
            this.http.get<Lesson>(`${environment.apiUrl}/lesson/${this.lessonId}`).subscribe({
                next: (lessonData) => {
                    this.lessonForm.patchValue({
                        name: lessonData.name,
                        description: lessonData.description,
                        price: lessonData.price,
                        videoUrl: lessonData.videoUrl,
                        cursus: lessonData.cursus?.id || ''
                    });
                },
                error: (error) => {
                    this.error = 'Erreur lors du chargement de la leçon';
                }
            });
        }
    }


    onSubmit(): void {
        if (this.lessonForm.valid) {
            this.error = null;

            const lessonData = {
                name: this.lessonForm.value.name,
                description: this.lessonForm.value.description,
                price: this.lessonForm.value.price,
                videoUrl: this.lessonForm.value.videoUrl,
                cursus: this.lessonForm.value.cursus ? `/api/cursus/${this.lessonForm.value.cursus}` : null
            };

            if (this.isEditMode) {
                this.http.put(`${environment.apiUrl}/lesson/${this.lessonId}`, lessonData, {
                    headers: {
                        'Content-Type': 'application/ld+json'
                    }
                }).subscribe({
                    next: () => {
                        this.router.navigate(['/admin']);
                    },
                    error: (error) => {
                        this.error = 'Erreur lors de la modification de la leçon';
                    }
                });
            } else {
                this.http.post(`${environment.apiUrl}/lesson`, lessonData, {
                    headers: {
                        'Content-Type': 'application/ld+json'
                    }
                }).subscribe({
                    next: () => {
                        this.router.navigate(['/admin']);
                    },
                    error: (error) => {
                        this.error = 'Erreur lors de la création de la leçon';
                    }
                });
            }
        }
    }

    get name() { return this.lessonForm.get('name'); }
    get description() { return this.lessonForm.get('description'); }
    get price() { return this.lessonForm.get('price'); }
    get videoUrl() { return this.lessonForm.get('videoUrl'); }
    get cursus() { return this.lessonForm.get('cursus'); }
}