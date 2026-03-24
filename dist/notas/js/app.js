document.addEventListener('DOMContentLoaded', () => {

    // --- 1. VARIABLES DE ESTADO ---
    let notas = JSON.parse(localStorage.getItem('codice_notas')) || [];
    let idNotaActiva = null;

    // --- 2. ELEMENTOS DEL DOM ---
    const listaNotasDOM = document.getElementById('lista-notas');
    const btnNueva = document.getElementById('btn-nueva');
    const inputBuscador = document.getElementById('buscador');
    
    // Editor
    const containerApp = document.querySelector('.app-container');
    const inputTitulo = document.getElementById('nota-titulo');
    const inputCuerpo = document.getElementById('nota-cuerpo');
    const spanFecha = document.getElementById('editor-date');
    const btnBorrar = document.getElementById('btn-borrar');
    const btnVolver = document.getElementById('btn-volver'); 

    // --- 3. FUNCIONES AUXILIARES (Helpers) ---
    // Definimos esto antes para evitar errores
    const autoResize = (elm) => {
        if(!elm) return;
        elm.style.height = 'auto';
        elm.style.height = elm.scrollHeight + 'px';
    };

    // --- 4. INICIALIZACIÓN ---
    renderizarLista();

    // Detectar si venimos de otra app (Deep Linking)
    const params = new URLSearchParams(window.location.search);
    const refTitulo = params.get('titulo');
    const refCuerpo = params.get('cuerpo');

    if (refTitulo) {
        // 1. Creamos la nota automáticamente
        const nuevaNota = {
            id: Date.now().toString(),
            titulo: refTitulo, // Usamos el título que nos pasaron
            cuerpo: refCuerpo || "", // Y el cuerpo (o vacío)
            fecha: new Date().toISOString()
        };

        // 2. Guardamos
        notas.unshift(nuevaNota);
        guardarLocal();
        renderizarLista();
        
        // 3. Abrimos el editor directamente
        activarNota(nuevaNota.id);
        containerApp.classList.add('view-note'); // Para móvil
        if(inputCuerpo) inputCuerpo.focus(); // Foco en el cuerpo para seguir escribiendo

        // 4. Limpiamos la URL para que si refresca no se cree otra vez
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // 5. Aviso bonito
        const Toast = Swal.mixin({
            toast: true, position: 'top-end', showConfirmButton: false,
            timer: 2000, background: '#1e293b', color: '#d4b483'
        });
        Toast.fire({ icon: 'success', title: 'Nota creada desde referencia' });
    }

    // --- 5. FUNCIONES PRINCIPALES ---

    // A) Guardar
    function guardarLocal() {
        localStorage.setItem('codice_notas', JSON.stringify(notas));
    }

    // B) Crear
    function crearNota() {
        const nuevaNota = {
            id: Date.now().toString(),
            titulo: "",
            cuerpo: "",
            fecha: new Date().toISOString()
        };

        notas.unshift(nuevaNota);
        guardarLocal();
        renderizarLista();
        activarNota(nuevaNota.id);
        
        containerApp.classList.add('view-note');
        if(inputTitulo) inputTitulo.focus();
        
        const Toast = Swal.mixin({
            toast: true, position: 'top-end', showConfirmButton: false,
            timer: 1500, background: '#1e293b', color: '#d4b483', iconColor: '#d4b483'
        });
        Toast.fire({ icon: 'success', title: 'Nueva nota creada' });
    }

    // C) Renderizar Lista
    function renderizarLista(filtro = "") {
        if(!listaNotasDOM) return;
        listaNotasDOM.innerHTML = "";
        
        const notasFiltradas = notas.filter(n => {
            const texto = (n.titulo + n.cuerpo).toLowerCase();
            return texto.includes(filtro.toLowerCase());
        });

        if (notasFiltradas.length === 0) {
            listaNotasDOM.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 0.9rem;">
                    ${notas.length === 0 ? 'No tienes notas aún. <br>¡Crea la primera!' : 'No se encontraron notas.'}
                </div>`;
            return;
        }

        notasFiltradas.forEach(nota => {
            const div = document.createElement('div');
            div.classList.add('note-item');
            if (nota.id === idNotaActiva) div.classList.add('active');
            
            const fecha = new Date(nota.fecha).toLocaleDateString('es-ES', { 
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
            });
            const tituloMostrar = nota.titulo.trim() || "Sin Título";
            const cuerpoMostrar = nota.cuerpo.trim() || "Texto vacío...";

            div.innerHTML = `
                <h3>${tituloMostrar}</h3>
                <p>${cuerpoMostrar}</p>
                <span class="date">${fecha}</span>
            `;

            div.addEventListener('click', () => {
                activarNota(nota.id);
                containerApp.classList.add('view-note');
            });

            listaNotasDOM.appendChild(div);
        });
    }

    // D) Activar Nota
    function activarNota(id) {
        idNotaActiva = id;
        const nota = notas.find(n => n.id === id);
        if (!nota) return;

        if(inputTitulo) inputTitulo.value = nota.titulo;
        if(inputCuerpo) inputCuerpo.value = nota.cuerpo;
        if(spanFecha) spanFecha.innerText = `Editado: ${new Date(nota.fecha).toLocaleString()}`;

        renderizarLista(inputBuscador ? inputBuscador.value : ""); 

        // Ocultar estado vacío y mostrar editor
        const emptyState = document.getElementById('empty-state');
        if(emptyState) emptyState.classList.add('hidden');
        
        // Ajustar altura del texto
        if(inputCuerpo) autoResize(inputCuerpo);
    }

    // E) Actualizar
    function actualizarNotaActual() {
        if (!idNotaActiva) return;
        const notaIndex = notas.findIndex(n => n.id === idNotaActiva);
        if (notaIndex === -1) return;

        notas[notaIndex].titulo = inputTitulo.value;
        notas[notaIndex].cuerpo = inputCuerpo.value;
        notas[notaIndex].fecha = new Date().toISOString();

        guardarLocal();
        renderizarLista(inputBuscador ? inputBuscador.value : "");
    }

    // F) Borrar
    function borrarNota() {
        if (!idNotaActiva) return;
        
        Swal.fire({
            title: '¿Borrar esta nota?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            background: '#1e293b', color: '#e2e8f0',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, borrar', cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                notas = notas.filter(n => n.id !== idNotaActiva);
                guardarLocal();
                idNotaActiva = null;
                if(inputTitulo) inputTitulo.value = "";
                if(inputCuerpo) inputCuerpo.value = "";
                
                renderizarLista();
                containerApp.classList.remove('view-note');
                
                // Volver a mostrar estado vacío
                const emptyState = document.getElementById('empty-state');
                if(emptyState) emptyState.classList.remove('hidden');

                const Toast = Swal.mixin({
                    toast: true, position: 'top-end', showConfirmButton: false,
                    timer: 2000, background: '#1e293b', color: '#fff'
                });
                Toast.fire({ icon: 'success', title: 'Nota eliminada' });
            }
        });
    }

    // --- 6. EVENT LISTENERS ---

    if(btnNueva) btnNueva.addEventListener('click', crearNota);
    if(btnBorrar) btnBorrar.addEventListener('click', borrarNota);
    if(btnVolver) btnVolver.addEventListener('click', () => containerApp.classList.remove('view-note'));

    if(inputTitulo) inputTitulo.addEventListener('input', actualizarNotaActual);
    if(inputCuerpo) inputCuerpo.addEventListener('input', function() {
        autoResize(this);
        actualizarNotaActual();
    });

    if(inputBuscador) inputBuscador.addEventListener('input', (e) => renderizarLista(e.target.value));

    // Atajos de teclado
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const Toast = Swal.mixin({
                toast: true, position: 'top-end', showConfirmButton: false, 
                timer: 1000, background: '#1e293b', color: '#10b981'
            });
            Toast.fire({ icon: 'success', title: 'Guardado' });
        }
    });

    // --- 7. BACKUP Y RESTAURACIÓN ---
    const btnDownload = document.getElementById('btn-download');
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            const dataStr = JSON.stringify(notas, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Códice_Notas_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            Swal.fire({
                icon: 'success', title: 'Copia descargada',
                background: '#1e293b', color: '#fff'
            });
        });
    }

    const fileUpload = document.getElementById('file-upload');
    if (fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedNotes = JSON.parse(event.target.result);
                    if (Array.isArray(importedNotes)) {
                        Swal.fire({
                            title: '¿Restaurar notas?',
                            text: "Se reemplazarán las notas actuales.",
                            icon: 'warning', showCancelButton: true,
                            confirmButtonText: 'Sí, restaurar', background: '#1e293b', color: '#fff'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                notas = importedNotes;
                                guardarLocal();
                                renderizarLista();
                                Swal.fire('¡Listo!', 'Notas restauradas.', 'success');
                            }
                        });
                    }
                } catch (err) { Swal.fire('Error', 'Archivo no válido.', 'error'); }
            };
            reader.readAsText(file);
        });
    }

    // --- 9. LÓGICA DEL LAUNCHER (ECOSISTEMA) ---
    const btnLauncher = document.getElementById('btn-launcher');
    const ecoMenu = document.getElementById('eco-menu');

    if (btnLauncher && ecoMenu) {
        btnLauncher.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que se cierre inmediatamente
            ecoMenu.classList.toggle('hidden');
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!ecoMenu.contains(e.target) && !btnLauncher.contains(e.target)) {
                ecoMenu.classList.add('hidden');
            }
        });
    }

    // --- MEJORA FINAL: COMPARTIR NOTA ---
    const btnShareNota = document.getElementById('btn-share-nota');
    
    if (btnShareNota) {
        btnShareNota.addEventListener('click', async () => {
            // 1. Validar que haya nota activa
            if (!idNotaActiva) return;
            const nota = notas.find(n => n.id === idNotaActiva);
            if (!nota) return;

            // 2. Preparar el texto
            const titulo = nota.titulo || "Nota sin título";
            const texto = nota.cuerpo || "";
            const firma = "\n\n📝 Escrito en mi diario de Códice Bíblico.";
            
            const shareData = {
                title: titulo,
                text: `${titulo}\n\n${texto}${firma}`,
            };

            // 3. Intentar usar el compartidor nativo del celular
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.log('Error al compartir o cancelado:', err);
                }
            } else {
                // 4. Fallback para PC (WhatsApp Web)
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text)}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    }

    // --- 8. FOOTER ---
    renderizarFooter();
});

// Footer fuera del evento principal
function renderizarFooter() {
    if (document.querySelector('.app-footer')) return;
    const nombreDesarrollador = "Domingo Curbeira"; 
    const year = new Date().getFullYear();
    const footerHTML = `
        <footer class="app-footer" style="padding: 20px 0; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: auto; text-align: center;">
            <div class="footer-content">
                <a href="../index.html" class="footer-brand" style="text-decoration: none; color: #e2e8f0; display: inline-block; margin-bottom: 5px; cursor: pointer;">
                    <span style="font-size: 1.1em;">📜</span> Códice Bíblico
                </a>
                
                <p class="footer-dev" style="color: #64748b; margin: 0;">
                    Desarrollado por <span style="color:#d4b483">${nombreDesarrollador}</span>
                </p>
                <p class="footer-year" style="color:#475569; margin: 0; font-size: 0.7rem;">© ${year}</p>
            </div>
        </footer>
    `;
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.insertAdjacentHTML('beforeend', footerHTML);
}