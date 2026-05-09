document.addEventListener('DOMContentLoaded', () => {

    // --- 1. VARIABLES DE ESTADO ---
    let notas = JSON.parse(localStorage.getItem('codice_notas')) || [];
    let idNotaActiva = null;
    let currentSize = parseInt(localStorage.getItem('escriba_font_size')) || 18;

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

    // --- 3. FUNCIONES AUXILIARES ---
    const autoResize = (elm) => {
        if(!elm) return;
        elm.style.height = 'auto';
        elm.style.height = elm.scrollHeight + 'px';
    };

    const obtenerIconoNota = (titulo, cuerpo) => {
        const t = (titulo + cuerpo).toLowerCase();
        if (t.includes('maná')) return '🍞';
        if (t.includes('oración') || t.includes('aposento')) return '🔥';
        if (t.includes('etymos') || t.includes('raíz')) return '🔍';
        if (t.includes('cronos') || t.includes('mapa')) return '🌍';
        if (t.includes('personaje') || t.includes('huellas')) return '👣';
        return '🪶';
    };

    // --- 4. INICIALIZACIÓN ---
    renderizarLista();
    inicializarControlFuente();

    const params = new URLSearchParams(window.location.search);
    const refTitulo = params.get('titulo');
    const refCuerpo = params.get('cuerpo');

    if (refTitulo) {
        const nuevaNota = {
            id: Date.now().toString(),
            titulo: refTitulo,
            cuerpo: refCuerpo || "",
            fecha: new Date().toISOString()
        };
        notas.unshift(nuevaNota);
        guardarLocal();
        renderizarLista();
        activarNota(nuevaNota.id);
        containerApp.classList.add('view-note');
        if(inputCuerpo) inputCuerpo.focus();
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // --- 5. FUNCIONES PRINCIPALES ---

    function guardarLocal() {
        localStorage.setItem('codice_notas', JSON.stringify(notas));
    }

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
        
        // Activamos la nota e indicamos que estamos en vista editor
        activarNota(nuevaNota.id);
        containerApp.classList.remove('view-list');
        containerApp.classList.add('view-note');
        
        // Forzamos el foco con un pequeño delay para la transición de móvil
        setTimeout(() => {
            if(inputTitulo) {
                inputTitulo.focus();
                // Scroll al inicio del editor por si acaso
                document.querySelector('.editor-content').scrollTop = 0;
            }
        }, 400);
    }

    function renderizarLista(filtro = "") {
        if(!listaNotasDOM) return;
        listaNotasDOM.innerHTML = "";
        
        const notasFiltradas = notas.filter(n => {
            const texto = (n.titulo + n.cuerpo).toLowerCase();
            return texto.includes(filtro.toLowerCase());
        });

        if (notasFiltradas.length === 0) {
            listaNotasDOM.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; color: #64748b; font-size: 0.9rem;">
                    ${notas.length === 0 ? 'Tu diario está esperando <br>la primera revelación.' : 'No se hallaron registros.'}
                </div>`;
            return;
        }

        notasFiltradas.forEach(nota => {
            const div = document.createElement('div');
            div.classList.add('note-item');
            if (nota.id === idNotaActiva) div.classList.add('active');
            
            const fecha = new Date(nota.fecha).toLocaleDateString('es-ES', { 
                day: 'numeric', month: 'short'
            });
            const icono = obtenerIconoNota(nota.titulo, nota.cuerpo);

            div.innerHTML = `
                <div class="note-icon">${icono}</div>
                <div class="note-info">
                    <h3>${nota.titulo.trim() || "Sin Título"}</h3>
                    <p>${nota.cuerpo.trim() || "Escribiendo..."}</p>
                    <span class="date">${fecha}</span>
                </div>
            `;

            div.addEventListener('click', () => {
                activarNota(nota.id);
                containerApp.classList.add('view-note');
            });
            listaNotasDOM.appendChild(div);
        });
    }

    function activarNota(id) {
        idNotaActiva = id;
        const nota = notas.find(n => n.id === id);
        if (!nota) return;

        if(inputTitulo) inputTitulo.value = nota.titulo;
        if(inputCuerpo) inputCuerpo.value = nota.cuerpo;
        if(spanFecha) spanFecha.innerText = `Editado: ${new Date(nota.fecha).toLocaleString()}`;

        const emptyState = document.getElementById('empty-state');
        if(emptyState) emptyState.classList.add('hidden');
        
        if(inputCuerpo) autoResize(inputCuerpo);
        renderizarLista(inputBuscador ? inputBuscador.value : ""); 
    }

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

    function inicializarControlFuente() {
        if (document.getElementById('btn-font-toggle')) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'font-control-wrapper';
        wrapper.innerHTML = `
            <button id="btn-font-toggle" class="btn-font-toggle" title="Ajustar texto"><i class="fas fa-font"></i></button>
            <div id="font-panel" class="font-control-panel">
                <button id="btn-font-up" class="btn-font-action">A+</button>
                <button id="btn-font-down" class="btn-font-action">A-</button>
            </div>
        `;
        document.body.appendChild(wrapper);
        const panel = document.getElementById('font-panel');
        const btnToggle = document.getElementById('btn-font-toggle');
        
        document.documentElement.style.setProperty('--reading-size', currentSize + 'px');
        
        btnToggle.onclick = (e) => { e.stopPropagation(); panel.classList.toggle('active'); };
        document.getElementById('btn-font-up').onclick = () => {
            if (currentSize < 32) { currentSize += 2; document.documentElement.style.setProperty('--reading-size', currentSize + 'px'); localStorage.setItem('escriba_font_size', currentSize); }
        };
        document.getElementById('btn-font-down').onclick = () => {
            if (currentSize > 14) { currentSize -= 2; document.documentElement.style.setProperty('--reading-size', currentSize + 'px'); localStorage.setItem('escriba_font_size', currentSize); }
        };
        document.addEventListener('click', () => panel.classList.remove('active'));
    }

    // --- 6. EVENT LISTENERS ---
    if(btnNueva) btnNueva.addEventListener('click', crearNota);
    
    if(btnBorrar) btnBorrar.addEventListener('click', () => {
        if (!idNotaActiva) return;
        Swal.fire({
            title: '¿Archivar permanentemente?',
            text: "Este registro se perderá en el tiempo.",
            icon: 'warning', background: '#161b22', color: '#f1f5f9',
            showCancelButton: true, confirmButtonColor: '#f85149', confirmButtonText: 'Borrar'
        }).then((result) => { // Corregido: 'result' en lugar de 'res'
            if (result.isConfirmed) {
                notas = notas.filter(n => n.id !== idNotaActiva);
                guardarLocal(); 
                idNotaActiva = null;
                renderizarLista(); 
                containerApp.classList.remove('view-note');
                document.getElementById('empty-state').classList.remove('hidden');
                
                Swal.fire({
                    toast: true, position: 'top-end', showConfirmButton: false, timer: 1500,
                    background: '#161b22', color: '#fff', icon: 'success', title: 'Registro archivado'
                });
            }
        });
    });

    if(btnVolver) btnVolver.addEventListener('click', () => {
        containerApp.classList.remove('view-note');
        // En escritorio, mostramos el dashboard vacío de nuevo
        if (window.innerWidth > 768) {
            document.getElementById('empty-state').classList.remove('hidden');
            idNotaActiva = null;
            renderizarLista();
        }
    });
    if(inputTitulo) inputTitulo.addEventListener('input', actualizarNotaActual);
    if(inputCuerpo) inputCuerpo.addEventListener('input', function() { autoResize(this); actualizarNotaActual(); });
    if(inputBuscador) inputBuscador.addEventListener('input', (e) => renderizarLista(e.target.value));

    const btnDownload = document.getElementById('btn-download');
    
    // --- MEJORA FINAL: COMPARTIR NOTA ---
    const btnShareNota = document.getElementById('btn-share-nota');
    if (btnShareNota) {
        btnShareNota.addEventListener('click', async () => {
            if (!idNotaActiva) return;
            const nota = notas.find(n => n.id === idNotaActiva);
            if (!nota) return;

            const titulo = nota.titulo || "Nota sin título";
            const texto = nota.cuerpo || "";
            const firma = "\n\n📝 Escrito en mi diario de Códice Bíblico.";
            
            const shareData = {
                title: titulo,
                text: `${titulo}\n\n${texto}${firma}`,
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.log('Error al compartir:', err);
                }
            } else {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text)}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    }

    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(notas, null, 2)], { type: "application/json" });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
            a.download = `Escriba_Backup_${new Date().toISOString().slice(0,10)}.json`; a.click();
        });
    }

    const fileUpload = document.getElementById('file-upload');
    if (fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const imported = JSON.parse(ev.target.result);
                    if (Array.isArray(imported)) {
                        notas = imported; guardarLocal(); renderizarLista();
                        Swal.fire('Éxito', 'Registros restaurados.', 'success');
                    }
                } catch (err) { Swal.fire('Error', 'Archivo no válido.', 'error'); }
            };
            reader.readAsText(file);
        });
    }
});
