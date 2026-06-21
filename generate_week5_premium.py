import json
import os

DIR_ESTUDIOS = "proyectos/biblia/codice/data/estudios"

# 1. HUELLAS (Lunes 29 Jun) - ICHABOD: CUANDO EL PESO SE RETIRA
mon_study = {
  "id": "huellas-ichabod-gloria",
  "activo": True,
  "fecha_programada": "2026-06-29",
  "tipo": "huellas",
  "titulo": "Ichabod: Cuando el Peso se retira",
  "subtitulo": "La Transición del Juicio: La tragedia de confundir la religión institucional con la presencia de Dios",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Junio 2026",
  "tiempo_lectura": "20 min",
  "imagen_portada": "../img/estudios/ichabod-nacimiento.webp",
  "tags": ["Ichabod", "Gloria", "Arca", "Silo", "Juicio"],
  "versiculo_clave": {
    "texto": "Y llamó al niño Icabod, diciendo: ¡Traspasada es la gloria de Israel! por haber sido tomada el arca de Dios...",
    "cita": "1 Samuel 4:21"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Narrativa de Juicio / Elegía Histórica",
      "titulo": "La Derrota en Afec",
      "texto": "Israel acababa de sufrir una derrota aplastante ante los filisteos en Afec. Su reacción no fue el arrepentimiento, sino la superstición: mandaron traer el Arca del Pacto desde Silo al campo de batalla. Pensaron que tener el 'mueble' sagrado los obligaría a ganar. El resultado fue un desastre bíblico: 30,000 israelitas murieron, los dos sacerdotes corruptos (Ofni y Finees) fueron asesinados, y el Arca fue capturada. Al oír la noticia, el Sumo Sacerdote Elí cayó de espaldas y murió. Su nuera, embarazada, entró en labor de parto por el shock. En su último aliento, le dio a su hijo un nombre que sería el epitafio de toda una era religiosa: Ichabod."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "I-cabód (אִי כָבוֹד)",
      "idioma": "Hebreo",
      "raiz": "'Iy' (Sin / Dónde) + 'Kabód' (Gloria / Peso)",
      "significado": "Sin gloria; traspasada es la gloria; ¿dónde está la gloria?",
      "fonetica_guia": "I-ca-bód",
      "revelacion": "El nombre es una declaración teológica aterradora. 'Kabód' significa 'peso' o 'abundancia'. Cuando la esposa de Finees dice 'Ichabod', está declarando que Israel se ha vuelto 'ligero', hueco y vacío. La presencia de Dios no es un concepto abstracto, es una realidad con 'peso' (autoridad, manifestación). Cuando el Kabód se va, lo único que queda es una estructura vacía que cualquier enemigo puede derribar."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "Dios Inconfinable y de Santidad Radical",
      "texto": "Dios revela que Él no puede ser chantajeado por Sus propios símbolos. El Arca era Su asiento, pero Su atributo de Santidad le impidió defenderla si eso significaba avalar el pecado de Israel. Él prefiere que el Arca sea llevada cautiva a territorio enemigo, antes que quedarse en un campamento israelita donde no hay arrepentimiento. Su gloria es libre."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "El Verdadero Kabód Encarnado",
      "texto": "Juan 1:14 declara: 'Y aquel Verbo fue hecho carne... y vimos su gloria (Kabód), gloria como del unigénito del Padre'. Mientras que en el Antiguo Testamento la gloria fue 'traspasada' (se fue del campamento), en el Nuevo Testamento, la Gloria traspasó los cielos para venir al campamento humano. Cristo es el peso eterno de Dios que no puede ser robado ni exiliado por ningún enemigo."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "Síntomas de una Estructura Ichabod",
      "descripcion": "Cómo una institución o una vida personal pierde el peso del Espíritu:",
      "pasos": [
        {
          "concepto": "Pecado Tolerado",
          "explicacion": "Comenzó en Silo con los hijos de Elí robando los sacrificios sin disciplina."
        },
        {
          "concepto": "Sordera Institucional",
          "explicacion": "Dios dejó de hablarle al Sumo Sacerdote y le empezó a hablar a un niño."
        },
        {
          "concepto": "Religión Utilitaria",
          "explicacion": "Tratar de usar los símbolos de Dios (el Arca) para conseguir éxito personal (ganar la guerra)."
        },
        {
          "concepto": "El Abandono Silencioso",
          "explicacion": "La gloria se va, pero la gente sigue gritando y haciendo los rituales como si nada hubiera pasado (1 Sam 4:5)."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "La Advertencia de la Gloria Perdida",
      "referencias": [
        {
          "cita": "Apocalipsis 2:5",
          "versiculo": "Recuerda, por tanto, de dónde has caído, y arrepiéntete... pues si no, vendré pronto a ti, y quitaré tu candelero de su lugar...",
          "revelacion": "Jesús aplica el principio de 'Ichabod' a las iglesias del Nuevo Pacto: puedes tener doctrina correcta (Éfeso), pero si pierdes el primer amor, pierdes la luz."
        },
        {
          "cita": "Ezequiel 10:18",
          "versiculo": "Entonces la gloria de Jehová se elevó de encima del umbral de la casa...",
          "revelacion": "La misma tragedia repetida siglos después en Jerusalén. Dios es consistente en Su santidad."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: Presencia vs Símbolos",
      "items": [
        {
          "punto": "No te escondas detrás de amuletos.",
          "ejemplo": "Llevar una Biblia en el coche o una cruz en el cuello creyendo que eso te protege, mientras vives deliberadamente en pecado.",
          "escenario_actual": "La verdadera protección no es tener objetos cristianos en tu casa, es tener a Cristo gobernando las decisiones de tu casa."
        },
        {
          "punto": "El ruido no garantiza a Dios.",
          "ejemplo": "Creer que porque en un concierto cristiano la gente grita y llora mucho, el Espíritu Santo está aprobando todo lo que sucede allí.",
          "escenario_actual": "Aprende a discernir entre el emocionalismo humano (el grito de Israel en el campamento) y el peso transformador del Espíritu Santo."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: Atrayendo el Peso (Kabód)",
      "items": [
        {
          "punto": "La obediencia atrae la gloria.",
          "ejemplo": "Esperar un avivamiento en tu iglesia solo porque organizaron un buen congreso, sin que haya un llamado genuino al arrepentimiento.",
          "escenario_actual": "Si quieres ver el peso (Kabód) de Dios en tu ministerio o negocio, asegúrate de que los fundamentos (integridad, santidad, trato justo) estén alineados con Su diseño."
        },
        {
          "punto": "Cuidado con la inercia religiosa.",
          "ejemplo": "Seguir predicando los mismos sermones y haciendo los mismos rituales por años sin darte cuenta de que el fuego se apagó.",
          "escenario_actual": "Haz una pausa hoy. Pregúntale al Espíritu Santo si tu servicio a Él se ha vuelto mecánico. Humíllate antes de que tu ministerio sea marcado como 'Ichabod'."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "El Mito de la Presencia Garantizada",
      "texto": "Es un error letal predicar que, pase lo que pase, 'Dios está obligado a bendecirnos' porque somos Su iglesia. La historia de Ichabod nos recuerda que, aunque el Pacto de salvación de Dios es eterno en Cristo, la manifestación de Su presencia, Su poder y Su unción en nuestro peregrinaje diario está directamente condicionada a nuestra reverencia y obediencia."
    }
  ],
  "desafio_practico": "Evalúa tus rutinas espirituales de esta semana. ¿Cuánto de lo que has hecho ha sido para 'usar' a Dios para tus fines, y cuánto ha sido adoración genuina? Rinde hoy tus intenciones.",
  "conexiones": {
    "huellas": [
      {
        "id": "jesucristo-pneuma",
        "nombre": "Jesucristo",
        "razon": "La Gloria Eterna e Intransferible.",
        "paralelismo": "El templo humano perfecto donde habita el peso de Dios."
      }
    ],
    "cronos": [
      {
        "id": "silo-santuario",
        "nombre": "Silo",
        "razon": "El origen de la tragedia.",
        "simbolismo": "El lugar donde la gloria habitó pero no fue reverenciada."
      }
    ],
    "etymos": [
      {
        "id": "kabod-heb",
        "nombre": "Kabód (Gloria)",
        "razon": "La sustancia que Israel perdió.",
        "familia": "El peso y la autoridad divina."
      }
    ],
    "aposento": [
      {
        "id_oracion": "restaurar-gloria",
        "tema": "Hambre por Su Presencia",
        "declaracion": "Padre, perdóname por tratar de manipularte. No quiero vivir de victorias pasadas ni de estructuras vacías. Que mi vida sea un lugar de aterrizaje seguro para el peso (Kabód) de Tu presencia."
      }
    ]
  }
}

# 2. MITOS (Martes 30 Jun) - EL MITO DEL AMULETO SAGRADO
tue_study = {
  "id": "mitos-arca-amuleto",
  "activo": True,
  "fecha_programada": "2026-06-30",
  "tipo": "mitos",
  "titulo": "El Mito del Amuleto Sagrado",
  "subtitulo": "¿Por qué Dios permitió que robaran el Arca? La diferencia entre la magia pagana y la obediencia del pacto",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Junio 2026",
  "tiempo_lectura": "18 min",
  "imagen_portada": "../img/estudios/arca-batalla.webp",
  "tags": ["Arca del Pacto", "Mitos", "Religión", "Magia", "Afec"],
  "versiculo_clave": {
    "texto": "Traigamos a nosotros de Silo el arca del pacto de Jehová, para que viniendo entre nosotros nos salve de la mano de nuestros enemigos.",
    "cita": "1 Samuel 4:3"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Polémica Antiopresiva / Crítica Religiosa",
      "titulo": "La Magia de la Desesperación",
      "texto": "Tras ser derrotados por los filisteos, los líderes de Israel no se preguntaron '¿En qué hemos pecado contra Jehová?'. Su razonamiento fue pagano: 'Si traemos el objeto sagrado (el Arca), Dios se verá forzado a defendernos, porque Él no dejará que destruyan Su trono'. Esto es la definición misma de la magia: intentar manipular a la deidad a través de un rito o un objeto para obtener un beneficio egoísta. Israel redujo al Dios Creador del Universo a la categoría de un genio en una lámpara (o en una caja de madera cubierta de oro)."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "Avodáh (עֲבוֹדָה)",
      "idioma": "Hebreo",
      "raiz": "Avad (Trabajar / Servir / Adorar)",
      "significado": "Servicio, trabajo, adoración, ministerio.",
      "fonetica_guia": "A-vo-dáh",
      "revelacion": "En hebreo, la misma palabra para 'trabajar' la tierra es la palabra para 'adorar' a Dios. La verdadera adoración (Avodáh) es un acto de servicio incondicional y esfuerzo consagrado hacia el Rey. Lo que Israel hizo en Afec no fue Avodáh; fue manipulación. No querían servir a Dios, querían que Dios les sirviera como guardaespaldas de sus propios planes caídos."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "Dios Personal, no Objeto Mecánico",
      "texto": "Al dejar que los filisteos capturaran el Arca, Dios estableció un principio monumental: Él es una Persona con voluntad, no una máquina expendedora de milagros. Su atributo de Personalidad Suprema significa que Él se relaciona mediante el pacto moral y la fe, no mediante la coacción ritual. Si tratas a Dios como un amuleto, Él se quedará en silencio mientras el enemigo te derrota."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "La Cruz no es un Amuleto",
      "texto": "Muchos hoy tratan la cruz de Cristo de la misma manera que Israel trató el Arca. Usan la cruz como joya o decoración esperando 'protección' o 'suerte', sin tener ninguna intención de someterse al Señorío de Jesús. La cruz de Cristo no es un talismán; es el altar donde el Yo debe morir. Cristo exige que tomemos la cruz (obediencia), no que la usemos como amuleto (manipulación)."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "Relación vs. Manipulación",
      "descripcion": "El contraste entre la mentalidad pagana y el diseño del Reino:",
      "pasos": [
        {
          "concepto": "Magia Pagana (Mentalidad del Amuleto)",
          "explicacion": "'Si hago este rito (sacrificio, decreto) Dios tiene que hacer lo que yo quiero'. Yo soy el centro."
        },
        {
          "concepto": "Adoración Bíblica (Mentalidad del Reino)",
          "explicacion": "'Me humillo y obedezco la Palabra (Avodáh). Hágase Tu voluntad, no la mía'. Dios es el centro."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "El Rechazo a la Brujería Espiritual",
      "referencias": [
        {
          "cita": "1 Samuel 15:23",
          "versiculo": "Porque como pecado de adivinación es la rebelión, y como ídolos e idolatría la obstinación.",
          "revelacion": "Samuel, quien creció viendo el desastre de Silo, nos enseña que rebelarse y tratar de obligar a Dios es el equivalente espiritual de la brujería."
        },
        {
          "cita": "Amós 8:21",
          "versiculo": "Aborrecí, abominé vuestras solemnidades, y no me complaceré en vuestras asambleas.",
          "revelacion": "Dios rechaza cualquier ritual (aunque sea bíblico) si no está respaldado por un corazón justo."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: La Oración no es Magia",
      "items": [
        {
          "punto": "No uses el nombre de Jesús como hechizo.",
          "ejemplo": "Creer que con repetir 'En el nombre de Jesús' diez veces al final de una oración, Dios está obligado a darte lo que pides.",
          "escenario_actual": "Orar 'en el nombre de Jesús' significa orar de acuerdo a Su carácter y voluntad. Pídele a Dios que te enseñe a orar lo que Él ya desea hacer."
        },
        {
          "punto": "La Biblia no es de la 'buena suerte'.",
          "ejemplo": "Dejar la Biblia abierta en el Salmo 91 en la sala pensando que eso espanta las malas energías.",
          "escenario_actual": "La Biblia protege tu mente cuando la lees, la crees y la obedeces. Ciérrala, ábrela, léela y vívela."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: Evaluando tu Avodáh",
      "items": [
        {
          "punto": "Cuidado con la adoración utilitaria.",
          "ejemplo": "Diezmar o servir en la iglesia solo 'para que Dios me multiplique las finanzas' o 'me cure'.",
          "escenario_actual": "Adora y sirve a Dios por lo digno que Él es, incluso si Él decide no darte la respuesta que estás buscando en este momento."
        },
        {
          "punto": "No arrastres el 'Arca' a tus propios pleitos.",
          "ejemplo": "Justificar decisiones egoístas o malos negocios diciendo 'es que Dios me respaldó' para obligar a otros a estar de acuerdo contigo.",
          "escenario_actual": "Ten la integridad de asumir la responsabilidad por tus decisiones, en lugar de usar el nombre de Dios como escudo teológico para tus errores."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "El Engaño del Hiper-Declaramientismo",
      "texto": "Hoy en día, se enseña mucho a 'decretar' y 'arrebatar' bendiciones, lo cual es bíblico en su contexto. Pero cuando esto se cruza con la falta de arrepentimiento, se convierte en el pecado de Israel en Afec. Pretender que podemos 'decretar' victoria mientras vivimos en desobediencia o falta de perdón es brujería evangélica. Dios no respaldará el orgullo humano, aunque cite la Biblia para justificarse."
    }
  ],
  "desafio_practico": "Revisa tus motivos. Si Dios te dijera hoy 'no voy a darte lo que me estás pidiendo', ¿seguirías adorándole con la misma intensidad? Renuncia a usar a Dios como amuleto.",
  "conexiones": {
    "huellas": [
      {
        "id": "jesucristo-pneuma",
        "nombre": "Jesucristo",
        "razon": "El Señor, no el siervo.",
        "paralelismo": "A quien nos sometemos, no a quien manipulamos."
      }
    ],
    "cronos": [],
    "etymos": [
      {
        "id": "avodah-he",
        "nombre": "Avodáh (Servicio)",
        "razon": "La verdadera adoración como entrega, no como exigencia.",
        "familia": "Trabajo, sumisión, adoración."
      }
    ],
    "aposento": [
      {
        "id_oracion": "limpieza-altar-corazon",
        "tema": "Protegiendo la Reverencia",
        "declaracion": "Padre, perdóname por las veces que he intentado usarte para mis fines. Hoy decido que Tú eres el Rey y yo el siervo. Hágase Tu voluntad en mí."
      }
    ]
  }
}

# 3. ETYMOS (Miércoles 1 Jul) - KABÓD: EL PESO DE LA GLORIA
wed_study = {
  "id": "etymos-kabod-gloria",
  "activo": True,
  "fecha_programada": "2026-07-01",
  "tipo": "etimologia",
  "titulo": "Kabód: El Peso de la Gloria",
  "subtitulo": "Descifrando el Código de la Majestad: Por qué la presencia de Dios es innegable e inamovible",
  "autor": "Códice Bíblico",
  "fecha_publicacion": "Julio 2026",
  "tiempo_lectura": "17 min",
  "imagen_portada": "../img/estudios/kabod-peso.webp",
  "tags": ["Gloria", "Kabód", "Presencia", "Etimología", "Majestad"],
  "versiculo_clave": {
    "texto": "Y la gloria (Kabód) de Jehová reposó sobre el monte Sinaí...",
    "cita": "Éxodo 24:16"
  },
  "contenido": [
    { "tipo": "seccion_titulo", "texto": "I. El Escenario del Espíritu (Contexto)" },
    {
      "tipo": "contexto_historico",
      "genero_literario": "Análisis Filológico / Teología de la Presencia",
      "texto": "Cuando usamos la palabra 'gloria' en occidente, solemos pensar en fama, un resplandor brillante, o una canción de adoración. Es un concepto muy etéreo y casi abstracto. Sin embargo, para los autores bíblicos, la Gloria no era algo flotante; era algo físico y abrumador. En el desierto, cuando el Tabernáculo fue terminado, el texto dice que Moisés no pudo entrar porque la Gloria 'llenó' el lugar (Ex 40:35). No era solo luz; era una 'gravedad' divina. Cuando el Arca fue llevada al templo de Dagón, ese 'peso' derribó literalmente al ídolo de piedra y trajo devastación física a la ciudad filistea. La gloria es peligrosa."
    },
    {
      "tipo": "lexico_profundo",
      "termino": "Kabód (כָּבוֹד)",
      "idioma": "Hebreo",
      "raiz": "Kavad (Ser pesado / Ser denso / Honrar)",
      "significado": "Peso, gravedad, esplendor, majestad aplastante.",
      "fonetica_guia": "Ka-bód",
      "revelacion": "El Kabód es la manifestación externa del valor interno de Dios. Cuando dices 'te doy la gloria', en hebreo estás diciendo 'reconozco que Tú eres lo más pesado, lo más valioso y lo más denso de mi vida; todo lo demás es ligero y desechable'. Cuando la Gloria desciende en una iglesia, la gente suele caer al suelo, no por un truco psicológico, sino porque el espíritu humano no puede sostenerse erguido ante la 'gravedad' del Kabód."
    },
    { "tipo": "seccion_titulo", "texto": "II. Cuerpo de la Enseñanza (Puntos de Revelación)" },
    {
      "tipo": "revelacion_atributo",
      "atributo": "Dios Tangible y Temible",
      "texto": "El Kabód revela que Dios no es una simple idea filosófica. Su atributo de Majestad indica que Él tiene 'sustancia'. Así como la gravedad de la Tierra mantiene los océanos en su lugar, el Kabód de Dios mantiene el universo funcionando. Cuando ese peso se concentra en un punto (como el Arca, o el día de Pentecostés), su impacto altera la realidad física, biológica y espiritual de quienes están cerca."
    },
    {
      "tipo": "cristocentrico",
      "titulo": "Jesucristo: El Peso que Sostuvo la Ira",
      "texto": "El apóstol Pablo escribe: 'Esta leve tribulación momentánea produce en nosotros un cada vez más excelente y eterno peso de gloria' (2 Cor 4:17). Cristo, al soportar el inmenso peso del pecado y la ira de Dios en la cruz, fue glorificado por el Padre. Él es el portador legítimo del Kabód. Por eso, en Su segunda venida, todo ojo le verá y toda rodilla se doblará ante la abrumadora evidencia de Su gravedad cósmica."
    },
    {
      "tipo": "revelacion_progresiva",
      "titulo": "De lo Ligero a lo Pesado",
      "descripcion": "El Kabód transforma nuestro sistema de valores:",
      "pasos": [
        {
          "concepto": "Lo Ligero (Qalal)",
          "explicacion": "El pecado, la opinión de los hombres, el orgullo, la idolatría. No tienen peso eterno, el viento se los lleva."
        },
        {
          "concepto": "Lo Pesado (Kabód)",
          "explicacion": "La Palabra de Dios, la integridad, el temor del Señor. Lo que ancla el alma en medio de la tormenta."
        }
      ]
    },
    {
      "tipo": "concordancia",
      "titulo": "La Gloria como Sustancia",
      "referencias": [
        {
          "cita": "1 Reyes 8:11",
          "versiculo": "Y los sacerdotes no pudieron permanecer para ministrar por causa de la nube; porque la gloria (Kabód) de Jehová había llenado la casa de Jehová.",
          "revelacion": "El peso de Dios paraliza el esfuerzo y el activismo humano."
        },
        {
          "cita": "Hebreos 1:3",
          "versiculo": "el cual, siendo el resplandor de su gloria, y la imagen misma de su sustancia...",
          "revelacion": "Jesucristo es la manifestación exacta y corpórea del Kabód."
        }
      ]
    },
    { "tipo": "seccion_titulo", "texto": "III. Aplicación Pastoral (Triada de Transformación)" },
    {
      "tipo": "aplicacion_leche",
      "titulo": "Para el Nuevo Creyente: Dar el 'Peso' Correcto",
      "items": [
        {
          "punto": "Honrar es dar 'peso'.",
          "ejemplo": "Darle más importancia ('peso') a lo que dicen tus amigos o a la moda de turno que a lo que dice la Biblia.",
          "escenario_actual": "Cuando tomes una decisión hoy, pregúntate: ¿A qué opinión le estoy dando más 'Kabód' (peso), a mis emociones o al diseño de Dios?"
        },
        {
          "punto": "La alabanza no es entretenimiento.",
          "ejemplo": "Cantar en la iglesia como si estuvieras en un concierto, enfocado en el ritmo en lugar de enfocarte en la majestad de Dios.",
          "escenario_actual": "En tu próximo tiempo de adoración, cierra los ojos y visualiza mentalmente el trono de Dios. Ríndele honor consciente a Su inmensidad."
        }
      ]
    },
    {
      "tipo": "aplicacion_solida",
      "titulo": "Para el Maduro: Soportando la Gravedad",
      "items": [
        {
          "punto": "El sufrimiento forja la capacidad para la Gloria.",
          "ejemplo": "Huir del proceso de quebrantamiento, sin entender que Dios está estirando tu capacidad espiritual para que puedas sostener una unción mayor.",
          "escenario_actual": "Si estás en medio de una presión intensa ('tribulación'), no te quejes. Ora: 'Señor, usa esto para producir en mí el eterno peso de Tu gloria'."
        },
        {
          "punto": "Cuidado con robarte el peso.",
          "ejemplo": "Usar la plataforma o los dones que Dios te dio para llevarte el crédito (gloria) y ser admirado por los hombres.",
          "escenario_actual": "Desvía intencionalmente el aplauso humano. Cuando alguien te felicite por un don ministerial, agradécelo con gracia y dirige de inmediato ese 'Kabód' de regreso a Cristo."
        }
      ]
    },
    {
      "tipo": "alerta_doctrinal",
      "titulo": "La Falsa Gloria Ligera",
      "texto": "Muchos movimientos enfatizan una 'gloria' que solo produce risas descontroladas, oro en los dientes, u oro falso, sin ningún llamado a la transformación moral, el arrepentimiento o la cruz. El verdadero Kabód del Antiguo y Nuevo Testamento siempre produjo terror reverente, humillación y una santidad más profunda en quienes lo experimentaron. Si la 'gloria' te hace arrogante o frívolo, no es el Kabód bíblico."
    }
  ],
  "desafio_practico": "Toma un objeto pesado (como un libro grueso o una piedra). Sostenlo en tus manos unos minutos y dile a Dios: 'Señor, quiero que Tu palabra, Tu presencia y Tus principios tengan este peso absoluto en mis decisiones diarias'.",
  "conexiones": {
    "huellas": [
      {
        "id": "jesucristo-pneuma",
        "nombre": "Jesucristo",
        "razon": "El resplandor de Su gloria.",
        "paralelismo": "El peso eterno encarnado."
      }
    ],
    "cronos": [],
    "etymos": [
      {
        "id": "kabod-heb",
        "nombre": "Kabód (Gloria)",
        "razon": "El eje central de la enseñanza.",
        "familia": "Gravedad, esplendor, autoridad."
      }
    ],
    "aposento": [
      {
        "id_oracion": "restaurar-gloria",
        "tema": "El Hambre del Kabód",
        "declaracion": "Padre, que todo lo que es ligero y mundano en mí sea barrido por el peso de Tu presencia. Hazme un recipiente apto para Tu gloria, enséñame a no robarla y a reverenciarla siempre."
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

huellas_path = os.path.join(DIR_ESTUDIOS, 'huellas.json')
mitos_path = os.path.join(DIR_ESTUDIOS, 'mitos.json')
etymos_path = os.path.join(DIR_ESTUDIOS, 'etimologia.json')

huellas_data = read_json(huellas_path)
mitos_data = read_json(mitos_path)
etymos_data = read_json(etymos_path)

huellas_data = [estudio for estudio in huellas_data if estudio['id'] != mon_study['id']]
huellas_data.insert(0, mon_study)

mitos_data = [estudio for estudio in mitos_data if estudio['id'] != tue_study['id']]
mitos_data.insert(0, tue_study)

etymos_data = [estudio for estudio in etymos_data if estudio['id'] != wed_study['id']]
etymos_data.insert(0, wed_study)

write_json(huellas_path, huellas_data)
write_json(mitos_path, mitos_data)
write_json(etymos_path, etymos_data)

print("✅ Estudios inyectados con éxito en los JSONs (Lun-Mie Semana 5).")
