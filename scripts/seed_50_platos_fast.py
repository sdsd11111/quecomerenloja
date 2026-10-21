import json
import re
import urllib.parse
import pymysql
import sys
import os

sys.path.insert(0, os.path.abspath('scripts'))
from platos_data import PLATOS_METADATA

db_url = 'mysql://quecomerlojadinamic-313931562a:%7BbS_c5HrdlrW@mysql.us.stackcp.com:46630/quecomerlojadinamic-313931562a'
parsed = urllib.parse.urlparse(db_url)
conn = pymysql.connect(
    host=parsed.hostname,
    port=parsed.port,
    user=parsed.username,
    password=urllib.parse.unquote(parsed.password),
    database=parsed.path[1:],
    connect_timeout=25,
    charset='utf8mb4'
)
cursor = conn.cursor()

with open(r'C:\Users\Smart\.gemini\antigravity-ide\brain\4645f903-7257-4b50-986f-aa3f925a13c9\scratch\restaurantes_resumen.json', 'r', encoding='utf-8') as f:
    rest_info_list = json.load(f)
rest_dict = {r['id_local']: r for r in rest_info_list}

with open(r'C:\Users\Smart\.gemini\antigravity-ide\brain\4645f903-7257-4b50-986f-aa3f925a13c9\scratch\raw_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Cargados {len(PLATOS_METADATA)} platos de configuración.")

plato_records = []
for p in PLATOS_METADATA:
    slug = p['slug']
    nombre = p['nombre']
    titulo_h1 = p['titulo_h1']
    seccion = p['seccion']
    meta_title = p['meta_title']
    meta_description = p['meta_description']
    descripcion_corta = p['descripcion_corta']
    historia = p['historia_tradicion']
    ingredientes_json = json.dumps(p['ingredientes_clave'], ensure_ascii=False)
    faqs_json = json.dumps(p['faqs'], ensure_ascii=False)
    volumen = p['volumen_busqueda']
    
    pat = p['regex']
    matched = [it for it in items if re.search(pat, f"{it.get('nom','')} {it.get('desc','')} {it.get('cat','')}".lower())]
    precios = [i['p_num'] for i in matched if i.get('p_num') is not None and isinstance(i['p_num'], (int, float))]
    
    rango = f"${min(precios):.2f} - ${max(precios):.2f} USD" if precios else "$3.00 - $8.00 USD"
    hero_img = f"https://mvps.b-cdn.net/quecomerenloja/platos/{slug}.webp"
    
    plato_records.append((
        slug, nombre, titulo_h1, seccion, meta_title, meta_description,
        descripcion_corta, historia, ingredientes_json, faqs_json,
        rango, hero_img, volumen
    ))

sql_plato = """
INSERT INTO platos_catalogo (
  slug, nombre, titulo_h1, seccion, meta_title, meta_description,
  descripcion_corta, historia_tradicion, ingredientes_clave, faqs,
  rango_precio_loja, hero_imagen_url, volumen_busqueda, activo
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  titulo_h1 = VALUES(titulo_h1),
  seccion = VALUES(seccion),
  meta_title = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  descripcion_corta = VALUES(descripcion_corta),
  historia_tradicion = VALUES(historia_tradicion),
  ingredientes_clave = VALUES(ingredientes_clave),
  faqs = VALUES(faqs),
  rango_precio_loja = VALUES(rango_precio_loja),
  volumen_busqueda = VALUES(volumen_busqueda);
"""
cursor.executemany(sql_plato, plato_records)
conn.commit()
print("50 Platos insertados con éxito en platos_catalogo.")

cursor.execute("SELECT slug, id FROM platos_catalogo;")
slug_to_id = dict(cursor.fetchall())

cursor.execute("DELETE FROM plato_restaurantes;")
conn.commit()

items_to_insert = []
for p in PLATOS_METADATA:
    slug = p['slug']
    plato_id = slug_to_id.get(slug)
    if not plato_id: continue
    
    pat = p['regex']
    matched = [it for it in items if re.search(pat, f"{it.get('nom','')} {it.get('desc','')} {it.get('cat','')}".lower())]
    
    for it in matched:
        id_loc = it.get('id_local')
        rest_name = it.get('rest')
        item_nom = it.get('nom')
        item_desc = it.get('desc')
        p_txt = it.get('p_txt')
        p_num = it.get('p_num')
        cat_excel = it.get('cat')
        
        r_info = rest_dict.get(id_loc, {})
        direccion = r_info.get('direccion') or ''
        parroquia = r_info.get('parroquia') or ''
        
        items_to_insert.append((
            plato_id, id_loc, rest_name, item_nom,
            item_desc, str(p_txt) if p_txt else None,
            p_num if isinstance(p_num, (int, float)) else None,
            'USD', cat_excel, direccion, parroquia
        ))

sql_item = """
INSERT INTO plato_restaurantes (
  plato_id, id_local_excel, nombre_restaurante, item_carta,
  descripcion_item, precio_textual, precio_numerico, moneda,
  categoria_excel, direccion, parroquia
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
"""

BATCH_SIZE = 150
for i in range(0, len(items_to_insert), BATCH_SIZE):
    batch = items_to_insert[i:i+BATCH_SIZE]
    cursor.executemany(sql_item, batch)
    conn.commit()
    print(f"Insertados {min(i+BATCH_SIZE, len(items_to_insert))} de {len(items_to_insert)} items...")

conn.commit()
cursor.execute("SELECT COUNT(*) FROM platos_catalogo;")
print("Total platos en DB:", cursor.fetchone()[0])
cursor.execute("SELECT COUNT(*) FROM plato_restaurantes;")
print("Total relaciones plato <-> restaurante en DB:", cursor.fetchone()[0])
conn.close()
