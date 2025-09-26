import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, RouterModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
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
    
    this.userService.loadCurrentUser();
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
        
        const allLessons = response.enrollmentLessons || [];
        this.enrollmentsLessons = allLessons.filter((enrollment: any) => {
            return !enrollment.lesson?.cursus;
        });
    }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  goToCursus(cursusId: number): void {
    if (cursusId) {
      this.router.navigate(['/cursus', cursusId]);
    }
  }

  goToLesson(lessonId: number): void {
    if (lessonId) {
      this.router.navigate(['/lesson', lessonId]);
    }
  }

}
