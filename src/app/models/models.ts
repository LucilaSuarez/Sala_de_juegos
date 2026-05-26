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
    };
    created_at?: string;
}

// Interfaz de cartas para juego Mayor o Menor
export interface mayor_menor{
    id?: string;
    user_id: string;
    puntaje: number;
    created_at?: string;
}

export interface Carta {
    image: string;
    value: string;
    suit: string;
}

// Interfaz para resultados del juego Ahorcado
export interface AhorcadoResultado {
    id?: string;  
    user_id: string;  
    cantidad_letras: number;
    tiempo: number;  
    resultado: 'victoria' | 'derrota';  
    created_at?: string;
}