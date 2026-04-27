// js/global-hub.js
(function() {
    // 1. La Función de apertura (Global)
    window.toggleCodiceHub = function() {
        const options = document.getElementById('hubOptions');
        const btnMain = document.getElementById('hubMain');
        const icon = document.getElementById('hubIcon');
        
        if (!options || !btnMain || !icon) {
            console.error("Chef, faltan elementos del Hub en el DOM");
            return;
        }

        const isOpen = options.classList.toggle('show');
        btnMain.classList.toggle('active');
        
        // Cambiar icono con clases de FontAwesome
        if (isOpen) {
            icon.classList.remove('fa-comment-dots');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-comment-dots');
        }
    };

    function inyectarHub() {
        if (document.getElementById('actionHub')) return;

        // 2. Estilos (Sin cambios, están perfectos)
        const style = document.createElement('style');
        style.innerHTML = `
            .action-hub { position: fixed !important; bottom: 30px !important; right: 30px !important; z-index: 999999999 !important; display: flex; flex-direction: column; align-items: flex-end; gap: 15px; }
            .hub-main { width: 60px; height: 60px; border-radius: 50%; background: #d4b483 !important; color: #0f172a !important; border: none; cursor: pointer; font-size: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; transition: all 0.3s ease; pointer-events: auto !important; }
            .hub-main.active { transform: rotate(45deg); background: #ef4444 !important; color: white !important; }
            .hub-options { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.3s ease; }
            .hub-options.show { opacity: 1; visibility: visible; transform: translateY(0); }
            .hub-btn { width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; text-decoration: none; color: white !important; font-size: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); background: #1e293b; backdrop-filter: blur(10px); position: relative; }
            .whatsapp { background: #25d366 !important; } .facebook { background: #1877f2 !important; } .contacto { background: #64748b !important; } .alfoli { background: #f59e0b !important; border: 1px solid rgba(255,255,255,0.3); }
            .hub-label { position: absolute; right: 65px; background: #0f172a; padding: 6px 14px; border-radius: 8px; font-size: 13px; color: #d4b483; border: 1px solid #d4b483; white-space: nowrap; opacity: 0; pointer-events: none; transition: 0.2s; }
            .hub-btn:hover .hub-label { opacity: 1; }
        `;
        document.head.appendChild(style);

        // 3. El HTML con el ONCLICK corregido y los IDs vinculados
        const div = document.createElement('div');
        div.id = 'actionHub';
        div.className = 'action-hub';
        div.innerHTML = `
            <div class="hub-options" id="hubOptions">
                <a href="https://ko-fi.com/codicebiblico" target="_blank" class="hub-btn alfoli">
                    <span class="hub-label">Alfolí</span>
                    <i class="fas fa-gift"></i>
                </a>
                <a href="https://whatsapp.com/channel/0029VbC3wXTDZ4LS6fQ4oB2U" target="_blank" class="hub-btn whatsapp">
                    <span class="hub-label">WhatsApp</span>
                    <i class="fab fa-whatsapp"></i>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61582655326586" target="_blank" class="hub-btn facebook">
                    <span class="hub-label">Facebook</span>
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="mailto:codicebiblico.app@gmail.com?subject=Mensaje desde la App&body=Hola Domingo, me gustaría comentarte que..." class="hub-btn contacto">
                    <span class="hub-label">Contacto</span>
                    <i class="fas fa-envelope"></i>
                </a>
            </div>
            
            <button class="hub-main" id="hubMain" onclick="window.toggleCodiceHub()">
                <i class="fas fa-comment-dots" id="hubIcon"></i>
            </button>
        `;
        document.body.appendChild(div);
    }

    if (document.readyState === 'complete') inyectarHub();
    else window.addEventListener('load', inyectarHub);
})();