document.addEventListener('DOMContentLoaded', async () => {
    
    // DOM Elements
    const listaDom = document.getElementById('lista-estudios');
    const readerHeader = document.getElementById('reader-header');
    
    // Modal Elements
    const modal = document.getElementById('modal-biblia');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalTexto = document.getElementById('modal-texto');
    const modalClose = document.querySelector('.modal-close');

    // Función para abrir el modal
    window.abrirModal = function(cita, texto) {
        if(!modal) return;
        modalTitulo.innerText = cita;
        modalTexto.innerText = `"${texto}"`;
        modal.classList.add('active'); // Usamos clase active para animación CSS
        modal.classList.remove('hidden'); 
    }

    // Cerrar modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 300); // Esperar animación
        });
    }

    // Cerrar al hacer clic fuera
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        });
    }

    // Cargar Datos
    let estudios = [];
    try {
        const respuesta = await fetch('data/estudios.json');
        const data = await respuesta.json();
        estudios = data.estudios;
    } catch (error) {
        console.error("Error cargando JSON", error);
        return;
    }

    // --- MODO 1: LISTA (index.html) ---
    if (listaDom) {
        listaDom.innerHTML = '';
        estudios.forEach(estudio => {
            const card = document.createElement('article');
            card.className = 'card-estudio';
            const tagsHtml = estudio.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            card.innerHTML = `
                <div class="card-meta">
                    <span>${estudio.fecha}</span>
                    <span>⏱ ${estudio.tiempo_lectura}</span>
                </div>
                <h2 class="card-title">${estudio.titulo}</h2>
                <p class="card-excerpt">${estudio.subtitulo}</p>
                <div class="tags">${tagsHtml}</div>
            `;
            
            card.addEventListener('click', () => {
                window.location.href = `leer.html?id=${estudio.id}`;
            });
            listaDom.appendChild(card);
        });
    }

    // --- MODO 2: LECTOR (leer.html) ---
    if (readerHeader) {
        const params = new URLSearchParams(window.location.search);
        const idBuscado = params.get('id');
        const estudio = estudios.find(e => e.id === idBuscado);

        if (estudio) {
            // 1. Header
            readerHeader.innerHTML = `
                <div class="card-meta">${estudio.fecha} • ${estudio.autor}</div>
                <h1 class="reader-title">${estudio.titulo}</h1>
                <p style="color:var(--text-muted)">${estudio.subtitulo}</p>
            `;

            const contentDom = document.getElementById('reader-content');
            let htmlContent = ''; 

            // --- VERSÍCULO CLAVE 🔑 ---
            if (estudio.versiculo_clave) {
                htmlContent += `
                    <div class="key-verse-box">
                        <p class="key-verse-text">"${estudio.versiculo_clave.texto}"</p>
                        <span class="key-verse-cite">— ${estudio.versiculo_clave.cita}</span>
                    </div>
                `;
            }

            // Contexto Histórico
            if (estudio.contexto_historico) {
                htmlContent += `
                    <div class="context-box">
                        <span class="context-label">Contexto Histórico</span>
                        <p class="context-text">${estudio.contexto_historico}</p>
                    </div>
                `;
            }

            // Contenido Principal
            if (estudio.contenido) {
                estudio.contenido.forEach(bloque => {
                    if (bloque.tipo === 'parrafo') {
                        htmlContent += `<p>${bloque.texto}</p>`;
                    } 
                    else if (bloque.tipo === 'subtitulo') {
                        htmlContent += `<h3>${bloque.texto}</h3>`;
                    }
                    else if (bloque.tipo === 'versiculo') {
                        htmlContent += `
                            <blockquote class="biblical-quote">
                                "${bloque.texto}"
                                <span class="biblical-cite">— ${bloque.cita}</span>
                            </blockquote>
                        `;
                    }
                });
            }

            // Raíces
            if (estudio.palabras_clave) {
                htmlContent += `<div class="roots-section"><h3 class="section-title">Profundizando en el Original</h3><div class="roots-grid">`;
                estudio.palabras_clave.forEach(palabra => {
                    htmlContent += `
                        <div class="root-card">
                            <div class="root-word">${palabra.palabra}</div>
                            <span class="root-origin">${palabra.origen}</span>
                            <p class="root-meaning">${palabra.significado}</p>
                        </div>
                    `;
                });
                htmlContent += `</div></div>`;
            }

            // --- RED BÍBLICA INTERACTIVA 🔗 ---
            if (estudio.referencias_cruzadas) {
                htmlContent += `<div class="roots-section"><h3 class="section-title">Red Bíblica (Concordancia)</h3><div class="refs-list">`;
                
                estudio.referencias_cruzadas.forEach(ref => {
                    const textoSafe = ref.texto.replace(/"/g, "&quot;");
                    htmlContent += `
                        <button class="ref-btn" onclick="abrirModal('${ref.cita}', '${textoSafe}')">
                            <div>
                                <span class="ref-cite-text">${ref.cita}</span>
                                <span class="ref-note-text">${ref.nota}</span>
                            </div>
                            <span class="icon-eye">👁️</span>
                        </button>
                    `;
                });
                htmlContent += `</div></div>`;
            }

            // Desafío
            if (estudio.desafio_practico) {
                htmlContent += `
                    <div class="challenge-box">
                        <span class="challenge-icon">🔥</span>
                        <p class="challenge-text">"${estudio.desafio_practico}"</p>
                    </div>
                `;
            }
            console.log(estudios);
            // Ecosistema (Botones de Apps)
            if (estudio.conexiones) {
                htmlContent += `<div class="ecosystem-links">
                                <h3 class="ecosystem-title">Profundiza en el Ecosistema</h3>
                                <div class="ecosystem-grid">`;
                
                // Conexión Cronos
                if (estudio.conexiones.cronos) {
                    htmlContent += `
                        <button class="btn-eco btn-cronos" onclick="window.location.href='../cronos/index.html?lugar=${estudio.conexiones.cronos.lugar_id}'">
                            <span class="eco-icon">🗺️</span>
                            <div>
                                <span class="eco-label">Ubicación (Cronos)</span>
                                <span class="eco-value">${estudio.conexiones.cronos.lugar}</span>
                            </div>
                        </button>
                    `;
                }
                
                // Conexión Huellas (ACTUALIZADO: Ahora lleva al perfil real)
                if (estudio.conexiones.huellas) {
                     estudio.conexiones.huellas.forEach(p => {
                        // Usamos el ID del personaje si existe en el JSON
                        const pID = p.id || p.nombre.toLowerCase(); 
                        htmlContent += `
                            <button class="btn-eco btn-huellas" onclick="window.location.href='../huellas/perfil.html?id=${pID}'">
                                <span class="eco-icon">👣</span>
                                <div>
                                    <span class="eco-label">Protagonista</span>
                                    <span class="eco-value">${p.nombre}</span>
                                </div>
                            </button>`;
                     });
                }
                htmlContent += `</div></div>`;
            }

            // --- NUEVO: SECCIÓN COMPARTIR (HTML) ---
            htmlContent += `
                <div class="study-share-section">
                    <h3 class="share-title">Compartir este Estudio</h3>
                    <div class="share-actions">
                        <button id="btn-wa" class="btn-share wa" aria-label="Compartir en WhatsApp">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </button>

                        <button id="btn-fb" class="btn-share fb" aria-label="Compartir en Facebook">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </button>

                        <button id="btn-copy" class="btn-share copy" aria-label="Copiar Enlace">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                    </div>
                </div>
            `;

            // INYECTAR TODO EL CONTENIDO
            contentDom.innerHTML = htmlContent;
            document.title = `${estudio.titulo} | A Imagen`;

            // --- NUEVO: ACTIVAR FUNCIONALIDAD COMPARTIR (JS) ---
            // Esto debe ir DESPUÉS de contentDom.innerHTML para que existan los botones
            const btnWa = document.getElementById('btn-wa');
            const btnFb = document.getElementById('btn-fb');
            const btnCopy = document.getElementById('btn-copy');

            if (btnWa && btnFb && btnCopy) {
                const currentUrl = window.location.href;
                const studyTitle = estudio.titulo || "Estudio Bíblico";
                const shareText = `Te comparto este estudio de A Imagen: "${studyTitle}". Léelo aquí:`;

                // WhatsApp
                btnWa.onclick = () => {
                    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
                };

                // Facebook
                btnFb.onclick = () => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
                };

                // Copiar Enlace
                btnCopy.onclick = () => {
                    navigator.clipboard.writeText(currentUrl).then(() => {
                        btnCopy.classList.add('copied');
                        const originalIcon = btnCopy.innerHTML;
                        btnCopy.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                        setTimeout(() => {
                            btnCopy.classList.remove('copied');
                            btnCopy.innerHTML = originalIcon;
                        }, 2000);
                    }).catch(err => {
                        console.error('Error al copiar: ', err);
                    });
                };
            }

        } else {
            readerHeader.innerHTML = `<h1>Estudio no encontrado 😕</h1>`;
        }
    }
});