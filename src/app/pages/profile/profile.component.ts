import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  orders: Order[] = []; 
  enrollmentsCursuses: any[] = [];
  enrollmentsLessons: any[] = [];
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.loadCurrentUser().then((response) => {
      if (response) {
        this.user = response;
        this.loadUserEnrollments(response);
      }
    });
    
    this.loadUserOrders();
  }

  loadUserOrders(): void {
    this.userService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders || [];
      },
      error: (error) => {
        this.error = 'erreur lors du chargement des commandes';
        this.orders = []; 
      }
    });
  }

  loadUserEnrollments(response: any): void {
    this.enrollmentsCursuses = response.enrollmentCursuses || [];
    this.enrollmentsLessons = response.enrollmentLessons || [];
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  goToCursus(cursusId: number): void {
    this.router.navigate(['/cursus', cursusId]);
  }

  goToLesson(lessonId: number): void {
    this.router.navigate(['/lesson', lessonId]);
  }
}
