import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MeResponse {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        isVerified: boolean;
    };
    enrollmentCursuses: any[];
    enrollmentLessons: any[];
    themes: any[];
    certifications: any[];
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    checkAdminRole(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const token = this.getToken();
            if (!token) {
                this.router.navigate(['/login']);
                resolve(false);
                return;
            }

            this.http.get<MeResponse>(`${environment.apiUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).subscribe({
                next: (response) => {
                    const userRole = response.user?.role;
                    const isAdmin = userRole === 'admin';
                    
                    if (!isAdmin) {
                        this.router.navigate(['/']);
                        resolve(false);
                        return;
                    }
                    
                    this.currentUserSubject.next(response.user);
                    resolve(true);
                },
                error: (error) => {
                    console.error('Erreur vérification admin:', error);
                    this.router.navigate(['/login']);
                    resolve(false);
                }
            });
        });
    }

    getToken(): string | null {
        return localStorage.getItem('knowledge_platform_token');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp && payload.exp < currentTime) {
                this.logout();
                return false;
            }
            
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    isAdmin(): boolean {
        const user = this.currentUserSubject.value;
        return user?.role === 'admin';
    }

    logout(): void {
        localStorage.removeItem('knowledge_platform_token');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

}
