document.addEventListener('DOMContentLoaded', () => {

    // --- 1. VARIABLES DE ESTADO ---
    let preguntas = [];
    let preguntaActual = {};
    let puntaje = 0;
    let vidas = 3;
    let contadorPreguntas = 0;
    let colaPreguntas = []; 
    
    // --- 2. ELEMENTOS DEL DOM ---
    const screenHome = document.getElementById('screen-home');
    const screenGame = document.getElementById('screen-game');
    const screenResult = document.getElementById('screen-result');
    
    const uiLives = document.getElementById('ui-lives');
    const uiScore = document.getElementById('score-val');
    const uiQuestionCounter = document.getElementById('question-counter');
    const uiQuestionText = document.getElementById('question-text');
    const uiOptionsContainer = document.getElementById('options-container');
    
    const btnStart = document.getElementById('btn-start');     
    const btnRestart = document.getElementById('btn-restart'); 
    const btnShare = document.getElementById('btn-share');

    // --- 3. CARGAR DATOS ---
    fetch('data/preguntas.json')
        .then(res => res.json())
        .then(data => {
            preguntas = data;
            console.log("⚔️ Desafíos cargados:", preguntas.length);
        })
        .catch(err => {
            console.error("Error cargando preguntas", err);
            uiQuestionText.innerText = "Error sintonizando el espíritu de sabiduría.";
        });

    // --- 4. FUNCIONES DE NAVEGACIÓN ---
    function actualizarHeroStats() {
        const highScore = parseInt(localStorage.getItem('virtus_highscore')) || 0;
        const uiRank = document.getElementById('hero-rank-name');
        const uiHigh = document.getElementById('hero-high-score');

        if (uiHigh) uiHigh.innerText = `${highScore} PTS`;

        if (uiRank) {
            let label = "NEÓFITO";
            if (highScore >= 1200) label = "VETERANO";
            else if (highScore >= 600) label = "DISCÍPULO";
            uiRank.innerText = label;
        }
    }

    function cambiarPantalla(pantallaOcultar, pantallaMostrar) {
        pantallaOcultar.classList.remove('active');
        pantallaOcultar.classList.add('hidden');
        pantallaMostrar.classList.remove('hidden');
        setTimeout(() => {
            pantallaMostrar.classList.add('active');
        }, 50);
    }

    // --- 5. FUNCIONES DEL JUEGO ---
    function iniciarJuego() {
        if(preguntas.length === 0) return;

        puntaje = 0;
        vidas = 3;
        contadorPreguntas = 0;
        
        // Barajar por niveles de madurez espiritual
        const nivelFacil = preguntas.filter(p => p.nivel === 'facil').sort(() => Math.random() - 0.5);
        const nivelDiscipulo = preguntas.filter(p => p.nivel === 'discipulo').sort(() => Math.random() - 0.5);
        const nivelVeterano = preguntas.filter(p => p.nivel === 'veterano').sort(() => Math.random() - 0.5);

        colaPreguntas = [...nivelFacil, ...nivelDiscipulo, ...nivelVeterano];
        
        const pantallaOrigen = !screenResult.classList.contains('hidden') ? screenResult : screenHome;
        cambiarPantalla(pantallaOrigen, screenGame);
        
        actualizarUI(); 
        cargarSiguientePregunta(); 
    }

    function cargarSiguientePregunta() {
        if (vidas <= 0 || contadorPreguntas >= colaPreguntas.length) {
            terminarJuego();
            return;
        }

        preguntaActual = colaPreguntas[contadorPreguntas];
        contadorPreguntas++;

        // Rango Visual Dinámico
        let etiqueta = "🟢 Neófito";
        let color = "#10b981";
        if (puntaje >= 1200) { etiqueta = "🔴 Veterano"; color = "#ef4444"; }
        else if (puntaje >= 600) { etiqueta = "🟡 Discípulo"; color = "#f59e0b"; }

        uiQuestionCounter.innerHTML = `Misión ${contadorPreguntas} <span style="float:right; font-size:0.8em; color:${color}; font-weight:bold;">${etiqueta}</span>`;
        uiQuestionText.textContent = preguntaActual.pregunta;
        uiOptionsContainer.innerHTML = ''; 

        preguntaActual.opciones.forEach((opcion, index) => {
            const btn = document.createElement('button');
            btn.classList.add('btn-option');
            btn.innerHTML = `<span>${opcion}</span>`;
            btn.onclick = () => verificarRespuesta(index, btn);
            uiOptionsContainer.appendChild(btn);
        });
    }

    function verificarRespuesta(indiceSeleccionado, btn) {
        const botones = uiOptionsContainer.querySelectorAll('button');
        botones.forEach(b => b.disabled = true);

        if (indiceSeleccionado === preguntaActual.correcta) {
            btn.classList.add('correct');
            puntaje += 100;
            
            Swal.fire({
                toast: true, position: 'top', icon: 'success', 
                title: '¡Sabiduría!', showConfirmButton: false, timer: 1000,
                background: '#0a0c10', color: '#10b981'
            });
        } else {
            btn.classList.add('wrong');
            vidas--;
            
            if(botones[preguntaActual.correcta]) {
                botones[preguntaActual.correcta].classList.add('correct');
            }
            
            Swal.fire({
                title: 'Revelación Necesaria',
                text: `La verdad se encuentra en ${preguntaActual.referencia}`,
                icon: 'error',
                confirmButtonText: 'Seguir estudiando',
                background: '#0a0c10', color: '#f1f5f9'
            });
        }

        actualizarUI();

        setTimeout(() => {
            if (vidas > 0) cargarSiguientePregunta();
            else terminarJuego();
        }, 2000);
    }

    function actualizarUI() {
        if(uiScore) uiScore.textContent = puntaje;
        if(uiLives) uiLives.innerHTML = "❤️".repeat(vidas > 0 ? vidas : 0);
    }

    function terminarJuego() {
        const finalPoints = document.getElementById('final-points');
        if(finalPoints) finalPoints.textContent = puntaje;
        
        let recordAnterior = localStorage.getItem('virtus_highscore') || 0;
        recordAnterior = parseInt(recordAnterior);
        
        let mensaje = "El camino del conocimiento es largo. Sigue estudiando.";
        if (puntaje > 300) mensaje = "¡Has luchado bien, guerrero!";
        if (puntaje > 800) mensaje = "¡Un verdadero Maestro de la Palabra!";
        
        if (puntaje > recordAnterior && puntaje > 0) {
            mensaje = "¡NUEVA MARCA DE HONOR!"; 
            localStorage.setItem('virtus_highscore', puntaje);
            
            // Sincronizar con el perfil global
            let perfil = JSON.parse(localStorage.getItem('codice_perfil')) || { xp: 0, logros: [] };
            perfil.xp += Math.floor(puntaje / 10); // Bono de XP
            localStorage.setItem('codice_perfil', JSON.stringify(perfil));

            setTimeout(() => {
                mostrarMedalla();
            }, 1000);
        }
        
        const resMsg = document.getElementById('result-message');
        if(resMsg) resMsg.textContent = mensaje;
        
        actualizarHeroStats(); // <--- NUEVO: Actualizar Hero para la próxima partida
        cambiarPantalla(screenGame, screenResult);
    }

    // --- EVENTOS ---
    if (btnStart) btnStart.addEventListener('click', iniciarJuego);
    if (btnRestart) btnRestart.addEventListener('click', iniciarJuego);

    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            const msg = `🛡️ VIRTUS: He alcanzado el rango de honor con ${puntaje} puntos en Códice Bíblico.\n¿Podrás superarme?`;
            if (navigator.share) {
                try { await navigator.share({ title: 'Desafío VIRTUS', text: msg, url: window.location.origin }); } 
                catch (err) { console.log('Cancelado'); }
            } else {
                window.open(`https://wa.me/?text=${encodeURIComponent(msg + " " + window.location.origin)}`, '_blank');
            }
        });
    }
});

function mostrarMedalla() {
    const modal = document.getElementById('modal-medalla');
    if(modal) modal.classList.remove('hidden');
}

window.cerrarMedalla = function() {
    const modal = document.getElementById('modal-medalla');
    if(modal) modal.classList.add('hidden');
};
