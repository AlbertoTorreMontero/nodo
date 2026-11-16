# Nodo · aprende haciendo

App de aprendizaje interactiva al estilo Brilliant, organizada como **build-your-own-x**: cada ruta construye su propia tecnología desde cero. Las lecciones son explicaciones explorables: poco texto, una pregunta para predecir antes de ver, figuras que se tocan y una sección final "Construye tu propia X" que se ejecuta en la propia página.

- **Construye tu propia base de datos** (SQL, 9 lecciones): máquina de consultas por etapas sobre la BD de F1, y en JavaScript tu propio LIKE, nested loop y hash join, GROUP BY con Map, búsqueda de índice y log de deshacer. Termina con el reto del boletín.
- **Construye tu propia IA** (14): neurona, red XOR, micrograd, convolución, BPE, atención y Fourier en Python puro (Pyodide); después el proyecto **Prisma** (imagen + audio + texto) con Hugging Face y Gradio.
- **Construye tu propio Redis en Rust** (11): ownership y borrowing visualizados; proyectos rgrep, mini-redis (tokio, protocolo RESP, SET/GET con caducidad) y emulador CHIP-8. Código compilado y con tests.
- **Construye tu propio lenguaje en Python** (11): lexer, AST con dataclasses, parser recursivo descendente, errores e intérprete con variables; pandas y FastAPI.

Pensada para móvil: instalable (PWA), funciona sin conexión tras la primera visita y tiene barra de atajos para escribir código.

## Ejecutar en local

Es una web estática sin build:

```bash
python -m http.server 8000
# abre http://localhost:8000
```

## Despliegue

Render (Static Site) con `render.yaml`: publish directory `.`, sin build command.

## Estructura

| Archivo | Qué hace |
|---|---|
| `index.html` | Estilos y carga de scripts |
| `app.js` | Motor de lecciones, corrección, progreso (localStorage), router |
| `explore.js` | Reproductor de lecciones explorables y figuras (máquina de consultas, laboratorios JS/Python, neurona…) |
| `widgets.js` | Figuras visuales (gradiente, convolución, atención, memoria Rust/Python, transacciones, índices…) |
| `code-library.js` | Código de proyectos y ejercicios (todo probado) |
| `data-db.js` | Bases de datos de práctica (F1 y Películas) |
| `course-*.js` | Contenido de cada ruta |
| `sw.js`, `manifest.webmanifest` | PWA y modo offline |
