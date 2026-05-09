document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTIÓN DEL DASHBOARD GLOBAL ---
    const dashRango = document.getElementById('dash-rango');
    const dashXP = document.getElementById('dash-xp');
    const dashLogros = document.getElementById('dash-logros');
    const shortcutContinue = document.getElementById('shortcut-continue');

    function actualizarDashboard() {
        const perfil = JSON.parse(localStorage.getItem('codice_perfil')) || { xp: 0, logros: [] };
        
        // Calcular Rango
        const niveles = [
            { min: 0, nombre: "Novicio" },
            { min: 100, nombre: "Buscador" },
            { min: 300, nombre: "Estudiante" },
            { min: 600, nombre: "Erudito" },
            { min: 1000, nombre: "Maestro" },
            { min: 2000, nombre: "Guardián del Códice" }
        ];
        
        const rangoActual = niveles.reverse().find(n => perfil.xp >= n.min) || niveles[niveles.length - 1];
        
        if (dashRango) dashRango.innerText = rangoActual.nombre;
        if (dashXP) dashXP.innerText = perfil.xp;
        if (dashLogros) dashLogros.innerText = `🏆 ${perfil.logros.length}`;

        // Lógica de "Continuar donde lo dejaste"
        const rastro = JSON.parse(sessionStorage.getItem('rastro_estudio'));
        if (rastro && rastro.url && shortcutContinue) {
            shortcutContinue.style.opacity = "1";
            shortcutContinue.style.cursor = "pointer";
            shortcutContinue.onclick = () => window.location.href = rastro.url;
            shortcutContinue.querySelector('.stat-value').innerText = rastro.nombrePersonaje || "Seguir leyendo";
        }
    }

    // --- 2. INSTALACIÓN PWA ---
    let deferredPrompt;
    const btnInstall = document.getElementById('btn-install');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (btnInstall) btnInstall.classList.remove('hidden');
    });

    if (btnInstall) {
        btnInstall.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                btnInstall.classList.add('hidden');
            }
            deferredPrompt = null;
        });
    }

    // Inicializar
    actualizarDashboard();
});
