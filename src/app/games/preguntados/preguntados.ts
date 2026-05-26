import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreguntadosService } from '../../services/preguntados';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { TriviaQuestion } from '../../models/models';

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule, RouterModule],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class Preguntados implements OnInit, OnDestroy {
  preguntadosService = inject(PreguntadosService);
  supabase = inject(SupabaseService);
  auth = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  preguntas: TriviaQuestion[] = [];
  indiceActual = 0;
  aciertos = 0;
  cargando = signal(true);
  
  respondido = false;
  opcionSeleccionada = '';
  juegoTerminado = false;
  resultadoMensaje = '';

  tiempoSegundos = 0;
  intervaloTiempo: any;

  async ngOnInit() {
    this.iniciarNuevaPartida();
  }

  ngOnDestroy() {
    this.detenerCronometro();
  }

  iniciarNuevaPartida() {
    this.cargando.set(true);
    this.juegoTerminado = false;
    this.indiceActual = 0;
    this.aciertos = 0;
    this.tiempoSegundos = 0;
    this.respondido = false;
    this.opcionSeleccionada = '';

    this.preguntadosService.getPreguntas().subscribe({
      next: (data) => {
        this.preguntas = data;
        this.cargando.set(false);
        this.iniciarCronometro();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar preguntas de la API:', err);
        this.cargando.set(false);
      }
    });
  }

  get preguntaActual(): TriviaQuestion {
    return this.preguntas[this.indiceActual];
  }

  verificarRespuesta(opcion: string) {
    if (this.respondido || this.juegoTerminado) return;

    this.respondido = true;
    this.opcionSeleccionada = opcion;

    if (opcion === this.preguntaActual.correct_answer) {
      this.aciertos++;
    }

    // Espera 1.5 segundos para mostrar visualmente si acertó o falló
    setTimeout(() => {
      this.siguientePregunta();
    }, 1500);

    this.cdr.detectChanges();
  }

  siguientePregunta() {
    this.respondido = false;
    this.opcionSeleccionada = '';

    if (this.indiceActual < this.preguntas.length - 1) {
      this.indiceActual++;
    } else {
      this.finalizarPartida();
    }
    this.cdr.detectChanges();
  }

  async finalizarPartida() {
    this.juegoTerminado = true;
    this.detenerCronometro();
    this.resultadoMensaje = `¡Terminaste! Acertaste ${this.aciertos} de ${this.preguntas.length} preguntas.`;
    
    await this.guardarResultado();
    this.cdr.detectChanges();
  }

  async guardarResultado() {
    const usuario = this.auth.user();
    if (!usuario) {
      console.error('Usuario no autenticado');
      return;
    }

    // Guardado minimalista: Solo user_id, aciertos y tiempo
    const { error } = await this.supabase.getClient().from('preguntados').insert({
      user_id: usuario.id,
      aciertos: this.aciertos,
      tiempo: this.tiempoSegundos
    });

    if (error) {
      console.error('Error al guardar en Supabase:', error.message);
    } else {
      console.log('Estadísticas de Preguntados guardadas con éxito');
    }
  }

  iniciarCronometro() {
    this.detenerCronometro();
    this.intervaloTiempo = setInterval(() => {
      this.tiempoSegundos++;
      this.cdr.detectChanges();
    }, 1000);
  }

  detenerCronometro() {
    if (this.intervaloTiempo) clearInterval(this.intervaloTiempo);
  }
}