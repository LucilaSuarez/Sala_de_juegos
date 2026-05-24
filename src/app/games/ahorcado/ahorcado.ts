import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule, RouterModule],
  templateUrl: './ahorcado.html', 
  styleUrl: './ahorcado.css'
})
export class Ahorcado implements OnInit, OnDestroy {
  supabase = inject(SupabaseService);
  auth = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  // Palabras (puedes importarlas de tu JSON o dejarlas fijas aquí)
  listaPalabras: string[] = [
    "ANGULAR", "SUPABASE", "PROGRAMACION", "JAVASCRIPT", 
    "COMPONENTE", "PYTHON", "FRONTEND", "BACKEND", "VARIABLE", "FUNCION"
  ];

  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  letrasSeleccionadas: Set<string> = new Set();

  palabraOculta = '';
  palabraAdivinar = '';
  letrasAdivinadas: string[] = [];

  intentosFallidos = 0;
  maxIntentos = 6;
  imagenActual = 'ahorcado/intentos-imagenes/start.png'; // Ruta inicial

  // Estado del juego y métricas
  juegoTerminado = false;
  resultadoMensaje = '';
  letrasTotalesPulsadas = 0;

  // Tiempo
  tiempoSegundos = 0;
  intervaloTiempo: any;

  ngOnInit() {
    this.iniciarJuego();
  }

  ngOnDestroy() {
    this.detenerCronometro();
  }

  iniciarJuego() {
    this.juegoTerminado = false;
    this.intentosFallidos = 0;
    this.letrasTotalesPulsadas = 0;
    this.tiempoSegundos = 0;
    this.letrasSeleccionadas.clear();
    this.imagenActual = 'ahorcado/intentos-imagenes/start.png';
    
    const indiceAzar = Math.floor(Math.random() * this.listaPalabras.length);
    this.palabraAdivinar = this.listaPalabras[indiceAzar].toUpperCase();
    
    this.letrasAdivinadas = Array(this.palabraAdivinar.length).fill('_');
    this.actualizarPalabraOculta();

    this.iniciarCronometro();
    this.cdr.detectChanges();
  }

  actualizarPalabraOculta() {
    this.palabraOculta = this.letrasAdivinadas.join(' ');
  }

  seleccionarLetra(letra: string) {
    if (this.letrasSeleccionadas.has(letra) || this.juegoTerminado) return;

    this.letrasSeleccionadas.add(letra);
    this.letrasTotalesPulsadas++;

    if (this.palabraAdivinar.includes(letra)) {
      // mostrar la letra en el guion bajo
      for (let i = 0; i < this.palabraAdivinar.length; i++) {
        if (this.palabraAdivinar[i] === letra) {
          this.letrasAdivinadas[i] = letra;
        }
      }
      this.actualizarPalabraOculta();

      if (!this.letrasAdivinadas.includes('_')) {
        this.finalizarPartida(true);
      }
    } else {
      this.intentosFallidos++;
      this.imagenActual = `ahorcado/intentos-imagenes/error0${this.intentosFallidos}.png`;

      if (this.intentosFallidos >= this.maxIntentos) {
        this.finalizarPartida(false);
      }
    }
    this.cdr.detectChanges();
  }

  iniciarCronometro() {
    this.detenerCronometro();
    this.intervaloTiempo = setInterval(() => {
      this.tiempoSegundos++;
      this.cdr.detectChanges();
    }, 1000);
  }

  detenerCronometro() {
    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
    }
  }

  async finalizarPartida(gano: boolean) {
    this.juegoTerminado = true;
    this.detenerCronometro();
    this.resultadoMensaje = gano ? '¡Ganaste!' : `¡Perdiste! La palabra era: ${this.palabraAdivinar}`;
    
    await this.guardarResultado(gano);
    this.cdr.detectChanges();
  }

  async guardarResultado(gano: boolean) {
    const usuario = this.auth.user();
    if (!usuario) {
      console.error('Usuario no autenticado');
      return;
    }

    const { error } = await this.supabase.getClient().from('ahorcado').insert({
      user_id: usuario.id,
      cantidad_letras: this.letrasTotalesPulsadas,
      tiempo: this.tiempoSegundos,
      resultado: gano ? 'victoria' : 'derrota'
    });

    if (error) {
      console.error('Error al guardar estadísticas:', error);
    } else {
      console.log('Estadísticas del Ahorcado guardadas con éxito');
    }
  }
}