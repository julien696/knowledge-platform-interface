import { Component, OnInit } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { Cursus } from '../../models/cursus.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lesson-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.css'
})
export class LessonDetailComponent implements OnInit {
  lesson: Lesson | null = null;
  cursus: Cursus | null = null;
  hasAcces = false;
  error: string | null = null;
  lessonId: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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

        const lessonId = this.route.snapshot.paramMap.get('id');
        if (lessonId) {
            this.userService.loadCurrentUser().then(() => {
                this.loadLesson(parseInt(lessonId));
                this.lessonId = parseInt(lessonId);
            });
        }
    }

    loadLesson(lessonId: number): void {
        this.http.get<Lesson>(`${environment.apiUrl}/lesson/${lessonId}/content`).subscribe({
            next: (lesson: any) => {
                this.lesson = lesson;
                this.checkAccess();
            },
            error: (error) => {
                console.error('Error loading lesson:', error);
            }
        });
    }

    checkAccess(): void {
        this.hasAcces = this.userService.hasAccessToLesson(this.lessonId);
        
        if (!this.hasAcces) {
            this.router.navigate(['/profil']);
        }
    }

    validateLesson(): void {
        this.validationService.validateLessonAndRedirect(this.lessonId);
    }

    getVideoUrl(videoUrl: string | undefined): string {
        if (!videoUrl) return '';
        if (videoUrl.startsWith('/')) {
            return `${environment.apiUrl.replace('/api', '')}${videoUrl}`;
        }
        return videoUrl;
    }

    goToProfil(): void {
        this.router.navigate(['/profil']);
    }
}  
