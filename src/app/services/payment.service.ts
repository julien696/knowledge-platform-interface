import { Injectable } from "@angular/core";
import { OrderItem } from "../models/order-item.model";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Order } from "../models/order.model";


export interface CreateOrderRequest {
    items: OrderItem[];
    user?: string;
}

export interface StripeSessionRequest {
    orderId: number;
    items?: any[];
}

export interface StripeSessionResponse {
    url: string;
}

export interface AccessCheckResponse {
    hasAccess: boolean;
    reason?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    createOrder(amount: number, cursusId?: number, lessonId?: number): Observable<{orderId: number}> {
        const payload: any = { 
            amount: amount
        };
        
        if (cursusId) {
            payload.cursusId = cursusId;
        }
        if (lessonId) {
            payload.lessonId = lessonId;
        }
        
        return this.http.post<{orderId: number}>(`${this.apiUrl}/create-order`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    createStripeSession(orderId: number): Observable<StripeSessionResponse> {
        const payload = { orderId };
        return this.http.post<StripeSessionResponse>(`${this.apiUrl}/stripe/create-checkout-session`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    confirmPayment(orderId: number): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}/orders/${orderId}/confirm-payment`, {});
        
    }

    checkLessonAccess(lessonId: number): Observable<AccessCheckResponse> {
        return this.http.get<AccessCheckResponse>(`${this.apiUrl}/check-access/lesson/${lessonId}`);
    }

    checkCursusAccess(cursusId: number): Observable<AccessCheckResponse> {
        return this.http.get<AccessCheckResponse>(`${this.apiUrl}/check-access/cursus/${cursusId}`);
    }
}