import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-confirmation-account',
    imports: [CommonModule],
    templateUrl: './confirmation-account.component.html',
    styleUrl: './confirmation-account.component.css'
})
export class ConfirmationAccountComponent {

    constructor(private router: Router) {}

    goToHome(): void {
        this.router.navigate(['/']);
    }
}
