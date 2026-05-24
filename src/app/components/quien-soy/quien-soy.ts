import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})

export class QuienSoy implements OnInit {

  private http = inject(HttpClient);
  user = signal<any>(null);
  repos = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUser();
    this.loadRepos();
  }

  loadUser(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<any>('https://api.github.com/users/LucilaSuarez')
      .subscribe({
        next: (data) => {
          this.user.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Error al cargar perfil');
          this.loading.set(false);
        }
      });
  }

  loadRepos(): void {
    this.http.get<any[]>('https://api.github.com/users/LucilaSuarez/repos?per_page=2')
      .subscribe({
        next: (data) => {
          this.repos.set(data);
        },
        error: () => {
          this.error.set('Error al cargar repositorios');
        }
      });
  }
}