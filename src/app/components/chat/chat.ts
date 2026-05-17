import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})

export class Chat {
  chatService = inject(ChatService);
  abierto = signal(false);
  nuevoMensaje = '';
  enviando = signal(false);

  toggleChat() {
    this.abierto.set(!this.abierto());
    if (this.abierto()) {
        this.chatService.cargarMensajes();
    }
  }

  async enviarMensaje() {
    const texto = this.nuevoMensaje.trim();
    if (!texto || this.enviando()) return;
    this.enviando.set(true);
    await this.chatService.enviarMensaje(texto);
    this.nuevoMensaje = '';
    this.enviando.set(false);
  }
}
