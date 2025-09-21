import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Theme, ThemeApiResponse } from '../../models/theme.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  themes : Theme[] = [];
  title : string = 'Knowledge Platform'

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadThemes();
  }

  loadThemes(): void {
    this.http.get<ThemeApiResponse>(`${environment.apiUrl}/themes`).subscribe({
      next: (response) => {
        this.themes = response.member;
      },
      error : (error) => {
        console.error('Erreur du chargement de théme', error);
      } 
    })
  }

  getThemeImage(themeName : string) : string {
    const imageMap : { [key :string ] : string } = {
      'Musique' : '/img/themes/musique.jpg',
      'Informatique' : '/img/themes/informatique.jpg',
      'Jardinage' : '/img/themes/jardinage.jpeg',
      'Cuisine' : '/img/themes/cuisine.jpeg'
    };
    return imageMap[themeName]
  }

  goToTheme(themeId: number): void {
    console.log('Navigation vers le thème:', themeId);
  }
}
