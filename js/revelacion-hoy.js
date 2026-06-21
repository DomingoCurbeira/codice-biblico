/**
 * js/revelacion-hoy.js
 * Lógica para el banner destacado "Revelación de Hoy"
 */

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('featured-revelation');
    if (!banner) return;

    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 (Dom) a 6 (Sab)
    
    // Obtener fecha local YYYY-MM-DD
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const hoyLocalStr = `${anio}-${mes}-${dia}`;

    // Mapeo de categorías por día (Lunes a Viernes)
    const categoriaPorDia = {
        1: { archivo: 'huellas.json', app: 'huellas' },
        2: { archivo: 'mitos.json', app: 'a_imagen_de_Dios' },
        3: { archivo: 'etimologia.json', app: 'etymos' },
        4: { archivo: 'historia.json', app: 'cronos' },
        5: { archivo: 'sermones.json', app: 'a_imagen_de_Dios' }
    };

    const config = categoriaPorDia[diaSemana];
    if (!config) {
        // Fines de semana o si no hay release hoy
        banner.classList.add('hidden');
        return;
    }

    fetch(`data/estudios/${config.archivo}`)
        .then(response => response.json())
        .then(estudios => {
            const estudioHoy = estudios.find(e => e.fecha_programada === hoyLocalStr);
            
            if (estudioHoy) {
                renderBanner(estudioHoy, config.app);
            } else {
                banner.classList.add('hidden');
            }
        })
        .catch(err => {
            console.error('Error cargando revelación de hoy:', err);
            banner.classList.add('hidden');
        });

    function renderBanner(estudio, appFolder) {
        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-badge">REVELACIÓN DE HOY</div>
                <h2 class="banner-title">${estudio.titulo}</h2>
                <p class="banner-subtitle">${estudio.subtitulo}</p>
                <div class="banner-meta">
                    <span><i class="far fa-clock"></i> ${estudio.tiempo_lectura}</span>
                    <span><i class="far fa-bookmark"></i> ${estudio.tipo.toUpperCase()}</span>
                </div>
                <a href="${appFolder}/visor.html?id=${estudio.id}" class="btn-reveal">
                    <i class="fas fa-eye"></i> EXPLORAR REVELACIÓN
                </a>
            </div>
            <div class="banner-overlay"></div>
            <img src="${estudio.imagen_portada.replace('../', '')}" class="banner-bg" alt="Portada">
        `;
        banner.classList.remove('hidden');
    }
});
