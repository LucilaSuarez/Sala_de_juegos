export interface Profiles {
    id?: string;
    nombre: string;
    apellido: string;
    edad: number;
    email: string;
    created_at?: string;
}

export interface User {
    id: string;
    nombre?: string;
    email: string;
}

export interface Mensaje {
    id?: string;
    user_id: string;
    contenido: string;
    profiles?: {
        nombre: string;
        apellido: string;
    };
    created_at?: string;
}