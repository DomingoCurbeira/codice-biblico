# 📝 TODO: Limpieza Final de Secciones de Compartir

Este documento sirve como recordatorio para la fase final de limpieza del ecosistema Códice Bíblico, tras la centralización de la botonera de compartir en el `global-footer.js`.

---

## 🧹 Tareas Pendientes

### 1. Limpieza de HTML (Eliminar secciones de compartir duplicadas)
- [ ] **etymos/palabra.html**: Eliminar `<h3 class="share-title">` y el div con los botones `btn-share`.
- [ ] **mana/lectura.html**: Eliminar la sección completa de `<h3 class="share-title">` y sus botones.
- [ ] **juego/index.html**: Revisar si `btn-share` es necesario o si debe usar la lógica global.
- [ ] **notas/index.html**: Revisar si `btn-share-nota` es necesario o si debe usar la lógica global.
- [ ] **rhema/index.html**: Eliminar el botón `#btn-share` local ya que el footer lo cubre.

### 2. Limpieza de CSS (Eliminar estilos redundantes)
Eliminar las definiciones de `.study-share-section`, `.btn-share` y similares en los siguientes archivos para reducir el peso del CSS:
- [ ] **a_imagen_de_Dios/css/styles.css**
- [ ] **aposento/css/styles.css**
- [ ] **etymos/css/palabra.css**
- [ ] **huellas/css/styles.css**

### 3. Verificación de Excepciones
- [ ] **Cronos**: Asegurarse de **NO** eliminar las secciones de compartir de Cronos, ya que no tiene footer global por diseño.

---
*Nota: La lógica de compartir ya ha sido eliminada de los archivos .js hoy. Solo queda la limpieza visual y estructural.*
