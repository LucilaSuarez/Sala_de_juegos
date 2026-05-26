import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { Ahorcado, mayor_menor, Preguntados, Compatibilidad } from '../../models/models';

@Component({
  selector: 'app-resultados',
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados implements OnInit {
  supabase = inject(SupabaseService);

  cargando = signal(true);

  // Tipamos los arrays usando tus interfaces y permitiendo la relación con profiles
  rankingAhorcado: (Ahorcado & { profiles?: { nombre: string; apellido: string } })[] = [];
  rankingMayorMenor: (mayor_menor & { profiles?: { nombre: string; apellido: string } })[] = [];
  rankingPreguntados: (Preguntados & { profiles?: { nombre: string; apellido: string } })[] = [];
  rankingCompatibilidad: (Compatibilidad & { profiles?: { nombre: string; apellido: string } })[] = [];

  ngOnInit() {
    this.cargarTodosLosRankings();
  }

  async cargarTodosLosRankings() {
    this.cargando.set(true);
    
    try {
      const client = this.supabase.getClient();

      // 1. Ahorcado: Ordenamos por victorias primero, y desempatamos por el que tardó menos tiempo
      const { data: ahorcado } = await client
        .from('ahorcado')
        .select('*, profiles(nombre, apellido)')
        .order('resultado', { ascending: false }) // 'victoria' va antes que 'derrota' alfabéticamente en orden descendente
        .order('tiempo', { ascending: true });
      this.rankingAhorcado = ahorcado || [];

      // 2. Mayor o Menor: Ordenamos por puntaje de mayor a menor
      const { data: mm } = await client
        .from('mayor_menor')
        .select('*, profiles(nombre, apellido)')
        .order('puntaje', { ascending: false });
      this.rankingMayorMenor = mm || [];

      // 3. Preguntados: Ordenamos por puntaje (aciertos) de mayor a menor y desempatamos por tiempo bajo
      const { data: preguntados } = await client
        .from('preguntados')
        .select('*, profiles(nombre, apellido)')
        .order('aciertos', { ascending: false })
        .order('tiempo', { ascending: true });
      this.rankingPreguntados = preguntados || [];
      console.log('Data cruda de Preguntados:', preguntados);

      // 4. Compatibilidad: Ordenamos por mayor porcentaje de amor
      const { data: comp } = await client
        .from('compatibilidad')
        .select('*, profiles(nombre, apellido)')
        .order('porcentaje', { ascending: false });
      this.rankingCompatibilidad = comp || [];

    } catch (error) {
      console.error('Error cargando tablas de posiciones:', error);
    } finally {
      this.cargando.set(false);
    }
  }
}
