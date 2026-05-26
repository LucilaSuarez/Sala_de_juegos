import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MayorMenorService } from '../../services/mayor-menor';
import { Carta } from '../../models/models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mayor-menor',
  imports: [CommonModule,  RouterModule],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css',
})
export class MayorMenor implements OnInit{
  mayorMenorService = inject(MayorMenorService);
  supabase = inject(SupabaseService);
  auth = inject(AuthService);
  cdr = inject(ChangeDetectorRef); // Inyectar ChangeDetectorRef para detectar cambios en la vista
  cartaActual?: Carta;
  puntaje = 0;
  intentos = 0;
  maxIntentos = 10;
  juegoTerminado = false;


  async ngOnInit() {
    console.log('Juego iniciado');
    await this.iniciarJuego();
  }

  async iniciarJuego() {
    await this.mayorMenorService.crearMazo();
    console.log('Deck ID:', this.mayorMenorService.deckId);
    this.cartaActual =await this.mayorMenorService.sacarCarta();
    this.cdr.detectChanges(); // Detectar cambios para actualizar la vista con la carta actual
    console.log(this.cartaActual);
  }

  obtenerValorCarta(valor: string): number {
    const valores: any = {
      ACE: 1,
      KING: 13,
      QUEEN: 12,
      JACK: 11
    };
    return valores[valor] || Number(valor);
  }

  async jugar(tipo: 'mayor' | 'menor') {
    if (!this.cartaActual || this.juegoTerminado) return;
    const cartaNueva = await this.mayorMenorService.sacarCarta();
    const valorActual =this.obtenerValorCarta(this.cartaActual.value);
    const valorNuevo = this.obtenerValorCarta(cartaNueva.value);

    let acerto = false;
    
    if (valorNuevo === valorActual) {
      this.cartaActual = cartaNueva;
      this.intentos++;
      if (this.intentos >= this.maxIntentos) {
        this.juegoTerminado = true;
        await this.guardarResultado();
      }
      this.cdr.detectChanges();
      return;
    }
    if (tipo === 'mayor') {
      acerto = valorNuevo > valorActual;
    } else {
      acerto = valorNuevo < valorActual;
    }
    this.intentos++;
    if (acerto) {
      this.puntaje++;
    }
    this.cartaActual = cartaNueva;
    if (this.intentos >= this.maxIntentos) {
      this.juegoTerminado = true;
      await this.guardarResultado();
    }
  this.cdr.detectChanges();
  }

  async reiniciarJuego() {
    this.puntaje = 0;
    this.intentos = 0;
    this.juegoTerminado = false;
    await this.iniciarJuego();
    this.cdr.detectChanges();
  }

  async guardarResultado() {
    const usuario = this.auth.user();
    if (!usuario) {
      console.error('Usuario no autenticado');
      return;
    }
    const { error } =
    await this.supabase.getClient().from('mayor_menor').insert({
      user_id: usuario.id,
      puntaje: this.puntaje
    });
    if (error) {
      console.error('Error al guardar resultado:', error);
    } else {
      console.log('Resultado guardado correctamente');
    }
  }
}
