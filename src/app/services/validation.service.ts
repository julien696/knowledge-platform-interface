import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private userService: UserService) {}

    validateLesson(lessonId: number): Observable<any> {
        const token = localStorage.getItem('knowledge_platform_token');
        
        return this.http.post(`${this.apiUrl}/lesson/${lessonId}/validate`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    validateLessonAndRedirect(lessonId: number | undefined): void {
        if (lessonId) {
            this.validateLesson(lessonId).subscribe({
                next: (response) => {
                    alert('Leçon validée !');
                    this.userService.loadCurrentUser().then(() => {
                        window.location.href = '/profil';
                    });
                },
                error: (error) => {
                    alert('Erreur de validation');
                }
            });
        }
    }

    validateLessonInCursus(lessonId: number | undefined, currentIndex: number, totalLessons: number, onNext: () => void): void {
        if (lessonId) {
            this.validateLesson(lessonId).subscribe({
                next: (response) => {
                    alert('Leçon validée !');
                    this.userService.loadCurrentUser().then(() => {
                        if (currentIndex === totalLessons - 1) {
                            alert('Cursus terminé !');
                            setTimeout(() => {
                                window.location.href = '/profil';
                            }, 1000);
                        } else {
                            onNext();
                        }
                    });
                },
                error: (error) => {
                    alert('Erreur de validation');
                }
            });
        }
    }
}
