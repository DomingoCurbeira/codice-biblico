import json
import os

DIR_ESTUDIOS = "proyectos/biblia/codice/data/estudios"

# 1. HUELLAS (Lunes 6 Jul) - SAÚL: EL REY QUE EL PUEBLO ELIGIÓ
mon_study = {
  "id": "huellas-saul-apariencia",
  "activo": True,
  "fecha_programada": "2026-07-06",
  "tipo": "huellas",
  "titulo": "Saúl: El Rey que el Pueblo eligió",
  "subtitulo": "La Transición del Gobierno: La tragedia de buscar un líder según los estándares del mundo en lugar del diseño del cielo",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Julio 2026",
  "tiempo_lectura": "21 min",
  "imagen_portada": "../img/estudios/saul-ungimiento.webp",
  "tags": ["Saúl", "Reino", "Apariencia", "Liderazgo", "Samuel"],
  "versiculo_clave": {
    "texto": "Y se adelantó a todos los del pueblo desde los hombros arriba. Y dijo Samuel a todo el pueblo: ¿Habéis visto al que ha elegido Jehová...?",
    "cita": "1 Samuel 10:23-24"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Narrativa Monárquica / Teología del Liderazgo",
      "titulo": "El Rechazo a la Teocracia",
      "texto": "Israel llegó a un punto de quiebre. Cansados de la inestabilidad de los jueces y atemorizados por las naciones vecinas (especialmente los amonitas y filisteos), el pueblo exigió un rey para ser 'como todas las naciones'. Al pedir esto, no solo estaban rechazando el liderazgo del anciano Samuel, estaban rechazando el gobierno directo de Jehová. Dios les concedió su petición, pero les dio exactamente lo que su corazón carnal deseaba: un líder que se viera imponente por fuera. Saúl, de la tribu de Benjamín, era alto, apuesto y fuerte. Representaba el ideal humano de un monarca guerrero, pero escondía una profunda inseguridad y una falta total de altar privado."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "Malkhút (מַלְכוּת)",
      "idioma": "Hebreo",
      "raiz": "Melek (Rey) / Malak (Reinar)",
      "significado": "Reino, dominio, poder soberano, realeza.",
      "fonetica_guia": "Mal-jút",
      "revelacion": "En la cosmovisión hebrea, el 'Malkhút' (Reino) no es principalmente un territorio geográfico, sino el ejercicio activo del señorío. Cuando Israel pidió un 'Melek' (Rey) visible, estaban renunciando al 'Malkhút' invisible de Dios sobre ellos. Saúl obtuvo el trono, pero nunca comprendió el Malkhút de Dios; intentó gobernar como un rey cananeo, basándose en la fuerza y el pragmatismo, en lugar de gobernar como un virrey sometido a la voz del Profeta."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "Dios de Soberanía Concedida (Juicio por Permisión)",
      "texto": "A veces, el mayor juicio de Dios no es decir 'no', sino decir 'sí' a nuestras peticiones equivocadas. Dios se revela como Alguien que no fuerza Su voluntad sobre un pueblo obstinado. El atributo de Soberanía no anula el libre albedrío; Dios permitió que Israel tuviera el líder que su inmadurez espiritual demandaba (Saúl) para que, a través del doloroso fracaso del rey carnal, aprendieran a anhelar al Rey según el corazón de Dios (David)."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "El Rey sin Atractivo Visual",
      "texto": "Saúl es la antítesis visual del Mesías. Saúl fue elegido porque sobresalía de los hombros hacia arriba; impresionaba la vista natural. Jesucristo, por el contrario, vino bajo el diseño de Isaías 53: 'No hay parecer en él, ni hermosura; le veremos, mas sin atractivo para que le deseemos'. Cristo (Jesucristo-Pneuma) no estableció Su Malkhút con una corona de oro, una gran estatura o un ejército armado, sino mediante la obediencia absoluta al Padre y una corona de espinas."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "El Ciclo del Liderazgo Carnal",
      "descripcion": "La anatomía del reinado de Saúl muestra cómo el carisma sin carácter siempre termina en ruina:",
      "pasos": [
        {
          "concepto": "Elección por Apariencia",
          "explicacion": "El pueblo y hasta Samuel fueron seducidos por la altura y estampa de Saúl. Lo externo ciega el discernimiento."
        },
        {
          "concepto": "Inseguridad Oculta",
          "explicacion": "El día de su presentación, Saúl se escondió entre el equipaje (1 Sam 10:22). La fachada fuerte a menudo esconde un terror interno."
        },
        {
          "concepto": "Pragmatismo sin Pacto",
          "explicacion": "Saúl ganó sus primeras batallas, pero su corazón no estaba interesado en conocer a Dios, solo en que Dios respaldara su corona."
        },
        {
          "concepto": "Pérdida de la Unción",
          "explicacion": "Ante la primera prueba de espera (en Gilgal), Saúl usurpa el altar. El liderazgo que no respeta el sacerdocio pierde el Reino."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "El Peligro de lo Externo",
      "referencias": [
        {
          "cita": "1 Samuel 16:7",
          "versiculo": "No mires a su parecer, ni a lo grande de su estatura... porque Jehová no mira lo que mira el hombre; sino que Jehová mira el corazón.",
          "revelacion": "La corrección definitiva que Dios le da a Samuel años después, cuando va a ungir a David. Dios repudia el estándar de Saúl."
        },
        {
          "cita": "Oseas 13:11",
          "versiculo": "Te di rey en mi furor, y te lo quité en mi ira.",
          "revelacion": "El profeta Oseas revela retrospectivamente que la instauración del reinado de Saúl fue un acto de ira disciplinaria de Dios."
        },
        {
          "cita": "Mateo 23:27",
          "versiculo": "Así también vosotros por fuera, a la verdad, os mostráis justos a los hombres, pero por dentro estáis llenos de hipocresía...",
          "revelacion": "Jesús confronta a los fariseos con el mismo 'Síndrome de Saúl': mantener la fachada alta mientras el interior está muerto."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: Cuidado con lo que pides",
      "items": [
        {
          "punto": "No exijas cosas para ser 'como los demás'.",
          "ejemplo": "Insistirle a Dios en que te dé cierto trabajo, pareja o estilo de vida solo porque todos tus amigos lo tienen.",
          "escenario_actual": "Si Dios te ha negado algo repetidamente, no fuerces la puerta. Un 'Saúl' en tu vida (una bendición forzada) te causará más dolor que el tiempo de espera."
        },
        {
          "punto": "No te escondas en el equipaje.",
          "ejemplo": "Aceptar un cargo o responsabilidad, pero luego evadir el compromiso por miedo a lo que dirán los demás.",
          "escenario_actual": "Si Dios te ha llamado a algo, asume tu posición con valentía. La inseguridad crónica, a pesar de estar ungido, es una falta de fe."
        },
        {
          "punto": "Lo alto no siempre es sagrado.",
          "ejemplo": "Creer que una iglesia es buena solo porque tiene un edificio enorme o el pastor viste muy elegante.",
          "escenario_actual": "Aprende a discernir el ambiente espiritual por encima de la decoración. Busca donde esté la presencia de Dios, no el mejor espectáculo."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: El Liderazgo sin Altar",
      "items": [
        {
          "punto": "El carisma te sube, el carácter te sostiene.",
          "ejemplo": "Liderar grandes proyectos o ministerios usando tus habilidades naturales de comunicación, pero sin orar en secreto.",
          "escenario_actual": "Si tus talentos te han llevado más lejos de lo que tu vida de oración puede sostener, estás a un paso de la caída. Regresa al altar privado hoy mismo."
        },
        {
          "punto": "La opinión pública no sustituye la voz de Dios.",
          "ejemplo": "Tomar decisiones ministeriales basadas en encuestas o en lo que la gente pide (como Israel pidiendo rey) en lugar de consultar el diseño de Dios.",
          "escenario_actual": "No cambies la visión que Dios te dio solo para mantener contenta a la multitud. Es preferible ser impopular con el mundo que ilegítimo ante el Cielo."
        },
        {
          "punto": "Evita el 'Síndrome de Saúl'.",
          "ejemplo": "Sentir que tienes que mantener una imagen de líder perfecto e infalible, ocultando tus debilidades a tu círculo íntimo.",
          "escenario_actual": "La verdadera fortaleza de un líder es su vulnerabilidad ante Dios y ante sus mentores. Quítate la corona pesada del ego y rinde cuentas."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "El Engaño del Liderazgo Pragmático",
      "texto": "Hoy abunda la teología empresarial dentro de la iglesia, que mide a los líderes por resultados visibles: crecimiento numérico, elocuencia y carisma (estatura de los hombros hacia arriba). La historia de Saúl nos advierte que Dios puede permitir el crecimiento numérico como juicio permisivo. Un ministerio puede ser masivo, pero carecer absolutamente de unción legítima. El diseño de Dios requiere pastores con el corazón de David, no CEOs con la armadura de Saúl."
    }
  ],
  "desafio_practico": "Hoy, identifica una decisión reciente que tomaste basándote puramente en la 'apariencia' (lo que se veía mejor, pagaba más o daba más estatus). Pídele perdón a Dios si excluiste Su voz del proceso.",
  "conexiones": {
    "huellas": [
      {
        "id": "samuel-vidente",
        "nombre": "Samuel",
        "razon": "El juez que tuvo que ungir a su propio reemplazo.",
        "paralelismo": "El contraste entre el profeta obediente y el rey rebelde."
      }
    ],
    "cronos": [
      {
        "id": "gabaa-saul",
        "nombre": "Gabaa",
        "razon": "La sede del poder rústico de Saúl.",
        "simbolismo": "Un centro de mando carnal sin presencia divina."
      }
    ],
    "etymos": [
      {
        "id": "malkhut-he",
        "nombre": "Malkhút (Reino)",
        "razon": "La soberanía que Israel quiso arrebatar a Dios.",
        "familia": "Gobierno, autoridad suprema."
      }
    ],
    "aposento": [
      {
        "id_oracion": "renuncia-apariencias",
        "tema": "Derribando la Vanagloria",
        "declaracion": "Señor, renuncio a buscar el aplauso de los hombres. Arranca de mí la necesidad de impresionar y la tiranía de las apariencias. Que mi único afán sea tener un corazón aprobado por Ti."
      }
    ]
  }
}

# 2. MITOS (Martes 7 Jul) - EL MITO DE LA IMPACIENCIA JUSTIFICADA
tue_study = {
  "id": "mitos-saul-sacrificio",
  "activo": True,
  "fecha_programada": "2026-07-07",
  "tipo": "mitos",
  "titulo": "El Mito de la Impaciencia Justificada",
  "subtitulo": "¿Por qué ofrecer un sacrificio a Dios le costó el trono a Saúl? El peligro del pragmatismo religioso",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Julio 2026",
  "tiempo_lectura": "22 min",
  "imagen_portada": "../img/estudios/saul-sacrificio.webp",
  "tags": ["Saúl", "Sacrificio", "Obediencia", "Samuel", "Impaciencia"],
  "versiculo_clave": {
    "texto": "Y dijo Samuel: ¿Qué has hecho? Y Saúl respondió: Porque vi que el pueblo se me desertaba... me esforcé, pues, y ofrecí holocausto.",
    "cita": "1 Samuel 13:11-12"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Biografía Trágica / Análisis de Crisis",
      "titulo": "La Prueba en Gilgal",
      "texto": "La situación era desesperada. Saúl y un pequeño grupo de soldados estaban en Gilgal, rodeados por un ejército filisteo masivo ('como la arena del mar'). Samuel le había ordenado a Saúl esperar exactamente siete días hasta que él llegara para ofrecer el sacrificio y buscar el favor de Dios antes de la batalla. El séptimo día llegó, el pueblo comenzó a desertar por miedo, y Samuel no aparecía. Sintiendo la presión política y militar, Saúl tomó una decisión pragmática: asumió funciones sacerdotales que no le correspondían y ofreció él mismo el holocausto. Justo cuando terminó, llegó Samuel. A los ojos humanos, Saúl hizo lo lógico para mantener a sus tropas unidas; a los ojos de Dios, cruzó una línea de autoridad inquebrantable."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "Olah (עוֹלָה)",
      "idioma": "Hebreo",
      "raiz": "Alah (Subir / Ascender)",
      "significado": "Holocausto, ofrenda quemada por completo que sube hacia Dios.",
      "fonetica_guia": "O-láh",
      "revelacion": "El 'Olah' era el sacrificio supremo de consagración; el animal se quemaba enteramente, simbolizando entrega total a Dios. La ironía es brutal: Saúl ofreció un sacrificio de 'entrega total' (Olah) mediante un acto de 'rebelión total' (usurpar el oficio del sacerdote). Dios no acepta el humo del sacrificio si las manos que encienden el fuego están manchadas de desobediencia."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "El Dios de los Tiempos Exactos y la Autoridad Delegada",
      "texto": "Dios se revela como Alguien que prueba el carácter a través de la presión del tiempo. El retraso de Samuel no fue un accidente; fue la providencia divina calibrando el corazón del rey. El atributo de Dios como Dador de Autoridad exige que cada uno respete su diseño: el rey gobierna (espada), el sacerdote oficia (altar). Cuando Saúl cruzó esa frontera por pánico, invalidó su capacidad para gobernar en el nombre de Dios."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "Cristo: El Sacerdote y Rey Legítimo",
      "texto": "Saúl intentó forzar la unión de la corona y el altar por su propia cuenta, lo cual estaba prohibido. Solo Jesucristo tiene el derecho legal y profético de ostentar ambos oficios. Jesús es el León (Rey) y el Cordero (Sacerdote/Sacrificio) simultáneamente, según el orden de Melquisedec. Saúl falló bajo la presión del miedo; Cristo, en Getsemaní, bajo la peor presión cósmica, esperó y obedeció al Padre hasta la cruz."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "La Anatomía de la Desobediencia Pragmática",
      "descripcion": "Los pasos mentales que llevaron a Saúl a perder el Reino nos advierten hoy:",
      "pasos": [
        {
          "concepto": "Lectura Natural de la Crisis",
          "explicacion": "'Vi que el pueblo se me desertaba'. Medir la realidad por las circunstancias en lugar de por la palabra profética dada."
        },
        {
          "concepto": "Justificación Espiritual",
          "explicacion": "'Me esforcé... y ofrecí holocausto'. Disfrazar un acto de desobediencia y miedo como si fuera un acto de piedad y adoración."
        },
        {
          "concepto": "Culpar a las Circunstancias",
          "explicacion": "Saúl culpó a la tardanza de Samuel y a la amenaza filistea. El corazón rebelde nunca asume la responsabilidad de su pánico."
        },
        {
          "concepto": "El Juicio Inmediato",
          "explicacion": "'Tu reino no será duradero'. Una sola decisión pragmática, hecha por temor al hombre, borró el linaje de Saúl del trono."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "La Obediencia por Encima del Ritual",
      "referencias": [
        {
          "cita": "1 Samuel 15:22",
          "versiculo": "Ciertamente el obedecer es mejor que los sacrificios, y el prestar atención que la grosura de los carneros.",
          "revelacion": "El principio universal que Samuel tuvo que enseñarle a Saúl más tarde: la liturgia no sustituye a la rendición."
        },
        {
          "cita": "Proverbios 19:2",
          "versiculo": "El alma sin ciencia no es buena, Y aquel que se apresura con sus pies, peca.",
          "revelacion": "La advertencia contra el pánico. La impaciencia no es solo debilidad, es el vehículo del pecado."
        },
        {
          "cita": "Hebreos 5:4",
          "versiculo": "Y nadie toma para sí esta honra, sino el que es llamado por Dios, como lo fue Aarón.",
          "revelacion": "Validación neotestamentaria del principio de autoridad: no puedes usurpar un diseño espiritual por iniciativa propia."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: La Trampa de 'Ayudar' a Dios",
      "items": [
        {
          "punto": "El fin no justifica los medios.",
          "ejemplo": "Mentir en un currículum para conseguir un trabajo y luego decir que 'Dios te abrió la puerta'.",
          "escenario_actual": "Si para conseguir algo (incluso algo bueno) tienes que romper un mandamiento de Dios, ese no es Su plan. Dios no necesita que peques para bendecirte."
        },
        {
          "punto": "Espera el tiempo de Dios.",
          "ejemplo": "Empezar una relación de pareja con alguien que no comparte tu fe solo porque 'se te pasa el tiempo' o te sientes solo.",
          "escenario_actual": "Cuando la presión sube y parece que la respuesta se retrasa (día 7), mantén tu posición. Ceder al pánico traerá peores consecuencias."
        },
        {
          "punto": "No justifiques tus miedos.",
          "ejemplo": "Culpar a tu jefe, a tu cónyuge o a la economía por tus malas decisiones.",
          "escenario_actual": "Asume la responsabilidad. Cuando te equivoques, no le digas a Dios 'es que vi que todo se caía'; simplemente dile: 'Perdóname, desobedecí'."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: El Peligro del Pragmatismo",
      "items": [
        {
          "punto": "El altar no es tuyo para manipularlo.",
          "ejemplo": "Un líder de alabanza o pastor que, al ver que la gente está fría o aburrida, recurre a manipulación emocional o humo para 'hacer que algo pase'.",
          "escenario_actual": "No fuerces el mover del Espíritu ('me esforcé y ofrecí holocausto'). Es preferible un culto sobrio en obediencia que un espectáculo nacido de la inseguridad pastoral."
        },
        {
          "punto": "Respeta los diseños y autoridades ajenas.",
          "ejemplo": "Un pastor que asume el control del dinero pasando por encima del equipo financiero, o un líder que toma funciones que le corresponden a otro.",
          "escenario_actual": "La prisa ministerial no es excusa para cruzar las fronteras de autoridad. Mantente dentro de la jurisdicción que Dios te asignó."
        },
        {
          "punto": "La prueba del último minuto.",
          "ejemplo": "Abandonar una convicción ética en tu empresa justo el día antes de firmar el contrato porque sientes que si no cedes, lo perderás todo.",
          "escenario_actual": "Dios suele probar el corazón en el 'día 7, a la última hora'. La verdadera lealtad se demuestra sosteniendo la posición cuando todo grita que abandones."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "La Falsa Espiritualidad del 'Resultadismo'",
      "texto": "La iglesia occidental está profundamente infectada por el pragmatismo (si funciona, está bien). Juzgamos los ministerios por el resultado (cuánta gente se quedó o llegó) y no por el proceso (¿obedeció la Palabra?). Saúl creyó que porque el humo del sacrificio subió, la crisis estaba resuelta. Dios advierte: Puedes tener la liturgia, la fogata y la justificación lógica, pero si llegaste ahí rompiendo el diseño divino, estás construyendo tu propio exilio."
    }
  ],
  "desafio_practico": "Identifica una situación en tu vida que te está causando ansiedad o pánico porque sientes que 'el tiempo se acaba'. Hoy, decide soltar el control y declarar: 'Señor, no forzaré las cosas. Esperaré Tu llegada'.",
  "conexiones": {
    "huellas": [
      {
        "id": "jesucristo-pneuma",
        "nombre": "Jesucristo",
        "razon": "El Rey y Sacerdote.",
        "paralelismo": "El único autorizado para ofrecer el sacrificio perfecto sin usurpar."
      }
    ],
    "cronos": [
      {
        "id": "gilgal-campamento",
        "nombre": "Gilgal",
        "razon": "El lugar de la prueba de espera.",
        "simbolismo": "Donde el liderazgo humano tropezó ante la presión del reloj."
      }
    ],
    "etymos": [
      {
        "id": "olah-heb",
        "nombre": "Olah (Holocausto)",
        "razon": "El sacrificio que Saúl usurpó.",
        "familia": "Entrega, fuego, ascensión."
      }
    ],
    "aposento": [
      {
        "id_oracion": "paciencia-proceso",
        "tema": "Contrarrestando el Pánico",
        "declaracion": "Padre, perdóname por tratar de 'ayudarte' pecando. Líbrame del pragmatismo. Dame la gracia de mantenerme firme en Tus promesas, incluso cuando mis ojos me griten que el tiempo se acaba."
      }
    ]
  }
}
