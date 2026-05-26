# 🎮 Playroom - Sala de Juegos

Proyecto realizado para la materia **Programación IV** - UTN Avellaneda.

## 👩‍💻 Alumna

* Lucila Micaela Suarez

---

# 🚀 Deploy

🔗 https://vercel.com/lucila-micaela-suarez-s-projects

---

# 🛠️ Tecnologías utilizadas

* Angular 20
* TypeScript
* HTML5
* CSS3
* Bootstrap 5
* Supabase
* Git & GitHub
* Vercel
* APIs REST

---

# 📌 Descripción del proyecto

Sala de juegos interactiva desarrollada con Angular y Supabase.

La aplicación cuenta con:

* Sistema de autenticación
* Chat en tiempo real
* Persistencia de datos
* Rankings y estadísticas
* Juegos interactivos
* Diseño responsive

---

# 🎮 Juegos incluidos

## 💀 Ahorcado

Juego clásico donde el usuario debe descubrir la palabra secreta seleccionando letras del abecedario antes de quedarse sin intentos.

### Características

* Teclado interactivo
* Imágenes dinámicas del ahorcado
* Contador de intentos
* Temporizador
* Guardado de partidas en Supabase

---

## 📈📉 Mayor o Menor

El jugador debe adivinar si la próxima carta será mayor o menor que la actual.

### Características

* Consumo de API externa de cartas
* Sistema de puntaje
* Límite de intentos
* Modal de fin de juego
* Guardado de resultados

---

## ❓ Preguntados

Juego de preguntas y respuestas consumidas desde una API externa.

### Características

* Preguntas aleatorias
* Opciones múltiples
* Temporizador
* Sistema de aciertos
* Guardado de estadísticas

---

## 💞 Compatibilidad

Juego propio del proyecto.
Permite ingresar dos nombres y calcular un porcentaje ficticio de compatibilidad.

### Características

* Generación aleatoria de afinidad
* Mensajes personalizados
* Diseño interactivo
* Guardado de resultados

---


# ✅ Sprint 1

## Funcionalidades

* Estructura inicial del proyecto
* Header y Footer
* Home
* Quién Soy
* Login
* Registro
* Navegación entre componentes

---

# ✅ Sprint 2

## Funcionalidades

* Registro de usuarios
* Persistencia de datos en Supabase
* Inicio automático de sesión luego del registro
* Protección de rutas
* Manejo de autenticación
* Validaciones de formularios

---

# ✅ Sprint 3

## Funcionalidades

* Chat en tiempo real
* Juego Mayor o Menor
* Juego Ahorcado
* Consumo de API externa de cartas
* Guardado de partidas en Supabase
* Modal de fin de juego
* Contador de puntaje e intentos
* Diferenciación visual de mensajes propios en el chat

---

# ✅ Sprint 4

## Funcionalidades

* Juego Preguntados con consumo de API externa
* Juego propio: Compatibilidad 
* Guardado de resultados en Supabase
* Sistema de estadísticas y rankings
* Página de Resultados con tablas de los 4 juegos
* Puntajes y desempeño por jugador
* Ranking ordenado de mejor a peor puntaje
* Diseño responsive unificado

---

# 📊 Estadísticas

La aplicación cuenta con una sección de rankings donde se muestran:

* Puntajes
* Tiempo de juego
* Victorias
* Rendimiento de cada jugador

Los resultados se almacenan en Supabase y se ordenan automáticamente según desempeño.

---

# 📂 Estructura del proyecto

```bash
src/app/
│
├── components/
├── games/
├── guards/
├── models/
├── services/
```

---

# 🔐 Base de datos

El proyecto utiliza Supabase para:

* autenticación
* almacenamiento de usuarios
* mensajes del chat
* resultados de juegos
