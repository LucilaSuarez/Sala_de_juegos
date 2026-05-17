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