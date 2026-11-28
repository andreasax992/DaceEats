#!/usr/bin/env python3
"""Descarga fotos de platos desde Wikimedia Commons (licencias libres).

Uso (en un ordenador con internet, desde la carpeta del proyecto):
    python3 tools/descargar_fotos.py            # descarga solo las que faltan
    python3 tools/descargar_fotos.py --forzar   # vuelve a descargar todas

Guarda las imágenes en img/platos/<id>.jpg, img/categorias/<id>.jpg e img/danzas/<nombre>.jpg y crea
CREDITOS.md con autor y licencia de cada foto (obligatorio atribuirlas).
IMPORTANTE: revisa el resultado: la búsqueda automática puede traer una foto
poco adecuada. Para cambiar una, sustituye el archivo por otro con el mismo nombre.
"""
import json, os, re, sys, time, urllib.parse, urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "DANCE-EATS/1.0 (recurso educativo)"}
FORZAR = "--forzar" in sys.argv

# Fotos de época de la pantalla de entrega (img/danzas/<nombre>.jpg) y su búsqueda
DANZAS = {
    "italia-1": "tarantella dance Italy",
    "italia-2": "tarantella dancers Naples",
    "texas-1": "square dance Texas",
    "texas-2": "square dancers dance hall Texas",
    "africa-1": "gumboot dance",
    "africa-2": "gumboot dancers miners South Africa",
}

def cargar_datos():
    txt = open(os.path.join(RAIZ, "js", "data.js"), encoding="utf-8").read()
    return json.loads(txt[txt.index("{"): txt.rindex("}") + 1])

def buscar(consulta):
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": f"{consulta} filetype:bitmap", "gsrnamespace": 6, "gsrlimit": 12,
        "prop": "imageinfo", "iiprop": "url|mime|size|extmetadata", "iiurlwidth": 900,
    }
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers=UA)
    datos = json.load(urllib.request.urlopen(req, timeout=30))
    paginas = sorted(datos.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 99))
    for p in paginas:
        info = (p.get("imageinfo") or [{}])[0]
        if info.get("mime") != "image/jpeg" or info.get("width", 0) < 700:
            continue
        if info["width"] < info.get("height", 0):   # preferimos fotos horizontales
            continue
        return info
    return None

def descargar(info, destino):
    req = urllib.request.Request(info.get("thumburl") or info["url"], headers=UA)
    with open(destino, "wb") as f:
        f.write(urllib.request.urlopen(req, timeout=60).read())

def limpiar(html):
    return re.sub(r"<[^>]+>", "", html or "").strip()

def main():
    d = cargar_datos()
    trabajos = [("platos", p["id"], p["q"] + " food dish") for p in d["platos"]]
    trabajos += [("categorias", c["id"], c["pais"] + " cuisine food") for c in d["categorias"]]
    trabajos += [("danzas", k, v) for k, v in DANZAS.items()]
    os.makedirs(os.path.join(RAIZ, "img", "danzas"), exist_ok=True)
    os.makedirs(os.path.join(RAIZ, "img", "platos"), exist_ok=True)
    os.makedirs(os.path.join(RAIZ, "img", "categorias"), exist_ok=True)
    creditos = ["# Créditos de las fotografías\n", "Fuente: Wikimedia Commons.\n"]
    for tipo, id_, consulta in trabajos:
        destino = os.path.join(RAIZ, "img", tipo, id_ + ".jpg")
        if os.path.exists(destino) and not FORZAR:
            continue
        try:
            info = buscar(consulta)
            if not info:
                print("SIN RESULTADO ", id_); continue
            descargar(info, destino)
            meta = info.get("extmetadata", {})
            autor = limpiar(meta.get("Artist", {}).get("value", "Desconocido"))
            lic = limpiar(meta.get("LicenseShortName", {}).get("value", ""))
            creditos.append(f"- {tipo}/{id_}.jpg — {autor} — {lic} — {info.get('descriptionurl', '')}")
            print("OK            ", id_)
        except Exception as e:
            print("ERROR         ", id_, e)
        time.sleep(0.6)
    if len(creditos) > 2:
        with open(os.path.join(RAIZ, "CREDITOS.md"), "a", encoding="utf-8") as f:
            f.write("\n".join(creditos) + "\n")
    print("Hecho. Revisa las fotos en img/ y conserva CREDITOS.md.")

if __name__ == "__main__":
    main()
