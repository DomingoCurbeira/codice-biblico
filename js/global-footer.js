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
            
            .footer-share-section {
                margin-bottom: 3.5rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1.5rem;
            }
            .share-label {
                font-size: 0.7rem;
                color: #d4b483;
                text-transform: uppercase;
                letter-spacing: 4px;
                font-weight: 800;
                opacity: 0.8;
            }
            .footer-share-actions {
                display: flex;
                justify-content: center;
                gap: 20px;
            }
            .btn-footer-share {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white !important;
                font-size: 18px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(212, 180, 131, 0.2);
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
            }
            .btn-footer-share:hover {
                background: #d4b483;
                color: #0f172a !important;
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(212, 180, 131, 0.3);
            }
            .btn-footer-share.wa:hover { background: #25d366; border-color: #25d366; }
            .btn-footer-share.fb:hover { background: #1877f2; border-color: #1877f2; }
            .btn-footer-share.nota:hover { background: #d4b483; border-color: #d4b483; }
            
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
            'body > footer', // Solo footers que son hijos directos del body
            '.app-footer', 
            '.modern-footer', 
            '.portal-footer', 
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
        const apps = ['mana', 'huellas', 'rhema', 'cronos', 'a_imagen_de_dios', 'aposento', 'etymos', 'onomastiko', 'notes', 'juego'];
        const estaEnSubcarpeta = apps.some(app => path.includes(`/${app}/`));
        
        const rootPath = estaEnSubcarpeta ? '../index.html' : './index.html';
        const notesPath = estaEnSubcarpeta ? '../notas/index.html' : './notas/index.html';

        const currentUrl = window.location.href;
        const currentTitle = document.title;
        const shareText = encodeURIComponent(`📖 Te comparto este estudio de Códice Bíblico: "${currentTitle}". Míralo aquí: `);
        
        // Determinar si debemos mostrar el botón de Escriba
        const excluirEscriba = path.includes('/notas/') || path.includes('/juego/') || path.includes('/cronos/');
        const btnEscribaHtml = !excluirEscriba ? `
            <a href="${notesPath}?titulo=${encodeURIComponent('Estudio: ' + currentTitle)}&ref=global" class="btn-footer-share nota" title="Guardar en Escriba">
                <i class="fas fa-pen-nib"></i>
            </a>
        ` : '';

        footer.innerHTML = `
            <div class="footer-container">
                <a href="${rootPath}" class="footer-portal-link">CÓDICE BÍBLICO</a>
                <p class="footer-credits">Creado por <strong>Domingo Curbeira</strong> &copy; 2026</p>
                
                <div class="footer-share-section">
                    <span class="share-label">Compartir Aplicación</span>
                    <div class="footer-share-actions">
                        ${btnEscribaHtml}
                        <a href="https://wa.me/?text=${shareText}${encodeURIComponent(currentUrl)}" target="_blank" class="btn-footer-share wa" title="Compartir en WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}" target="_blank" class="btn-footer-share fb" title="Compartir en Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <button id="btn-global-copy" class="btn-footer-share" title="Copiar Enlace">
                            <i class="fas fa-link"></i>
                        </button>
                    </div>
                </div>

                <div class="footer-verse-box">
                    <p class="footer-verse-text">"${v.texto}"</p>
                    <p class="footer-verse-cita">${v.cita}</p>
                </div>
            </div>
        `;

        document.body.appendChild(footer);

        // Lógica de copiado
        const btnCopy = document.getElementById('btn-global-copy');
        if (btnCopy) {
            btnCopy.onclick = () => {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    const icon = btnCopy.querySelector('i');
                    icon.className = 'fas fa-check';
                    setTimeout(() => { icon.className = 'fas fa-link'; }, 2000);
                });
            };
        }
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
