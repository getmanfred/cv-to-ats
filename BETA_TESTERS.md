# ATSKiller Beta — Guía para testers

> Gracias por participar en la beta. Tu opinión es lo más valioso que nos puedes dar ahora mismo.

---

## Qué es esto

**ATSKiller** analiza CVs contra los sistemas ATS (Applicant Tracking Systems) que usan las empresas de selección, y da feedback concreto para mejorarlos antes de que lleguen a un proceso de selección.

Estamos en fase de pruebas privada. El objetivo de esta beta es encontrar errores, flujos confusos y cosas que no funcionan como deberían antes de abrirlo al público.

---

## Acceso

| | |
|---|---|
| **URL** | cv-to-ats-production.up.railway.app |
| **Usuario** | `admin` |
| **Contraseña** | *(la que te han compartido)* |

> Tu CV y tus datos no se comparten con otros usuarios ni se almacenan en ningún servidor. El historial de análisis queda únicamente en tu propio navegador.

---

## Qué puedes probar

### 1. Analizar CV *(flujo principal)*

Sube tu CV en PDF y recibe una puntuación ATS desglosada por categorías: keywords, formato, experiencia, educación, contacto y longitud. Incluye sugerencias concretas con prioridad alta / media / baja, y alertas si hay algo que puede romper el parsing automático.

**Qué observar:**
- ¿La puntuación refleja la realidad de tu CV?
- ¿Las sugerencias son específicas o demasiado genéricas?
- ¿Falta alguna categoría importante que no se evalúa?

---

### 2. Match con oferta

Pega el texto de una oferta de trabajo y sube (o usa tu último CV analizado). La herramienta calcula el encaje entre tu perfil y la posición.

**Qué observar:**
- ¿El resultado tiene sentido para esa oferta concreta?
- ¿Detecta bien las keywords clave de la oferta?

---

### 3. Analizar LinkedIn

Pega el texto de tu perfil de LinkedIn para analizarlo con la misma lógica ATS.

**Qué observar:**
- ¿Es fácil entender qué texto hay que pegar y cómo obtenerlo?
- ¿El análisis es coherente con el del CV?

---

### 4. Editor de CV

Edita tu CV directamente en la herramienta y expórtalo. Prueba a modificar secciones y descarga el resultado.

**Qué observar:**
- ¿Es usable el editor o resulta confuso?
- ¿La exportación sale bien formateada?

---

### 5. Comparar versiones

Analiza dos versiones de un CV (original vs. mejorado, por ejemplo) y compara los resultados lado a lado.

**Qué observar:**
- ¿La comparativa es clara y útil?
- ¿Se entiende qué ha mejorado y qué no?

---

## Cómo dar feedback

Hay un botón **"Feedback"** fijo en la esquina inferior izquierda de la pantalla, visible en todo momento. Úsalo cada vez que encuentres algo — no hace falta acumular todo para el final.

Puedes reportar cuatro tipos:

| Tipo | Cuándo usarlo |
|---|---|
| **Error / Bug** | Algo que no funciona o da error |
| **Sugerencia** | Algo que mejorarías en cómo funciona |
| **Idea** | Algo nuevo que añadirías |
| **Otro** | Cualquier cosa que no encaje en lo anterior |

El nombre y el email son opcionales, pero si los dejas es más fácil hacer seguimiento y preguntarte más detalles si es necesario.

---

## Qué nos ayuda especialmente

- Pruébalo con **tu CV real**, no con uno inventado
- Si algo te parece raro, confuso o incorrecto, repórtalo aunque no estés seguro de si es un error
- Pruébalo también desde el **móvil**
- Si el análisis dice algo que claramente está mal (puntuación que no tiene sentido, sugerencia absurda), cuéntanoslo con detalle en el feedback

---

*Herramienta desarrollada por Manfred · Beta privada · Abril 2026*
