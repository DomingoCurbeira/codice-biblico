import json
import os

MAESTRO_PATH = "proyectos/biblia/codice/data/etymos/etymos_maestro.json"
LEXICO_PATH = "proyectos/biblia/codice/data/etymos/lexico.json"
INDICE_PATH = "proyectos/biblia/codice/data/indices/indice_lexico.json"

qodesh_word = {
    "id": "qodesh-heb",
    "maestro": {
        "id": "qodesh-heb",
        "termino": "Qódesh (קֹדֶשׁ)",
        "original": "קֹדֶשׁ",
        "transliteracion": "Qôdesh",
        "idioma": "Hebreo",
        "esencia_antigua": "Separación absoluta / Lo consagrado / Lo intocable.",
        "sentido_verdad": "La santidad (Qódesh) no es primariamente un código moral; es una cualidad de 'separación' o alteridad. Dios es Qódesh porque está absolutamente separado del pecado y de la creación común. Tratar a Dios como algo común o familiar es letal.",
        "eco_escritura": {
            "texto": "Y los de Bet-semes dijeron: ¿Quién podrá estar delante de Jehová el Dios santo (Qódesh)?",
            "cita": "1 Samuel 6:20"
        },
        "revelacion_cristo": "Jesucristo es 'el Santo (Qódesh) de Dios'. Él vivió en el mundo pero separado del pecado. A través de Su sacrificio, Él nos transfirió Su estatus legal de Qódesh para que no seamos consumidos por el fuego de la presencia del Padre.",
        "reflejo_tierra": "Si tratas tu tiempo de oración o tu ministerio como un hábito cualquiera, has perdido el Qódesh. La familiaridad engendra presunción. Dios no es tu 'compinche', es el Rey del Universo; acércate con confianza, pero con extremo temor reverente.",
        "activacion": "Espíritu de Dios, devuélveme el temblor reverente. Perdóname por mezclar lo sagrado con lo común. Hoy separo (Qódesh) mi mente y mi corazón exclusivamente para Ti."
    },
    "lexico": {
        "id": "qodesh-heb",
        "palabra_espanol": "Santo / Santidad (Qódesh)",
        "idioma": "Hebreo",
        "original": "קֹדֶשׁ",
        "transliteracion": "Qôdesh",
        "strong": "H6944",
        "definicion": "Un lugar sagrado o cosa sagrada; santidad, separación. A menudo indica lo que está dedicado exclusivamente a Dios y no puede ser usado para fines comunes."
    }
}

def read_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Update Maestro
maestro_data = read_json(MAESTRO_PATH)
maestro_data = [w for w in maestro_data if w['id'] != qodesh_word['maestro']['id']]
maestro_data.insert(0, qodesh_word['maestro'])
write_json(MAESTRO_PATH, maestro_data)

# Update Lexico
lexico_data = read_json(LEXICO_PATH)
lexico_data = [w for w in lexico_data if w['id'] != qodesh_word['lexico']['id']]
lexico_data.insert(0, qodesh_word['lexico'])
write_json(LEXICO_PATH, lexico_data)

# Update Index
indice_data = read_json(INDICE_PATH)
entries = list(indice_data.items())
entries = [e for e in entries if e[0] != qodesh_word['id']]
entries.insert(0, (qodesh_word['id'], 'hebreo'))
write_json(INDICE_PATH, dict(entries))

print("✅ Qódesh (Santo) añadido a todos los diccionarios e índices de Etymos.")
