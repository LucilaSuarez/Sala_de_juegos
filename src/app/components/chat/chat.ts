import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})

export class Chat implements OnDestroy {
  chatService = inject(ChatService);
  abierto = signal(false);
  nuevoMensaje = '';
  enviando = signal(false);

  toggleChat() {
    const nuevoEstado = !this.abierto();
    this.abierto.set(nuevoEstado);
    if (nuevoEstado) {
      // Si se abre, cargamos el historial y encendemos el tiempo real
      this.chatService.cargarMensajes();
      this.chatService.escucharMensajes();
    } else {
      // Si se cierra, apagamos el tiempo real para liberar memoria
      this.chatService.desconectar();
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

  ngOnDestroy() {
    this.chatService.desconectar();
  }
}
