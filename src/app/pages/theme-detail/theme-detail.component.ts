import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Theme } from '../../models/theme.model';
import { Cursus } from '../../models/cursus.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';

@Component({
    selector: 'app-theme-detail',
    imports: [CommonModule, RouterModule],
    templateUrl: './theme-detail.component.html',
    styleUrl: './theme-detail.component.css'
})
export class ThemeDetailComponent implements OnInit {
    theme: Theme | null = null;
    cursus: Cursus[] = [];
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private authService: AuthService,
        private router: Router,
        private paymentService: PaymentService
    ) {}

    ngOnInit(): void {
        const themeId = this.route.snapshot.paramMap.get('id');

        if (themeId) {
            this.loadThemeData(themeId);
        }
    }

    loadThemeData(themeId: string): void {
        this.http.get<Theme>(`${environment.apiUrl}/themes/${themeId}?groups[]=theme:read&groups[]=cursus:read&groups[]=lesson:read`).subscribe({
            next: (response) => {
                this.theme = response;
                this.cursus = (response as any).cursuses || [];
            },
            error: (error) => {
                this.error = 'Erreur lors du chargement du thème';
            }
        });
    }


    getThemeImage(): string {
        if (this.theme?.imageName) {
            return `${environment.apiUrl.replace('/api', '')}/uploads/img/${this.theme.imageName}`;
        }
        return '';
    }

    buyCursus(cursus: any): void {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }
        
        this.authService.canPurchaseAsync().then((canPurchase) => {
            if (!canPurchase) {
                alert('Veuillez vérifier votre compte avant de pouvoir acheter du contenu.');
                return;
            }

            const amount = parseFloat(cursus.price.toString());
            
            this.paymentService.createOrder(amount, cursus.id).subscribe({
                next: (response) => {
                    localStorage.setItem('lastOrderId', response.orderId.toString());
                    
                    this.paymentService.createStripeSession(response.orderId).subscribe({
                        next: (session) => {
                            window.location.href = session.url;
                        },
                        error: (error) => {
                            this.error = 'Erreur lors de la création de la session de paiement';
                        }        
                    })
                },
                error: (error) => {
                    this.handleOrderError(error);
                }
            });
        });
    }

    buyLesson(lesson: any): void {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }

        this.authService.canPurchaseAsync().then((canPurchase) => {
            if (!canPurchase) {
                alert('Veuillez vérifier votre compte avant de pouvoir acheter du contenu.');
                return;
            }

            const amount = parseFloat(lesson.price.toString());
            
            this.paymentService.createOrder(amount, undefined, lesson.id).subscribe({
                next: (response) => {
                    localStorage.setItem('lastOrderId', response.orderId.toString());
                    
                    this.paymentService.createStripeSession(response.orderId).subscribe({
                        next: (session) => {
                            window.location.href = session.url;
                        },
                        error: (error) => {
                            this.error = 'Erreur lors de la création de la session de paiement';
                        }
                    });
                },
                error: (error) => {
                    this.handleOrderError(error);
                }
            });
        });
    }

    private handleOrderError(error: any): void {
        console.error('Erreur commande:', error);
        
        const errorMessage = error?.error?.error || error?.error?.detail || 'Erreur lors de la création de la commande';
        
        this.error = errorMessage;
        
        alert(errorMessage);
        
        setTimeout(() => {
            this.router.navigate(['/']);
        }, 2000);
    }
}

