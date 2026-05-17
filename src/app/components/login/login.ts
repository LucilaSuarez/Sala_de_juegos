import { Component , inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  auth = inject(AuthService);

  email = '';
  password = '';
  loading = signal(false);
  errorMensaje = signal('');

  async onSubmit(){
    this.loading.set(true);
    this.errorMensaje.set('');

    if (!this.email.trim()) {
      this.errorMensaje.set('El correo electrónico es obligatorio.');
      this.loading.set(false);
      return;
    }
    if (!this.password) {
      this.errorMensaje.set('La contraseña es obligatoria.');
      this.loading.set(false);
      return;
    }

    try { 
      const success =await this.auth.login(this.email,this.password );
      if (!success) {
        this.errorMensaje.set(
          'Email o contraseña incorrectos'
        );
      }
    } finally {
      this.loading.set(false);
    }
  }

  autocompletar(index: number): void {
    const usuarios = [
        { email: 'prueba1@gmail.com', password: 'prueba1' },
        { email: 'prueba2@gmail.com', password: 'prueba2' },
        { email: 'prueba3@gmail.com', password: 'prueba3' },
    ];
    this.email = usuarios[index].email;
    this.password = usuarios[index].password;
  }
}