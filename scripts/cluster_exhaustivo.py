import json
import re
from collections import defaultdict

with open(r'C:\Users\Smart\.gemini\antigravity-ide\brain\4645f903-7257-4b50-986f-aa3f925a13c9\scratch\raw_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

NORM_RULES = [
    ('repe-lojano', 'Repe Lojano', r'\brepe\b', 'Tradicional Lojana'),
    ('cecina-lojana', 'Cecina Lojana', r'\bcecina\b|\bcecinas\b', 'Tradicional Lojana'),
    ('tamales-lojanos', 'Tamales Lojanos', r'\btamal\b|\btamales\b', 'Tradicional Lojana'),
    ('humitas-loja', 'Humitas en Loja', r'\bhumita\b|\bhumitas\b', 'Tradicional Lojana'),
    ('quimbolitos-loja', 'Quimbolitos Lojanos', r'\bquimbolito\b|\bquimbolitos\b', 'Tradicional Lojana'),
    ('cuy-asado-loja', 'Cuy Asado en Loja', r'\bcuy\b', 'Tradicional Lojana'),
    ('gallina-cuyada-loja', 'Gallina Cuyada en Loja', r'gallina cuyada', 'Tradicional Lojana'),
    ('arveja-con-guineo-loja', 'Arveja con Guineo', r'arveja.*guineo|arvejas.*guineo', 'Tradicional Lojana'),
    ('fritada-loja', 'Fritada en Loja', r'\bfritada\b|\bfritadas\b', 'Tradicional Ecuatoriana'),
    ('chicharron-loja', 'Chicharron y Piqueos de Cerdo', r'\bchicharron\b|\bchicharrones\b', 'Tradicional Ecuatoriana'),
    ('empanadas-loja', 'Empanadas de Verde y Morocho', r'\bempanada\b|\bempanadas\b', 'Tradicional Ecuatoriana'),
    ('bolones-loja', 'Bolones de Verde en Loja', r'\bbolon\b|\bbolones\b', 'Desayunos y Tradicional'),
    ('tigrillo-loja', 'Tigrillo en Loja', r'\btigrillo\b|\btigrillos\b', 'Desayunos y Tradicional'),
    ('sango-loja', 'Sango Lojano y de Camaron', r'\bsango\b', 'Tradicional Lojana'),
    ('locro-loja', 'Locros y Sopas Tradicionales', r'\blocro\b|\blocros\b', 'Tradicional Ecuatoriana'),
    ('caldo-de-gallina-loja', 'Caldo de Gallina Criolla', r'caldo de gallina|sopa de gallina', 'Sopas y Caldos'),
    ('caldo-de-patas-loja', 'Caldo de Patas en Loja', r'caldo de pata|caldo de patas', 'Sopas y Caldos'),
    ('caldo-de-bola-loja', 'Caldo de Bola de Verde', r'caldo de bola', 'Sopas y Caldos'),
    ('seco-de-chivo-loja', 'Seco de Chivo en Loja', r'seco de chivo', 'Secos y Almuerzos'),
    ('seco-de-pollo-loja', 'Seco de Pollo y Gallina', r'seco de pollo|seco de gallina', 'Secos y Almuerzos'),
    ('seco-de-carne-loja', 'Seco de Chancho y Res', r'seco de chancho|seco de cerdo|seco de carne|seco de res|seco de costilla|guisado de carne', 'Secos y Almuerzos'),
    ('guatita-loja', 'Guatita Criolla en Loja', r'\bguatita\b|\bguatitas\b|\bguata\b', 'Secos y Almuerzos'),
    ('menestras-loja', 'Menestras con Carne al Carbon', r'\bmenestra\b|\bmenestras\b', 'Asados y Menestras'),
    ('churrasco-loja', 'Churrasco Ecuatoriano', r'\bchurrasco\b', 'Platos Fuertes'),
    ('banderas-loja', 'Banderas y Platos Combinados', r'\bbandera\b|\bbanderas\b', 'Platos Fuertes'),
    ('parihuela-loja', 'Parihuela de Mariscos', r'\bparihuela\b', 'Mariscos y Costena'),
    ('encebollado-loja', 'Encebollados en Loja', r'\bencebollado\b|\bencebollados\b', 'Mariscos y Costena'),
    ('ceviche-camaron-loja', 'Ceviche de Camaron', r'ceviche.*camar[on]|cebiche.*camar[on]', 'Mariscos y Costena'),
    ('ceviche-concha-loja', 'Ceviche de Concha Negra', r'ceviche.*concha|cebiche.*concha', 'Mariscos y Costena'),
    ('ceviche-pescado-loja', 'Ceviche de Pescado y Peruano', r'ceviche.*pescado|ceviche peruano|cebiche peruano', 'Mariscos y Costena'),
    ('ceviche-mixto-loja', 'Ceviche Mixto y Maremoto', r'ceviche mixto|cebiche mixto|maremoto|rompe colchon|levantamuertos', 'Mariscos y Costena'),
    ('arroz-marinero-loja', 'Arroz Marinero y con Mariscos', r'arroz marinero|arroz con mariscos|arroz con camaron', 'Mariscos y Costena'),
    ('cazuela-mariscos-loja', 'Cazuela de Mariscos', r'cazuela', 'Mariscos y Costena'),
    ('encocado-loja', 'Encocados de Mariscos', r'encocado', 'Mariscos y Costena'),
    ('camarones-apanados-loja', 'Camarones Apanados y al Ajillo', r'camaron apanado|camarones apanados|camaron al ajillo|camarones al ajillo|camarones crocantes', 'Mariscos y Costena'),
    ('pescado-frito-loja', 'Pescado Frito, Corvina y Trucha', r'pescado frito|corvina frita|trucha|tilapia|pescado a la plancha', 'Mariscos y Costena'),
    ('cangrejos-loja', 'Cangrejos y Cangrejadas', r'cangrejo|cangrejos|cangrejada', 'Mariscos y Costena'),
    ('sopas-marineras-loja', 'Sopa Marinera y Caldo de Mariscos', r'sopa marinera|caldo marinero|sopa de mariscos', 'Mariscos y Costena'),
    ('parrilladas-loja', 'Parrilladas al Carbon en Loja', r'\bparrillada\b|\bparrilladas\b|\basado\b|\basados\b', 'Parrilladas y Carnes'),
    ('cortes-premium-loja', 'Bife, Picanha y Cortes Premium', r'bife|picanha|rib eye|t-bone|tomahawk|new york steak|vacio', 'Parrilladas y Carnes'),
    ('lomo-fino-loja', 'Lomo Fino y Lomo Saltado', r'lomo fino|lomo saltado|lomito saltado|filete de carne|medallon de lomo', 'Parrilladas y Carnes'),
    ('costillas-bbq-loja', 'Costillas BBQ y Ahumadas', r'costilla|costillas|ribs', 'Parrilladas y Carnes'),
    ('pollo-asado-loja', 'Pollo Asado y a la Brasa', r'pollo asado|pollo a la brasa|pollo broaster|cuarto de pollo|medio pollo', 'Pollerias y Asados'),
    ('pinchos-loja', 'Pinchos y Brochetas al Carbon', r'pincho|pinchos|brocheta|brochetas|chuzo|chuzos', 'Parrilladas y Carnes'),
    ('hamburguesas-artesanales-loja', 'Hamburguesas Artesanales', r'hamburguesa|burger|burguer', 'Comida Rapida'),
    ('alitas-loja', 'Alitas BBQ y Picantes', r'alitas|wings', 'Comida Rapida'),
    ('pizza-artesanal-loja', 'Pizzas Artesanales en Horno', r'pizza|pizzas', 'Pizzerias'),
    ('salchipapas-loja', 'Salchipapas y Papas Cargadas', r'salchipapa|salchipapas|papas con carne|papas del hueco|papas cargadas|papas fritas', 'Comida Rapida'),
    ('hot-dogs-loja', 'Hot Dogs y Choripan', r'hot dog|hot-dog|perro caliente|choripan', 'Comida Rapida'),
    ('sandwiches-loja', 'Sandwiches y Sanduches Artesanales', r'sandwich|sandwiches|sanduche|sanduches', 'Comida Rapida'),
    ('tacos-mexicanos-loja', 'Tacos, Burritos y Quesadillas', r'taco|tacos|burrito|burritos|quesadilla|quesadillas|nachos|fajitas', 'Comida Mexicana'),
    ('chifa-chaulafan-loja', 'Chifa y Chaulafan en Loja', r'chifa|chaulafan|chaufan|arroz chino|tallarin saltado|wantan|kam lu wantan', 'Cocina Asiatica'),
    ('sushi-rolls-loja', 'Sushi, Rolls y Makis', r'sushi|roll|rolls|maki|makis|sashimi|poke', 'Cocina Asiatica'),
    ('pastas-italianas-loja', 'Pastas Italianas, Lasana y Ravioles', r'pasta|pastas|spaghetti|tagliatelle|fetuccini|fettuccine|lasa|ravioles|gnocchis|carbonara|bolognesa|pesto', 'Cocina Italiana'),
    ('tablas-charcuteria-loja', 'Tablas de Jamones y Quesos', r'tabla|tablas|charcuter|jamon serrano|prosciutto', 'Piqueos y Vinos'),
    ('cafe-especialidad-loja', 'Cafe de Especialidad y Filtrados', r'filtrado|chemex|v60|aeropress|prensa francesa|espresso|cappuccino|latte|americano|mocca', 'Cafeterias'),
    ('waffles-crepes-loja', 'Waffles, Crepes y Pancakes', r'waffle|waffles|crepe|crepes|pancake|pancakes', 'Cafeterias y Desayunos'),
    ('postres-tortas-loja', 'Tortas, Cheesecakes y Pasteleria', r'cheesecake|torta|pastel|pie de|brownie|tres leches|tiramisu', 'Cafeterias y Dulces'),
    ('helados-loja', 'Helados Artesanales', r'helado|helados|gelato|copa de helado', 'Cafeterias y Dulces')
]

asignados = defaultdict(list)
descartados = []

for it in items:
    cat = str(it.get('cat') or '').lower()
    tipo = str(it.get('tipo') or '').lower()
    nom = str(it.get('nom') or '').strip()
    desc = str(it.get('desc') or '').strip()
    
    # Si es trago o botella alcoholica pura
    if any(b in cat for b in ['botellas', 'cervezas', 'coctelería', 'licores', 'vinos', 'shots', 'tragos']) and tipo in ['bebida', 'licor', 'cerveza', 'coctel']:
        descartados.append((nom, it.get('rest'), 'alcohol'))
        continue
        
    txt = f"{nom} {desc} {cat}".lower()
    match = False
    for slug, nombre_plato, pat, seccion in NORM_RULES:
        if re.search(pat, txt):
            asignados[slug].append(it)
            match = True
            break
            
    if not match:
        descartados.append((nom, it.get('rest'), 'sin clasificar'))

resumen = []
for slug, nombre_plato, pat, seccion in NORM_RULES:
    c_items = asignados[slug]
    if c_items:
        locales = sorted(list(set(x['rest'] for x in c_items)))
        precios = [x['p_num'] for x in c_items if x['p_num'] is not None and isinstance(x['p_num'], (int, float))]
        resumen.append({
            'slug': slug,
            'nombre': nombre_plato,
            'seccion': seccion,
            'total_items': len(c_items),
            'total_locales': len(locales),
            'min_precio': min(precios) if precios else None,
            'max_precio': max(precios) if precios else None,
            'ejemplos': [x['nom'] for x in c_items[:5]],
            'locales_muestra': locales[:5]
        })

print(f"Total Clusters Generados: {len(resumen)}")
print(f"Total Items Asignados a Platos Reales: {sum(len(v) for v in asignados.values())}")
print(f"Total Descartados (Alcohol / Tragos / Huérfanos): {len(descartados)}")

with open(r'C:\Users\Smart\.gemini\antigravity-ide\brain\4645f903-7257-4b50-986f-aa3f925a13c9\scratch\fase1_clusters_exhaustivo.json', 'w', encoding='utf-8') as f:
    json.dump({'clusters': resumen, 'descartados_muestra': descartados[:25]}, f, ensure_ascii=False, indent=2)

print("Archivo JSON generado con éxito.")
