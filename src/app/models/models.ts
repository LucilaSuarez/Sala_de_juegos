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
export interface Ahorcado {
    id?: string;  
    user_id: string;  
    cantidad_letras: number;
    tiempo: number;  
    resultado: 'victoria' | 'derrota';  
    created_at?: string;
}

// Interfaz para resultados del Preguntados
export interface Preguntados {
    id?: string;
    user_id: string;
    aciertos: number;
    tiempo: number;
    created_at?: string;
}

export interface TriviaResponse {
    response_code: number;
    results: TriviaQuestion[];
}

export interface TriviaQuestion {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    opcionesMezcladas?: string[]; 
}

// Interfaz para resultados del juego Compatibilidad
export interface Compatibilidad {
    id?: string;
    user_id: string;
    porcentaje: number;
    created_at?: string;
}