import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Theme } from '../../models/theme.model';
import { Cursus } from '../../models/cursus.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
        private http: HttpClient
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
        console.log('Achat du cursus:', cursus);
        alert(`Achat du cursus "${cursus.name}" pour ${cursus.price}€`);
    }

    buyLesson(lesson: any): void {
        console.log('Achat de la leçon:', lesson);
        alert(`Achat de la leçon "${lesson.name}" pour ${lesson.price}€`);
    }
}

