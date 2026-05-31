import json
import os

MAESTRO_PATH = "data/etymos/etymos_maestro.json"
LEXICO_PATH = "data/etymos/lexico.json"
INDICE_PATH = "data/indices/indice_lexico.json"

new_words = [
    {
        "maestro": {
            "id": "teruah-heb",
            "termino": "Teruah",
            "original": "תְּרוּעָה",
            "transliteracion": "Teruáh",
            "idioma": "Hebreo",
            "esencia_antigua": "Clamor / Alarma de guerra / Grito de júbilo.",
            "sentido_verdad": "Es la liberación de un decreto audible que rompe la atmósfera. No es un ruido físico, es una señal de que el Rey está presente en el campo de batalla y el juicio ha comenzado.",
            "eco_escritura": {
                "texto": "Entonces el pueblo gritó (Teruah), y los muros se derrumbaron de lo suyo.",
                "cita": "Josué 6:20"
            },
            "revelacion_cristo": "Jesús es la Palabra encarnada cuyo grito en la cruz ('Consumado es') fue el Teruah definitivo que derribó los muros de separación entre Dios y el hombre para siempre.",
            "reflejo_tierra": "Es como el pitido inicial de un partido donde un equipo ya sabe que va a ganar. El Teruah no gana la batalla, anuncia que la victoria ya es un hecho legal.",
            "activacion": "Hoy libero mi Teruah de alabanza. No grito por miedo, grito porque sé que mi Rey ya venció y mis murallas están por caer."
        },
        "lexico": {
            "id": "teruah-heb",
            "palabra_espanol": "Grito / Alarma (Teruah)",
            "idioma": "Hebreo",
            "original": "תְּרוּעָה",
            "transliteracion": "Teruáh",
            "strong": "H8643",
            "raiz": "Rua (Quebrar / Hacer ruido)",
            "definicion_corta": "Clamor ruidoso o sonido de trompeta.",
            "contexto_cultural": "Usado para convocar al pueblo, anunciar un nuevo rey o iniciar una batalla.",
            "perla_espiritual": "Tu voz tiene el poder de romper frecuencias de opresión cuando se alinea con la verdad de Dios.",
            "ejemplo_biblico": "Números 23:21 - '...y júbilo (Teruah) de rey en él.'",
            "tags": ["victoria", "voz", "alabanza", "guerra"]
        }
    },
    {
        "maestro": {
            "id": "yasha-heb",
            "termino": "Yasha",
            "original": "יָשַׁע",
            "transliteracion": "Yashá",
            "idioma": "Hebreo",
            "esencia_antigua": "Amplitud / Espacio libre / Auxilio.",
            "sentido_verdad": "Describe el acto de sacar a alguien de un lugar estrecho y asfixiante hacia una llanura amplia donde puede respirar. La salvación es, en esencia, libertad de movimiento.",
            "eco_escritura": {
                "texto": "Me sacó a lugar espacioso; Me libró (Yasha), porque se agradó de mí.",
                "cita": "Salmos 18:19"
            },
            "revelacion_cristo": "Jesucristo-Pneuma es nuestra Amplitud. Él entró en la estrechez de la muerte para romper sus paredes y darnos el espacio infinito de la vida eterna.",
            "reflejo_tierra": "Es como estar atrapado en un ascensor averiado y que de repente las puertas se abran hacia un jardín inmenso. Ese respiro de alivio es el Yasha de Dios.",
            "activacion": "Rechazo hoy toda asfixia del pasado. Declaro que en Cristo camino en amplitud y mi propósito tiene lugar para expandirse."
        },
        "lexico": {
            "id": "yasha-heb",
            "palabra_espanol": "Salvar / Ampliar (Yasha)",
            "idioma": "Hebreo",
            "original": "יָשַׁע",
            "transliteracion": "Yashá",
            "strong": "H3467",
            "raiz": "Raíz primaria: ser ancho o espacioso.",
            "definicion_corta": "Rescatar, salvar, dar libertad de movimiento.",
            "contexto_cultural": "Término legal para el auxilio que un superior da a un subordinado en peligro.",
            "perla_espiritual": "Dios no solo te perdona; te da espacio para que seas todo lo que Él diseñó que fueras.",
            "ejemplo_biblico": "Éxodo 14:30 - 'Así salvó (Yasha) Jehová aquel día a Israel...'",
            "tags": ["libertad", "salvación", "auxilio"]
        }
    },
    {
        "maestro": {
            "id": "tikvah-heb",
            "termino": "Tikvah",
            "original": "תִּקְוָה",
            "transliteracion": "Tikváh",
            "idioma": "Hebreo",
            "esencia_antigua": "Cuerda tensada / Esperanza / Expectativa.",
            "sentido_verdad": "Es una esperanza que tiene cuerpo físico: una cuerda que te une a un destino. No es un deseo vago, es una conexión legal inquebrantable con lo que Dios prometió.",
            "eco_escritura": {
                "texto": "...y ella ató el cordón (Tikvah) de grana a la ventana.",
                "cita": "Josué 2:21"
            },
            "revelacion_cristo": "Jesucristo-Pneuma es nuestra Tikvah. Su sangre es la cuerda roja que nos une al Reino de los Cielos mientras vivimos en medio de un mundo bajo sentencia de juicio.",
            "reflejo_tierra": "Es como el arnés de seguridad de un alpinista. Aunque el suelo desaparezca, la cuerda (Tikvah) lo mantiene unido a la cima firme. Tu esperanza es tu ancla.",
            "activacion": "Mi esperanza no es un sentimiento, es un contrato. Ato mi vida a la fidelidad de Dios y espero con paz Su victoria en mi casa."
        },
        "lexico": {
            "id": "tikvah-heb",
            "palabra_espanol": "Cuerda / Esperanza (Tikvah)",
            "idioma": "Hebreo",
            "original": "תִּקְוָה",
            "transliteracion": "Tikváh",
            "strong": "H8615",
            "raiz": "Qavah (Tenzar / Esperar)",
            "definicion_corta": "Cordón, hilo; expectativa, esperanza.",
            "contexto_cultural": "Simbolizaba la unión o el vínculo legal entre dos partes.",
            "perla_espiritual": "La esperanza bíblica es una cuerda roja: te hace visible para el cielo en medio de la destrucción de la tierra.",
            "ejemplo_biblico": "Rut 1:12 - '...aunque tuviese esperanza (Tikvah)...'",
            "tags": ["esperanza", "fe", "protección"]
        }
    }
]

def inject_etymos():
    with open(MAESTRO_PATH, 'r', encoding='utf-8') as f: m = json.load(f)
    with open(LEXICO_PATH, 'r', encoding='utf-8') as f: l = json.load(f)
    with open(INDICE_PATH, 'r', encoding='utf-8') as f: ind = json.load(f)
    
    mapping = {"teruah-heb": "santuario", "yasha-heb": "transformacion", "tikvah-heb": "sabiduria"}

    for w in new_words:
        mid = w['maestro']['id']
        m = [i for i in m if i.get('id') != mid]
        m.append(w['maestro'])
        
        l = [i for i in l if i.get('id') != mid]
        l.append(w['lexico'])
        
        ind[mid] = mapping.get(mid, "fundamentos")

    with open(MAESTRO_PATH, 'w', encoding='utf-8') as f: json.dump(m, f, indent=2, ensure_ascii=False)
    with open(LEXICO_PATH, 'w', encoding='utf-8') as f: json.dump(l, f, indent=2, ensure_ascii=False)
    with open(INDICE_PATH, 'w', encoding='utf-8') as f: json.dump(ind, f, indent=2, ensure_ascii=False)
    print("✅ Etymos inyectados.")

if __name__ == "__main__":
    inject_etymos()
