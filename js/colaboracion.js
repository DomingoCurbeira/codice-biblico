// js/colaboracion.js
// js/colaboracion.js
(function() {
    function inyectarBotonKofi() {
        const contenedorPadre = document.getElementById('estudio-content');
        if (!contenedorPadre) return;

        // 1. Estilos (Mantener los tuyos que están excelentes)
        if (!document.getElementById('estilos-kofi-cb')) {
            const estiloKofi = document.createElement('style');
            estiloKofi.id = 'estilos-kofi-cb';
            estiloKofi.innerHTML = `
                .cb-semilla-container {
                    margin: 50px auto 30px auto;
                    padding: 40px 20px;
                    text-align: center;
                    border-top: 1px solid rgba(212, 175, 55, 0.3);
                    max-width: 650px;
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 1s ease, transform 1s ease;
                }
                .cb-semilla-container.visible { opacity: 1; transform: translateY(0); }
                .cb-semilla-texto { color: #f8fafc; font-size: 1.1rem; margin-bottom: 25px; line-height: 1.7; font-style: italic; font-weight: 300; }
                .cb-btn-kofi {
                    display: inline-flex; align-items: center; gap: 14px;
                    background-color: #000000; color: #ffffff !important;
                    border: 1px solid #D4AF37; padding: 14px 32px; border-radius: 4px;
                    text-decoration: none; font-weight: 600; letter-spacing: 1px;
                    transition: all 0.4s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.6);
                    text-transform: uppercase; font-size: 0.85rem;
                }
                .cb-btn-kofi:hover { background-color: #0a0a0a; border-color: #f1d279; box-shadow: 0 0 25px rgba(212, 175, 55, 0.3); transform: translateY(-3px); }
                .cb-kofi-icon { width: 22px; height: 22px; fill: #D4AF37; }
            `;
            document.head.appendChild(estiloKofi);
        }

        // 2. HTML
        const seccionKofi = document.createElement('div');
        seccionKofi.id = 'seccion-semilla';
        seccionKofi.className = 'cb-semilla-container';
        seccionKofi.innerHTML = `
            <p class="cb-semilla-texto">
                "Damos de gracia lo que de gracia recibimos. Si sientes el deseo de apoyar este servicio, tu colaboración permite apoyar el crecimiento y mantenimiento de Códice Bíblico."
            </p>
            <a href="https://ko-fi.com/codicebiblico" target="_blank" class="cb-btn-kofi">
                <svg class="cb-kofi-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.724c-.048 0-.067.02-.088.039-.021.02-.039.04-.039.066V19.88s.01.069.069.127c.059.058.174.12.328.12h13.125c5.686 0 6.102-6.102 6.102-6.102s2.853-.308 3.596-1.703c.744-1.395.026-3.374-.026-3.374zM18.504 13.063c-.147 2.271-1.95 3.087-1.95 3.087H4.23V6.44h12.781s5.707 1.071 1.493 6.623zm4.105-1.205c-.143.351-.458.467-.458.467s-1.114.142-1.171.128c-.058-.014.029-.934.029-.934s1.241-.143 1.412-.028c.171.115.331.017.188.367z"/></svg>
                APOYAR EL PROYECTO
            </a>
        `;
        contenedorPadre.appendChild(seccionKofi);

        // 3. Lógica de Scroll mejorada para móviles
        const manejarScroll = () => {
            const h = document.documentElement;
            const b = document.body;
            
            // Altura total del documento
            const totalHeight = Math.max(h.scrollHeight, b.scrollHeight);
            // Posición actual del scroll + altura de la ventana
            const currentProgress = (h.scrollTop || b.scrollTop) + h.clientHeight;
            
            // Calculamos el porcentaje real
            const porcentaje = (currentProgress / totalHeight) * 100;

            // Umbral: 70% en móvil (es más seguro) y 85% en escritorio
            const umbralNecesario = window.innerWidth < 768 ? 40 : 85; 

            if (porcentaje > umbralNecesario) {
                seccionKofi.classList.add('visible');
                window.removeEventListener('scroll', manejarScroll);
            }
        };

        window.addEventListener('scroll', manejarScroll, { passive: true });
        
        // Fallback: Si en 4 segundos no ha hecho scroll pero está en la página, lo mostramos
        setTimeout(() => {
            seccionKofi.classList.add('visible');
            window.removeEventListener('scroll', manejarScroll);
        }, 4000);
    }

    // Inicialización según el estado del documento
    if (document.readyState === 'complete') {
        inyectarBotonKofi();
    } else {
        window.addEventListener('load', inyectarBotonKofi);
    }
})();