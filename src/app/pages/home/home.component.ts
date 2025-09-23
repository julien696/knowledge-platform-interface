import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Theme, ThemeApiResponse } from '../../models/theme.model';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  themes : Theme[] = [];
  title : string = 'Knowledge Platform';
  lessons : Lesson[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadThemes();
    this.loadLessons();
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

  loadLessons(): void {
    this.http.get<any>(`${environment.apiUrl}/admin/lesson`).subscribe({
      next: (response) => {
        console.log(' Réponse API des leçons (admin):', response);
        
        this.lessons = response.member || response;
        
        console.log(' Leçons récupérées:', this.lessons);
        console.log(' Nombre de leçons:', this.lessons.length);
        
        this.lessons.forEach((lesson, index) => {
          console.log(` Leçon ${index + 1}:`, {
            id: lesson.id,
            name: lesson.name,
            videoName: lesson.videoName,
            hasVideo: !!lesson.videoName,
            description: lesson.description
          });
        });
      },
      error: (error) => {
        console.error(' Erreur du chargement des leçons:', error);
      }
    });
  }

  getThemeImage(theme: Theme): string {
    if (theme.imageName) {
      const imageFile  = `${environment.apiUrl.replace('/api', '')}/uploads/img/${theme.imageName}`;
      return imageFile;
    }
    return '';
  }

  goToTheme(themeId: number): void {
    console.log('Navigation vers le thème:', themeId);
  }
}
