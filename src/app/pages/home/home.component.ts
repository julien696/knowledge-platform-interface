import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Theme, ThemeApiResponse } from '../../models/theme.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../services/payment.service';

@Component({
    selector: 'app-home',
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    themes : Theme[] = [];
    title : string = 'Knowledge Platform';

    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthService,
        private paymentService: PaymentService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.loadThemes();

        if (this.router.url.includes('/payment/success')) {
            this.handlePaymentSuccess();
            this.router.navigate(['/'], { replaceUrl: true });
        }
    }

    loadThemes(): void {
        this.http.get<ThemeApiResponse>(`${environment.apiUrl}/themes`).subscribe({
            next: (response) => {
                this.themes = response.member;
            },
            error : (error) => {
                console.error('Erreur du chargement de thème', error);
            } 
        })
    }

    getThemeImage(theme: Theme): string {
        if (theme.imageName) {
            const imageFile  = `${environment.apiUrl.replace('/api', '')}/uploads/img/${theme.imageName}`;
            return imageFile;
        }
        return '';
    }

    goToTheme(themeId: number): void {
        this.router.navigate(['/theme', themeId]);
    }

    handlePaymentSuccess(): void {
        const lastOrderId = localStorage.getItem('lastOrderId');
        
        if (lastOrderId) {
            this.paymentService.confirmPayment(parseInt(lastOrderId)).subscribe({
                next: () => {
                    this.userService.loadCurrentUser();
                    alert('Paiement confirmé ! Regardez votre profil pour accéder à vos cours.');
                },
                error: () => {
                    this.userService.loadCurrentUser();
                    alert('Paiement confirmé ! Regardez votre profil pour accéder à vos cours.');
                }
            });
        }
    }
}
