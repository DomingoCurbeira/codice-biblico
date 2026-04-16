document.addEventListener('DOMContentLoaded', () => {
            
    // --- LÓGICA DEL MENÚ LAUNCHER ---
    const btnLauncher = document.getElementById('btn-launcher');
    const ecoMenu = document.getElementById('eco-menu');
    if (btnLauncher && ecoMenu) {
        btnLauncher.addEventListener('click', (e) => {
            e.stopPropagation();
            ecoMenu.classList.toggle('active');
            btnLauncher.style.transform = ecoMenu.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
        });
        document.addEventListener('click', (e) => {
            if (!ecoMenu.contains(e.target) && !btnLauncher.contains(e.target)) {
                ecoMenu.classList.remove('active');
                btnLauncher.style.transform = 'rotate(0deg)';
            }
        });
    }

    // --- LÓGICA DE DETALLE DE PALABRA ---
    const contenedorDetalle = document.getElementById('detalle-contenido');
    const loadingMsg = document.getElementById('loading-msg');

    // 1. Obtener parámetros de la URL
    const parametrosURL = new URLSearchParams(window.location.search);
    const palabraId = parametrosURL.get('id');
    const retornoId = parametrosURL.get('retorno'); // <--- Capturamos el retorno aquí

    if (!palabraId) {
        mostrarError("No se especificó ninguna palabra para estudiar.");
        return;
    }

    // 2. Cargar el JSON y buscar la palabra
    async function cargarPalabra() {
        try {
            const respuesta = await fetch('../data/etymos/lexico.json'); 
            if (!respuesta.ok) throw new Error("Error al leer el códice.");
            
            const lexico = await respuesta.json();
            const palabra = lexico.find(p => p.id === palabraId);

            if (palabra) {
                renderizarDetalle(palabra);
            } else {
                mostrarError("La palabra que buscas no se encuentra en nuestros registros.");
            }
        } catch (error) {
            mostrarError("Hubo un problema de conexión al buscar el significado.");
        }
    }

    // 3. Pintar la información en pantalla
    function renderizarDetalle(palabra) {
        document.title = `Etymos | ${palabra.original} (${palabra.palabra_espanol})`;

        // LÓGICA DEL BOTÓN DE REGRESO (Generamos el HTML solo si existe retornoId)
        let botonRegresoHtml = '';
        if (retornoId) {
            botonRegresoHtml = `
                <div style="margin-bottom: 20px;">
                    <a href="../onomastiko/nombre.html?id=${retornoId}" class="btn-regreso-onomastiko" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: #10b981; font-weight: 600; font-size: 0.9rem; background: rgba(16, 185, 129, 0.1); padding: 8px 15px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.2); transition: all 0.3s ease;">
                        <span>🆔</span> Regresar al Perfil
                    </a>
                </div>
            `;
        }

        // Preparar links para compartir
        const urlActual = encodeURIComponent(window.location.href);
        const textoCompartir = encodeURIComponent(`¡Mira el profundo significado original de "${palabra.palabra_espanol}" (${palabra.original}) en la Biblia! 📖✨\n\n`);
        const linkWA = `https://api.whatsapp.com/send?text=${textoCompartir}${urlActual}`;
        const linkFB = `https://www.facebook.com/sharer/sharer.php?u=${urlActual}`;

        // Construir el HTML interno
        contenedorDetalle.innerHTML = `
            ${botonRegresoHtml}
            <div class="detalle-header">
                <div class="detalle-original">${palabra.original}</div>
                <span class="detalle-transliteracion">${palabra.transliteracion}</span>
                <div class="detalle-meta">
                    <span>📜 ${palabra.idioma}</span>
                    ${palabra.strong ? `<span>🔢 Strong: ${palabra.strong}</span>` : ''}
                </div>
                <h2 style="font-size: 1.8rem; margin-top: 15px; color: #fff;">${palabra.palabra_espanol}</h2>
            </div>

            <div class="detalle-seccion">
                <h3>Definición Base</h3>
                <p><strong>Raíz:</strong> ${palabra.raiz}</p>
                <p>${palabra.definicion_corta}</p>
            </div>

            <div class="detalle-seccion">
                <h3>Contexto Cultural e Histórico</h3>
                <p>${palabra.contexto_cultural}</p>
            </div>

            <div class="detalle-seccion" style="background: rgba(15, 23, 42, 0.6); padding: 15px; border-left: 4px solid #10b981; border-radius: 0 8px 8px 0;">
                <h3 style="color: #10b981; border: none; padding: 0;">📖 Uso Bíblico</h3>
                <p style="font-style: italic; font-size: 0.95rem;">"${palabra.ejemplo_biblico}"</p>
            </div>

            <div class="perla-caja">
                <h3>✨ Perla Espiritual</h3>
                <p>${palabra.perla_espiritual}</p>
            </div>

            <div class="etymos-share-section">
                <h3 class="share-title">COMPARTIR ESTA PALABRA</h3>
                <div class="share-actions">
                    <button id="btn-nota-lexico" class="btn-share-round nota"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <a href="${linkWA}" target="_blank" class="btn-share-round wa"><svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
                    <a href="${linkFB}" target="_blank" class="btn-share-round fb"><svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                    <button id="btn-copy-link" class="btn-share-round copy"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
                </div>
            </div>
        `;

        loadingMsg.style.display = 'none';
        contenedorDetalle.style.display = 'block';
        renderizarFooter();
    }

    // --- FUNCIONES AUXILIARES ---
    function renderizarFooter() {
        if (document.querySelector('.app-footer')) return;
        const footerHTML = `
            <footer class="app-footer" style="padding: 20px 0; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: auto; text-align: center;">
                <p style="color: #64748b; margin: 0;">Desarrollado por <span style="color:#d4b483">Domingo Curbeira</span></p>
                <p style="color:#475569; margin: 0; font-size: 0.7rem;">© ${new Date().getFullYear()}</p>
            </footer>
        `;
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    function mostrarError(mensaje) {
        loadingMsg.innerHTML = `❌ ${mensaje}`;
        loadingMsg.style.color = '#ef4444';
    }

    function handleCrearNota() {
        const palabraOriginal = document.querySelector('.detalle-original').innerText;
        const palabraEspanol = document.querySelector('.detalle-header h2').innerText;
        const definicion = document.querySelectorAll('.detalle-seccion p')[1].innerText; 

        const tituloNota = `Léxico: ${palabraOriginal} (${palabraEspanol})`;
        const cuerpoNota = `Análisis de "${palabraOriginal}" (${palabraEspanol}).\n\nDefinición:\n${definicion}\n\nMis reflexiones:\n`;
        window.location.href = `../notas/index.html?titulo=${encodeURIComponent(tituloNota)}&cuerpo=${encodeURIComponent(cuerpoNota)}`;
    }

    function handleCopiarEnlace(boton) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            boton.classList.add('copied');
            setTimeout(() => { boton.classList.remove('copied'); }, 2000);
        });
    }

    // EVENTOS DE CLIC
    document.addEventListener('click', (e) => {
        if (e.target.closest('#btn-nota-lexico')) handleCrearNota();
        const btnCopy = e.target.closest('#btn-copy-link');
        if (btnCopy) handleCopiarEnlace(btnCopy);
    });

    // Iniciar carga
    cargarPalabra();

}); // <--- AQUÍ CIERRA CORRECTAMENTE EL DOMContentLoaded