import { Injectable, inject, signal, computed } from "@angular/core";
import { SupabaseService } from "./supabase";
import { User } from "../models/models";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
    private router = inject(Router);
    private supabase = inject(SupabaseService);

    user = signal<User | null>(null);
    isAuthenticated = computed(() => this.user() !== null);

    sessionChecked: Promise<void>;

    constructor() {
        
        this.sessionChecked = this.checkSession();
    }

    // Verificacion de sesión al cargar la aplicación
    loading = signal(true); // flag para indicar que se está verificando la sesión al inicio
    async checkSession() {
        const { data: { session } } = await this.supabase.getClient().auth.getSession();
        if (session?.user) { 
            await this.loadProfile(session.user.id);
            //this.user.set({ id: session.user.id, email: session.user.email ?? '', });
        }
        this.loading.set(false); 
    }

    async login(email: string, password: string): Promise<boolean> {
        const { data, error } = await this.supabase.getClient().auth.signInWithPassword({email,password}); 
        if (error) {
            console.error(error.message); 
            return false; 
        } 
        if (data.user) { 
            await this.loadProfile(data.user.id);
            //this.user.set({ id: data.user.id, email: data.user.email ?? '',}); 
            this.router.navigate(['/home']); 
            return true; 
        } 
        return false; 
    }

    // Carga el perfil del usuario desde la tabla 'profiles' usando el ID del usuario autenticado (para traer el nombre)
    async loadProfile(userId: string) {
        const { data, error } = await this.supabase.getClient()
        .from('profiles').select('nombre, apellido, email').eq('id', userId).single();
        if (data && !error) {
            this.user.set({ id: userId, email: data.email, nombre: data.nombre });
        }
    }

    async register(
        nombre: string,
        apellido: string,
        edad: number,
        email: string,
        password: string
    ): Promise<boolean> {
        // 1. crear usuario auth
        const { data, error } =await this.supabase.getClient().auth.signUp({email, password});

        if (error || !data.user) {
            console.error(error?.message);
            // si el usuario ya existe, mostrar mensaje específico
            if (error?.message.includes('User already registered')) {
                throw new Error('El usuario ya se encuentra registrado');
            }
        throw new Error(error?.message);
        }
        // 2. guardar perfil
        const { error: profileError } = await this.supabase.getClient().from('profiles').insert({
            id: data.user.id, nombre, apellido, edad, email});


        if (profileError) {
            console.error(profileError.message);
            return false;
        }

        //this.user.set({id: data.user.id, email: data.user.email ?? '',});
        await this.loadProfile(data.user.id);
        this.router.navigate(['/home']);
        return true;
    }

    // cierre de sesión
    async logout(): Promise<void> {await this.supabase.getClient().auth.signOut();
        this.user.set(null);
        this.router.navigate(['/login']);
    }
}
