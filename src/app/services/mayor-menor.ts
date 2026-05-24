import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class MayorMenorService {
    private apiUrl = 'https://deckofcardsapi.com/api/deck';
    deckId = '';

    async crearMazo() {
        const response = await fetch(
            `${this.apiUrl}/new/shuffle/?deck_count=1`
        );
        const data = await response.json();
        this.deckId = data.deck_id;
        console.log(data);
        console.log('Mazo creado:', this.deckId);
    }

    async sacarCarta() {
        if (!this.deckId) {await this.crearMazo();}
        const response = await fetch(`${this.apiUrl}/${this.deckId}/draw/?count=1`);
        const data = await response.json();
        console.log(data);
        return data.cards[0];
    }
}