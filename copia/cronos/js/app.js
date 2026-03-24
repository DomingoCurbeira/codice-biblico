document.addEventListener('DOMContentLoaded', async () => {
    
    // --- ELEMENTOS DEL DOM (NUEVOS) ---
    const visorOverlay = document.getElementById('visor-overlay');
    const visorImg = document.getElementById('visor-img');
    const visorTitulo = document.getElementById('visor-titulo');
    const visorDesc = document.getElementById('visor-desc');
    const visorLibro = document.getElementById('visor-libro');
    const btnCerrar = document.getElementById('btn-cerrar-visor');
    const btnWa = document.getElementById('btn-wa');
    const btnFb = document.getElementById('btn-fb');
    const btnCopy = document.getElementById('btn-copy');

    // 1. INICIALIZAR MAPA (Satélite Híbrido) 🛰️
    const map = L.map('map', { zoomControl: false, attributionControl: false })
                 .setView([31.7683, 35.2137], 7);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 19, opacity: 0.8 }).addTo(map);

    // Variables
    const listaLugares = document.getElementById('lista-lugares');
    let todosLosLugares = [];


    // ya no necesitamos 'marcadores' global porque no usaremos popups

    function generarId(texto) {
        if (!texto) return 'id-' + Math.random();
        return texto.toString().toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    // 2. CARGAR DATOS
    try {
        const response = await fetch('data/libros.json');
        const data = await response.json();
        const biblioteca = Array.isArray(data) ? data : (data.lugares ? [data] : []);

        biblioteca.forEach(libro => {
            if (libro.lugares && Array.isArray(libro.lugares)) {
                libro.lugares.forEach(lugar => {
                    if (lugar.coords && Array.isArray(lugar.coords)) {
                        todosLosLugares.push({
                            id: lugar.id || generarId(lugar.nombre),
                            nombre: lugar.nombre,
                            coords: lugar.coords,
                            zoom: lugar.zoom || 13, // Zoom más cercano para el vuelo
                            historia: lugar.historia || lugar.descripcion || "",
                            imagen: lugar.imagen_lugar || null,
                            libro: libro.titulo
                        });
                    }
                });
            }
        });

        cargarPuntos();
        renderizarCarrusel();
        
        const params = new URLSearchParams(window.location.search);
        const lugarSolicitado = params.get('lugar');
        if (lugarSolicitado) viajarA(lugarSolicitado);

    } catch (error) { console.error("Error Cronos:", error); }

    // 3. PUNTOS EN EL MAPA (Solo visuales, sin popup)
    function cargarPuntos() {
        todosLosLugares.forEach(lugar => {
            const circle = L.circleMarker(lugar.coords, {
                radius: 6, fillColor: "#f59e0b", color: "#fff", weight: 2, opacity: 1, fillOpacity: 1
            }).addTo(map);

            // Efecto Hover
            circle.on('mouseover', function() { this.setRadius(10); });
            circle.on('mouseout', function() { this.setRadius(6); });
            // Al hacer clic, inicia el viaje completo
            circle.on('click', function() { viajarA(lugar.id); });
        });
    }

    // 4. CARRUSEL INFERIOR
    function renderizarCarrusel() {
        listaLugares.innerHTML = '';
        todosLosLugares.forEach(lugar => {
            const card = document.createElement('div');
            card.className = 'place-card';
            card.dataset.id = lugar.id;
            card.innerHTML = `<div class="place-name">${lugar.nombre}</div><div class="place-coords">Ver en mapa</div>`;
            card.addEventListener('click', () => viajarA(lugar.id));
            listaLugares.appendChild(card);
        });
    }

    // --- NUEVA LÓGICA DE VIAJE ---

    // Cerrar el visor
    btnCerrar.addEventListener('click', () => {
        visorOverlay.classList.add('hidden');
    });

    // Función principal: Viajar y mostrar visor
    function viajarA(id) {
        const lugar = todosLosLugares.find(l => l.id === id);
        if (!lugar) return;

        // Esto cambia lo que se ve en la barra de direcciones
        const nuevaUrl = `?lugar=${id}`;
        window.history.pushState({path: nuevaUrl}, '', nuevaUrl);
        
        // 1. Activar tarjeta en carrusel
        document.querySelectorAll('.place-card').forEach(c => c.classList.remove('active'));
        const cardActiva = document.querySelector(`.place-card[data-id="${id}"]`);
        if (cardActiva) {
            cardActiva.classList.add('active');
            cardActiva.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        map.flyTo(lugar.coords, lugar.zoom, { duration: 2 });

        // ... (Tu código de cargar imagen y textos sigue igual) ...
        const fallbackImg = "https://images.unsplash.com/photo-1519705864120-f053d6558e06?q=80&w=2070&auto=format&fit=crop";
        visorImg.src = lugar.imagen || fallbackImg;
        visorTitulo.innerText = lugar.nombre;
        visorDesc.innerText = lugar.historia || "Sin descripción detallada.";
        visorLibro.innerText = `📍 Ubicación en ${lugar.libro}`;

        // === NUEVO: CONFIGURAR BOTONES DE COMPARTIR ===
        
        // 1. Crear la URL exacta de este lugar
        // Toma la URL base (sin parametros) y le pega el ?lugar=ID
        const shareUrl = `${window.location.origin}${window.location.pathname}?lugar=${id}`;
        const shareText = `Mira la ubicación de ${lugar.nombre} en Cronos 🌍:`;

        // 2. WhatsApp
        btnWa.onclick = () => {
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        };

        // 3. Facebook
        btnFb.onclick = () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        };

        // 4. Copiar al Portapapeles
        btnCopy.onclick = () => {
            navigator.clipboard.writeText(shareUrl).then(() => {
                // Efecto visual de "Copiado"
                const originalHtml = btnCopy.innerHTML;
                btnCopy.classList.add('copied');
                btnCopy.innerHTML = '✓'; // Check mark
                setTimeout(() => {
                    btnCopy.classList.remove('copied');
                    btnCopy.innerHTML = originalHtml;
                }, 2000);
            });
        };

        // Mostrar el overlay después de un pequeño delay para que empiece el vuelo
        setTimeout(() => {
            visorOverlay.classList.remove('hidden');
        }, 500); 
    }
});