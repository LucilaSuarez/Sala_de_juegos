import { Component, inject, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})

export class Registro {
  private auth = inject(AuthService);

  nombre = '';
  apellido = '';
  edad!: number;
  email = '';
  password = '';

  loading = signal(false);
  errorMensaje = signal('');

  async onSubmit() {
    this.loading.set(true);
    this.errorMensaje.set('');
    
    if (!this.nombre.trim()) {
      this.errorMensaje.set('El nombre es obligatorio.');
      this.loading.set(false);
      return;
    }
    if (!this.apellido.trim()) {
      this.errorMensaje.set('El apellido es obligatorio.');
      this.loading.set(false);
      return;
    }
    if (!this.edad || this.edad < 1 || this.edad > 120) {
      this.errorMensaje.set('Ingresá una edad válida.');
      this.loading.set(false);
      return;
    }
    if (!this.email.trim()) {
      this.errorMensaje.set('El correo electrónico es obligatorio.');
      this.loading.set(false);
      return;
    }
    if (!this.password || this.password.length < 6) {
      this.errorMensaje.set('La contraseña debe tener al menos 6 caracteres.');
      this.loading.set(false);
      return;
    }

    try {
      await this.auth.register(
        this.nombre,
        this.apellido,
        this.edad,
        this.email,
        this.password
    );
    } catch(error: any) {
      this.errorMensaje.set(error.message);
    } finally {
      this.loading.set(false);    
    }
  } 
}