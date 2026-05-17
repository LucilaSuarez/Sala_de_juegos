import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { QuienSoy } from './components/quien-soy/quien-soy';
import {  authGuard, publicGuard } from './guards/auth';

export const routes: Routes = [
    { path: 'home', component: Home, canActivate: [authGuard]},
    { path: 'login', component: Login, canActivate: [publicGuard] },
    { path: 'registro', component: Registro, canActivate: [publicGuard] },
    { path: 'quien-soy', component: QuienSoy },
    { path: '', redirectTo: 'home', pathMatch: 'full' },  
    { path: '**', redirectTo: 'home' } 
];
