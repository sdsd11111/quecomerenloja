import json
import re
import sys
import os
from collections import Counter, defaultdict

with open(r'C:\Users\Smart\.gemini\antigravity-ide\brain\4645f903-7257-4b50-986f-aa3f925a13c9\scratch\raw_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

sys.path.insert(0, os.path.abspath('scripts'))
from platos_data import PLATOS_METADATA

pat_combinado = '|'.join(['(' + p['regex'] + ')' for p in PLATOS_METADATA])

fuera = []
for it in items:
    cat = str(it.get('cat') or '').lower()
    tipo = str(it.get('tipo') or '').lower()
    nom = str(it.get('nom') or '').strip()
    desc = str(it.get('desc') or '').strip()
    txt = f"{nom} {desc} {cat}".lower()
    
    if not re.search(pat_combinado, txt):
        fuera.append(it)

print(f"Total items en crudo: {len(items)}")
print(f"Items que no entraron en los 51 primeros clusters: {len(fuera)}")

# Analizar candidatos gastronómicos reales
CANDIDATOS_FUTUROS = [
    ('ensaladas-gourmet-loja', 'Ensaladas Gourmet y Bowls Saludables', r'ensalada|caesar|cesar|bowl|quinoa', 'Ensaladas y Saludable'),
    ('almuerzos-ejecutivos-loja', 'Almuerzos Ejecutivos y Menú del Día', r'almuerzo|menu del dia|menú ejecutivo|merienda|sopa del dia', 'Almuerzos y Menús'),
    ('caldos-sopas-criollas-loja', 'Caldos y Sopas Criollas (Gallina, Res, Verdura)', r'caldo|sopa|crema de|consome', 'Sopas y Caldos'),
    ('trucha-pescados-frescos-loja', 'Trucha de Río y Tilapia Frita', r'trucha|tilapia|salmon|corvina|pescado', 'Pescados y Truchas'),
    ('desayunos-continentales-loja', 'Desayunos Completos, Huevos y Tostadas', r'desayuno|tostada|huevos|omelette|hot cakes', 'Desayunos'),
    ('nachos-piqueos-texmex-loja', 'Nachos con Queso, Guacamole y Piqueos Mexicanos', r'nachos|totopos|guacamole|frijol refrito', 'Comida Mexicana'),
    ('carnes-cerdo-chuletas-loja', 'Chuletas de Cerdo, Panceta y Chicharrón', r'chuleta|panceta|pernil|lomo de cerdo', 'Carnes y Cerdo'),
    ('comida-vegetariana-vegana-loja', 'Opciones Vegetarianas y Veganas en Loja', r'vegetariano|vegano|tofu|falafel|soya|champiñones al ajillo', 'Vegetariana y Saludable'),
    ('jugos-batidos-naturales-loja', 'Jugos Naturales, Batidos y Horchata Lojana', r'jugo|batido|smoothie|horchata|limonada|naranjada', 'Bebidas Naturales'),
    ('reposteria-pasteleria-artesanal-loja', 'Pastelería, Brownies y Galletas Artesanales', r'galleta|brownie|muffin|cupcake|alfajor|dona|croissant', 'Pastelería y Dulces'),
    ('cocteleria-cerveza-artesanal-loja', 'Coctelería de Autor y Cerveza Artesanal Lojana', r'artesanal|coctel|mojito|margarita|gin tonic|michelada|cantarito', 'Bares y Coctelería')
]

candidatos_match = defaultdict(list)
residual_ruido = []

for it in fuera:
    cat = str(it.get('cat') or '').lower()
    tipo = str(it.get('tipo') or '').lower()
    nom = str(it.get('nom') or '').strip()
    desc = str(it.get('desc') or '').strip()
    txt = f"{nom} {desc} {cat}".lower()
    
    match = False
    for slug, nombre, regex, seccion in CANDIDATOS_FUTUROS:
        if re.search(regex, txt):
            candidatos_match[slug].append(it)
            match = True
            break
            
    if not match:
        residual_ruido.append(it)

print(f"\nItems clasificados en candidatos de expansión a futuro: {sum(len(v) for v in candidatos_match.values())}")
print(f"Items residuales finales (marcas comerciales de licores, cigarrillos, combos de fantasía): {len(residual_ruido)}")

print("\n--- Desglose de los Grupos Candidatos para Expansión Futura ---")
resumen_futuro = []
for slug, nombre, regex, seccion in CANDIDATOS_FUTUROS:
    it_list = candidatos_match[slug]
    locales = sorted(list(set(x['rest'] for x in it_list)))
    print(f"[{slug}] {nombre}: {len(it_list)} ítems en {len(locales)} locales")
    resumen_futuro.append({
        'slug': slug,
        'nombre': nombre,
        'seccion': seccion,
        'total_items': len(it_list),
        'total_locales': len(locales),
        'ejemplos': [x['nom'] for x in it_list[:6]],
        'locales': locales[:6]
    })

with open(r'C:\Users\Smart\.gemini\antigravity-ide\brain\4645f903-7257-4b50-986f-aa3f925a13c9\scratch\futuros_platos.json', 'w', encoding='utf-8') as f:
    json.dump({
        'candidatos_futuros': resumen_futuro,
        'residual_ruido_muestra': residual_ruido[:30]
    }, f, ensure_ascii=False, indent=2)

print("\nJSON de candidatos a futuro guardado exitosamente.")
