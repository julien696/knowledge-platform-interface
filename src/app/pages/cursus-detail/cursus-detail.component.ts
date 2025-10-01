import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';
import { Cursus } from '../../models/cursus.model';
import { Lesson } from '../../models/lesson.model';

@Component({
    selector: 'app-cursus',
    imports: [CommonModule, RouterModule],
    templateUrl: './cursus-detail.component.html',
    styleUrl: './cursus-detail.component.css'
})
export class CursusDetailComponent implements OnInit {
    cursus: Cursus | null = null;
    currentLessonIndex = 0;
    currentLesson: Lesson | null = null;
    hasAccess = false;
    isValidationInProgress = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private userService: UserService,
        private authService: AuthService,
        private validationService: ValidationService
    ) {}

    ngOnInit(): void {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }

        const cursusId = this.route.snapshot.paramMap.get('id');
        if (cursusId) {
            this.userService.loadCurrentUser().then(() => {
                this.loadCursus(parseInt(cursusId));
            });
        }
    }

    loadCursus(cursusId: number): void {
        this.http.get(`${environment.apiUrl}/cursus/${cursusId}`).subscribe({
            next: (cursus: any) => {
                this.cursus = cursus;
                this.hasAccess = this.userService.hasAccessToCursus(cursusId);
                
                if (this.hasAccess) {
                    this.loadCursusContent(cursusId);
                }
            },
            error: (error) => {
            }
        });
    }

    loadCursusContent(cursusId: number): void {
        this.http.get(`${environment.apiUrl}/cursus/${cursusId}/content`).subscribe({
            next: (content: any) => {
                console.log('Contenu reçu:', content);
                if (this.cursus) {
                    this.cursus.lessons = content.lessons || content;
                    console.log('Lessons assignées:', this.cursus.lessons);
                }
                
                if (this.cursus?.lessons && this.cursus.lessons.length > 0) {
                    this.currentLesson = this.cursus.lessons[this.currentLessonIndex];
                    console.log('Current lesson:', this.currentLesson);
                }
            },
            error: (error) => {
                console.error('Erreur contenu:', error);
            }
        });
    }

    goToNextLesson(): void {
        if (this.cursus?.lessons && this.currentLessonIndex < this.cursus.lessons.length - 1) {
            this.currentLessonIndex++;
            this.currentLesson = this.cursus.lessons[this.currentLessonIndex];
        }
    }

    goToPreviousLesson(): void {
        if (this.cursus?.lessons && this.currentLessonIndex > 0) {
            this.currentLessonIndex--;
            this.currentLesson = this.cursus.lessons[this.currentLessonIndex];
        }
    }

    validateLesson(): void {
        const lessonUrl = (this.currentLesson as any)['@id'];
        if (lessonUrl) {
            const lessonId = parseInt(lessonUrl.split('/').pop() || '0');
            
            this.validationService.validateLessonInCursus(lessonId, this.currentLessonIndex, this.cursus?.lessons?.length || 0, () => {
                this.goToNextLesson();
            });
        }
    }

    getVideoUrl(videoUrl: string | undefined): string {
        if (!videoUrl) return '';
        if (videoUrl.startsWith('/')) {
            return `${environment.apiUrl.replace('/api', '')}${videoUrl}`;
        }
        return videoUrl;
    }

    goToPurchase(): void {
        this.router.navigate(['/profil']);
    }
}
