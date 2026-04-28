// Códice Bíblico - Script de Landing Page (Unificado)

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mensaje de bienvenida (Easter Egg)
    console.log(
        "%c CÓDICE BÍBLICO ", 
        "background: #3b82f6; color: white; font-weight: bold; padding: 5px; border-radius: 4px;"
    );
    console.log("Bienvenido al ecosistema. Soli Deo Gloria.");

    // 2. Renderizar Footer y Botones de Compartir (UI)
    inyectarCompartirPortada(); // Luego ponemos los botones encima
    renderizarFooter();       // Primero creamos el footer

    // 3. Actualizar año automáticamente (Si hay un span manual en el HTML)
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 4. PWA: Registro del Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registrado:', reg.scope))
            .catch(err => console.log('Error SW:', err));
    }

    // 5. PWA: Lógica del Botón de Instalación
    manejarInstalacionPWA();
});

// --- LÓGICA DE INSTALACIÓN PWA ---
function manejarInstalacionPWA() {
    let deferredPrompt;
    const installBtn = document.getElementById('btn-install');

    // Si no existe el botón en el HTML, salimos para no dar error
    if (!installBtn) return;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.classList.remove('hidden'); // Mostrar botón
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Usuario eligió: ${outcome}`);
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });

    window.addEventListener('appinstalled', () => {
        console.log('Códice Bíblico instalado');
        installBtn.classList.add('hidden');
    });
}

// --- BOTONES DE COMPARTIR (PORTADA) ---
function inyectarCompartirPortada() {
    // Buscamos el footer para insertar los botones ANTES de él
    const footer = document.querySelector('.app-footer');
    
    // Si no hay footer, usamos el body
    const destino = footer ? footer : document.body;
    const metodoInsercion = footer ? 'beforebegin' : 'beforeend';

    const shareHTML = `
        <div class="main-share-container">
            <h3 class="share-title-main">Compartir Códice Bíblico</h3>
            <p class="share-subtitle">Ayuda a otros a descubrir estas herramientas</p>
            
            <div class="share-actions-main">
                <button id="btn-wa-main" class="btn-share wa" aria-label="WhatsApp">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </button>
                <button id="btn-fb-main" class="btn-share fb" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button id="btn-copy-main" class="btn-share copy" aria-label="Copiar Link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
            </div>
        </div>

        
    `;

    destino.insertAdjacentHTML(metodoInsercion, shareHTML);

    setTimeout(() => {
        const btnWa = document.getElementById('btn-wa-main');
        const btnFb = document.getElementById('btn-fb-main');
        const btnCopy = document.getElementById('btn-copy-main');
        
        const currentUrl = window.location.origin + window.location.pathname;
        const shareText = `✨ Descubre Códice Bíblico: Una colección de herramientas para profundizar en la fe. Entra aquí:`;

        if(btnWa) btnWa.onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
        if(btnFb) btnFb.onclick = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
        if(btnCopy) {
            btnCopy.onclick = () => {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    const originalIcon = btnCopy.innerHTML;
                    btnCopy.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>`;
                    btnCopy.style.background = "#10b981";
                    setTimeout(() => { 
                        btnCopy.innerHTML = originalIcon; 
                        btnCopy.style.background = ""; 
                    }, 2000);
                });
            };
        }
    }, 100);
}

// --- FOOTER GLOBAL NEXT-GEN (PORTADA) ---
function renderizarFooter() {
    if (document.querySelector('.modern-footer')) return;

    const nombreDesarrollador = "Domingo Curbeira"; 
    const year = new Date().getFullYear();

    const footerHTML = `
        <footer class="modern-footer">
            <div class="footer-container">
                
                <div class="footer-top">
                    <div class="footer-brand-modern">
                        <div class="icon">📜</div>
                        <div class="text-wrapper">
                            <h4>CÓDICE BÍBLICO</h4>
                            <p>Soli Deo Gloria</p>
                        </div>
                    </div>

                    <div class="footer-links-modern">
                        <a href="guia/index.html" class="modern-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            Manual del Usuario
                        </a>
                        
                        <a href="guia/index.html#privacidad" class="modern-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Privacidad
                        </a>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p class="copyright">© ${year} Códice Bíblico. Todos los derechos reservados.</p>
                    <p class="developer">Desarrollado por <span>${nombreDesarrollador}</span></p>
                </div>

            </div>
        </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// 