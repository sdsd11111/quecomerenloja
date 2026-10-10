# Guía de identidad — Qué comer en Loja

## Dirección de marca

**Qué comer en Loja** se plantea como una guía local de descubrimiento gastronómico: ayuda a residentes y visitantes a decidir qué probar y dónde encontrarlo. No se presenta como un restaurante ni como un directorio genérico, sino como una marca editorial/digital con raíz local, útil y preparada para crecer a más categorías, formatos y alianzas.

- **Idea central:** descubrir Loja a través de su mesa.
- **Promesa:** hacer más fácil encontrar sabores y lugares que merecen ser descubiertos.
- **Descriptor:** Guía gastronómica local.
- **Lema propuesto:** «Descubre el sabor local». Es opcional y no forma parte del logotipo principal.
- **Carácter:** local, curioso, confiable, claro y contemporáneo; orgulloso de la tradición sin verse folclórico ni nostálgico.

## Concepto del símbolo

La inicial **Q** se convierte en un plato visto desde arriba: el doble aro recuerda el borde de un plato y su remate funciona como un trazo de ruta que llega a un punto de destino. Une gastronomía y descubrimiento en una forma breve, reconocible y usable como favicon, avatar o sello. Se evita depender de ilustraciones literales de platos, cubiertos o sombreros.

## Sistema de logotipos

- **Horizontal:** versión principal para navegación, encabezados, firmas y perfiles de socios.
- **Apilado:** para espacios cuadrados o estrechos.
- **Símbolo:** avatar, favicon, etiquetas compactas y usos donde el nombre ya está visible.
- **Inverso:** para superficies oscuras.
- **Monocromo:** impresión a una tinta, sellos y aplicaciones de bajo contraste de color.

Los SVG contienen el texto como curvas, por lo que el aspecto del nombre no depende de que el dispositivo tenga instaladas las fuentes. El paquete incluye PNG para sistemas que no acepten SVG.

## Paleta

| Color | HEX | Función sugerida |
|---|---|---|
| Petróleo profundo | `#153E3E` | Color principal, navegación, texto de marca |
| Cítrico de altura | `#D0DB61` | Acento distintivo, ruta y detalles destacados |
| Grafito | `#1F2928` | Texto y elementos neutros |
| Porcelana | `#F5F6F1` | Fondo claro principal y superficies |
| Niebla | `#DCE4E0` | Superficies secundarias, divisores y estados suaves |
| Blanco | `#FFFFFF` | Fondo limpio y contraste |

**Proporción orientativa en interfaces:** petróleo y neutros como base; porcelana para superficies; cítrico en acentos puntuales (puntos, indicadores y CTA seleccionados), no en párrafos ni fondos extensos. Comprueba siempre contraste suficiente en texto funcional. La combinación evita los códigos de color rústicos más habituales y hace que la marca se sienta más digital, actual y reconocible.

## Tipografía para el sitio

- **Titulares editoriales:** Noto Serif Display (Medium o Semibold), para aportar carácter y lectura gastronómica.
- **Interfaz, navegación y texto:** Noto Sans (Regular/Medium/Semibold), por claridad y buen rendimiento en móvil.
- **Alternativas de sistema:** Georgia para titulares; Arial o sans-serif para interfaz.

El wordmark entregado ya está convertido a curvas; estas recomendaciones son para construir nuevas páginas, publicaciones y piezas de campaña de forma coherente.

## Voz y estilo de contenido

Hablar como una persona local que conoce la ciudad: concreto, acogedor e informado. Priorizar nombres de platos, zonas, ocasiones y datos útiles. Evitar superlativos sin respaldo («el mejor», «imperdible») y no afirmar disponibilidad, precios o verificación si no se han comprobado.

**Ejemplos de tono**
- Sí: «¿Antojo de repe? Explora dónde probarlo en Loja».
- Sí: «Cafés, huecas y platos de aquí, en una sola guía».
- Evitar: «La plataforma #1 e infalible de todo Ecuador» sin evidencia.

## Reglas rápidas de uso

- Dejar alrededor del logotipo un margen libre, como mínimo, igual al diámetro del punto central del símbolo.
- Usar el logotipo horizontal a partir de unos **260 px** de ancho; por debajo, preferir el símbolo o el logo apilado.
- No estirar, inclinar, recolorear parcialmente, agregar sombras ni cambiar la relación entre símbolo y nombre.
- Usar el logo inverso solo sobre fondos oscuros suficientemente uniformes; usar la versión principal sobre marfil o blanco.
- No colocar el logo sobre fotografías recargadas sin una placa de contraste.

## Implementación web

Copiar los archivos seleccionados al directorio público del sitio y añadir en el `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png">
```

Usar `logo-horizontal.svg` en el encabezado del sitio. Para fondos oscuros, `logo-horizontal-inverso.svg`. El ZIP adjunto contiene todos los masters y exportaciones.
