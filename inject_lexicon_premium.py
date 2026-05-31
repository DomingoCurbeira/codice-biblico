import json
import os

LEXICO_PATH = "data/etymos/lexico.json"
INDICE_PATH = "data/indices/indice_lexico.json"

new_words = [
    {
        "id": "kapar-heb",
        "palabra_espanol": "Expiación / Cobertura (Kapar)",
        "idioma": "Hebreo",
        "original": "כָּפַר",
        "transliteracion": "Kapar",
        "strong": "H3722",
        "raiz": "Raíz primaria: cubrir (específicamente con betún).",
        "definicion_corta": "Cancelar una deuda, aplacar un juicio o cubrir una falta mediante un rescate.",
        "contexto_cultural": "En el mundo antiguo, 'Kapar' se usaba para sellar algo y hacerlo impermeable. El primer uso bíblico es cuando Noé calafatea el Arca con brea (Kopher). En el sistema levítico, era el término legal para el sacrificio: la sangre 'cubría' el pecado para que el juicio de Dios no pudiera penetrar en la vida del oferente.",
        "perla_espiritual": "La expiación no es esconder el pecado debajo de la alfombra; es sellar la brecha legal entre Dios y el hombre. Dios no ignoró tu pecado, lo 'calafateó' con la sangre de Su Hijo. Así como el Arca protegió a Noé del diluvio, el 'Kapar' de Cristo te hace impermeable a la condenación eterna.",
        "ejemplo_biblico": "Génesis 3:21 - 'Y Jehová Dios hizo al hombre y a su mujer túnicas de pieles, y los vistió (primer Kapar).'",
        "tags": ["gracia", "sangre", "protección", "justificación"]
    },
    {
        "id": "yada-heb",
        "palabra_espanol": "Conocer (Yada)",
        "idioma": "Hebreo",
        "original": "יָדַע",
        "transliteracion": "Yadá",
        "strong": "H3045",
        "raiz": "Raíz primaria: percibir / reconocer.",
        "definicion_corta": "Conocimiento profundo, experiencial e íntimo.",
        "contexto_cultural": "A diferencia del concepto griego 'Gnosis' (que es intelectual), 'Yada' implica compromiso y relación. Se usa para describir la intimidad más profunda entre un hombre y su mujer. 'Conocer' en la Biblia es sinónimo de 'experimentar la presencia'.",
        "perla_espiritual": "El pecado en el Edén fue querer 'Yada' (experimentar) el mal por cuenta propia. Dios nos invita ahora a 'Yada' Su bondad. No se trata de saber cosas ACERCA de Dios, sino de caminar con Él hasta que Su pensamiento sea el tuyo. La vida eterna, según Jesús, es 'que te conozcan (Yada) a ti'.",
        "ejemplo_biblico": "Génesis 4:1 - 'Conoció (Yada) Adán a su mujer Eva, la cual concibió...'",
        "tags": ["intimidad", "sabiduría", "experiencia", "relación"]
    },
    {
        "id": "jata-heb",
        "palabra_espanol": "Pecado (Jata)",
        "idioma": "Hebreo",
        "original": "חָטָא",
        "transliteracion": "Jatá",
        "strong": "H2398",
        "raiz": "Raíz primaria: errar el blanco.",
        "definicion_corta": "Fallar en alcanzar la marca, desviarse del propósito original.",
        "contexto_cultural": "Era un término técnico en la arquería y la milicia. Un arquero que disparaba y no daba en la diana cometía un 'Jata'. No implicaba necesariamente maldad intrínseca en la flecha, sino un fallo trágico en la dirección y el destino.",
        "perla_espiritual": "Pecar es fallar en ser quien Dios diseñó que fueras. No es solo romper una regla; es fracasar en reflejar la gloria de Dios. Eres una flecha diseñada para el corazón de Dios; cualquier otro blanco, por muy bueno que parezca, es un fallo existencial. Cristo es quien vuelve a alinear tu trayectoria.",
        "ejemplo_biblico": "Jueces 20:16 - '...tiraban una piedra con la honda a un cabello, y no erraban (Jata).'",
        "tags": ["propósito", "identidad", "caída", "alineación"]
    },
    {
        "id": "hamartia-gr",
        "palabra_espanol": "Pecado (Hamartia)",
        "idioma": "Griego",
        "original": "ἁμαρτία",
        "transliteracion": "Hamartia",
        "strong": "G266",
        "raiz": "De 'a' (sin) + 'meros' (parte/porción/suerte).",
        "definicion_corta": "Falta de participación en la gloria; error fatal.",
        "contexto_cultural": "En la tragedia griega, la 'Hamartia' era el error de juicio o defecto de carácter que llevaba al héroe a su ruina. En el Nuevo Testamento, Pablo la usa para describir la condición humana de estar 'sin porción' en la vida divina de Dios.",
        "perla_espiritual": "Estar en Hamartia es vivir 'sin herencia'. El pecado nos desconectó de nuestra porción eterna. Jesús vino como el Hombre sin Hamartia para devolvernos nuestra participación en la naturaleza divina. Ya no somos huérfanos sin suerte; en Cristo recuperamos nuestro 'Meros' (porción) en el Reino.",
        "ejemplo_biblico": "Romanos 3:23 - 'Por cuanto todos pecaron (Hamartia), y están destituidos...'",
        "tags": ["herencia", "caída", "naturaleza", "redención"]
    },
    {
        "id": "abad-heb",
        "palabra_espanol": "Servir / Adorar (Abad)",
        "idioma": "Hebreo",
        "original": "עָבַד",
        "transliteracion": "Abád",
        "strong": "H5647",
        "raiz": "Raíz primaria: trabajar / labrar.",
        "definicion_corta": "Servicio que se convierte en adoración; trabajar con un fin sagrado.",
        "contexto_cultural": "En el Edén, Adán fue puesto para 'Abad' el huerto. No era un trabajo penoso, sino una liturgia. Para el hebreo, el trabajo diario y el servicio al templo usan la misma palabra. Tu oficio es tu altar.",
        "perla_espiritual": "No hay separación entre lo secular y lo sagrado cuando operas en 'Abad'. Lo que haces con tus manos el lunes es tan espiritual como lo que cantas el domingo, siempre que el destinatario sea el Rey. Dios restauró tu capacidad de servir para que tu productividad sea una fragancia de adoración.",
        "ejemplo_biblico": "Génesis 2:15 - '...lo puso en el huerto de Edén, para que lo labrara (Abad)...'",
        "tags": ["trabajo", "sacerdocio", "servicio", "excelencia"]
    },
    {
        "id": "shamar-heb",
        "palabra_espanol": "Guardar / Proteger (Shamar)",
        "idioma": "Hebreo",
        "original": "שָׁמַר",
        "transliteracion": "Shamár",
        "strong": "H8104",
        "raiz": "Raíz primaria: cercar con espinas / vigilar.",
        "definicion_corta": "Ejercer vigilancia activa; blindar un territorio.",
        "contexto_cultural": "Describe la acción de un pastor protegiendo su rebaño de los lobos o de un centinela en las murallas de una ciudad. Implica responsabilidad legal sobre lo que se guarda.",
        "perla_espiritual": "Adán falló en el 'Shamar' cuando permitió que la serpiente entrara al templo del Edén. Hoy, tú eres el guardia de tu santuario interior. No eres una víctima de tus pensamientos; eres el centinela encargado de cerrar la puerta a todo lo que profana tu paz y tu identidad en Cristo.",
        "ejemplo_biblico": "Génesis 2:15 - '...y lo guardase (Shamar).'",
        "tags": ["vigilancia", "autoridad", "guerra espiritual", "pureza"]
    },
    {
        "id": "typos-gr",
        "palabra_espanol": "Figura / Modelo (Typos)",
        "idioma": "Griego",
        "original": "τύπος",
        "transliteracion": "Túpos",
        "strong": "G5179",
        "raiz": "De 'tupto' (golpear / estampar).",
        "definicion_corta": "La marca dejada por un golpe; un prototipo o sombra representativa.",
        "contexto_cultural": "Se usaba para el sello que dejaba un anillo sobre la cera o la impresión de un molde. En teología, un 'Tipo' es un evento o persona del Antiguo Testamento que prefigura una realidad mucho más grande en el Nuevo Testamento.",
        "perla_espiritual": "Adán fue un 'Tipo' de Jesús. La marca de Adán fue de muerte, pero el 'Golpe' de la Gracia en Cristo dejó una marca de vida eterna. Tú ya no portas el sello del fracaso de Adán; si estás en Cristo, has sido 'estampado' con Su victoria y Su destino. Eres el reflejo de un Modelo perfecto.",
        "ejemplo_biblico": "Romanos 5:14 - '...el cual es figura (Typos) del que había de venir.'",
        "tags": ["profecía", "jesús", "modelo", "exégesis"]
    }
]

def inject_lexico():
    with open(LEXICO_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Update or Add
    for new_w in new_words:
        data = [w for w in data if w.get('id') != new_w['id']]
        data.append(new_w)
    
    with open(LEXICO_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Inyectadas {len(new_words)} palabras en {LEXICO_PATH}")

def update_indice():
    with open(INDICE_PATH, 'r', encoding='utf-8') as f:
        indice = json.load(f)
    
    mappings = {
        "kapar-heb": "santuario",
        "yada-heb": "sabiduria",
        "jata-heb": "transformacion",
        "hamartia-gr": "transformacion",
        "abad-heb": "santuario",
        "shamar-heb": "santuario",
        "typos-gr": "sabiduria"
    }
    
    for key, val in mappings.items():
        indice[key] = val
        
    with open(INDICE_PATH, 'w', encoding='utf-8') as f:
        json.dump(indice, f, indent=2, ensure_ascii=False)
    print(f"✅ Actualizado el índice {INDICE_PATH}")

if __name__ == "__main__":
    inject_lexico()
    update_indice()
