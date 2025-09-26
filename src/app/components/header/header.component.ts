import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {}

    get isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    get currentUser(): User | null {
        return this.userService.getCurrentUser();
    }

    logout(): void {
        this.authService.logout();
    }

    goToThemes(): void {
        this.router.navigate(['/'], { fragment: 'themes' });
    }
}
