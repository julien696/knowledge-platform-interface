import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-confirmation-account',
    imports: [CommonModule],
    templateUrl: './confirmation-account.component.html',
    styleUrl: './confirmation-account.component.css'
})
export class ConfirmationAccountComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient
    ) {}

    ngOnInit(): void {
        console.log('Confirmation component loaded');
        const token = this.route.snapshot.paramMap.get('token');
        console.log('Token from route paramMap:', token);

        if (token) {
            this.http.get(`${environment.apiUrl}/confirm/${token}`).subscribe({
                next: (res) => {
                    console.log('Réponse du back-end:', res);
                },
                error: (err) => {
                    console.error('Erreur lors de la confirmation:', err);
                }
            })
        }
    }

    goToHome(): void {
        this.router.navigate(['/']);
    }
}
