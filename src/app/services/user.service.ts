import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getUserOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/my/orders`);
    }

    getOrder(orderId: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/my/orders/${orderId}`);
    }
}