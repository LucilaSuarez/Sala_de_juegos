import { Component, signal, inject } from '@angular/core';
import { Header } from './components/header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { AuthService } from './services/auth';
import { Chat } from "./components/chat/chat";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('playroom');
  auth = inject(AuthService);
}
