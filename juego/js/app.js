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
    
    const uiLives = document.querySelector('.lives');
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
            console.log("Preguntas cargadas:", preguntas.length);
        })
        .catch(err => {
            console.error("Error cargando preguntas", err);
            uiQuestionText.innerText = "Error cargando preguntas. Revisa la consola.";
        });

    // --- 4. FUNCIONES DE NAVEGACIÓN (LA QUE FALTABA) ---
    
    /**
     * Oculta una pantalla y muestra otra con animaciones
     */
    function cambiarPantalla(pantallaOcultar, pantallaMostrar) {
        // Quitar estado activo y ocultar
        pantallaOcultar.classList.remove('active');
        pantallaOcultar.classList.add('hidden');
        
        // Mostrar y activar
        pantallaMostrar.classList.remove('hidden');
        // Pequeño delay para que la transición CSS (opacity) se note
        setTimeout(() => {
            pantallaMostrar.classList.add('active');
        }, 50);
    }

    // --- 5. FUNCIONES DEL JUEGO ---

    function iniciarJuego() {
        if(preguntas.length === 0) {
            console.warn("Aún no se han cargado las preguntas.");
            return;
        }

        puntaje = 0;
        vidas = 3;
        contadorPreguntas = 0;
        
        // 1. Separar y barajar por niveles
        const nivelFacil = preguntas.filter(p => p.nivel === 'facil').sort(() => Math.random() - 0.5);
        const nivelDiscipulo = preguntas.filter(p => p.nivel === 'discipulo').sort(() => Math.random() - 0.5);
        const nivelVeterano = preguntas.filter(p => p.nivel === 'veterano').sort(() => Math.random() - 0.5);

        colaPreguntas = [...nivelFacil, ...nivelDiscipulo, ...nivelVeterano];
        
        // 2. Gestionar el cambio de pantalla
        // Si el resultado no está oculto, venimos de ahí, si no, de Home.
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

    // Determinamos el Rango del jugador según su puntaje actual
    let etiqueta = "";
    let color = "";

    if (puntaje >= 1200) {
        etiqueta = "🔴 Veterano";
        color = "#ef4444";
    } else if (puntaje >= 600) {
        etiqueta = "🟡 Discípulo";
        color = "#f59e0b";
    } else {
        etiqueta = "🟢 Neófito";
        color = "#10b981";
    }

    // Actualizamos el contador y el letrero de rango
    uiQuestionCounter.innerHTML = `Pregunta ${contadorPreguntas} <span style="float:right; font-size:0.8em; color:${color}; font-weight:bold;">${etiqueta}</span>`;
    
    uiQuestionText.textContent = preguntaActual.pregunta;
    uiOptionsContainer.innerHTML = ''; 

    preguntaActual.opciones.forEach((opcion, index) => {
        const btn = document.createElement('button');
        btn.classList.add('btn-option');
        btn.textContent = opcion;
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
                title: '¡Correcto!', showConfirmButton: false, timer: 1000,
                background: '#1e293b', color: '#10b981'
            });
        } else {
            btn.classList.add('wrong');
            vidas--;
            
            if(botones[preguntaActual.correcta]) {
                botones[preguntaActual.correcta].classList.add('correct');
            }
            
            Swal.fire({
                title: '¡Fallaste!',
                text: `La respuesta correcta está en ${preguntaActual.referencia}`,
                icon: 'error',
                confirmButtonText: 'Entendido',
                background: '#1e293b', color: '#fff'
            });
        }

        actualizarUI();

        setTimeout(() => {
            if (vidas > 0) cargarSiguientePregunta();
            else terminarJuego();
        }, 2000);
    }

    function actualizarUI() {
        uiScore.textContent = puntaje;
        uiLives.textContent = "❤️".repeat(vidas > 0 ? vidas : 0);
    }

    function terminarJuego() {
        const finalPoints = document.getElementById('final-points');
        if(finalPoints) finalPoints.textContent = puntaje;
        
        // 1. Buscamos el récord anterior guardado en el celular (si es la primera vez, será 0)
        let recordAnterior = localStorage.getItem('virtus_highscore') || 0;
        recordAnterior = parseInt(recordAnterior);
        
        let mensaje = "Debes estudiar más las Escrituras.";
        if (puntaje > 300) mensaje = "¡Bien hecho, soldado!";
        if (puntaje > 800) mensaje = "¡Un verdadero maestro de la Palabra!";
        
        // --- NUEVA LÓGICA DE MEDALLA: SUPERAR EL RÉCORD ---
        // Si el puntaje actual es MAYOR al récord anterior (y mayor a cero para que no premie por no hacer nada)
        if (puntaje > recordAnterior && puntaje > 0) {
            mensaje = "¡NUEVO RÉCORD PERSONAL!"; // Cambiamos el mensaje para celebrar
            
            // Guardamos el nuevo récord en la memoria del teléfono
            localStorage.setItem('virtus_highscore', puntaje);
            
            // Hacemos saltar la medalla
            setTimeout(() => {
                mostrarMedalla();
            }, 1000);
        }
        
        const resMsg = document.getElementById('result-message');
        if(resMsg) resMsg.textContent = mensaje;
        
        // Usamos nuestra función de cambio de pantalla para ir a los resultados
        cambiarPantalla(screenGame, screenResult);
    }

    // --- 6. EVENT LISTENERS ---
    if (btnStart) btnStart.addEventListener('click', iniciarJuego);
    if (btnRestart) btnRestart.addEventListener('click', iniciarJuego);

    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            const mensaje = `🛡️ VIRTUS: He demostrado mi valor obteniendo ${puntaje} puntos en Códice Bíblico.\n¿Podrás superarme?`;
            if (navigator.share) {
                try { await navigator.share({ title: 'Desafío VIRTUS', text: mensaje, url: window.location.href }); } 
                catch (err) { console.log('Compartir cancelado'); }
            } else {
                window.open(`https://wa.me/?text=${encodeURIComponent(mensaje + " " + window.location.href)}`, '_blank');
            }
        });
    }

    // Menú Launcher
    const btnLauncher = document.getElementById('btn-launcher');
    const ecoMenu = document.getElementById('eco-menu');
    if (btnLauncher && ecoMenu) {
        btnLauncher.addEventListener('click', (e) => {
            e.stopPropagation();
            ecoMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', () => ecoMenu.classList.add('hidden'));
    }

    renderizarFooter();
});

function renderizarFooter() {
    if (document.querySelector('.app-footer')) return;
    const year = new Date().getFullYear();
    const footerHTML = `
        <footer class="app-footer" style="padding: 20px 0; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; width: 100%;">
            <p style="color: #64748b; margin: 0;">Desarrollado por <span style="color:#d4b483">Domingo Curbeira</span></p>
            <p style="color:#475569; margin: 0; font-size: 0.7rem;">© ${year}</p>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// --- 7. SISTEMA DE LOGROS (MEDALLA) ---

// Mostrar Medalla
function mostrarMedalla() {
    const modal = document.getElementById('modal-medalla');
    if(modal) modal.classList.remove('hidden');
}

// Cerrar Medalla (Se llama desde el botón del HTML)
function cerrarMedalla() {
    const modal = document.getElementById('modal-medalla');
    if(modal) modal.classList.add('hidden');
}