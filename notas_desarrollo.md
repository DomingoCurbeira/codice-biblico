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
- [ ] **Modo Offline Completo:** Reforce del Service Worker para que todo el contenido (incluyendo imágenes) sea accesible sin internet.
- [ ] **Audiolibro en Huellas:** Integrar el sistema de síntesis de voz de Aposento en las biografías de Huellas.

---

## 📅 Actualización: 9 de Mayo, 2026 (Salto Cuántico)
En esta jornada se ha completado la integración de contenidos de alta gama y la unificación visual definitiva del ecosistema.

### 💎 Nuevo Módulo: RHEMA (Promesas Diarias)
*   **Base de Datos 365:** Implementación de un ciclo anual completo de promesas bíblicas premium.
*   **Diseño Generativo:** Integración de la librería `html2canvas` para permitir al usuario descargar promesas con diseño editorial (fusión de texto + imagen de fondo).
*   **Conexión Etymos:** Cada promesa incluye el significado original de términos clave en Hebreo/Griego.
*   **Compartir Inteligente:** Uso de la Web Share API para una integración nativa en dispositivos móviles.

---

## 📅 Actualización: 13 de Mayo, 2026 (Persistencia y Propagación)
Esta fase se ha centrado en la **estabilidad del rastro de estudio** y la **centralización de herramientas sociales**, elevando la cohesión técnica de todo el ecosistema.

### 🔄 Persistencia Ecosistémica (LocalStorage)
*   **Migración de Rastro:** El sistema "Continuar donde lo dejaste" ha sido migrado de `sessionStorage` a `localStorage`. Ahora, el progreso de lectura persiste incluso después de cerrar el navegador.

---

## 📅 Actualización: 15 de Mayo, 2026 (La Era Premium y Arquitectos del Reino)
Esta jornada marca el salto definitivo a la **Calidad Editorial Premium** en todos los contenidos y la automatización del despliegue en la nube.

### 💎 Contenido Premium (Estudios y Huellas)
*   **ADN de Código Maestro:** Refactorización total de los 39 estudios temáticos y la colección completa de Huellas. Se han incorporado secciones de *Contexto Histórico*, *Léxico Profundo*, *Revelación de Atributos* y *Conexiones Cristocéntricas*.
*   **Inyección de Texto Bíblico:** Automatización de la carga de versículos (Reina Valera 1960) en cada enseñanza. Ahora las citas incluyen el texto íntegro para lectura inmediata sin salir de la app.
*   **Normalización de Concordancia:** Unificación visual de las referencias cruzadas bajo el tipo `concordancia`, fusionando texto y revelación con emojis descriptivos (📖).

### 🔥 El Aposento Maestro (Oración Profunda)
*   **Estructura SELAH:** Implementación de un flujo de oración de 3 fases (*Confrontación, Revelación, Decreto*) con pausas meditativas `[SELAH]` obligatorias.
*   **Expansión Masiva:** Recuperación y modernización de más de 70 oraciones de identidad, propósito y guerra espiritual.
*   **Índice Inteligente:** Creación de `indice_aposento.json` para la gestión escalable de temas y categorías de oración.

### 🏗️ Serie "Arquitectos del Reino"
*   **Currículum de Conquista:** Planificación e implementación de 5 nuevas enseñanzas programadas (Moisés, Josué, Noé, Abraham e Isaac) centradas en protocolos de gobierno.
*   **Schedules Activos:** Las enseñanzas se han configurado con fechas futuras (18-22 de Mayo) para activarse de forma orgánica en la plataforma.

### 🚀 Optimización de Despliegue y UX
*   **Control Editorial Total:** El motor de renderizado en `app.js` ha sido reprogramado para priorizar el orden manual definido en `indice_estudios.json` por encima de la cronología alfabética.
*   **Auto-Build en Netlify:** Configuración de `netlify.toml` y `.node-version` (v20) para automatizar el empaquetado del proyecto con cada `git push`.
*   **Service Worker v68:** Actualización forzosa de la caché global para asegurar que todos los usuarios reciban la versión Premium de inmediato.
*   **Sincronización Multicarpeta:** Automatización de réplicas en `/dist` y `/prototipos` para mantener la integridad del código en todas las ramas del desarrollo.

---
*Desarrollado con excelencia por Domingo Curbeira — 2026*

## 📅 Actualización: 20 de Mayo, 2026 (Ingeniería de la Revelación)
En esta jornada se ha culminado la transformación de los núcleos de inteligencia del Códice, elevando la interconexión técnica y teológica al máximo nivel.

### 🪪 Onomastiko Maestro (Identidad Suprema)
*   **Identidad de Origen:** Integración de **Jesús** como la Identidad Suprema al inicio de la biblioteca, con una estructura dual de fases: *Yeshúa* (Siervo Sufriente) y *Kyrios* (Rey de Gloria).
*   **Consolidación de Identidades:** Restauración de personajes omitidos (Nahúm, Malaquías) y adición de nuevos pilares apostólicos (Lucas, Priscila & Aquila, Onésimo).
*   **Sincronización Total:** Los 63 personajes han sido actualizados al Estándar Maestro, incluyendo *Misterio Escudriñado*, *Eco de Cristo* y *3 puntos de Transferencia* con citas de la Reina Valera 1960.
*   **Detección Inteligente:** Refactorización del motor `nombre.js` para manejar dinámicamente personajes con múltiples fases de transformación absoluta.

### 🧭 Cronos (Rutas Maestro)
*   **Itinerarios de Revelación:** Creación del estándar de "Rutas Maestro" con tres capas de datos por hito: *Transacción Legal*, *Misterio del Camino* y *Transferencia Territorial*.
*   **Mapeo de Trayectorias:** Implementación de las rutas de Abraham, Moisés, Noé, Jacob, José, David, Jesús, Jonás, Daniel y Pablo.
*   **Modo Enfoque:** El mapa ahora resalta visualmente los puntos de la trayectoria activa, atenuando el resto para una inmersión total.
*   **Pestaña "Rastro Profético":** Adición de una pestaña dinámica en el visor de Cronos que solo se activa al navegar por una ruta, entregando contenido geográfico exclusivo.

### 📜 Étymos Maestro (Los 70 Códigos de Oro)
*   **Purificación Léxica:** Reducción y curaduría de la biblioteca a una "Selección de Oro" de 70 términos fundamentales de alta gama.
*   **Hermenéutica Cristocéntrica:** Cada término ha sido redactado con un tono solemne, eliminando tecnicismos y añadiendo:
    *   **Eco de la Escritura:** Versículo íntegro en RVR1960.
    *   **Reflejo en la Tierra:** Parábolas de la vida cotidiana para aterrizar la revelación.
*   **Vínculo de Profundidad:** Sincronización masiva de conexiones; ahora los personajes de Onomastiko redirigen al **Concepto Técnico** que sostiene su diseño (ej. Aarón ➔ Kohén/Sacerdocio).

### 🛠️ Estabilidad y Despliegue (UX/Netlify)
*   **Blindaje de Rhema:** Refactorización del motor de descarga de imágenes migrando de DataURL a **Blobs binarios**, solucionando el error de visualización en Netlify.
*   **Seguridad de Carga (CORS):** Implementación de permisos de seguridad para tipografías y fondos, asegurando que las imágenes descargadas conserven toda su elegancia editorial.
*   **Optimización Mobile-First:** Ajuste de interfaces en Cronos y Onomastiko para garantizar la legibilidad en 4 pestañas simultáneas sin desbordamiento horizontal.

---
