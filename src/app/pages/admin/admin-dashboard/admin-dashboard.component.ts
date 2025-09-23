import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/user.model';
import { Cursus, CursusEnrollment } from '../../../models/cursus.model';
import { Lesson, LessonEnrollment } from '../../../models/lesson.model';
import { Order } from '../../../models/order.model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-admin-dashboard',
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
    users: User[] = [];
    cursus: Cursus[] = [];
    lessons: Lesson[] = [];
    orders: Order[] = [];
    cursusEnrollments: CursusEnrollment[] = [];
    lessonEnrollments: LessonEnrollment[] = [];
    themes: any[] = []; 

    selectedOrder: string = '';
    selectedCursusEnrollment: string = '';
    selectedLessonEnrollment: string = '';

    error: string | null = null;
    success: string | null = null;

    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}

    async ngOnInit(): Promise<void> {
        const isAdmin = await this.authService.checkAdminRole();
        if (isAdmin) {
            this.loadData();
        }
    }


    loadData(): void {
        this.loadUsers();
        this.loadThemes();
        this.loadCursus();
        this.loadLessons();
        this.loadOrders();
        this.loadCursusEnrollments();
        this.loadLessonEnrollments();
    }

    loadUsers(): void {
        this.http.get(`${environment.apiUrl}/admin/users`).subscribe({
            next: (response: any) => {
                this.users = response.member || response;
                this.error = null;
            },
            error: (error) => {
                this.error = 'Erreur lors du chargement des utilisateurs';
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
        this.http.get(`${environment.apiUrl}/cursus`).subscribe({
            next: (response: any) => {
                this.cursus = response.member || response;
            },
            error: (error) => {
                this.error = 'Erreur lors du chargement des cursus';
            }
        });
    }

    loadLessons(): void {
        this.http.get(`${environment.apiUrl}/lesson`).subscribe({
            next: (response: any) => {
                this.lessons = response.member || response;
            },
            error: (error) => {
                this.error = 'Erreur lors du chargement des leçons';
            }
        });
    }

    loadOrders(): void {
        this.http.get(`${environment.apiUrl}/orders`).subscribe({
            next: (response: any) => {
                this.orders = response.member || response;
            },
            error: (error) => {
                this.error = 'Erreur lors du chargement des commandes';
            }
        });
    }

    loadCursusEnrollments(): void {
        this.http.get(`${environment.apiUrl}/enrollment_cursuses`).subscribe({
            next: (response: any) => {
                this.cursusEnrollments = response.member || response;
            },
            error: (error) => {
                this.error = 'Erreur lors du chargement des inscriptions cursus';
            }
        });
    }

    loadLessonEnrollments(): void {
        this.http.get(`${environment.apiUrl}/enrollment_lessons`).subscribe({
            next: (response: any) => {
                this.lessonEnrollments = response.member || response;
            },
            error: (error) => {
                this.error = 'Erreur lors du chargement des inscriptions leçons';
            }
        });
    }

    addUser(): void {
        this.router.navigate(['/admin/users/create']);
    }

    editUser(user: User): void {
        this.router.navigate(['/admin/users', user.id, 'edit']);
    }

    deleteUser(user: User): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            this.http.delete(`${environment.apiUrl}/users/${user.id}`).subscribe({
                next: () => {
                    this.loadUsers();
                },
                error: (error) => {
                    this.error = 'Erreur lors de la suppression de l\'utilisateur';
                }
            });
        }
    }

    updateUserRole(user: User): void {
        this.http.put(`${environment.apiUrl}/admin/users/${user.id}`, user, {
            headers: {
                'Content-Type': 'application/ld+json'
            }
        }).subscribe({
            next: () => {
                this.error = null;
                this.success = `Rôle de ${user.name} mis à jour avec succès !`;
                
                setTimeout(() => {
                    this.success = null;
                }, 3000);
            },
            error: (error) => {
                this.error = 'Erreur lors de la mise à jour du rôle';
            }
        });
    }


    addCursus(): void {
        this.router.navigate(['/admin/cursus/create']);
    }

    editCursus(cursus: Cursus): void {
        this.router.navigate(['/admin/cursus', cursus.id, 'edit']);
    }

    deleteCursus(cursus: Cursus): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce cursus ?')) {
            this.http.delete(`${environment.apiUrl}/cursus/${cursus.id}`).subscribe({
                next: () => {
                    this.loadCursus();
                },
                error: (error) => {
                    this.error = 'Erreur lors de la suppression du cursus';
                }
            });
        }
    }

    addLesson(): void {
        this.router.navigate(['/admin/lessons/create']);
    }

    editLesson(lesson: Lesson): void {
        this.router.navigate(['/admin/lessons', lesson.id, 'edit']);
    }

    deleteLesson(lesson: Lesson): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
            this.http.delete(`${environment.apiUrl}/lesson/${lesson.id}`).subscribe({
                next: () => {
                    this.loadLessons();
                },
                error: (error) => {
                    this.error = 'Erreur lors de la suppression de la leçon';
                }
            });
        }
    }

    getThemeById(themeIri: any): string {
        if (!themeIri || themeIri === 'undefined') return 'Aucun thème';
        
        if (typeof themeIri === 'object' && themeIri.name) {
            return themeIri.name;
        }
        
        if (typeof themeIri === 'string') {
            const themeId = themeIri.split('/').pop();
            const theme = this.themes.find(t => t.id == themeId);
            return theme ? theme.name : `Thème ID ${themeId}`;
        }
        
        return 'Aucun thème';
    }

    getVideoUrl(videoName: string): string {
        return `${environment.apiUrl.replace('/api', '')}/uploads/videos/${videoName}`;
    }
}