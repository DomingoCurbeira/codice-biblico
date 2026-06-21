import json
import os

DIR_ESTUDIOS = "proyectos/biblia/codice/data/estudios"

# 1. HUELLAS (Lunes 22 Jun) - ANA: EL GRITO DE LA ESTERILIDAD
mon_study = {
  "id": "huellas-ana-esterilidad",
  "activo": False,
  "fecha_programada": "2026-06-22",
  "tipo": "huellas",
  "titulo": "Ana: El Grito de la Esterilidad",
  "subtitulo": "La Transición del Dolor al Propósito: Cuando Dios cierra una matriz para abrir el firmamento profético",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Junio 2026",
  "tiempo_lectura": "20 min",
  "imagen_portada": "../img/estudios/ana-altar.webp",
  "tags": ["Ana", "Samuel", "Oración", "Esterilidad", "Propósito"],
  "versiculo_clave": {
    "texto": "Y ella dijo: ¡Oh, señor mío! Vive tu alma, señor mío, yo soy aquella mujer que estuvo aquí junto a ti orando a Jehová. Por este niño oraba, y Jehová me dio lo que le pedí.",
    "cita": "1 Samuel 1:26-27"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Narrativa Histórica / Teología del Padecimiento",
      "titulo": "El Silencio en Silo y el Bullicio en Casa",
      "texto": "Israel atravesaba una sequía espiritual aguda; 'la palabra de Jehová escaseaba en aquellos días' (1 Sam 3:1). Silo, el centro de adoración, estaba corrompido por el sacerdocio ineficaz de Elí y la perversión de sus hijos. En el ámbito doméstico, Ana sufría una doble humillación: la incapacidad cultural y biológica de concebir en una sociedad patriarcal, y el acoso constante de Penina (la otra esposa). Ana representa a un remanente en Israel: rodeada de ruido, burla y religión muerta, pero con una matriz espiritual desesperada por concebir la voz de Dios."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "Channah (חַנָּה)",
      "idioma": "Hebreo",
      "raiz": "Chanan (Inclinarse en favor / Tener misericordia)",
      "significado": "Gracia, favor, compasión.",
      "fonetica_guia": "Ja-náh",
      "revelacion": "Es paradójico que la mujer que experimentaba la mayor 'desgracia' social llevara por nombre 'Gracia'. Esto revela un principio del Reino: el nombre (identidad) que Dios te da a menudo contradice tu situación temporal. La esterilidad de Ana no era un castigo, era un bloqueo estratégico (1 Samuel 1:5 dice que 'Jehová le había cerrado la matriz'). Dios estaba esperando que su oración pasara del 'dame un hijo para mí' al 'dame un hijo para Ti'."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "Dios de los Bloqueos Estratégicos",
      "texto": "Dios se revela como el Soberano que puede retener una bendición menor para provocar un parto mayor. Si Ana hubiera concebido rápido, Samuel habría sido un hijo más. Al cerrarle la matriz, Dios generó en ella tal nivel de agonía y oración que, cuando finalmente concibió, el niño ya no le pertenecía a ella, sino al altar. Su atributo de Soberanía nos enseña que algunas frustraciones son el útero del avivamiento."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "El Niño Cedido y el Hijo Entregado",
      "texto": "Ana hizo un voto radical: si Dios le daba un hijo, ella se lo devolvería a Jehová por todos los días de su vida. Esto es un claro paralelismo de Dios Padre. Así como Ana entregó a su hijo unigénito de la promesa (Samuel) para que ministrara en el templo y restaurara la voz profética de Israel, el Padre entregó a Su Hijo Unigénito (Jesucristo-Pneuma) para ser el Profeta Perfecto y el Sacrificio definitivo que restauraría nuestra comunión con el Cielo."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "La Anatomía de una Oración que Cambia la Historia",
      "descripcion": "El proceso de Ana en el altar de Silo nos muestra cómo orar para dar a luz los diseños de Dios:",
      "pasos": [
        {
          "concepto": "Amargura Derramada",
          "explicacion": "Lloró abundantemente (v.10). No escondió su dolor con religión, lo expuso ante Dios."
        },
        {
          "concepto": "El Voto de Rendición",
          "explicacion": "Pasó de pedir un consuelo a ofrecer una solución a la necesidad de Dios (un sacerdote puro)."
        },
        {
          "concepto": "Incomprensión Religiosa",
          "explicacion": "Elí la confundió con una ebria (v.14). La verdadera intercesión a menudo parece locura a la religión institucional."
        },
        {
          "concepto": "Recepción en Fe",
          "explicacion": "Se fue y 'no estuvo más triste' (v.18) antes de estar embarazada. La fe se apropia del milagro en el espíritu antes de verlo en la carne."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "El Protocolo de la Matriz Abierta",
      "referencias": [
        {
          "cita": "Génesis 30:22",
          "versiculo": "Y se acordó Dios de Raquel, y la oyó Dios, y le abrió la matriz.",
          "revelacion": "El mismo patrón se repite en las matriarcas. El 'acordarse' de Dios no es memoria, es acción legal sobre un asunto retenido."
        },
        {
          "cita": "Salmo 113:9",
          "versiculo": "El hace habitar en familia a la estéril, que se goza en ser madre de hijos. Aleluya.",
          "revelacion": "Una promesa directa que conecta la esterilidad natural o espiritual con el gozo final de la multiplicación por diseño."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: El Dolor no es tu Destino",
      "items": [
        {
          "punto": "No escuches a 'Penina'.",
          "ejemplo": "Dejar que las personas que sí tienen lo que tú deseas (éxito, familia, ministerio) te hagan sentir inferior o rechazado por Dios.",
          "escenario_actual": "Identifica esa voz constante (puede ser una persona, o las redes sociales) que te recuerda lo que 'no tienes', y decide hoy apagar ese ruido para escuchar a Dios."
        },
        {
          "punto": "Lleva tu llanto al altar, no al mundo.",
          "ejemplo": "Quejarte de tu situación con amigos, familiares o en internet, en lugar de desahogarte honestamente delante de Dios.",
          "escenario_actual": "Hoy, siéntate a solas y dile a Dios exactamente cómo te sientes, sin filtros religiosos, al igual que Ana derramó su alma."
        },
        {
          "punto": "La fe cambia tu rostro antes que tu circunstancia.",
          "ejemplo": "Esperar a tener el milagro en la mano para empezar a adorar o cambiar de actitud.",
          "escenario_actual": "Declara hoy que Dios ha escuchado tu oración y decide cambiar tu actitud (no estar más triste) basado en Su promesa, aunque aún no veas la evidencia."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: Orando por los Intereses del Reino",
      "items": [
        {
          "punto": "Alinea tu petición con la necesidad de Dios.",
          "ejemplo": "Orar solo por consuelo personal ('dame un hijo para no ser burla') en lugar de orar por el propósito del Reino ('dame un hijo para dártelo a Ti').",
          "escenario_actual": "Revalúa tu mayor petición actual. ¿Ese negocio, pareja o ministerio es para tu comodidad, o estás dispuesto a consagrarlo totalmente a Dios si Él te lo entrega?"
        },
        {
          "punto": "Soporta la incomprensión de los 'Elí'.",
          "ejemplo": "Desanimarse cuando líderes o personas religiosas no entienden tu proceso, tu pasión o tu forma de adorar.",
          "escenario_actual": "Mantén tu postura de humildad y respeto hacia la autoridad, pero no permitas que la falta de visión de otros apague el fuego de intercesión que Dios ha puesto en ti."
        },
        {
          "punto": "Reconoce los bloqueos divinos.",
          "ejemplo": "Enojarse con el diablo por una puerta cerrada que, en realidad, Dios mismo cerró para prepararte para algo mayor.",
          "escenario_actual": "Pide revelación sobre ese área 'estéril' en tu vida ministerial o profesional. Quizás Dios está reteniendo el fruto hasta que tu carácter pueda sostener la gloria que viene."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "El Error del 'Decreto Exigente'",
      "texto": "Hay una tendencia a enseñar que podemos 'exigirle' a Dios que nos quite la esterilidad o el problema basándonos en confesiones positivas vacías. Ana no exigió; ella se rindió (Channah = gracia). Ella reconoció que la matriz le pertenecía a Jehová. La verdadera fe no da órdenes a Dios, se somete a Sus términos. El milagro se libera en la rendición, no en la exigencia altanera."
    }
  ],
  "desafio_practico": "Identifica algo que le has estado pidiendo a Dios por mucho tiempo. Hoy, haz el 'Voto de Ana': Dile a Dios que, si te lo concede, estás dispuesto a que ese milagro le sirva completamente a Él y no a tu ego.",
  "conexiones": {
    "huellas": [
      {
        "id": "samuel-vidente",
        "nombre": "Samuel",
        "razon": "El fruto de la matriz rendida.",
        "paralelismo": "El hijo que escuchó la voz que su madre dio a luz en el espíritu."
      },
      {
        "id": "jesucristo-pneuma",
        "nombre": "Jesucristo",
        "razon": "El Hijo Entregado Supremo.",
        "paralelismo": "El sacrificio perfecto que restaura la comunicación."
      }
    ],
    "cronos": [
      {
        "id": "silo-santuario",
        "nombre": "Silo",
        "razon": "El lugar de la adoración corrompida y la oración pura.",
        "simbolismo": "Donde la religión institucional fracasa, la intercesión personal triunfa."
      }
    ],
    "etymos": [
      {
        "id": "channah-heb",
        "nombre": "Channah (Gracia)",
        "razon": "El nombre que profetizaba su destino por encima de su condición.",
        "familia": "Misericordia, favor, súplica."
      }
    ],
    "aposento": [
      {
        "id_oracion": "voto-rendicion-matriz",
        "tema": "Oración de Rendición",
        "declaracion": "Padre, entrego mi área estéril en Tus manos. No te pido solo una bendición para mi consuelo; te pido que mi frustración dé a luz un propósito que sirva a Tu Reino."
      }
    ]
  }
}

# 2. MITOS (Martes 23 Jun) - EL MITO DE LA PIEDAD POR HERENCIA
tue_study = {
  "id": "mitos-eli-hijos",
  "activo": False,
  "fecha_programada": "2026-06-23",
  "tipo": "mitos",
  "titulo": "El Mito de la Piedad por Herencia",
  "subtitulo": "¿Por qué los hijos del Sumo Sacerdote no conocían a Dios? El peligro de la familiaridad con lo sagrado",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Junio 2026",
  "tiempo_lectura": "19 min",
  "imagen_portada": "../img/estudios/eli-silo.webp",
  "tags": ["Elí", "Samuel", "Sacerdocio", "Religión", "Mitos"],
  "versiculo_clave": {
    "texto": "Los hijos de Elí eran hombres impíos, y no tenían conocimiento de Jehová.",
    "cita": "1 Samuel 2:12"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Análisis Sacerdotal / Juicio Institucional",
      "titulo": "Oficiando en la Oscuridad",
      "texto": "Elí era el Sumo Sacerdote y Juez de Israel, residente en Silo, donde estaba el Arca del Pacto. Sus hijos, Ofni y Finees, oficiaban como sacerdotes por derecho de nacimiento (linaje de Aarón). El texto hebreo los llama literalmente 'hijos de Belial' (hijos de inutilidad/maldad). Ellos manejaban los sacrificios, vestían el efod, y dominaban el protocolo religioso, pero el versículo es tajante: 'No conocían a Jehová'. Utilizaban el altar para extorsionar carne a los adoradores y cometían inmoralidad sexual en la puerta del Tabernáculo. Es la ilustración bíblica más gráfica de que la proximidad física a lo sagrado no garantiza la intimidad espiritual."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "Yadá' (יָדַע)",
      "idioma": "Hebreo",
      "raiz": "Saber / Conocer / Experimentar",
      "significado": "Conocer por intimidad y experiencia, no por intelecto.",
      "fonetica_guia": "Ya-dá",
      "revelacion": "Cuando dice que los hijos de Elí 'no tenían conocimiento (Yadá) de Jehová', no significa que ignoraran la Torá o la teología. ¡Ellos dirigían la iglesia de su tiempo! Significaba que no tenían experiencia íntima con Él. Confundieron la administración de los utensilios de Dios con el conocimiento del Dios de los utensilios. La familiaridad mató su reverencia."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "Dios Incorruptible y de Juicio Ineludible",
      "texto": "Dios revela que Él no es un sistema que se pueda hackear. Nadie tiene 'inmunidad diplomática' en el Reino por causa de sus padres o su título eclesiástico. El atributo de Incorruptibilidad de Dios garantiza que Él prefiere destruir Su propia institución (Silo) antes de tolerar que Su Nombre sea profanado por ministros que usan el altar para el vientre y el ego."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "El Sacerdote Fiel vs Los Sacerdotes Impíos",
      "texto": "Ofni y Finees son el antotipo de Cristo. Ellos tomaban la carne por la fuerza para sí mismos; Cristo (el verdadero Sumo Sacerdote) entregó Su propia carne por los demás. Ellos se servían del pueblo; Cristo lavó los pies de Su pueblo. El fracaso estrepitoso del sacerdocio levítico en Silo prepara el escenario profético para el surgimiento del Sacerdocio según el orden de Melquisedec: un sacerdocio inquebrantable basado en una vida indestructible (Jesucristo-Pneuma)."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "La Escalera de la Corrupción Religiosa",
      "descripcion": "El declive de Silo no ocurrió en un día. Sigue un proceso de descomposición espiritual:",
      "pasos": [
        {
          "concepto": "Tolerancia Pasiva",
          "explicacion": "Elí escuchaba lo que hacían, los reprendió débilmente, pero no los destituyó. La honra a la familia superó la honra a Dios (1 Sam 2:29)."
        },
        {
          "concepto": "Pérdida de la Vista",
          "explicacion": "Físicamente, Elí quedó ciego; espiritualmente, la ceguera institucional hizo que no reconocieran la voz de Dios cuando llamó a Samuel."
        },
        {
          "concepto": "Uso Utilitario de la Presencia",
          "explicacion": "Llevar el Arca a la batalla como un amuleto mágico para ganar la guerra, sin arrepentimiento previo."
        },
        {
          "concepto": "Pérdida de la Gloria",
          "explicacion": "El nacimiento de Icabod: 'Traspasada es la gloria'. La religión se queda con la liturgia, pero sin la Presencia."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "El Peligro de la Religión sin Relación",
      "referencias": [
        {
          "cita": "Mateo 7:22-23",
          "versiculo": "Muchos me dirán en aquel día: Señor, Señor... Y entonces les declararé: Nunca os conocí (Yadá); apartaos de mí, hacedores de maldad.",
          "revelacion": "Jesús aplica el mismo principio de Silo al Nuevo Testamento: Operar los carismas o dirigir la liturgia no sustituye la intimidad."
        },
        {
          "cita": "Ezequiel 44:23",
          "versiculo": "Y enseñarán a mi pueblo a hacer diferencia entre lo santo y lo profano...",
          "revelacion": "La función sacerdotal que Elí y sus hijos perdieron: mantener la línea clara entre lo sagrado (Dios) y lo utilitario."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: La Salvación no se hereda",
      "items": [
        {
          "punto": "Dios no tiene nietos.",
          "ejemplo": "Pensar que porque tus padres son pastores, ancianos o cristianos devotos, tú tienes un 'pase libre' al cielo o no necesitas buscar a Dios.",
          "escenario_actual": "Comprender que la fe de tu familia es un trampolín, pero tú debes construir tu propia relación (Yadá) con Jesús a puerta cerrada."
        },
        {
          "punto": "Respeta las cosas de Dios.",
          "ejemplo": "Acostumbrarse tanto a la iglesia que se empieza a tratar el servicio, la adoración o el diezmo como una rutina sin sentido o con ligereza.",
          "escenario_actual": "Entrar a la reunión o conectarte online con expectativa y reverencia, sabiendo que vienes a encontrarte con el Rey, no a cumplir un evento social."
        },
        {
          "punto": "Acepta la corrección.",
          "ejemplo": "Ignorar los consejos espirituales de líderes o padres, como hicieron Ofni y Finees con Elí, endureciendo el corazón.",
          "escenario_actual": "Cuando alguien te señala un error a la luz de la Biblia, recibe la advertencia con humildad en lugar de ponerte a la defensiva."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: Protegiendo el Altar",
      "items": [
        {
          "punto": "No uses el ministerio para tu ego o beneficio.",
          "ejemplo": "Servir en el altar (predicar, cantar, liderar) buscando aplausos, influencia, dinero o beneficios secundarios.",
          "escenario_actual": "Examina tu corazón: Si nadie te agradeciera o no tuvieras un título, ¿seguirías sirviendo con la misma excelencia y pasión para Dios?"
        },
        {
          "punto": "Honra a Dios más que a los hombres.",
          "ejemplo": "Elí honró más a sus hijos que a Dios al no detener su pecado (1 Sam 2:29). La tolerancia al pecado por evitar conflictos familiares o eclesiásticos es idolatría.",
          "escenario_actual": "Tener la valentía de poner límites claros o ejercer disciplina bíblica en tu hogar o liderazgo, aunque duela, para proteger la santidad del ambiente."
        },
        {
          "punto": "Combate la ceguera institucional.",
          "ejemplo": "Estar tan ocupado en la logística de la iglesia (las lámparas, las puertas) que no percibes cuando Dios empieza a hablar (como le pasó a Elí con Samuel).",
          "escenario_actual": "Asegúrate de que tu agenda administrativa no asfixie tu tiempo de quietud. Si no estás escuchando la voz fresca de Dios, estás operando en modo 'Silo'."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "El Riesgo de la Gracia Barata",
      "texto": "Se ha enseñado mucho que Dios es tan amoroso que 'todo pasa' y 'todo se tolera' bajo el concepto de gracia. La historia de Silo demuestra que la gracia no anula la reverencia. Tratar la sangre de Cristo o el servicio a Dios como algo común o profano nos expone al juicio disciplinario de un Dios que, por amor, no permitirá que Su iglesia se convierta en una cueva de ladrones."
    }
  ],
  "desafio_practico": "Hoy, identifica una rutina espiritual (leer, orar, ir a la iglesia) que hayas empezado a hacer 'en piloto automático'. Pausa, pídele perdón a Dios por la familiaridad irrespetuosa, y renueva tu asombro ante Su presencia.",
  "conexiones": {
    "huellas": [
      {
        "id": "jesucristo-pneuma",
        "nombre": "Jesucristo",
        "razon": "El Sacerdote Fiel prometido que reemplazaría la casa de Elí.",
        "paralelismo": "El que honró al Padre hasta la muerte, frente a los que se honraron a sí mismos."
      }
    ],
    "cronos": [
      {
        "id": "silo-santuario",
        "nombre": "Silo",
        "razon": "La sede del juicio por la corrupción del altar.",
        "simbolismo": "Lugar de advertencia: Dios no habita en edificios, habita en corazones contritos."
      }
    ],
    "etymos": [
      {
        "id": "yada-heb",
        "nombre": "Yadá (Conocer)",
        "razon": "La diferencia entre saber de Dios y experimentar a Dios.",
        "familia": "Intimidad, relación, revelación."
      }
    ],
    "aposento": [
      {
        "id_oracion": "limpieza-altar-corazon",
        "tema": "Protegiendo la Reverencia",
        "declaracion": "Padre, perdóname por tratar Tus cosas como algo común. Renueva mi asombro. Límpiame de cualquier motivación impura en mi servicio y enséñame a conocerte íntimamente (Yadá)."
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

huellas_path = os.path.join(DIR_ESTUDIOS, 'huellas.json')
mitos_path = os.path.join(DIR_ESTUDIOS, 'mitos.json')

# Cargar
huellas_data = read_json(huellas_path)
mitos_data = read_json(mitos_path)

# Inyectar (Asegurando que no existan previamente para evitar duplicados)
huellas_data = [estudio for estudio in huellas_data if estudio['id'] != mon_study['id']]
huellas_data.insert(0, mon_study) # Insertamos al principio

mitos_data = [estudio for estudio in mitos_data if estudio['id'] != tue_study['id']]
mitos_data.insert(0, tue_study)

# Guardar
write_json(huellas_path, huellas_data)
write_json(mitos_path, mitos_data)

print("✅ Estudios inyectados con éxito en los JSONs.")
