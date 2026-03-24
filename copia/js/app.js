// Códice Bíblico - Script de Landing Page

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Actualizar año automáticamente en el footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Mensaje de bienvenida para curiosos (Easter Egg)
    console.log(
        "%c CÓDICE BÍBLICO ", 
        "background: #3b82f6; color: white; font-weight: bold; padding: 5px; border-radius: 4px;"
    );
    console.log("Bienvenido al ecosistema. Soli Deo Gloria.");

    // Aquí podrás añadir lógica futura (ej: detectar si vienen de Cronos para abrir una nota)
});

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Actualizar año
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. Registro del Service Worker (PWA)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registrado:', reg.scope))
            .catch(err => console.log('Error SW:', err));
    }

    // 3. Lógica del Botón de Instalación
    let deferredPrompt;
    const installBtn = document.getElementById('btn-install');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenimos que el navegador muestre su banner automático feo
        e.preventDefault();
        deferredPrompt = e;
        
        // Mostramos nuestro botón bonito
        installBtn.classList.remove('hidden');
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Mostramos el prompt nativo
        deferredPrompt.prompt();
        
        // Esperamos la elección del usuario
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Usuario eligió: ${outcome}`);
        
        // Limpiamos
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });

    // Si la app ya fue instalada, ocultamos el botón
    window.addEventListener('appinstalled', () => {
        console.log('Códice Bíblico instalado');
        installBtn.classList.add('hidden');
    });

    console.log("%c CÓDICE BÍBLICO ", "background: #3b82f6; color: white; font-weight: bold;");
});