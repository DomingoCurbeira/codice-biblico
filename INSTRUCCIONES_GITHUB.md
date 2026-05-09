# 🚀 Guía de Actualización: Códice Bíblico Premium a GitHub

Esta guía te ayudará a reemplazar tu proyecto antiguo por esta nueva versión premium de forma segura, manteniendo la conexión con GitHub y Netlify.

---

## ⚠️ El Secreto: La carpeta `.git`
Tu carpeta original (`codice`) contiene una carpeta **oculta** llamada `.git`. Esta es la que tiene la "antena" que sabe a qué repositorio de GitHub debe enviar los archivos. **No debemos borrarla ni perderla.**

---

## 🛠️ Procedimiento Recomendado (El más seguro)

Sigue estos pasos para que Git detecte el cambio como una actualización masiva y no como un error:

### 1. Preparar las carpetas
*   Asegúrate de tener localizadas las dos carpetas:
    *   `codice` (La original vinculada a GitHub).
    *   `codice-copia` (Esta versión nueva con todas las mejoras).

### 2. Limpiar el proyecto antiguo
*   Entra en tu carpeta original `codice`.
*   **Borra todo el contenido** (archivos y carpetas) **EXCEPTO** la carpeta oculta `.git`.
    *   *Tip:* En Mac, pulsa `Comando + Shift + Punto (.)` para ver la carpeta `.git` si no aparece.

### 3. Trasvasar el nuevo código
*   Entra en esta carpeta `codice-copia`.
*   **Copia todo su contenido** (incluyendo el nuevo `js/`, `mana/`, `huellas/`, etc.).
*   **Pégalo** dentro de la carpeta `codice` (la que ahora solo tiene la carpeta `.git`).

### 4. Realizar el Commit en Visual Studio Code
*   Abre la carpeta `codice` en VS Code.
*   Ve a la pestaña de **Control de Código Fuente** (el icono del nodo). Verás que hay cientos de cambios.
*   Pulsa el botón **"+"** (Stage All Changes) para preparar todos los archivos.
*   Escribe un mensaje épico para el commit, por ejemplo:
    > `Refactorización total: Códice Bíblico Premium v2.0`
*   Pulsa el botón **Commit**.

### 5. Subir a la nube (Push)
*   Pulsa en **Sync Changes** o haz un `git push` desde la terminal.

---

## ✅ ¿Qué pasará después?

1.  **GitHub:** Recibirá todos los archivos nuevos y las mejoras. Verás que las carpetas antiguas se han ido y han aparecido las nuevas que creamos hoy.
2.  **Netlify:** Detectará el cambio automáticamente. Empezará a compilar la nueva versión y, en unos 2-3 minutos, tu web estará actualizada en vivo con el Hero, la grilla magazine, el mapa inmersivo y el santuario de oración.

---
*Nota: Una vez que confirmes que todo está en vivo y funcionando en Netlify, puedes borrar la carpeta `codice-copia` y quedarte solo con tu carpeta `codice` oficial.*
