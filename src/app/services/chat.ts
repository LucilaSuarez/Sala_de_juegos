import { Injectable , signal, inject, NgZone} from "@angular/core";
import { SupabaseService } from "./supabase";
import { AuthService } from "./auth";
import { Mensaje } from "../models/models";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private supabase = inject(SupabaseService);
    public auth = inject(AuthService); // Cambiado a public para acceder limpiamente desde el HTML
    private zone = inject(NgZone); // <-- El motor de sincronización de Angular
    public mensaje = signal<Mensaje[]>([]);
    private channel: any; // Para almacenar la referencia al canal de suscripción

    constructor() { 
        // this.cargarMensajes();
        // this.escucharMensajes();
    }

    async cargarMensajes() {
        const { data , error} = await this.supabase
        .getClient()
        .from('mensaje')
        .select(`*,profiles(nombre)`)
        .order('created_at', { ascending: true });

        console.log('Mensajes cargados:', data?.length); // log para verificar la cantidad de mensajes cargados

        if (error) {
            console.error('Error al cargar mensajes:', error.message);
            return;
        }

        if (data) {
            this.mensaje.set(data as Mensaje[]);
            this.hacerScrollAbajo();
        }
    }

    escucharMensajes(){
        // Limpiar canal anterior si existe CAMBIO
        if (this.channel) {
            this.supabase.getClient().removeChannel(this.channel);
        }

        // Crear nuevo canal
        this.channel = this.supabase.getClient().channel('sala-de-chat')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensaje'},
            async (payload) => { 
                console.log('Nuevo mensaje detectado:', payload);
                const mensajeId = payload.new['id'];
                // Obtener el mensaje completo con los datos del perfil
                const { data, error } = await this.supabase.getClient()
                    .from('mensaje').select(`*, profiles(nombre)`)
                    .eq('id', mensajeId).single();
                if (error) {
                    console.error('Error al obtener nuevo mensaje:', error);
                    return;
                }
                if (data) {
                    this.zone.run(() => {
                        this.mensaje.update(mensajes => {
                                if (mensajes.some(m => m.id === data.id)) return mensajes;
                                return [...mensajes, data as Mensaje];
                            });
                        });

                    // Forzamos a Angular a revisar la vista debido al salto asíncrono del tiempo real
                    this.hacerScrollAbajo(); 
                }
            }
        )
        .subscribe((status) => {
            console.log('Estado de la suscripción:', status);
        });
    }

    async enviarMensaje(contenido: string){
        const usuario = this.auth.user();
        if (!usuario) {
            console.error('Usuario no autenticado');
            return;
        }

        const { data, error } = await this.supabase.getClient().from('mensaje')
        .insert({user_id: usuario.id, contenido: contenido, created_at: new Date().toISOString()}).select();

        if (error) {
            console.error('Error al enviar mensaje:', error.message);
        }
        console.log('Mensaje enviado exitosamente:', data);
        return data;
    }

    hacerScrollAbajo() {
        setTimeout(() => {
            const chatContainer = document.querySelector('.chat-mensajes');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 100);
    }

    // limpiamos la suscripción cuando sea necesario
    desconectar() {
        if (this.channel) {
            this.supabase.getClient().removeChannel(this.channel);
        }
    }
}