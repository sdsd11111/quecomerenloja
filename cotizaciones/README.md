# Cotizaciones — Qué Comer en Loja

Plantilla PDF con el branding oficial del proyecto (petróleo `#153E3E`, cítrico `#D0DB61`,
League Spartan + Plus Jakarta Sans), encabezado y pie de página repetidos en cada hoja.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `plantilla-cotizacion.html` | La plantilla editable. Duplícala por cada cotización. |
| `generar-pdf.ps1` | Convierte un HTML en PDF con Chrome/Edge (headless). |
| `salida/` | PDFs generados. |
| `assets/` | Logos y fuentes de marca (no editar). |

## Cómo crear una cotización

1. **Duplica** `plantilla-cotizacion.html` y renómbralo, por ejemplo `COT-2026-001.html`.
2. **Edita** los textos entre `[corchetes]`:
   - N.º de cotización (encabezado y pie).
   - Datos del cliente.
   - Fechas, forma de pago.
   - Filas de la tabla de servicios.
   - Condiciones y observaciones.
3. **Genera el PDF** desde la raíz del proyecto:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File ".\cotizaciones\generar-pdf.ps1" -Html "cotizaciones\COT-2026-001.html"
   ```

   El PDF queda en `cotizaciones\salida\COT-2026-001.pdf`.
   También puedes abrir el HTML en Chrome y usar **Imprimir → Guardar como PDF**
   (márgenes: ninguno, gráficos de fondo: activado).

## Ítems de la tabla

Cada fila se edita así:

```html
<tr data-cant="1" data-precio="40.00">
  <td class="mono">01</td>
  <td>
    <span class="item-nombre">Nombre del servicio</span>
    <span class="item-detalle">Descripción breve de lo que incluye.</span>
    <span class="item-etiqueta">Suscripción mensual</span>
  </td>
  <td class="cant mono">1</td>
  <td class="num mono">$ 40,00</td>
  <td class="num mono line-total">$ 40,00</td>
</tr>
```

Solo importan `data-cant` y `data-precio`: el script recalcula la cantidad, el total de
la fila, el subtotal, el IVA, el total y el **valor en letras** automáticamente.

- **Descuento:** en `<div class="totales" data-descuento="0.00" data-iva="15">`.
- **IVA:** cambia `data-iva` (15 % en Ecuador). Usa `0` si la cotización no lleva IVA.
- Para agregar filas, copia un `<tr>` completo y ajusta sus datos.

## Notas de diseño

- Formato A4, una columna, márgenes laterales de 15 mm.
- La cabecera y el pie van en `<thead>` / `<tfoot>` de una tabla: Chrome los repite
  automáticamente en todas las páginas.
- Si el contenido pasa de una página, las firmas y condiciones bajan completas
  (no se cortan a la mitad).
- Los logos usados son recortes del master de marca para que no quede espacio en blanco:
  `logo-horizontal-inverso-recorte.svg` y `simbolo-inverso.svg`.
