/**
 * js/app.js - RHEMA (Daily Promises)
 */

document.addEventListener('DOMContentLoaded', async () => {

    // --- 1. CONFIGURACIÓN ---
    const URL_DATA = '../data/promesas/promesas_365.json';
    
    // Pool de imágenes temáticas (Sustituir por img/rhema/XX.webp)
    const IMAGENES_THEME = {
        paz: [
            "../img/rhema/paz_1.webp", "../img/rhema/paz_2.webp", "../img/rhema/paz_3.webp", "../img/rhema/paz_4.webp",
            "../img/rhema/paz_5.webp", "../img/rhema/paz_6.webp", "../img/rhema/paz_7.webp", "../img/rhema/paz_8.webp"
        ],
        guia: [
            "../img/rhema/guia_1.webp", "../img/rhema/guia_2.webp", "../img/rhema/guia_3.webp", "../img/rhema/guia_4.webp",
            "../img/rhema/guia_5.webp", "../img/rhema/guia_6.webp", "../img/rhema/guia_7.webp", "../img/rhema/guia_8.webp"
        ],
        provision: [
            "../img/rhema/provision_1.webp", "../img/rhema/provision_2.webp", "../img/rhema/provision_3.webp", "../img/rhema/provision_4.webp",
            "../img/rhema/provision_5.webp", "../img/rhema/provision_6.webp", "../img/rhema/provision_7.webp", "../img/rhema/provision_8.webp"
        ],
        soberania: [
            "../img/rhema/soberania_1.webp", "../img/rhema/soberania_2.webp", "../img/rhema/soberania_3.webp", "../img/rhema/soberania_4.webp",
            "../img/rhema/soberania_5.webp", "../img/rhema/soberania_6.webp", "../img/rhema/soberania_7.webp", "../img/rhema/soberania_8.webp"
        ]
    };

    let todasLasPromesas = [];

    // --- 2. CARGA DE DATOS ---
    try {
        const response = await fetch(URL_DATA);
        todasLasPromesas = await response.json();
        
        inicializarRhema();
    } catch (err) {
        console.error("Error cargando Rhema:", err);
        const pText = document.getElementById('promise-text');
        if (pText) pText.innerText = "La provisión está en camino, intenta de nuevo en un momento.";
    }

    // --- 3. LÓGICA PRINCIPAL ---
    function inicializarRhema() {
        const params = new URLSearchParams(window.location.search);
        const idSolicitado = params.get('id');
        
        let promesa;

        if (idSolicitado) {
            promesa = todasLasPromesas.find(p => p.id == idSolicitado);
        }

        const hoy = new Date();
        const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        const fechaHoyTexto = `Día ${hoy.getDate()} de ${meses[hoy.getMonth()]}`;

        // Si no hay ID o no se encontró, usamos la del día
        if (!promesa) {
            const inicioAno = new Date(hoy.getFullYear(), 0, 0);
            const diff = hoy - inicioAno;
            const diaDelAno = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            const indice = diaDelAno % todasLasPromesas.length;
            promesa = todasLasPromesas[indice];

            const indicator = document.getElementById('day-of-year');
            if (indicator) indicator.innerText = fechaHoyTexto;
        } else {
            const indicator = document.getElementById('day-of-year');
            if (indicator) indicator.innerText = `Revelación Especial #${promesa.id}`;
        }

        renderizarPromesa(promesa);
    }

    function renderizarPromesa(p) {
        if (!p) return;

        const card = document.getElementById('main-card');
        const uiCite = document.getElementById('promise-cite');
        const uiText = document.getElementById('promise-text');
        const uiDecreto = document.getElementById('promise-decreto');
        const uiEtymosWord = document.getElementById('etymos-word');
        const uiEtymosMeaning = document.getElementById('etymos-meaning');
        const uiEtymosLang = document.getElementById('etymos-lang');
        const etymosBox = document.getElementById('etymos-box');

        // Inyectar Textos
        if (uiCite) uiCite.innerText = p.cita;
        if (uiText) uiText.innerText = p.texto;
        
        const decretoBox = document.querySelector('.decreto-box');
        if (uiDecreto) {
            uiDecreto.innerText = p.decreto || "";
            if (decretoBox) {
                decretoBox.style.display = p.decreto ? 'block' : 'none';
            }
        }
        
        // Etymos
        if (p.etymos && etymosBox) {
            etymosBox.classList.remove('hidden');
            if (uiEtymosWord) uiEtymosWord.innerText = p.etymos.palabra;
            if (uiEtymosMeaning) uiEtymosMeaning.innerText = `(${p.etymos.significado})`;
            if (uiEtymosLang) uiEtymosLang.innerText = p.etymos.idioma;
        } else if (etymosBox) {
            etymosBox.classList.add('hidden');
        }

        // Imagen de Fondo
        if (card) {
            const pool = IMAGENES_THEME[p.tema] || IMAGENES_THEME['paz'];
            const imgUrl = pool[p.id % pool.length];
            card.style.backgroundImage = `url('${imgUrl}')`;
        }

        // Acciones
        const btnDownload = document.getElementById('btn-download');
        if (btnDownload) btnDownload.onclick = () => descargarImagen(p);

        const btnShare = document.getElementById('btn-share');
        if (btnShare) btnShare.onclick = () => compartirPromesa(p);

        // --- GUARDAR RASTRO PERSISTENTE ---
        localStorage.setItem('rastro_estudio', JSON.stringify({
            nombrePersonaje: `Rhema: ${p.cita}`,
            url: window.location.href
        }));

        // Notificar al Dashboard Global
        const hoyStr = new Date().toDateString();
        if (localStorage.getItem('rhema_last_visit') !== hoyStr) {
            let perfil = JSON.parse(localStorage.getItem('codice_perfil')) || { xp: 0, logros: [] };
            perfil.xp += 10; 
            localStorage.setItem('codice_perfil', JSON.stringify(perfil));
            localStorage.setItem('rhema_last_visit', hoyStr);
        }
    }

    // --- 4. FUNCIONES DE ACCIÓN ---
    async function descargarImagen(p) {
        const btn = document.getElementById('btn-download');
        const originalHtml = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparando...';
        btn.disabled = true;

        const area = document.getElementById('capture-area');
        
        try {
            // Aseguramos que la imagen de fondo esté cargada de forma robusta
            const card = document.getElementById('main-card');
            const bgStyle = window.getComputedStyle(card).backgroundImage;
            const bgMatch = bgStyle.match(/url\("?(.+?)"?\)/);
            const bgUrl = bgMatch ? bgMatch[1] : null;
            
            if (bgUrl && bgUrl !== 'none') {
                await new Promise((resolve) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = bgUrl;
                });
            }

            const canvas = await html2canvas(area, {
                useCORS: true,
                allowTaint: true,
                scale: 2,
                backgroundColor: '#050608',
                logging: false, // Desactivar en producción si no es necesario
                onclone: (clonedDoc) => {
                    // Asegurar que el elemento clonado sea visible para la captura
                    const clonedArea = clonedDoc.getElementById('capture-area');
                    if (clonedArea) {
                        clonedArea.style.display = 'block';
                    }
                }
            });

            // Estrategia de descarga mediante Blob (más compatible con Netlify/Producción)
            canvas.toBlob((blob) => {
                if (!blob) throw new Error("Error generando el archivo binario.");

                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                
                // Limpieza de nombre de archivo para evitar errores de cabecera
                const safeCite = p.cita.replace(/[^a-z0-9]/gi, '_');
                link.download = `Rhema_${safeCite}.png`;
                link.href = url;
                
                // Simular click para disparar descarga
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Liberar recursos
                setTimeout(() => URL.revokeObjectURL(url), 200);

                Swal.fire({
                    toast: true, position: 'top', icon: 'success',
                    title: '¡Imagen Guardada!', showConfirmButton: false, timer: 2500,
                    background: '#161b22', color: '#d4b483'
                });
            }, 'image/png', 1.0);

        } catch (err) {
            console.error("Error en la exportación Rhema:", err);
            Swal.fire({
                icon: 'error',
                title: 'No se pudo generar la imagen',
                text: 'Hubo un problema técnico al procesar la captura. Intenta tomar una captura de pantalla manual.',
                background: '#161b22', color: '#d4b483'
            });
        } finally {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    }

    window.cambiarPromesaAleatoria = function() {
        const random = todasLasPromesas[Math.floor(Math.random() * todasLasPromesas.length)];
        window.history.pushState({ path: `?id=${random.id}` }, '', `?id=${random.id}`);
        renderizarPromesa(random);
        document.getElementById('day-of-year').innerText = `Revelación Especial #${random.id}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

});

    async function compartirPromesa(p) {
        const shareData = {
            title: 'Rhema: Palabra del Día',
            text: `📖 "${p.texto}" - ${p.cita}\n\nDescubre más en Códice Bíblico:`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: Copiar enlace
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                Swal.fire({
                    toast: true, position: 'top', icon: 'success',
                    title: '¡Enlace Copiado!', showConfirmButton: false, timer: 2000,
                    background: '#161b22', color: '#d4b483'
                });
            }
        } catch (err) {
            console.log('Cancelado o error en share:', err);
        }
    }
