# ATSKiller — Manfred

Herramienta interna para analizar CVs contra sistemas ATS (Applicant Tracking Systems). Desarrollada como prototipo funcional para explorar cómo la IA generativa puede ayudar a candidatos a mejorar sus CVs antes de que lleguen a un proceso de selección.

## Qué hace

- **Análisis ATS completo**: sube un CV en PDF y obtén una puntuación detallada por categorías (keywords, formato, experiencia, educación, contacto, longitud)
- **Feedback accionable**: sugerencias concretas con prioridad alta/media/baja, no genéricas
- **Detección de alertas críticas**: columnas múltiples, tablas complejas, caracteres decorativos que rompen el parsing ATS
- **Comparativa de versiones**: analiza dos CVs y compara resultados lado a lado
- **Match con oferta**: pega una oferta de trabajo y calcula el encaje del CV con la posición
- **Análisis de LinkedIn**: analiza perfiles de LinkedIn con la misma lógica ATS
- **Editor de CV**: edita y exporta el CV directamente desde la herramienta
- **Multiidioma**: detecta automáticamente si el CV está en español o inglés y responde en el mismo idioma

## Stack

- **Next.js 14** (App Router) — frontend y API routes
- **Gemini** (Google AI) — motor de análisis y generación de feedback
- **pdf-parse** — extracción de texto de PDFs
- **Tailwind CSS** — estilos con sistema de diseño propio basado en la identidad de Manfred
- **Railway** — despliegue en producción

## Variables de entorno

```bash
GEMINI_API_KEY=       # Clave de Google AI Studio
AUTH_USERNAME=        # Usuario para el login
AUTH_PASSWORD=        # Contraseña para el login
AUTH_SECRET=          # Secreto para firmar la cookie de sesión
```

## Desarrollo local

```bash
npm install
npm run dev
```

La app arranca en `http://localhost:3000`.
