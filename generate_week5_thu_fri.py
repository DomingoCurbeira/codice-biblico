import json
import os

DIR_ESTUDIOS = "proyectos/biblia/codice/data/estudios"

# 4. HISTORIA (Jueves 2 Jul) - DAGÓN VS JEHOVÁ: LA CAÍDA DEL ÍDOLO
thu_study = {
  "id": "historia-dagon-ashdod",
  "activo": True,
  "fecha_programada": "2026-07-02",
  "tipo": "historia",
  "titulo": "Dagón vs Jehová: La Caída del Ídolo",
  "subtitulo": "Arqueología del Triunfo Solitario: Cómo la presencia cautiva de Dios desmembró la idolatría sin ayuda humana",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Julio 2026",
  "tiempo_lectura": "19 min",
  "imagen_portada": "../img/estudios/dagon-caido.webp",
  "tags": ["Dagón", "Arca", "Asdod", "Filisteos", "Arqueología"],
  "versiculo_clave": {
    "texto": "Y al día siguiente, los de Asdod se levantaron de mañana, y he aquí Dagón postrado en tierra delante del arca de Jehová...",
    "cita": "1 Samuel 5:3"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Polémica Arqueológica / Crónica Militar",
      "titulo": "El Trofeo en el Templo Filisteo",
      "texto": "Asdod era una de las cinco ciudades principales de la Pentápolis filistea. Dagón era la deidad suprema de esta región; comúnmente asociado con el grano (dagan en hebreo) o como un dios pez (dag en hebreo). Cuando los filisteos capturaron el Arca, no la destruyeron; la llevaron al templo de Dagón como un trofeo de guerra. En la mentalidad del antiguo Cercano Oriente, esto significaba que su dios había vencido al Dios de Israel y ahora Jehová era un dios vasallo sirviendo a los pies de Dagón. Sin embargo, Dios no necesita un ejército israelita para defender Su santidad."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "El Elyón (אֵל עֶלְיוֹן)",
      "idioma": "Hebreo",
      "raiz": "El (Dios) + Alah (Subir / Elevarse)",
      "significado": "El Dios Altísimo, el Dios Supremo sobre todas las deidades.",
      "fonetica_guia": "El El-yón",
      "revelacion": "El título 'El Elyón' establece a Jehová no como un dios local o nacional, sino como la máxima autoridad cósmica. La humillación de Dagón (primero postrado, luego decapitado y sin manos) fue la declaración visual de Dios a los filisteos: 'Yo no soy el botín de su ídolo; su ídolo es polvo ante mis pies'. Dios desmembró la capacidad de Dagón de pensar (cabeza) y de actuar (manos)."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "Dios Autosuficiente y Defensor de Su propia Gloria",
      "texto": "Dios revela que Él no necesita de nuestro esfuerzo para 'protegerlo'. Israel fracasó miserablemente en el campo de batalla, pero la gloria de Dios no disminuyó. Su atributo de Autosuficiencia significa que Él puede ganar la guerra desde el cautiverio. Incluso cuando Su pueblo es infiel y el testimonio de la iglesia está por el suelo (el Arca capturada), Dios sabe cómo avergonzar a los demonios y a los sistemas idólatras por Su propia cuenta."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "Cristo en las Profundidades del Hades",
      "texto": "La llegada del Arca a territorio filisteo y la destrucción de Dagón es un asombroso presagio de la muerte de Cristo. Jesús fue llevado cautivo, clavado en una cruz y puesto en una tumba de piedra. El imperio de las tinieblas pensó que lo había capturado como trofeo. Pero, al igual que el Arca, Jesús entró en el territorio enemigo (la muerte y el Hades) y, sin levantar una espada humana, desmembró el poder de Satanás, quitándole las llaves de la muerte."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "El Desmembramiento del Sistema Caído",
      "descripcion": "El progreso de la destrucción de Dagón frente al Arca nos enseña cómo Dios derriba nuestras fortalezas:",
      "pasos": [
        {
          "concepto": "Sometimiento Visual",
          "explicacion": "Día 1: Dagón cae postrado ante el Arca. Todo sistema orgulloso eventualmente tendrá que inclinarse ante el Señorío de Dios."
        },
        {
          "concepto": "Intento Humano de Restauración",
          "explicacion": "Los sacerdotes filisteos volvieron a levantar al ídolo. Nuestra tendencia a volver a nuestros viejos vicios y justificaciones después de que Dios nos muestra que son inútiles."
        },
        {
          "concepto": "Desmembramiento Total",
          "explicacion": "Día 2: Cabeza y manos cortadas en el umbral. Dios anula la autoridad (cabeza) y el poder (manos) del ídolo, demostrando que es solo madera inerte."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "El Altísimo sobre Todos",
      "referencias": [
        {
          "cita": "Salmos 97:9",
          "versiculo": "Avergonzados sean todos los que sirven a las imágenes de talla, Los que se glorían en los ídolos. Póstrate ante él, todos los dioses.",
          "revelacion": "El salmista establece como regla espiritual lo que ocurrió literalmente en el templo de Asdod."
        },
        {
          "cita": "Colosenses 2:15",
          "versiculo": "y despojando a los principados y a las potestades, los exhibió públicamente, triunfando sobre ellos en la cruz.",
          "revelacion": "El desmembramiento espiritual de las tinieblas realizado por Jesucristo."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: Cero Tolerancia a los Ídolos",
      "items": [
        {
          "punto": "No mezcles la luz con las tinieblas.",
          "ejemplo": "Ir a la iglesia los domingos, pero seguir consultando el horóscopo o participando en rituales de la 'buena suerte' en casa.",
          "escenario_actual": "Comprende que Dios (el Arca) no tolerará compartir espacio con ningún ídolo (Dagón) en el templo de tu corazón. Él derribará aquello en lo que pones tu confianza paralela."
        },
        {
          "punto": "No puedes 'ayudar' a tus ídolos caídos.",
          "ejemplo": "Justificar una relación tóxica o un mal hábito después de que las circunstancias ya te demostraron que te está destruyendo.",
          "escenario_actual": "Si Dios ya tiró al suelo un orgullo o un vicio en tu vida, no trates de 'volverlo a poner en su pedestal' como hicieron los sacerdotes de Asdod."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: Descansar en Su Autosuficiencia",
      "items": [
        {
          "punto": "Dios no necesita tus excusas.",
          "ejemplo": "Angustiarse excesivamente y tratar de 'salvar la reputación' de Dios cuando figuras públicas del cristianismo caen o el nombre de Cristo es burlado en la cultura.",
          "escenario_actual": "Dios es El Elyón. Él es perfectamente capaz de humillar el orgullo intelectual, filosófico o político del mundo contemporáneo por Sí solo. Ora y predica la verdad, pero no te angusties como si Dios fuera frágil."
        },
        {
          "punto": "Permite que Él desmiembre lo que estorba.",
          "ejemplo": "Afanarse por retener el control (manos) o tener la última palabra intelectual (cabeza) en discusiones o liderazgos que ya no son fructíferos.",
          "escenario_actual": "Rinde al Señor tus capacidades de control y de orgullo intelectual. Si se convierten en ídolos, el Kabód de Dios las desbaratará."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "El Error del Pluralismo Espiritual",
      "texto": "Hoy es común la filosofía de que 'todos los caminos llevan a Dios' y que todas las religiones pueden coexistir pacíficamente en el mismo templo. La historia de Asdod demuestra que el Dios de Israel es excluyente. Cuando la Presencia Verdadera entra, exige dominio absoluto y derriba toda cosmovisión que compita con Su supremacía (El Elyón). El pluralismo pacífico con la idolatría es bíblicamente imposible."
    }
  ],
  "desafio_practico": "Identifica hoy tu propio 'Dagón' (algo en lo que confías más que en Dios: tu intelecto, tu cuenta bancaria, una persona). Dile al Señor: 'Entra a esta área de mi vida y derriba todo lo que no se someta a Tu Señorío'.",
  "conexiones": {
    "huellas": [
      {
        "id": "sanson-redimido",
        "nombre": "Sansón",
        "razon": "Quien también enfrentó al dios Dagón.",
        "paralelismo": "El siervo que derribó las columnas de su templo."
      }
    ],
    "cronos": [
      {
        "id": "silo-santuario",
        "nombre": "Silo",
        "razon": "De donde salió el Arca.",
        "simbolismo": "El recordatorio del juicio a Israel."
      }
    ],
    "etymos": [
      {
        "id": "kabod-heb",
        "nombre": "Kabód (Gloria)",
        "razon": "El peso innegable que aplastó a la mentira.",
        "familia": "Gravedad, autoridad."
      }
    ],
    "aposento": [
      {
        "id_oracion": "caida-idolos",
        "tema": "Desmantelando Ídolos",
        "declaracion": "Dios Altísimo (El Elyón), pido que Tu presencia ocupe tanto espacio en mi interior que todo ídolo de orgullo, miedo o avaricia sea desmembrado ante Ti."
      }
    ]
  }
}

# 5. SERMONES (Viernes 3 Jul) - EL REGRESO DEL ARCA: SINCERIDAD VS PROTOCOLO
fri_study = {
  "id": "sermones-regreso-arca",
  "activo": True,
  "fecha_programada": "2026-07-03",
  "tipo": "sermones",
  "titulo": "El Regreso del Arca: Sinceridad vs Protocolo",
  "subtitulo": "Sermones Filtrados: El desastre de Bet-semes y la lección sobre cómo manejar la santidad de Dios",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Julio 2026",
  "tiempo_lectura": "22 min",
  "imagen_portada": "../img/estudios/arca-regreso.webp",
  "tags": ["Arca", "Santidad", "Reverencia", "Bet-semes", "Protocolo"],
  "versiculo_clave": {
    "texto": "Y los de Bet-semes dijeron: ¿Quién podrá estar delante de Jehová el Dios santo? ¿Y a quién irá de nosotros?",
    "cita": "1 Samuel 6:20"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Análisis Sacerdotal / Narrativa de Restauración",
      "titulo": "La Falsa Familiaridad en Bet-semes",
      "texto": "Los filisteos, azotados por tumores y destrucción, devolvieron el Arca del Pacto a Israel en una carreta tirada por vacas. Llegó a Bet-semes, una ciudad de levitas (sacerdotes). Los habitantes se alegraron al principio y ofrecieron sacrificios. Pero luego cometieron un error fatal: movidos por una curiosidad irreverente, abrieron el Arca para mirar dentro. Dios hirió a muchos de ellos (el texto hebreo dice 'cincuenta mil setenta hombres', aunque algunos manuscritos antiguos dicen 'setenta'). Bet-semes es la prueba de que ser el 'pueblo elegido' no te da derecho a profanar lo sagrado."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "Qódesh (קֹדֶשׁ)",
      "idioma": "Hebreo",
      "raiz": "Qadash (Separar / Apartar / Cortar)",
      "significado": "Santidad, separación absoluta, lo que no debe mezclarse con lo común.",
      "fonetica_guia": "Qó-desh",
      "revelacion": "La santidad (Qódesh) no es solo pureza moral; es una cualidad de 'separación' que requiere protocolo y temor reverente. Los de Bet-semes eran levitas, sabían las leyes, pero trataron el Arca con la misma curiosidad con la que abrirían un baúl de tesoros humanos. La sinceridad en su alegría inicial no compensó la falta de protocolo de santidad. Dios es inmensamente accesible por la gracia, pero exige ser tratado como 'Qódesh'."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "Santidad Fuego Consumidor",
      "texto": "Dios revela que Su Santidad no es un atributo inofensivo. Es un fuego que purifica lo que está alineado con Él, pero destruye instantáneamente lo que es profano o irreverente. La presunción (creer 'a mí no me pasará nada porque soy de Bet-semes') es duramente castigada para preservar el temor al Señor en toda la nación."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "Cristo: El Veló que nos Protege del Fuego",
      "texto": "Bajo el Antiguo Pacto, mirar dentro del Arca traía muerte fulminante porque el pecado humano no puede coexistir con la luz del Qódesh. Sin embargo, en Jesucristo, el velo del templo se rasgó de arriba a abajo (Marcos 15:38). La sangre de Cristo es la que nos cubre, permitiéndonos ahora mirar 'a cara descubierta la gloria del Señor' (2 Cor 3:18) sin ser consumidos. Tenemos acceso audaz, no por nuestra irreverencia, sino por Su sacrificio protector."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "Tres Maneras de Tratar la Gloria de Dios",
      "descripcion": "La historia del Arca nos muestra tres posturas del corazón frente a lo sagrado:",
      "pasos": [
        {
          "concepto": "Postura Pagana (Filisteos)",
          "explicacion": "Tratan el Arca como un trofeo o amuleto para manipular su propio éxito. Termina en tumores y caída de sus ídolos."
        },
        {
          "concepto": "Postura Familiar / Irreverente (Bet-semes)",
          "explicacion": "Creen que su linaje o posición eclesiástica les da derecho a tratar los misterios de Dios con frivolidad y curiosidad morbosa. Termina en juicio letal."
        },
        {
          "concepto": "Postura de Temor Reverente (Quiriat-jearim)",
          "explicacion": "Eleazar es santificado específicamente para guardar el Arca con el protocolo y cuidado debido. El Arca reposa allí y trae paz antes del reinado de David."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "El Acercamiento Peligroso",
      "referencias": [
        {
          "cita": "Hebreos 12:28-29",
          "versiculo": "...sirvamos a Dios agradándole con temor y reverencia; porque nuestro Dios es fuego consumidor.",
          "revelacion": "El Nuevo Testamento mantiene la misma advertencia de Bet-semes: la gracia no anula el temor a Su Santidad."
        },
        {
          "cita": "Levítico 10:1-2",
          "versiculo": "Nadab y Abiú... ofrecieron delante de Jehová fuego extraño, que él nunca les mandó. Y salió fuego de delante de Jehová y los quemó...",
          "revelacion": "El juicio sobre la presunción sacerdotal: ignorar las instrucciones de Dios pensando que la 'sinceridad' es suficiente."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: Respeto al Acercarse",
      "items": [
        {
          "punto": "La curiosidad no es comunión.",
          "ejemplo": "Acercarse a la Biblia solo para debatir intelectualmente, o estudiar profecía bíblica como si fuera un libro de misterios o teorías de conspiración.",
          "escenario_actual": "La Palabra de Dios (el Arca) no se abre para satisfacer tu curiosidad humana, se abre para someterte a ella y ser transformado. Léela con actitud de siervo, no de crítico literario."
        },
        {
          "punto": "No juegues con las disciplinas espirituales.",
          "ejemplo": "Tomar la Santa Cena de forma rutinaria y mecánica, sin examinar tu vida, mientras guardas rencor contra un hermano.",
          "escenario_actual": "Recuerda que la gracia nos da acceso a la mesa de Dios, pero el temor reverente nos exige acercarnos con un corazón limpio y arrepentido."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: Equilibrio entre Gracia y Qódesh",
      "items": [
        {
          "punto": "La Sinceridad no justifica la Desobediencia.",
          "ejemplo": "Liderar un ministerio a tu manera, rompiendo los principios bíblicos (de moralidad, orden o sujeción) y justificarlo diciendo 'lo importante es que lo hago de corazón'.",
          "escenario_actual": "Dios no negocia Su santidad a cambio de tus 'buenas intenciones'. Alinea de inmediato cualquier práctica en tu servicio a Dios con las Escrituras, sin excepciones."
        },
        {
          "punto": "Cuidado con el 'Exceso de Familiaridad'.",
          "ejemplo": "Tratar la adoración o el ministerio desde una plataforma con tanta ligereza que se convierte en un show donde hablas del 'Señor' como si fuera un compinche de tu nivel.",
          "escenario_actual": "Tú eres Su hijo y Su amigo, pero Él sigue siendo el Creador del Universo. Si perdiste el asombro y el temblor reverente en tu comunión, pausa tu ministerio y busca el rostro del Padre."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "El Antropocentrismo Disfrazado de Adoración",
      "texto": "La doctrina que afirma que Dios está tan enamorado de nosotros que ignorará nuestras transgresiones al protocolo de Su santidad, es falsa. Bet-semes nos enseña que acercarse a Dios sin el mediador correcto (la sangre) y sin la actitud correcta (reverencia) es letal. No somos el centro del universo; la Santidad (Qódesh) de Jehová es el centro, y nosotros tenemos el inmenso y aterrador privilegio de ser invitados a acercarnos."
    }
  ],
  "desafio_practico": "Identifica si hay algún área en la que estás tratando a Dios con falta de respeto o frivolidad. Toma 5 minutos hoy, póstrate en el suelo (físicamente) en tu cuarto, y renueva tu temor reverente al Dios Altísimo.",
  "conexiones": {
    "huellas": [
      {
        "id": "jesucristo-pneuma",
        "nombre": "Jesucristo",
        "razon": "El Veló Rasgado.",
        "paralelismo": "Gracias a Su sacrificio, la gloria que mató en Bet-semes nos vivifica hoy."
      }
    ],
    "cronos": [
      {
        "id": "silo-santuario",
        "nombre": "Silo",
        "razon": "El origen histórico de la pérdida.",
        "simbolismo": "Donde todo empezó a salir mal por falta de temor reverente."
      }
    ],
    "etymos": [
      {
        "id": "qodesh-heb",
        "nombre": "Qódesh (Santo)",
        "razon": "La condición innegociable de la naturaleza de Dios.",
        "familia": "Separación, pureza absoluta."
      }
    ],
    "aposento": [
      {
        "id_oracion": "limpieza-altar-corazon",
        "tema": "Restaurando la Reverencia",
        "declaracion": "Dios Santo (Qódesh), perdóname por el exceso de familiaridad que engendra presunción. Recuérdame que la gracia no es un permiso para el irrespeto, sino un camino seguro hacia Tu trono de fuego."
      }
    ]
  }
}

def read_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

historia_path = os.path.join(DIR_ESTUDIOS, 'historia.json')
sermones_path = os.path.join(DIR_ESTUDIOS, 'sermones.json')

historia_data = read_json(historia_path)
sermones_data = read_json(sermones_path)

historia_data = [estudio for estudio in historia_data if estudio['id'] != thu_study['id']]
historia_data.insert(0, thu_study)

sermones_data = [estudio for estudio in sermones_data if estudio['id'] != fri_study['id']]
sermones_data.insert(0, fri_study)

write_json(historia_path, historia_data)
write_json(sermones_path, sermones_data)

print("✅ Estudios inyectados con éxito en los JSONs (Jue-Vie Semana 5).")
