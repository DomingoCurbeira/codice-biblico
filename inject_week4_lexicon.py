import json
import os

MAESTRO_PATH = "proyectos/biblia/codice/data/etymos/etymos_maestro.json"
LEXICO_PATH = "proyectos/biblia/codice/data/etymos/lexico.json"

new_words = [
    {
        "id": "channah-heb",
        "maestro": {
            "id": "channah-heb",
            "termino": "Channah (חַנָּה)",
            "original": "חַנָּה",
            "transliteracion": "Channâh",
            "idioma": "Hebreo",
            "esencia_antigua": "Inclinarse en favor / Gracia / Súplica.",
            "sentido_verdad": "No es un favor aleatorio; es la respuesta compasiva de un superior que se inclina hacia un inferior que suplica desde la rendición.",
            "eco_escritura": {
                "texto": "Y se llamaba Ana (Channah)... a la cual Jehová había cerrado la matriz.",
                "cita": "1 Samuel 1:2,5"
            },
            "revelacion_cristo": "Cristo es la encarnación del Chanan divino: el Dios Altísimo que se 'inclinó' hasta el pesebre y la cruz para escuchar el llanto de una humanidad estéril, dándonos el linaje de gracia eterna.",
            "reflejo_tierra": "Cuando la vida te cierra una puerta (esterilidad), tu respuesta no debe ser la amargura, sino el 'Channah': la súplica rendida que atrae la compasión del Rey para dar a luz Su propósito.",
            "activacion": "Hoy rindo mis áreas estériles. No exijo, suplico con gracia. Confío en que el Dios que se inclina escuchará mi clamor y abrirá mi matriz espiritual."
        },
        "lexico": {
            "id": "channah-heb",
            "palabra_espanol": "Gracia / Favor (Channah)",
            "idioma": "Hebreo",
            "original": "חַנָּה",
            "transliteracion": "Channâh",
            "strong": "H2584",
            "definicion": "Favor, gracia. Literalmente derivado de la acción de inclinarse con compasión hacia alguien necesitado."
        }
    },
    {
        "id": "yada-heb",
        "maestro": {
            "id": "yada-heb",
            "termino": "Yadá' (יָדַע)",
            "original": "יָדַע",
            "transliteracion": "Yâda‘",
            "idioma": "Hebreo",
            "esencia_antigua": "Conocer a través de la experiencia íntima.",
            "sentido_verdad": "A diferencia del griego (conocer intelectualmente), Yadá implica una relación profunda, experiencial y a menudo de pacto (como la intimidad conyugal). Conocer a Dios sin Yadá es pura religión.",
            "eco_escritura": {
                "texto": "Los hijos de Elí eran hombres impíos, y no tenían conocimiento (Yadá) de Jehová.",
                "cita": "1 Samuel 2:12"
            },
            "revelacion_cristo": "Jesús es el cumplimiento del Yadá entre Dios y el hombre. 'Esta es la vida eterna: que te conozcan a ti' (Jn 17:3). Él rasgó el velo para que pasáramos de ser servidores del templo a ser amigos íntimos del Padre.",
            "reflejo_tierra": "Puedes manejar los micrófonos, liderar las células y conocer la teología; pero si en lo secreto no tienes comunión personal con Dios, eres un huérfano oficiando en la casa del Rey.",
            "activacion": "Padre, líbrame de la religión fría. Hoy renuncio a saber 'acerca' de Ti, para empezar a conocerte (Yadá) en el lugar secreto."
        },
        "lexico": {
            "id": "yada-heb",
            "palabra_espanol": "Conocer / Intimidad (Yadá)",
            "idioma": "Hebreo",
            "original": "יָדַע",
            "transliteracion": "Yâda‘",
            "strong": "H3045",
            "definicion": "Saber mediante la observación, reflexión y experiencia íntima directa. Se usa para describir relaciones profundas."
        }
    },
    {
        "id": "shama-heb",
        "maestro": {
            "id": "shama-heb",
            "termino": "Shamá' (שָׁמַע)",
            "original": "שָׁמַע",
            "transliteracion": "Shâma‘",
            "idioma": "Hebreo",
            "esencia_antigua": "Oír con la intención garantizada de obedecer.",
            "sentido_verdad": "En hebreo antiguo, no hay palabra para 'obedecer'. Se asume que si escuchas verdaderamente al Rey, la ejecución es automática. Oír sin actuar es, literalmente, sordera.",
            "eco_escritura": {
                "texto": "Y Samuel dijo: Habla, porque tu siervo oye (Shamá).",
                "cita": "1 Samuel 3:10"
            },
            "revelacion_cristo": "Jesucristo es el Oído Perfecto del Padre. Él no solo escuchó los planes del Cielo, sino que descendió para ejecutarlos hasta la cruz. En Él, el 'Shamá' humano y divino se fusionan perfectamente.",
            "reflejo_tierra": "Tus cuadernos llenos de notas de sermones no impresionan al Cielo. El Reino se establece por la instrucción que escuchaste hoy y ejecutaste antes de que el sol se pusiera.",
            "activacion": "Señor, purga mi audición espiritual. No quiero ser un consumidor de sermones; hazme un ejecutor de Tu voluntad. Hoy declaro: Habla, que tu siervo oye y obedece."
        },
        "lexico": {
            "id": "shama-heb",
            "palabra_espanol": "Oír / Obedecer (Shamá)",
            "idioma": "Hebreo",
            "original": "שָׁמַע",
            "transliteracion": "Shâma‘",
            "strong": "H8085",
            "definicion": "Oír de manera inteligente, prestando atención y respondiendo con obediencia diligente."
        }
    },
    {
        "id": "kabod-heb",
        "maestro": {
            "id": "kabod-heb",
            "termino": "Kabód (כָּבוֹד)",
            "original": "כָּבוֹד",
            "transliteracion": "Kâbôwd",
            "idioma": "Hebreo",
            "esencia_antigua": "Peso, gravedad, abundancia, honor espléndido.",
            "sentido_verdad": "La gloria de Dios no es una nube etérea; es el 'peso' innegable de Su presencia y carácter manifestado en un lugar, que exige reverencia absoluta de quienes lo experimentan.",
            "eco_escritura": {
                "texto": "Y llamó al niño Icabod, diciendo: ¡Traspasada es la gloria (Kabód) de Israel!",
                "cita": "1 Samuel 4:21"
            },
            "revelacion_cristo": "Jesús es 'el resplandor de su gloria' (Heb 1:3). Él es el peso definitivo de la presencia de Dios caminando entre nosotros. La cruz fue el momento donde el 'Kabód' del cielo aplastó el sistema del pecado.",
            "reflejo_tierra": "Cuando la iglesia se llena de programas pero carece de oración, la estructura se vuelve ligera y vacía (Icabod). Tu vida necesita el 'peso' de la presencia para no ser arrastrada por los vientos del mundo.",
            "activacion": "Espíritu Santo, no permitas que mi vida sea ligera ni vacía. Que el peso de Tu Kabód repose sobre mis decisiones, mi hogar y mi llamado."
        },
        "lexico": {
            "id": "kabod-heb",
            "palabra_espanol": "Gloria / Peso (Kabód)",
            "idioma": "Hebreo",
            "original": "כָּבוֹד",
            "transliteracion": "Kâbôwd",
            "strong": "H3519",
            "definicion": "Peso (en un sentido bueno), esplendor, copiosidad, majestad y honor glorioso."
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

print("✅ Palabras maestras de la Semana 4 inyectadas en Etymos.")
