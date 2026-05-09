# 📜 Notas de Desarrollo: Códice Bíblico
**Ecosistema Digital de Revelación y Estudio**

Este documento registra la evolución, arquitectura y el "Salto de Nivel" realizado en el prototipo durante la fase de optimización premium (Mayo 2026).

---

## 🚀 Resumen del "Salto de Nivel"
Se ha transformado el proyecto de una serie de herramientas funcionales a una **plataforma digital premium** con identidad visual coherente, navegación fluida y atmósfera inmersiva.

### 🏛️ Arquitectura de Componentes Centralizados
Para facilitar el mantenimiento y la escalabilidad, se han creado componentes que se inyectan automáticamente:

1.  **Ecosistema Hub (`js/ecosistema-hub.js`):**
    *   Menú de 9 puntos que se autoinyecta en cualquier página.
    *   **Detección inteligente:** Detecta la app actual y oculta su botón para evitar redundancia.
    *   Estilos encapsulados con glassmorphism y z-index blindado (999.999).

2.  **Footer Global (`js/global-footer.js`):**
    *   Cierre unificado para todas las apps.
    *   **Enlace Maestro:** Link directo al portal raíz (`index.html`).
    *   **Autolimpieza:** Borra automáticamente cualquier footer antiguo detectado en la página.
    *   **Perlas de Sabiduría:** Generador aleatorio de versículos bíblicos sobre la Palabra.

---

## 🎨 Design System (Estética Códice)
Se ha establecido un lenguaje visual común para todo el proyecto:
*   **Colores:** Azul Pizarra (fondo), Oro Códice (acentos), Blanco Suave (lectura).
*   **Tipografías:** 
    *   *Cinzel:* Para títulos majestuosos y portadas.
    *   *Merriweather / Lora:* Para lectura profunda (Serif).
    *   *Inter / Lato:* Para interfaz de usuario (Sans-serif).
*   **Patrones de Interfaz:**
    *   **Magazine Grid:** Grillas asimétricas donde los elementos destacados ocupan doble espacio.
    *   **Zen Reading:** Experiencia de lectura sobre fondo de pergamino con control de tamaño de letra (A+/A-) y barra de progreso.

---

## 📂 Estado de los Módulos

### 1. Portal Principal (Root)
*   Hero cinematográfico con tipografía Cinzel.
*   Dashboard Global que integra XP y Logros de todas las apps.
*   Acceso directo "Continuar donde lo dejaste" vía SessionStorage.

### 2. Huellas (Biografías)
*   Hero dinámico con "Personaje del Día".
*   Línea de tiempo visual basada en nodos dorados.
*   Categorización temática (Mujeres de Valor, Tendencias).

### 3. Cronos (Mapa Bíblico)
*   Iconos minimalistas temáticos (🏛️, ⛺, ⚔️, 🌊) de gran tamaño.
*   **Time Slider:** Deslizador para filtrar lugares por era bíblica.
*   Bottom Sheet móvil para una navegación estilo Google Maps.

### 4. A Imagen de Dios (Biblioteca)
*   Catálogo estilo editorial premium.
*   Paginación numérica clásica estructurada.

### 5. Onomastiko (Identidad)
*   Fichas de identidad estilo "Tarjeta Virtual" interactiva.
*   Efecto de resplandor (Glow) al activar el switch de transformación de identidad.

### 6. Maná (Devocional)
*   Hero de calendario dinámico con fecha gigante.
*   Barra de acceso rápido a los últimos 7 días.
*   Lectura en modo pergamino sagrado.

### 7. El Aposento (Santuario)
*   Fondo animado de "respiración visual".
*   Reproductor de audio Zen con estados de ministración y Selah.

### 8. Escriba (Diario)
*   Rediseño estilo diario de cuero y oro.
*   Categorización automática por iconos según el contenido (🍞, 🔥, 👣).
*   FAB (Botón flotante) para nueva nota y controles de fuente a la izquierda.

---

## 🛠️ Roadmap / Futuras Mejoras
- [ ] **Virtus (Gamificación):** Profundizar en las misiones épicas y sala de trofeos.
- [ ] **Sincronización Cloud:** Evaluar paso de LocalStorage a una base de datos real (ej. Firebase) para que la XP se guarde entre dispositivos.
- [ ] **Modo Offline Completo:** Reforzar el Service Worker para que todo el contenido (incluyendo imágenes) sea accesible sin internet.
- [ ] **Audiolibro en Huellas:** Integrar el sistema de síntesis de voz de Aposento en las biografías de Huellas.

---
*Desarrollado con excelencia por Domingo Curbeira — 2026*
