import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public error: string | null = null;

    constructor(
        private http: HttpClient,
        private router: Router,
        private userService: UserService
    ) {
        if (this.isAuthenticated()) {
            this.userService.initializeUser();
        }
    }

    checkAdminRole(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const token = this.getToken();
            if (!token) {
                this.router.navigate(['/login']);
                resolve(false);
                return;
            }

            this.userService.loadCurrentUser().then((response) => {
                const userRole = response?.role;
                const isAdmin = userRole === 'admin';
                
                if (!isAdmin) {
                    this.router.navigate(['/']);
                    resolve(false);
                    return;
                }
                
                resolve(true);
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
        const user = this.userService.getCurrentUser();
        return user?.role === 'admin';
    }

    logout(): void {
        localStorage.removeItem('knowledge_platform_token');
        this.router.navigate(['/login']);
    }

    canPurchaseAsync(): Promise<boolean> {
        return new Promise((resolve) => {
            if (!this.isAuthenticated()) {
                resolve(false);
                return;
            }

            this.userService.loadCurrentUser().then((response) => {
                const isVerified = response?.verified === true ;
                
                resolve(isVerified);
            });
        });
    }
}
