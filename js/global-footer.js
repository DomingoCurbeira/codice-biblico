/**
 * js/global-footer.js (v2.0)
 * Centraliza el cierre de todas las aplicaciones del ecosistema.
 * Incluye créditos, link al portal y versículos aleatorios.
 * Autolimpia footers antiguos para evitar duplicados.
 */

(function() {
    const VERSICULOS = [
        { texto: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.", cita: "Salmos 119:105" },
        { texto: "La palabra del Dios nuestro permanece para siempre.", cita: "Isaías 40:8" },
        { texto: "Tu palabra es la verdad.", cita: "Juan 17:17" },
        { texto: "No solo de pan vivirá el hombre, sino de toda palabra de Dios.", cita: "Mateo 4:4" },
        { texto: "Escudriñad las Escrituras; porque a vosotros os parece que en ellas tenéis la vida eterna.", cita: "Juan 5:39" }
    ];

    function inyectarEstilosFooter() {
        if (document.getElementById('global-footer-styles')) return;
        const style = document.createElement('style');
        style.id = 'global-footer-styles';
        style.innerHTML = `
            .global-footer {
                padding: 5rem 2rem 7rem 2rem;
                background: linear-gradient(to top, #000 0%, #050608 50%, transparent 100%);
                text-align: center;
                border-top: 1px solid rgba(212, 180, 131, 0.1);
                margin-top: 6rem;
                width: 100%;
                position: relative;
                z-index: 100;
            }
            .footer-portal-link {
                font-family: 'Cinzel', serif;
                font-size: 1.6rem;
                color: #d4b483;
                text-decoration: none;
                letter-spacing: 6px;
                display: inline-block;
                margin-bottom: 1.2rem;
                transition: all 0.3s ease;
                font-weight: 900;
            }
            .footer-portal-link:hover {
                color: #fff;
                transform: translateY(-3px) scale(1.05);
                text-shadow: 0 0 20px rgba(212, 180, 131, 0.6);
            }
            .footer-credits {
                font-size: 0.9rem;
                color: #94a3b8;
                margin-bottom: 2.5rem;
                letter-spacing: 1px;
            }
            .footer-credits strong { color: #d4b483; font-weight: 700; }
            
            .footer-verse-box {
                max-width: 650px;
                margin: 0 auto;
                padding: 25px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 20px;
                border: 1px solid rgba(212, 180, 131, 0.1);
                backdrop-filter: blur(10px);
            }
            .footer-verse-text {
                font-family: 'Merriweather', serif;
                font-style: italic;
                font-size: 1rem;
                color: #e2e8f0;
                line-height: 1.8;
                margin-bottom: 10px;
            }
            .footer-verse-cita {
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 3px;
                color: #d4b483;
                font-weight: 800;
            }
            @media (max-width: 600px) {
                .global-footer { padding: 4rem 1.5rem 8rem 1.5rem; }
                .footer-portal-link { font-size: 1.2rem; letter-spacing: 4px; }
                .footer-verse-text { font-size: 0.9rem; }
            }
        `;
        document.head.appendChild(style);
    }

    function limpiarFootersAntiguos() {
        const SELECTORES = [
            'footer', 
            '.app-footer', 
            '.modern-footer', 
            '.portal-footer', 
            '.main-share-container',
            '.footer-dev'
        ];
        
        SELECTORES.forEach(selector => {
            const elementos = document.querySelectorAll(selector);
            elementos.forEach(el => {
                // Solo borramos si NO es nuestro propio footer nuevo
                if (!el.classList.contains('global-footer')) {
                    el.remove();
                }
            });
        });
    }

    function inicializarFooter() {
        // 1. Limpiar rastro de footers viejos
        limpiarFootersAntiguos();

        if (document.querySelector('.global-footer')) return;

        inyectarEstilosFooter();

        // 2. Elegir versículo aleatorio
        const v = VERSICULOS[Math.floor(Math.random() * VERSICULOS.length)];

        // 3. Crear HTML del footer
        const footer = document.createElement('footer');
        footer.className = 'global-footer';
        
        // 4. Lógica de ruta robusta al index.html principal
        const path = window.location.pathname.toLowerCase();
        
        // Si estamos en la raíz (no hay subcarpetas de apps conocidas)
        const apps = ['mana', 'huellas', 'cronos', 'a_imagen_de_dios', 'aposento', 'etymos', 'onomastiko', 'notas', 'juego'];
        const estaEnSubcarpeta = apps.some(app => path.includes(`/${app}/`));
        
        const rootPath = estaEnSubcarpeta ? '../index.html' : './index.html';

        footer.innerHTML = `
            <div class="footer-container">
                <a href="${rootPath}" class="footer-portal-link">CÓDICE BÍBLICO</a>
                <p class="footer-credits">Creado por <strong>Domingo Curbeira</strong> &copy; 2026</p>
                
                <div class="footer-verse-box">
                    <p class="footer-verse-text">"${v.texto}"</p>
                    <p class="footer-verse-cita">${v.cita}</p>
                </div>
            </div>
        `;

        document.body.appendChild(footer);
    }

    // Ejecución rápida y segura
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarFooter);
    } else {
        inicializarFooter();
    }
    
    // Doble chequeo por si el contenido carga tarde
    setTimeout(limpiarFootersAntiguos, 1000);
})();
