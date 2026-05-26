import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-compatibilidad',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './compatibilidad.html',
  styleUrl: './compatibilidad.css'
})
export class Compatibilidad {
  supabase = inject(SupabaseService);
  auth = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  // Inputs del usuario
  nombre1: string = '';
  nombre2: string = '';

  // Estados del juego
  calculando: boolean = false;
  juegoTerminado: boolean = false;
  porcentajeResultado: number = 0;
  resultadoMensaje: string = '';

  calcularCompatibilidad() {

    if (!this.nombre1.trim() || !this.nombre2.trim()) return;

    this.calculando = true;
    this.juegoTerminado = false;
    this.cdr.detectChanges();

    setTimeout(async () => {
      // Generamos el porcentaje aleatorio de 0 a 100
      this.porcentajeResultado = Math.floor(Math.random() * 101);

      if (this.porcentajeResultado >= 80) {
        this.resultadoMensaje = `¡Almas Gemelas! 🌟 ${this.nombre1} y ${this.nombre2} tienen una conexión indestructible.`;
      } else if (this.porcentajeResultado >= 50) {
        this.resultadoMensaje = `¡Buena Onda! 👍 Hay mucho potencial entre ${this.nombre1} y ${this.nombre2}.`;
      } else {
        this.resultadoMensaje = `¡Mejor como amigos! 🫂 El destino tiene otros planes para ${this.nombre1} y ${this.nombre2}.`;
      }

      this.calculando = false;
      this.juegoTerminado = true;

      // Guardamos automáticamente el desempeño en la base de datos
      await this.guardarResultado();
      this.cdr.detectChanges();
    }, 2000);
  }

  async guardarResultado() {
    const usuario = this.auth.user();
    if (!usuario) {
      console.error('Usuario no autenticado');
      return;
    }

    // Insertamos en la tabla 
    const { error } = await this.supabase.getClient().from('compatibilidad').insert({
      user_id: usuario.id,
      porcentaje: this.porcentajeResultado
    });

    if (error) {
      console.error('Error al guardar en Supabase:', error.message);
    } else {
      console.log('Resultado de compatibilidad guardado con éxito');
    }
  }

  reiniciarJuego() {
    this.nombre1 = '';
    this.nombre2 = '';
    this.juegoTerminado = false;
    this.porcentajeResultado = 0;
    this.resultadoMensaje = '';
    this.cdr.detectChanges();
  }
}