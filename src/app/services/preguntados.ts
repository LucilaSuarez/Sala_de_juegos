import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { TriviaResponse, TriviaQuestion } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class PreguntadosService {
    private http = inject(HttpClient);
    private apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';

    getPreguntas(): Observable<TriviaQuestion[]> {
        return this.http.get<TriviaResponse>(this.apiUrl).pipe(
            map(response => {
                return response.results.map(pregunta => {
                    // Juntamos respuestas
                    const opciones = [pregunta.correct_answer, ...pregunta.incorrect_answers];
                    // Mezclamos y decodificamos el HTML extraño que manda la API
                    pregunta.opcionesMezcladas = this.mezclarArreglo(opciones).map(opc => this.decodificarHtml(opc));
                    pregunta.question = this.decodificarHtml(pregunta.question);
                    pregunta.correct_answer = this.decodificarHtml(pregunta.correct_answer);
                    return pregunta;
                });
            })
        );
    }

    private mezclarArreglo(arreglo: string[]): string[] {
        const copia = [...arreglo];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }

    private decodificarHtml(texto: string): string {
        const txt = document.createElement('textarea');
        txt.innerHTML = texto;
        return txt.value;
    }
}