# 🌉 Bridge API — Activación de Trials por WhatsApp

Guía para que el **bot externo** active pruebas gratuitas en *Qué Comer en Loja*.

---

## ¿Qué hace este puente?

Cuando el bot externo califica a un restaurante para una prueba gratuita, llama a **un solo endpoint**. El sistema entonces:

1. Registra al restaurante como aliado **trial de 7 días**
2. Le envía un **mensaje de bienvenida por WhatsApp** con instrucciones exactas
3. El restaurante ya puede publicar su menú o cena navideña **de forma autónoma**
4. Al vencer los 7 días, el bot les avisa y los bloquea suavemente hasta que contraten

---

## Endpoint

```
POST https://www.quecomerenloja.com/api/bridge/activar-trial
```

### Headers requeridos

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |
| `x-bridge-key` | `qcel-bridge-2026-XkP9mRzLvW4qNjT` |

### Body JSON

```json
{
  "nombre": "Restaurante Don Pepe",
  "telefono": "0991234567",
  "tipo": "MENU",
  "ubicacion": "Loja, Ecuador",
  "descripcion": "Restaurante de comida típica lojana"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre` | string | ✅ | Nombre del restaurante (mínimo 2 caracteres) |
| `telefono` | string | ✅ | Formato `09XXXXXXXX` o `593XXXXXXXXX` |
| `tipo` | string | ❌ | `"MENU"` (default) o `"CENA_NAVIDENA"` |
| `ubicacion` | string | ❌ | Sector en Loja. Default: `"Loja, Ecuador"` |
| `descripcion` | string | ❌ | Descripción corta del negocio |

### Respuesta exitosa

```json
{
  "success": true,
  "aliadoId": 42,
  "telefono": "593991234567",
  "trial": true,
  "expiraEn": "2026-11-25",
  "whatsappEnviado": true,
  "mensaje": "Trial activado y bienvenida enviada por WhatsApp ✅"
}
```

### Respuesta si ya existía

```json
{
  "success": true,
  "aliadoId": 15,
  "trial": false,
  "yaExistia": true,
  "mensaje": "Aliado ya registrado. Bienvenida de recordatorio enviada por WhatsApp."
}
```

---

## Consultar estado de un número

```
GET https://www.quecomerenloja.com/api/bridge/activar-trial?telefono=0991234567
```

Header: `x-bridge-key: qcel-bridge-2026-XkP9mRzLvW4qNjT`

```json
{
  "activo": true,
  "aliadoId": 42,
  "nombre": "Restaurante Don Pepe",
  "trial": true,
  "expiraEn": "2026-11-25",
  "tipoSugerido": "MENU"
}
```

---

## Ejemplo de integración (cURL)

```bash
curl -X POST https://www.quecomerenloja.com/api/bridge/activar-trial \
  -H "Content-Type: application/json" \
  -H "x-bridge-key: qcel-bridge-2026-XkP9mRzLvW4qNjT" \
  -d '{
    "nombre": "El Rincón Lojano",
    "telefono": "0987654321",
    "tipo": "MENU"
  }'
```

## Ejemplo en Python (para el bot externo)

```python
import requests

BRIDGE_URL = "https://www.quecomerenloja.com/api/bridge/activar-trial"
BRIDGE_KEY = "qcel-bridge-2026-XkP9mRzLvW4qNjT"

def activar_trial(nombre: str, telefono: str, tipo: str = "MENU") -> dict:
    resp = requests.post(
        BRIDGE_URL,
        json={"nombre": nombre, "telefono": telefono, "tipo": tipo},
        headers={"x-bridge-key": BRIDGE_KEY},
        timeout=10
    )
    return resp.json()

# Uso
resultado = activar_trial("El Rincón Lojano", "0987654321", "MENU")
print(resultado)
# → {'success': True, 'aliadoId': 42, 'trial': True, 'expiraEn': '2026-11-25', ...}
```

---

## Flujo completo para el restaurante (lo que reciben por WA)

Cuando el bot activa el trial, el restaurante recibe en WhatsApp:

> 🎉 **¡Hola El Rincón Lojano!**
>
> Te damos la bienvenida a tu **prueba gratuita de 7 días** en **Qué Comer en Loja** 🍽️
>
> Ya estás activado. Así de simple es publicar:
>
> 🍽️ **Para tu Menú del Día:**  
> Escribe: `MENU:` y describe los platos del día.
>
> _Ejemplo: MENU: Sopa de pollo, arroz, menestra, jugo y postre. Precio $3.50_
>
> 📸 O simplemente **envía una foto** de tu afiche/pizarrón y lo publicamos directo.
>
> Te mostraré un borrador antes de publicar. Solo escribe **SI** para confirmar. ✅

---

## Número de WhatsApp del bot (para publicaciones)

El restaurante debe escribir a: **el mismo número del bot de Evolution API**

> `EVOLUTION_INSTANCE: "que comer loja"` → el número configurado en la instancia

---

## Qué pasa al vencer el trial

El bot responde automáticamente cuando el restaurante intenta publicar tras los 7 días:

> _"Tu período de prueba ha terminado. ¿Te gustó el servicio? Escríbenos para activar tu cuenta completa..."_

El admin puede convertir un trial en cuenta real desde `/admin/aliados` desactivando el flag `trial`.
