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

## 📅 Actualización: 9 de Mayo, 2026 (Salto Cuántico)
En esta jornada se ha completado la integración de contenidos de alta gama y la unificación visual definitiva del ecosistema.

### 💎 Nuevo Módulo: RHEMA (Promesas Diarias)
*   **Base de Datos 365:** Implementación de un ciclo anual completo de promesas bíblicas premium.
*   **Diseño Generativo:** Integración de la librería `html2canvas` para permitir al usuario descargar promesas con diseño editorial (fusión de texto + imagen de fondo).
*   **Conexión Etymos:** Cada promesa incluye el significado original de términos clave en Hebreo/Griego.
*   **Compartir Inteligente:** Uso de la Web Share API para una integración nativa en dispositivos móviles.

### 🖼️ Unificación Visual: El "Standard Hero"
*   **Centralización de Activos:** Creación de la carpeta `img/hero/` para gestionar todas las cabeceras del ecosistema.
*   **Identidad Visual:** Implementación de Heros cinemáticos con tipografía *Cinzel* en todos los módulos (Rhema, Aposento, Maná, Etymos, Imagen de Dios).
*   **Prompts de Autor:** Generación de un set de 32 prompts de IA para mantener la coherencia estética en todo el proyecto.

### 🏛️ Cátedra de Exégesis: Semana Shekhináh
*   **Currículum Avanzado:** Generación de 5 enseñanzas de alto nivel teológico para el módulo "A Imagen de Dios" (Lunes a Viernes).
*   **Ruta del Tabernáculo:** Un viaje inmersivo desde el Altar de Bronce hasta el Arca del Pacto, con conexiones dinámicas a Huellas, Cronos y Aposento.
*   **Inmersión en Lectura:** Las portadas de los estudios ahora se renderizan dentro del lector para una experiencia visual continua.

### 🛠️ Refuerzo Técnico y UX
*   **Retorno Inteligente:** Implementación de botones de "Volver al Estudio" en Etymos para usuarios que llegan desde la biblioteca, evitando la pérdida del hilo de lectura.
*   **Ordenamiento Cronológico:** Refactorización del motor de "A Imagen de Dios" para mezclar y ordenar estudios por fecha programada, creando una línea de tiempo unificada.
*   **Service Worker v66:** Actualización del sistema de caché con filtros de protocolo para evitar errores de extensiones del navegador.
*   **Blindaje de Componentes:** Refinamiento del script de limpieza de footers para proteger los elementos internos de las tarjetas.

---
*Desarrollado con excelencia por Domingo Curbeira — 2026*
