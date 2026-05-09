/**
 * js/ecosistema-hub.js (v2.0)
 * COMPONENTE AUTÓNOMO DEL ECOSISTEMA CÓDICE BÍBLICO
 * 
 * Este script centraliza la navegación, inyecta sus propios estilos y HTML,
 * y detecta automáticamente en qué app se encuentra para optimizar el menú.
 */

(function() {
    // 1. CONFIGURACIÓN MAESTRA DEL ECOSISTEMA
    const APPS = [
        { id: 'cronos', nombre: 'Cronos', icon: '🌍', path: 'cronos/index.html', class: 'cronos' },
        { id: 'mana', nombre: 'Maná', icon: '🍞', path: 'mana/index.html', class: 'mana' },
        { id: 'rhema', nombre: 'Rhema', icon: '💎', path: 'rhema/index.html', class: 'rhema' },
        { id: 'huellas', nombre: 'Huellas', icon: '👣', path: 'huellas/index.html', class: 'huellas' },
        { id: 'imagen', nombre: 'Imagen', icon: '🎓', path: 'a_imagen_de_dios/index.html', class: 'imagen' },
        { id: 'aposento', nombre: 'Aposento', icon: '🔥', path: 'aposento/index.html', class: 'aposento' },
        { id: 'onomastiko', nombre: 'Onomastiko', icon: '🆔', path: 'onomastiko/index.html', class: 'onomastiko' },
        { id: 'etymos', nombre: 'Etymos', icon: '🔍', path: 'etymos/index.html' , class: 'etymos'},
        { id: 'virtus', nombre: 'Virtus', icon: '🛡️', path: 'juego/index.html', class: 'virtus' },
        { id: 'escriba', nombre: 'Escriba', icon: '📝', path: 'notas/index.html', class: 'escriba' }
    ];

    // 2. INYECCIÓN DE ESTILOS GLOBALES (Garantiza consistencia total)
    function inyectarEstilos() {
        if (document.getElementById('hub-global-styles')) return;
        const style = document.createElement('style');
        style.id = 'hub-global-styles';
        style.innerHTML = `
            /* Botón Lanzador */
            .btn-hub-launcher {
                position: fixed; top: 15px; right: 15px;
                background: rgba(15, 23, 42, 0.6) !important; 
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1); 
                color: #94a3b8;
                cursor: pointer; width: 45px; height: 45px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 999999 !important; /* Z-index extremo para ganar a mapas y capas */
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }
            .btn-hub-launcher:hover {
                color: #d4b483; background: rgba(15, 23, 42, 0.9) !important;
                transform: rotate(90deg) scale(1.1);
                border-color: #d4b483;
            }
            .btn-hub-launcher svg { width: 24px; height: 24px; fill: currentColor; }

            /* Menú Ecosistema */
            .eco-hub-menu {
                position: fixed; top: 75px; right: 20px;
                background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px;
                padding: 1.2rem; z-index: 10000 !important;
                box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
                opacity: 0; transform: translateY(-20px) scale(0.95);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }
            .eco-hub-menu.active { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

            .hub-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; width: 240px; }
            
            .hub-item {
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                background: rgba(255, 255, 255, 0.03); padding: 1rem; border-radius: 15px;
                text-decoration: none; color: #f8fafc; transition: all 0.2s ease;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .hub-item:hover {
                background: rgba(212, 180, 131, 0.15); border-color: #d4b483;
                transform: translateY(-3px);
            }
            .hub-item .icon { font-size: 1.6rem; margin-bottom: 6px; }
            .hub-item span:not(.icon) { font-size: 0.8rem; font-weight: 500; letter-spacing: 0.5px; color: #cbd5e1; }
            .hub-item:hover span:not(.icon) { color: #d4b483; }

            @media (max-width: 480px) {
                .btn-hub-launcher { top: 12px; right: 12px; }
                .eco-hub-menu { top: 65px; right: 10px; left: 10px; }
                .hub-grid { width: auto; grid-template-columns: repeat(3, 1fr); }
            }
        `;
        document.head.appendChild(style);
    }

    // 3. GENERACIÓN DEL HUB
    function inicializarHub() {
        if (document.getElementById('eco-hub-container')) return;

        inyectarEstilos();

        const currentPath = window.location.pathname.toLowerCase();
        console.log(currentPath)
        
        // Crear Contenedor
        const container = document.createElement('div');
        container.id = 'eco-hub-container';
        
        // Crear Botón
        const btn = document.createElement('button');
        btn.id = 'btn-launcher'; // ID Original para compatibilidad
        btn.className = 'btn-hub-launcher';
        btn.setAttribute('aria-label', 'Menú Ecosistema');
        btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>`;
        
        // Crear Menú
        const menu = document.createElement('div');
        menu.className = 'eco-hub-menu';
        
        let gridHTML = '<div class="hub-grid">';
        
        APPS.forEach(app => {
            // Detección robusta (todo en minúsculas para evitar fallos)
            const pathLower = currentPath.toLowerCase();
            const esActiva = pathLower.includes(`/${app.id}/`) || 
                           (app.id === 'imagen' && pathLower.includes('/a_imagen_de_dios/')) ||
                           (app.id === 'virtus' && pathLower.includes('/juego/')) ||
                           (app.id === 'escriba' && pathLower.includes('/notas/'));

            if (!esActiva) {
                // Cálculo dinámico de profundidad para rutas relativas
                // Si el script está en /js/, y el index está en /app/index.html, necesitamos ../
                const relativePath = `../${app.path}`;
                
                gridHTML += `
                    <a href="${relativePath}" class="hub-item">
                        <span class="${app.class} icon">${app.icon}</span>
                        <span>${app.nombre}</span>
                    </a>
                `;
            }
        });
        
        gridHTML += '</div>';
        menu.innerHTML = gridHTML;

        // Ensamblar
        container.appendChild(btn);
        container.appendChild(menu);
        document.body.appendChild(container);

        // Lógica de Eventos
        btn.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        };

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
    }

    // Ejecución segura
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarHub);
    } else {
        inicializarHub();
    }
})();
