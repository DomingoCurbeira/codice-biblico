import json
import os

MAESTRO_PATH = "proyectos/biblia/codice/data/etymos/etymos_maestro.json"
LEXICO_PATH = "proyectos/biblia/codice/data/etymos/lexico.json"

new_words = [
    {
        "id": "malkhut-he",
        "maestro": {
            "id": "malkhut-he",
            "termino": "Malkhút (מַלְכוּת)",
            "original": "מַלְכוּת",
            "transliteracion": "Malkhûwth",
            "idioma": "Hebreo",
            "esencia_antigua": "Reinado / Autoridad Soberana / Imperio.",
            "sentido_verdad": "No se refiere primariamente a un territorio con fronteras (reino físico), sino a la 'acción de reinar'. El Malkhút de Dios existe dondequiera que se obedece Su voluntad, independientemente de las condiciones externas.",
            "eco_escritura": {
                "texto": "Y dijo Jehová a Samuel... no te han desechado a ti, sino a mí me han desechado, para que no reine (Malak) sobre ellos.",
                "cita": "1 Samuel 8:7"
            },
            "revelacion_cristo": "Jesucristo no vino a establecer un imperio político temporal como esperaban los zelotes. Él trajo el Malkhút de los cielos a la tierra a través de Su sumisión en la cruz, demostrando que el verdadero poder se perfecciona en la entrega, no en la tiranía.",
            "reflejo_tierra": "Si exiges ser el 'rey' de tu propia vida y tomar todas tus decisiones según tu instinto, has rechazado el Malkhút divino. Rinde hoy la corona de tu ego.",
            "activacion": "Padre, perdóname por intentar reinar sobre mi vida bajo mis propios términos. Renuncio al control. Que Tu Malkhút (reino) se establezca hoy en mi mente y corazón."
        },
        "lexico": {
            "id": "malkhut-he",
            "palabra_espanol": "Reino / Realeza (Malkhút)",
            "idioma": "Hebreo",
            "original": "מַלְכוּת",
            "transliteracion": "Malkhûwth",
            "strong": "H4438",
            "definicion": "El acto de gobernar; realeza, poder soberano, el dominio real."
        }
    },
    {
        "id": "olah-heb",
        "maestro": {
            "id": "olah-heb",
            "termino": "Olah (עוֹלָה)",
            "original": "עוֹלָה",
            "transliteracion": "‘Ôlâh",
            "idioma": "Hebreo",
            "esencia_antigua": "Aquello que asciende / Ofrenda quemada por completo.",
            "sentido_verdad": "A diferencia de otros sacrificios donde el adorador comía parte de la carne, el Olah se consumía totalmente en el fuego. Simboliza la consagración y rendición absoluta a Dios, sin reservarse nada para uno mismo.",
            "eco_escritura": {
                "texto": "Saúl respondió: me esforcé, pues, y ofrecí holocausto (Olah).",
                "cita": "1 Samuel 13:12"
            },
            "revelacion_cristo": "Jesús es el Olah perfecto. Él no dio 'parte' de Su tiempo o esfuerzo; se entregó por completo en el altar de la cruz, ascendiendo como olor fragante para satisfacer la justicia del Padre.",
            "reflejo_tierra": "Saúl intentó ofrecer un 'Olah' sin tener un corazón rendido. No intentes apaciguar a Dios con dinero o servicio en la iglesia si estás guardando pecado y rebelión en secreto.",
            "activacion": "Señor, no quiero darte ofrendas a medias. Hoy pongo mi vida entera como un Olah en Tu altar. Que mi obediencia suba ante Ti como olor fragante."
        },
        "lexico": {
            "id": "olah-heb",
            "palabra_espanol": "Holocausto / Ofrenda Ascendente (Olah)",
            "idioma": "Hebreo",
            "original": "עוֹלָה",
            "transliteracion": "‘Ôlâh",
            "strong": "H5930",
            "definicion": "Ofrenda quemada que asciende en humo. Representa dedicación total."
        }
    },
    {
        "id": "qesem-heb",
        "maestro": {
            "id": "qesem-heb",
            "termino": "Qésem (קֶסֶם)",
            "original": "קֶסֶם",
            "transliteracion": "Qesem",
            "idioma": "Hebreo",
            "esencia_antigua": "Adivinación / Sortilegio / El acto de forzar respuestas espirituales.",
            "sentido_verdad": "El Qésem es el intento de manipular lo divino para obtener información o poder fuera del canal de fe y sumisión a Jehová. Dios ve la rebelión obstinada al mismo nivel que la brujería porque ambas buscan el control saltándose Su autoridad.",
            "eco_escritura": {
                "texto": "Porque como pecado de adivinación (Qésem) es la rebelión...",
                "cita": "1 Samuel 15:23"
            },
            "revelacion_cristo": "Cristo rechazó el Qésem cuando el diablo le ofreció el mundo a cambio de postrarse. Jesús eligió el sufrimiento en el orden de Dios, en lugar de la gloria en el orden de la manipulación satánica.",
            "reflejo_tierra": "Tratar de controlar a tu cónyuge, manipular a la iglesia o desobedecer la Palabra para forzar un resultado a tu favor es, espiritualmente, practicar hechicería emocional.",
            "activacion": "Líbrame, Señor, de querer forzar Tus tiempos o alterar Tus principios. Renuncio a la rebelión y me someto a la autoridad de Tu Palabra."
        },
        "lexico": {
            "id": "qesem-heb",
            "palabra_espanol": "Adivinación / Brujería (Qésem)",
            "idioma": "Hebreo",
            "original": "קֶסֶם",
            "transliteracion": "Qesem",
            "strong": "H7081",
            "definicion": "Adivinación, oráculo (falso), sortilegio. Práctica estrictamente prohibida de buscar conocimiento oculto."
        }
    },
    {
        "id": "shamar-heb",
        "maestro": {
            "id": "shamar-heb",
            "termino": "Shamár (שָׁמַר)",
            "original": "שָׁמַר",
            "transliteracion": "Shâmar",
            "idioma": "Hebreo",
            "esencia_antigua": "Guardar / Poner un cerco alrededor / Vigilar celosamente.",
            "sentido_verdad": "No es guardar como quien almacena algo en un cajón, sino guardar como un centinela armado que protege un tesoro. Implica vigilancia activa para que la santidad y la Palabra no sean robadas del corazón.",
            "eco_escritura": {
                "texto": "Si Jehová no guardare (Shamár) la ciudad, En vano vela la guardia.",
                "cita": "Salmo 127:1"
            },
            "revelacion_cristo": "En Getsemaní, Jesús 'guardó' (Shamár) la voluntad del Padre bajo el ataque más feroz del infierno. Él es el Pastor vigilante que no pierde a ninguna de las ovejas que el Padre le ha dado.",
            "reflejo_tierra": "Si no pones un cerco (Shamár) alrededor de tus ojos, tus oídos y tu mente, el mundo entrará a saquear tu paz. La santidad requiere intencionalidad defensiva.",
            "activacion": "Espíritu Santo, pon una guardia en mis labios y en mi corazón. Ayúdame a Shamár (guardar) mis convicciones en medio de una cultura que exige compromiso con el pecado."
        },
        "lexico": {
            "id": "shamar-heb",
            "palabra_espanol": "Guardar / Vigilar (Shamár)",
            "idioma": "Hebreo",
            "original": "שָׁמַר",
            "transliteracion": "Shâmar",
            "strong": "H8104",
            "definicion": "Poner un seto alrededor (como con espinas), cuidar, proteger, atender celosamente."
        }
    }
]

def read_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

maestro_data = read_json(MAESTRO_PATH)
lexico_data = read_json(LEXICO_PATH)

for word in new_words:
    # Maestro
    maestro_data = [w for w in maestro_data if w['id'] != word['maestro']['id']]
    maestro_data.insert(0, word['maestro'])
    
    # Lexico
    lexico_data = [w for w in lexico_data if w['id'] != word['lexico']['id']]
    lexico_data.insert(0, word['lexico'])

write_json(MAESTRO_PATH, maestro_data)
write_json(LEXICO_PATH, lexico_data)

print("✅ Palabras maestras de la Semana 6 inyectadas en Etymos.")
