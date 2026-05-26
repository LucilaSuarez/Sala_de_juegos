import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { Chat } from './components/chat/chat';
import { authGuard, publicGuard } from './guards/auth';
import { MayorMenor } from './games/mayor-menor/mayor-menor';
import { Ahorcado } from './games/ahorcado/ahorcado';

export const routes: Routes = [
    { path: 'home', component: Home, canActivate: [authGuard]},
    { path: 'login', component: Login, canActivate: [publicGuard] },
    { path: 'registro', component: Registro, canActivate: [publicGuard] },
    { path: 'quien-soy', component: QuienSoy },
    {path: 'games/mayor-menor', component: MayorMenor},
    {path: 'games/ahorcado', component: Ahorcado},
    {path: 'chat', component: Chat},
    
    { path: '', redirectTo: 'home', pathMatch: 'full' },  
    { path: '**', redirectTo: 'home' } 
];