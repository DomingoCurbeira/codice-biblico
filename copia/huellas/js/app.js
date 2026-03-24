document.addEventListener('DOMContentLoaded', async () => {
    
    // VARIABLES
    const filaAT = document.getElementById('fila-at');
    const filaNT = document.getElementById('fila-nt');
    const profileView = document.getElementById('profile-view');
    
    // CARGAR JSON
    let personajes = [];
    try {
        const res = await fetch('data/personajes.json');
        const data = await res.json();
        // Soporte para estructura {personajes: [...]} o [...] directa
        personajes = data.personajes || data || []; 
        console.log(`Huellas: ${personajes.length} personajes cargados.`);
    } catch (e) {
        console.error("Error cargando JSON:", e);
        return;
    }

    // ENRUTAMIENTO
    const params = new URLSearchParams(window.location.search);
    const idSolicitado = params.get('id');

    if (idSolicitado && profileView) {
        // --- MODO PERFIL ---
        const p = personajes.find(pj => pj.id === idSolicitado);
        if (p) {
            renderizarPerfil(p);
        } else {
            document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:20%'>Perfil no encontrado</h1>";
        }
    } else if (filaAT) {
        // --- MODO PORTADA ---
        renderizarPortada(personajes);
    }

    // --- FUNCIONES ---

    function renderizarPortada(lista) {
        filaAT.innerHTML = '';
        filaNT.innerHTML = '';

        lista.forEach(p => {
            const card = document.createElement('div');
            card.className = 'poster-card';
            card.onclick = () => window.location.href = `perfil.html?id=${p.id}`;
            
            // Imagen o Placeholder
            const imgUrl = p.imagen || 'https://via.placeholder.com/300x450?text=Sin+Foto';

            card.innerHTML = `
                <img src="${imgUrl}" class="poster-img" loading="lazy" alt="${p.nombre}">
                <div class="poster-overlay">
                    <div class="poster-name">${p.nombre}</div>
                </div>
            `;

            // Clasificación
            if (p.testamento === 'antiguo') {
                filaAT.appendChild(card);
            } else {
                filaNT.appendChild(card);
            }
        });
    }

    function renderizarPerfil(p) {
        // 1. Header
        setText('p-nombre', p.nombre);
        setText('p-role', p.titular); // Usamos 'titular' del JSON
        const imgEl = document.getElementById('p-foto');
        if(imgEl) imgEl.src = p.imagen || '';

        // 2. Resumen
        setText('p-resumen', p.resumen || "Sin biografía disponible.");

        // 3. Expediente (Datos)
        // Usamos optional chaining (?.) por si falta algún campo
        setText('p-ocupacion', p.datos?.ocupacion || "-");
        
        // Lugares: Si es array lo unimos, si es texto lo dejamos
        const lugares = Array.isArray(p.datos?.lugares) ? p.datos.lugares.join(", ") : p.datos?.lugares;
        setText('p-origen', lugares || "-");

        setText('p-familia', p.datos?.familia || "-");

        // 4. Análisis (Listas)
        renderList('p-fortalezas', p.analisis?.fortalezas);
        renderList('p-debilidades', p.analisis?.debilidades);
        renderList('p-lecciones', p.analisis?.lecciones);

        // 5. Curiosidades
        setText('p-curioso', p.dato_curioso || "No hay datos curiosos registrados.");

        // 6. Conexión Jesús
        setText('p-conexion', p.conexion_jesus || "Información pendiente.");

        // 7. Cronología
        const timeline = document.getElementById('p-timeline');
        if (timeline && p.hitos && p.hitos.length > 0) {
            timeline.innerHTML = '';
            p.hitos.forEach(h => {
                timeline.innerHTML += `
                    <div class="timeline-item">
                        <div class="timeline-year">${h.anio}</div>
                        <div style="color: #cbd5e1;">${h.evento}</div>
                    </div>
                `;
            });
        } else {
            timeline.innerHTML = "<p style='color:#666'>Sin hitos registrados.</p>";
        }

        // 8. Versículo
        if (p.versiculo) {
            setText('p-versiculo-txt', `"${p.versiculo.texto}"`);
            setText('p-versiculo-cita', p.versiculo.cita);
        }

        // 9. CONFIGURAR BOTONES DE COMPARTIR (NUEVO)
        const btnWa = document.getElementById('btn-wa');
        const btnFb = document.getElementById('btn-fb');
        const btnCopy = document.getElementById('btn-copy');

        if (btnWa && btnFb && btnCopy) {
            // Generar Link y Texto
            const shareUrl = `${window.location.origin}${window.location.pathname}?id=${p.id}`;
            const shareText = `📖 Descubre la historia de *${p.nombre}* en Huellas de Fe. Sus lecciones y legado aquí:`;

            // WhatsApp
            btnWa.onclick = () => {
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
            };

            // Facebook
            btnFb.onclick = () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
            };

            // Copiar
            btnCopy.onclick = () => {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    const originalHtml = btnCopy.innerHTML;
                    btnCopy.classList.add('copied');
                    btnCopy.innerHTML = '✓';
                    setTimeout(() => {
                        btnCopy.classList.remove('copied');
                        btnCopy.innerHTML = originalHtml;
                    }, 2000);
                });
            };
        }
    }

    // Helpers
    function setText(id, txt) {
        const el = document.getElementById(id);
        if (el) el.innerText = txt;
    }

    function renderList(id, items) {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = '';
        if (items && items.length > 0) {
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerText = item;
                el.appendChild(li);
            });
        } else {
            el.innerHTML = "<li style='list-style:none; color:#555'>-</li>";
        }
    }
});