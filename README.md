# Nodo · aprende haciendo

App de aprendizaje interactiva al estilo Brilliant con cuatro rutas:

- **SQL de verdad** (14 lecciones): consultas reales ejecutadas en el navegador (sql.js) sobre la BD de F1 de los ejercicios de la asignatura de Bases de Datos, transacciones, índices y triggers.
- **IA de cero a multimodal** (16): neurona, descenso de gradiente, redes, CNN, embeddings, atención, audio y el proyecto **Prisma** (imagen + audio + texto).
- **Rust para portfolio** (15): ownership y borrowing visualizados y 4 proyectos (rgrep, f1-api, pulse, chip8).
- **Python rápido y profesional** (12): ejercicios con Python real (Pyodide), pandas, CLI y API con FastAPI.

Pensada sobre todo para móvil: instalable como app (PWA), funciona sin conexión tras la primera visita, barra de atajos para escribir SQL/Python en el teclado del móvil.

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
| `widgets.js` | Bloques interactivos (neurona, gradiente, convolución, atención, memoria Rust/Python, transacciones, índices…) |
| `data-db.js` | Bases de datos de práctica (F1 y Películas) |
| `course-*.js` | Contenido de cada ruta |
| `sw.js`, `manifest.webmanifest` | PWA y modo offline |
