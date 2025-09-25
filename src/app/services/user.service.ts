import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Order } from '../models/order.model';

export interface MeResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    enrollmentCursuses: any[];
    enrollmentLessons: any[];
    orders: any[];
    themes: any[];
    certifications: any[];
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    public error: string | null = null;

    constructor(private http: HttpClient) {}

    getUserOrders(): Observable<Order[]> {
        return this.http.get<any>(`${this.apiUrl}/my/orders`).pipe(
            map(response => response.member || [])
        );
    }

    getOrder(orderId: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/my/orders/${orderId}`);
    }

    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    loadCurrentUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('knowledge_platform_token');
            if (!token) {
                resolve(null);
                return;
            }

            this.http.get<MeResponse>(`${environment.apiUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).subscribe({
                next: (response) => {
                    this.currentUserSubject.next(response);
                    resolve(response);
                },
                error: (error) => {
                    this.error = 'Erreur chargement utilisateur';
                    resolve(null);
                }
            });
        });
    }

    initializeUser(): void {   
        this.loadCurrentUser();
    }
}