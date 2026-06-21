import json
import os

DIR_ESTUDIOS = "proyectos/biblia/codice/data/estudios"

# 3. ETYMOS (Miércoles 24 Jun) - SHAMÁ: OÍR ES OBEDECER
wed_study = {
  "id": "etymos-shama-oir",
  "activo": False,
  "fecha_programada": "2026-06-24",
  "tipo": "etimologia",
  "titulo": "Shamá': El Arte de Escuchar",
  "subtitulo": "Descifrando el Código Legal de la Obediencia: Por qué en el Reino de Dios oír sin actuar es sordera",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Junio 2026",
  "tiempo_lectura": "18 min",
  "imagen_portada": "../img/estudios/shama-oir.webp",
  "tags": ["Samuel", "Shamá", "Obediencia", "Escuchar", "Etimología"],
  "versiculo_clave": {
    "texto": "Y Samuel dijo: Habla, porque tu siervo oye (Shamá).",
    "cita": "1 Samuel 3:10"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Análisis Filológico / Narrativa Profética",
      "texto": "En la cultura occidental (griega), 'escuchar' es un proceso acústico y cognitivo. Si te digo algo y tú lo entiendes, asumes que has 'escuchado'. Sin embargo, en el mundo hebreo antiguo, los conceptos eran funcionales y orientados a la acción. Para un hebreo, la audición estaba indisolublemente unida a la obediencia. El Shemá ('Oye, Israel', Dt 6:4) no es solo una llamada a prestar atención auditiva, es una orden militar: 'Presta atención, interioriza y ejecuta'. Cuando Samuel responde 'Habla, que tu siervo oye', no está diciendo 'tengo buen oído', está firmando un contrato en blanco que dice 'lo que digas, lo haré'."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "Shamá' (שָׁמַע)",
      "idioma": "Hebreo",
      "raiz": "Sh-m-a (Oír / Prestar atención / Obedecer)",
      "significado": "Escuchar inteligentemente con la intención garantizada de responder y obedecer.",
      "fonetica_guia": "Sha-má",
      "revelacion": "En el hebreo bíblico, no existe una palabra independiente para 'obedecer' como concepto aislado. Para decir 'obedecer', se usa 'Shamá'. Esto es una revelación masiva: Si dices que oíste a Dios, pero no hiciste lo que te pidió, bíblicamente hablando, estás sordo. La acción valida la audición."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "Dios Comunicador y Autoridad Soberana",
      "texto": "Dios revela que Él es un Dios que habla (a diferencia de los ídolos mudos de las naciones), pero Su atributo de Soberanía exige que Su voz no sea tratada como una simple 'sugerencia'. Cuando Dios habla, la materia se altera (creación) o la voluntad humana se alinea (obediencia). Él busca vasijas como Samuel, dispuestas a ser afinadas en la frecuencia del 'Shamá'."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "Jesucristo: El Oído Perfecto",
      "texto": "Isaías 50:4-5 dice proféticamente sobre el Mesías: 'Despierta mi oído para que oiga como los sabios... yo no fui rebelde'. Jesús encarna la plenitud del 'Shamá'. Él dijo: 'Las palabras que yo os hablo, no las hablo por mi propia cuenta' (Jn 14:10). Cristo no solo tenía un oído acústico para el Padre, tenía una voluntad perfectamente sintonizada para ejecutar cada decreto del Cielo."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "Las Cuatro Etapas de la Frecuencia Divina",
      "descripcion": "El llamado de Samuel en la noche nos revela cómo se afina el oído espiritual:",
      "pasos": [
        {
          "concepto": "Percepción Borrosa",
          "explicacion": "Samuel oye la voz (acústica), pero la confunde con la de Elí. Conoce el sonido, pero no al Emisor."
        },
        {
          "concepto": "Dirección Sacerdotal",
          "explicacion": "Elí, a pesar de sus fallos, discierne que es Dios y le da a Samuel el protocolo de respuesta ('Habla, Jehová...')."
        },
        {
          "concepto": "Posición de Servicio",
          "explicacion": "Samuel responde como 'siervo' (Ebed). No se puede oír a Dios desde el orgullo, solo desde la rendición."
        },
        {
          "concepto": "Recepción de la Carga",
          "explicacion": "Una vez afinado el oído, Dios le suelta a Samuel una profecía durísima (el juicio contra Elí). Oír a Dios duele a la carne."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "El Hilo de la Audición Activa",
      "referencias": [
        {
          "cita": "Santiago 1:22",
          "versiculo": "Pero sed hacedores de la palabra, y no tan solamente oidores, engañándoos a vosotros mismos.",
          "revelacion": "Santiago, con mente hebrea, nos advierte contra el engaño griego de creer que entender un sermón equivale a haberlo obedecido."
        },
        {
          "cita": "Juan 10:27",
          "versiculo": "Mis ovejas oyen mi voz, y yo las conozco, y me siguen.",
          "revelacion": "Jesús une indisolublemente la audición ('oyen') con la acción incondicional ('siguen')."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: Aprender a Sintonizar",
      "items": [
        {
          "punto": "Apaga el ruido ambiental.",
          "ejemplo": "Tratar de orar y escuchar a Dios mientras tienes la televisión prendida, el celular sonando y la mente llena de ansiedades.",
          "escenario_actual": "Dedica 10 minutos hoy al silencio total. Sin música de fondo. Solo tú, diciéndole: 'Señor, estoy aquí para escuchar'."
        },
        {
          "punto": "No confundas las voces.",
          "ejemplo": "Creer que cualquier pensamiento bueno en tu cabeza es 'la voz de Dios', sin pasarlo por el filtro de la Biblia.",
          "escenario_actual": "Si sientes que Dios te 'dijo' algo, compáralo con la Escritura. Dios nunca te dirá que hagas algo que contradiga Su Palabra escrita."
        },
        {
          "punto": "La obediencia rápida es obediencia real.",
          "ejemplo": "Saber que tienes que perdonar a alguien porque leíste la Biblia, pero decidir 'esperar a sentirlo'.",
          "escenario_actual": "Si sabes que Dios te mandó a pedir perdón, a donar algo o a dejar un hábito, hazlo en las próximas 24 horas. La demora intencional es desobediencia."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: Cargando el Peso de Su Voz",
      "items": [
        {
          "punto": "Pasa de consumidor a ejecutor.",
          "ejemplo": "Ir a conferencias, llenar libretas de apuntes y escuchar podcasts, pero no tener ninguna evidencia de cambio de carácter.",
          "escenario_actual": "Deja de buscar 'nueva revelación' por un mes y dedícate a ejecutar (Shamá) la última instrucción clara que Dios te dio y que aún tienes en pausa."
        },
        {
          "punto": "Escucha lo que es difícil de oír.",
          "ejemplo": "Solo querer escuchar profecías de 'bendición y expansión', ignorando cuando el Espíritu te redarguye de pecado o egoísmo.",
          "escenario_actual": "Pídele a Dios hoy: 'Señor, dime aquello que no quiero escuchar sobre mi carácter, y dame la gracia para aceptarlo sin excusas'."
        },
        {
          "punto": "Asume tu posición de 'Siervo'.",
          "ejemplo": "Acercarse a la oración como si fuera un restaurante de comida rápida ('dame esto, bendice aquello') en lugar de decir 'qué necesitas Tú de mí hoy'.",
          "escenario_actual": "Cambia tu lenguaje de oración hoy. Transiciona del 'Señor, haz...' al 'Señor, dime qué debo hacer yo'."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "El Riesgo del Cristianismo Acústico",
      "texto": "Cuidado con evaluar la 'espiritualidad' de una iglesia por cuán elocuentes son sus predicadores o cuán espectaculares son sus enseñanzas. Puedes tener una iglesia llena de gente con cuadernos de apuntes que, ante el cielo, son un auditorio de sordos. El Reino no se edifica por la cantidad de conocimiento que consumes, sino por el porcentaje de la Palabra que ejecutas bajo presión."
    }
  ],
  "desafio_practico": "Identifica una instrucción que sepas que Dios te dio (a través de la Biblia o convicción interna) y que no has cumplido. Hoy, comprométete a dar el primer paso físico de obediencia antes de que termine el día.",
  "conexiones": {
    "huellas": [
      {
        "id": "samuel-vidente",
        "nombre": "Samuel",
        "razon": "El portador del 'Shamá'.",
        "paralelismo": "El niño que se convirtió en juez por su disposición a escuchar lo duro."
      }
    ],
    "cronos": [],
    "etymos": [
      {
        "id": "shama-heb",
        "nombre": "Shamá (Oír)",
        "razon": "El concepto fundacional del estudio.",
        "familia": "Atención, obediencia, ejecución."
      }
    ],
    "aposento": [
      {
        "id_oracion": "afinando-oido",
        "tema": "Afinación Profética",
        "declaracion": "Padre, perdóname por mi sordera espiritual y por acumular conocimiento sin acción. Hoy digo como Samuel: Habla, que tu siervo te escucha y está listo para obedecer."
      }
    ]
  }
}

# 4. HISTORIA (Jueves 25 Jun) - SILO: EL SANTUARIO OLVIDADO
thu_study = {
  "id": "historia-silo-arqueologia",
  "activo": False,
  "fecha_programada": "2026-06-25",
  "tipo": "historia",
  "titulo": "Silo: El Santuario Olvidado",
  "subtitulo": "Arqueología del Juicio: Qué ocurre cuando la religión se aferra al edificio pero pierde la Gloria",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Junio 2026",
  "tiempo_lectura": "21 min",
  "imagen_portada": "../img/estudios/silo-ruinas.webp",
  "tags": ["Silo", "Arqueología", "Historia", "Arca del Pacto", "Icabod"],
  "versiculo_clave": {
    "texto": "Andad ahora a mi lugar en Silo, donde hice morar mi nombre al principio, y ved lo que le hice por la maldad de mi pueblo Israel.",
    "cita": "Jeremías 7:12"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Crónica Arqueológica / Análisis Profético",
      "titulo": "La Primera Capital Espiritual",
      "texto": "Antes de que Jerusalén existiera como ciudad sagrada de Israel, el centro del universo hebreo era Silo. Ubicada en la región montañosa de Efraín, Silo albergó el Tabernáculo de Reunión y el Arca del Pacto durante casi 369 años (desde Josué hasta Elí). Fue el lugar donde se repartió la tierra, donde Ana lloró, y donde Samuel escuchó la voz de Dios. Arqueológicamente (excavaciones de Israel Finkelstein), se han encontrado capas masivas de ceniza y vasijas rotas que datan del siglo XI a.C. Esto confirma una destrucción catastrófica y repentina, coincidiendo exactamente con la época de la derrota israelita ante los filisteos en Afec, donde se robó el Arca y Elí murió."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "Icabod (אִי כָבוֹד)",
      "idioma": "Hebreo",
      "raiz": "'Iy' (Sin / Dónde) + 'Kabód' (Gloria / Peso)",
      "significado": "Sin gloria; traspasada es la gloria; ¿dónde está la gloria?",
      "fonetica_guia": "I-ca-bód",
      "revelacion": "Icabod es el nombre que la nuera de Elí le dio a su hijo al morir, tras escuchar que el Arca había sido capturada. Es el epitafio de Silo. La tragedia no fue perder un edificio; fue perder el 'Kabód' (el peso de la presencia de Dios). Silo permaneció como una ruina física, utilizada siglos después por profetas como Jeremías para advertir a la arrogante Jerusalén: 'Dios no está atado a tu arquitectura'."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "Dios de Libertad Inconfinable",
      "texto": "Dios se revela como un Ser que rechaza ser 'domesticado'. Los israelitas pensaron que, como tenían el Arca físicamente, tenían garantizada la victoria militar, independientemente de su obediencia moral (usaron el Arca como amuleto en Afec). El atributo de Santidad de Dios le permite desmantelar Sus propios santuarios. Él prefiere habitar en una tienda en el desierto con gente humillada, que en una catedral dorada con corazones de piedra."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "Jesús: La Gloria que abandona el Templo",
      "texto": "Años después, en los evangelios, ocurre el 'Silo' definitivo. Jesús sale del Templo de Jerusalén (Mateo 24:1) y declara: 'Vuestra casa os es dejada desierta'. En la cruz, el velo del templo se rasgó. La Gloria (Jesucristo-Pneuma) abandonó la estructura de piedra para venir a residir en una nueva estructura, no hecha de manos: el creyente redimido. Nosotros somos el nuevo Tabernáculo donde mora el Kabód."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "Las Lecciones de las Cenizas de Silo",
      "descripcion": "El mensaje que las ruinas de Silo gritan a través de los siglos:",
      "pasos": [
        {
          "concepto": "El Peligro del 'Amuleto'",
          "explicacion": "Creer que los ritos (diezmar, congregarse, usar una cruz) forzarán a Dios a bendecirte, a pesar del pecado oculto."
        },
        {
          "concepto": "El Abandono Silencioso",
          "explicacion": "La religión continuó en Silo (había sacerdotes y sacrificios), pero la Gloria ya se había ido. Puedes tener liturgia sin Presencia."
        },
        {
          "concepto": "La Inmunidad Falsa",
          "explicacion": "Jerusalén creyó que no caería por tener el Templo. Jeremías los mandó a mirar a Silo: 'Dios puede destruirte a ti también si no te arrepientes'."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "La Advertencia de la Estructura Vacía",
      "referencias": [
        {
          "cita": "Salmo 78:60-61",
          "versiculo": "Dejó, por tanto, el tabernáculo de Silo... Entregó a cautiverio su poder, Y su gloria en mano del enemigo.",
          "revelacion": "El salmista recuerda la historia para humillar el orgullo nacional de Efraín."
        },
        {
          "cita": "Hechos 7:48",
          "versiculo": "Si bien el Altísimo no habita en templos hechos de mano...",
          "revelacion": "Esteban paga con su vida por recordar a la élite religiosa la misma lección que enseñó Silo."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: Eres el Templo",
      "items": [
        {
          "punto": "No busques a Dios en el edificio.",
          "ejemplo": "Creer que Dios solo te escucha si oras dentro de las cuatro paredes del auditorio de tu iglesia.",
          "escenario_actual": "Comprende que el Espíritu Santo viaja contigo en tu coche, en tu oficina y en tu habitación. Tú portas la Presencia, no la butaca."
        },
        {
          "punto": "No uses a Dios como amuleto.",
          "ejemplo": "Poner la Biblia abierta en el Salmo 91 en tu sala creyendo que eso espantará a los demonios, mientras tienes gritos y peleas en la casa.",
          "escenario_actual": "Reconoce que Dios busca una relación de obediencia, no rituales mágicos vacíos de transformación moral."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: Protegiendo el Kabód",
      "items": [
        {
          "punto": "Cuidado con la religión sin presencia.",
          "ejemplo": "Organizar eventos ministeriales excelentes, con humo y luces, pero sin haber orado ni una hora para que el Espíritu descienda.",
          "escenario_actual": "Si lideras algo, asegúrate de que el peso de la gloria (Kabód) apruebe lo que haces. Es preferible un culto imperfecto con Presencia, que un show perfecto vacío."
        },
        {
          "punto": "Acepta la advertencia de Silo.",
          "ejemplo": "Pensar: 'Dios me usó grandemente en el pasado, por tanto, nunca me disciplinará ni me quitará el ministerio'.",
          "escenario_actual": "Mantén un corazón contrito, sabiendo que el pasado espiritual no garantiza el respaldo presente de Dios si hay soberbia."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "El Síndrome de la 'Estructura Intocable'",
      "texto": "Muchas iglesias y denominaciones mueren abrazadas a su tradición, creyendo que sus edificios históricos o su nombre institucional garantizan que Dios está allí. Las ruinas de Silo son un grito de advertencia teológica: Cuando el sistema eclesiástico sustituye la reverencia por la manipulación, Dios firmará el acta de 'Icabod', apagará la luz y levantará a un joven Samuel en otra parte para que escuche Su voz."
    }
  ],
  "desafio_practico": "Hoy, pide perdón si en algún momento trataste la oración, la adoración o el ministerio como una simple herramienta para lograr tus propios beneficios (usar el Arca) en lugar de buscarlo a Él por quien Él es.",
  "conexiones": {
    "huellas": [],
    "cronos": [
      {
        "id": "silo-santuario",
        "nombre": "Silo",
        "razon": "La sede del estudio.",
        "simbolismo": "El lugar donde la religión presuntuosa fue reducida a cenizas."
      }
    ],
    "etymos": [
      {
        "id": "kabod-heb",
        "nombre": "Kabód (Gloria)",
        "razon": "El peso divino que abandonó el santuario.",
        "familia": "Gravedad, honra, manifestación."
      }
    ],
    "aposento": [
      {
        "id_oracion": "restaurar-gloria",
        "tema": "Hambre por la Presencia",
        "declaracion": "Espíritu Santo, líbrame de la religión vacía. No quiero el esqueleto del ministerio sin el peso de Tu Gloria. Que mi corazón nunca tenga que ser etiquetado como Icabod."
      }
    ]
  }
}

# 5. SERMONES (Viernes 26 Jun) - SAMUEL: EL OÍDO QUE RESTAURÓ LA PALABRA
fri_study = {
  "id": "sermones-samuel-oido",
  "activo": False,
  "fecha_programada": "2026-06-26",
  "tipo": "sermones",
  "titulo": "Samuel: El Oído que Restauró la Palabra",
  "subtitulo": "Sermones Filtrados: Cómo el Cielo reescribió la historia de una nación usando a un niño dispuesto a escuchar lo que los ancianos ignoraron",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Junio 2026",
  "tiempo_lectura": "23 min",
  "imagen_portada": "../img/estudios/samuel-noche.webp",
  "tags": ["Samuel", "Profeta", "Sermones", "Llamado", "Obediencia"],
  "versiculo_clave": {
    "texto": "Y creció Samuel, y Jehová estaba con él, y no dejó caer a tierra ninguna de sus palabras.",
    "cita": "1 Samuel 3:19"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Sermón Biográfico / Análisis Profético",
      "titulo": "El Contraste en el Templo",
      "texto": "1 Samuel 3 nos presenta uno de los contrastes más dramáticos de la Biblia. Por un lado, está Elí, el Sumo Sacerdote y Juez supremo: anciano, ciego, con sobrepeso (símbolo de su complacencia), que descansa en su aposento privado, sordo a la decadencia de sus hijos. Por otro lado, está Samuel: un niño 'ministrando a Jehová', durmiendo cerca del Arca, vestido con un efod de lino, portando una pureza que avergonzaba al sistema establecido. En esta atmósfera de ruina institucional, donde 'no había visión con frecuencia', Dios toma una decisión radical: pasar por encima de la máxima autoridad religiosa de la nación para entregarle los secretos de estado a un niño. La transición del período de los Jueces a la Monarquía no comenzó con una guerra, comenzó con una palabra susurrada en la oscuridad."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "Naphál (נָפַל)",
      "idioma": "Hebreo",
      "raiz": "Caer / Fracasar / Morir",
      "significado": "Caer al suelo (literalmente), o fallar, ser invalidado (metafóricamente).",
      "fonetica_guia": "Na-fál",
      "revelacion": "El texto dice que Dios 'no dejó caer (naphál) a tierra ninguna de sus palabras'. En la cultura agraria, si una semilla cae en tierra dura o se cae de la bolsa del sembrador, se pierde y no da fruto. La promesa sobre Samuel no es que él fuera un gran orador, sino que su alineación con Dios era tan perfecta, que cada palabra que Samuel hablaba era una semilla certificada por el Cielo; estaba garantizado que germinaría. Su boca se convirtió en la extensión oficial del trono de Dios."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "La Búsqueda Divina de Corazones Responsivos",
      "texto": "Dios se revela como Alguien que está escaneando activamente la tierra en busca de receptividad. El llamado a Samuel ('¡Samuel, Samuel!') no fue un error del GPS celestial; Dios sabía que en la habitación de Elí solo había estática religiosa, pero junto al Arca había un corazón dispuesto a calibrarse. Esto manifiesta el atributo de Accesibilidad de Dios: Él habla a quien está dispuesto a oír para obedecer, sin importar su edad, credenciales o título teológico."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "El Profeta Fiel que Inaugura el Reino",
      "texto": "Samuel es la figura de transición por excelencia: él cierra la era de los Jueces y unge a los reyes (Saúl y David), prefigurando la venida del Reino. Jesucristo es el antitipo perfecto: Él es el 'Profeta Fiel' definitivo (Deut. 18) que no dejó caer ninguna palabra del Padre. Cristo vino en medio del silencio profético de 400 años y de un sacerdocio farisaico corrompido, al igual que Samuel. Y fue Cristo (Jesucristo-Pneuma) quien inauguró y nos ungió como reyes y sacerdotes para un reino eterno."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "La Construcción de la Autoridad Profética",
      "descripcion": "El ministerio inquebrantable de Samuel no se construyó en un día, siguió un proceso severo:",
      "pasos": [
        {
          "concepto": "Posición de Proximidad",
          "explicacion": "Dormía cerca del Arca. La revelación exige que nos posicionemos en la atmósfera de Su presencia."
        },
        {
          "concepto": "Disposición Acústica (Shamá)",
          "explicacion": "'Habla, porque tu siervo oye'. La declaración de rendición absoluta."
        },
        {
          "concepto": "Prueba de la Verdad Dolorosa",
          "explicacion": "Tuvo que decirle el duro juicio de Dios a Elí (su mentor). El profeta no elige el mensaje, es esclavo del mensaje."
        },
        {
          "concepto": "Respaldo en la Ejecución",
          "explicacion": "Al pasar la prueba de lealtad, Dios sella sus labios: 'ninguna de sus palabras cayó a tierra'."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "El Peso de la Palabra Respaldada",
      "referencias": [
        {
          "cita": "Jeremías 1:9",
          "versiculo": "He aquí he puesto mis palabras en tu boca.",
          "revelacion": "La transferencia de autoridad divina al vaso humano humillado."
        },
        {
          "cita": "Hechos 3:37-38",
          "versiculo": "El Altísimo no habita en templos hechos de mano... (ver también historia de Silo)",
          "revelacion": "Corrobora que la autoridad reposa en la obediencia del corazón (Samuel) y no en la arquitectura (Elí)."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: Eres Apto para Escuchar",
      "items": [
        {
          "punto": "No necesitas un título para oír a Dios.",
          "ejemplo": "Creer que solo el pastor de tu iglesia recibe revelación y tú solo dependes de lo que él te diga los domingos.",
          "escenario_actual": "Comienza hoy a leer la Biblia con la expectativa real de que el Espíritu Santo iluminará tu entendimiento en tu cuarto, tal como lo hizo con el niño Samuel."
        },
        {
          "punto": "Ubícate cerca de la Presencia.",
          "ejemplo": "Esperar grandes revelaciones de Dios mientras alimentas tu mente todo el día con entretenimiento tóxico.",
          "escenario_actual": "Apaga las distracciones y dedica un espacio físico en tu casa ('cerca del arca') solo para tu devocional diario."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: La Responsabilidad de la Revelación",
      "items": [
        {
          "punto": "La verdad no siempre es cómoda.",
          "ejemplo": "Suavizar la Palabra de Dios para no ofender a familiares, amigos o feligreses que viven en pecado, como Elí.",
          "escenario_actual": "Si Dios te pone una carga por alguien, comunícala con amor, pero con absoluta verdad. Tu lealtad es al Mensajero Supremo, no a las emociones del receptor."
        },
        {
          "punto": "Cuida que tus palabras 'no caigan'.",
          "ejemplo": "Hablar a la ligera, prometer y no cumplir, o dar 'consejos espirituales' que en realidad son tus propias opiniones.",
          "escenario_actual": "Aplica un filtro estricto a tu boca. Si vas a decir 'Dios me dijo', asegúrate de que haya pasado el fuego del altar. Si eres fiel en lo que hablas, Dios respaldará el peso de tus decretos."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "El Síndrome del Profeta Complaciente",
      "texto": "En la iglesia contemporánea abunda el 'ministerio profético' que solo declara prosperidad, años de júbilo y ascensos económicos, ignorando deliberadamente el arrepentimiento y la cruz. Samuel no inauguró su ministerio declarando 'cosas bonitas' a la casa de Elí; su primera palabra fue un juicio devastador. El verdadero ministerio profético no está para masajear el ego de la audiencia, está para alinear a la Iglesia con los estándares inquebrantables del Rey."
    }
  ],
  "desafio_practico": "Hoy, haz un pacto de integridad verbal: Promete a Dios que a partir de hoy, tus 'sí' serán sí, tus 'no' serán no, y que no usarás Su Nombre en vano para justificar tus decisiones emocionales.",
  "conexiones": {
    "huellas": [
      {
        "id": "samuel-vidente",
        "nombre": "Samuel",
        "razon": "El protagonista de la restauración de la voz.",
        "paralelismo": "El puente entre los jueces y los reyes."
      }
    ],
    "cronos": [
      {
        "id": "silo-santuario",
        "nombre": "Silo",
        "razon": "El lugar de la transición.",
        "simbolismo": "Donde la religión vieja duerme, el espíritu fresco despierta."
      }
    ],
    "etymos": [
      {
        "id": "shama-heb",
        "nombre": "Shamá (Oír)",
        "razon": "La palabra que activó el ministerio de Samuel.",
        "familia": "El oído que obedece detona el respaldo del Cielo."
      }
    ],
    "aposento": [
      {
        "id_oracion": "respaldo-palabra",
        "tema": "Peso de Autoridad",
        "declaracion": "Padre, purifica mis labios. Que mi lealtad a Tu verdad sea tan radical que Tú decidas no dejar caer ninguna de mis palabras. Pon Tu fuego en mi boca, en el nombre de Yeshua."
      }
    ]
  }
}

# --- CÓDIGO DE INYECCIÓN ---

def read_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

etymos_path = os.path.join(DIR_ESTUDIOS, 'etimologia.json')
historia_path = os.path.join(DIR_ESTUDIOS, 'historia.json')
sermones_path = os.path.join(DIR_ESTUDIOS, 'sermones.json')

# Cargar
etymos_data = read_json(etymos_path)
historia_data = read_json(historia_path)
sermones_data = read_json(sermones_path)

# Inyectar
etymos_data = [estudio for estudio in etymos_data if estudio['id'] != wed_study['id']]
etymos_data.insert(0, wed_study)

historia_data = [estudio for estudio in historia_data if estudio['id'] != thu_study['id']]
historia_data.insert(0, thu_study)

sermones_data = [estudio for estudio in sermones_data if estudio['id'] != fri_study['id']]
sermones_data.insert(0, fri_study)

# Guardar
write_json(etymos_path, etymos_data)
write_json(historia_path, historia_data)
write_json(sermones_path, sermones_data)

print("✅ Estudios inyectados con éxito en los JSONs (Mie-Vie).")
