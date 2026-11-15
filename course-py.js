(window.COURSES = window.COURSES || []).push({
  id: 'py', color: 'py', tag: 'Programación', title: 'Python rápido y profesional',
  tagline: 'Para quien ya programa (Java): lo idiomático de Python, datos con pandas y dos proyectos publicables.',
  desc: 'Sin repetir lo que ya sabes de Java. Cada ejercicio se ejecuta con un intérprete de Python real dentro de la página. Termina con una CLI y una API con tests, la base que usarás en la ruta de IA.',
  time: '≈ 4 h + 2 proyectos',
  builds: ['Ejercicios con un intérprete de Python 3 real en el navegador', 'Análisis de la BD de F1 con pandas', '<b>gastos</b>: CLI con argparse, JSON y pytest', '<b>pitwall-api</b>: API con FastAPI + SQLite, validación con Pydantic y tests'],
  cert: 'Completa la evaluación final y publica los dos proyectos con tests en verde en GitHub. Si quieres un certificado externo, el Python Institute ofrece los exámenes PCEP (inicial) y PCAP (asociado).',
  certDone: 'Ruta completada. Siguiente paso natural: la ruta de IA, que usa todo esto.',
  sources: ['Tutorial oficial de Python (docs.python.org) y <i>Fluent Python</i> (L. Ramalho)', 'Documentación de pandas, FastAPI y pytest', 'Python Institute: exámenes PCEP y PCAP', 'Pyodide: Python compilado a WebAssembly para los ejercicios'],
  units: [
    { title: 'Python para quien ya programa', desc: 'Lo que cambia respecto a Java', lessons: [
      { id: 'py-1', title: 'Sintaxis esencial', steps: [
        { t: 'learn', k: 'Empieza aquí', h: 'Menos ceremonia, mismas ideas', body: '<pre class="code">// Java\npublic static int doble(int x) { return x * 2; }\n\n# Python\ndef doble(x):\n    return x * 2</pre><ul><li>Los bloques los marca la <b>indentación</b> (4 espacios), no las llaves.</li><li>Tipado <b>dinámico</b>: los valores tienen tipo, las variables no.</li><li><code>f"Hola {nombre}"</code> para formatear.</li></ul>' },
        { t: 'py', h: 'Tu primer programa', q: 'Imprime <code>Hola, Python 3</code> usando un f-string con las variables dadas.', start: 'lenguaje = "Python"\nversion = 3\nprint(...)', sol: 'lenguaje = "Python"\nversion = 3\nprint(f"Hola, {lenguaje} {version}")', expect: 'Hola, Python 3', why: 'Dentro de las llaves cabe cualquier expresión: <code>f"{precio:.2f} €"</code>, <code>f"{x=}"</code> para depurar.' },
        { t: 'mcq', q: '¿Qué devuelve <code>7 // 2</code> y qué <code>7 / 2</code>?', opts: ['3 y 3', '3 y 3.5', '3.5 y 3.5', '4 y 3.5'], a: 1, why: '<code>/</code> siempre da float en Python 3; <code>//</code> es división entera (hacia abajo).' },
        { t: 'py', h: 'Bucles con range', q: 'Imprime la suma de los múltiplos de 3 o 5 menores que 100.', start: 'total = 0\nfor n in range(100):\n    ...\nprint(total)', sol: 'total = 0\nfor n in range(100):\n    if n % 3 == 0 or n % 5 == 0:\n        total += n\nprint(total)', expect: '2318', why: 'En una línea: <code>sum(n for n in range(100) if n % 3 == 0 or n % 5 == 0)</code>.' },
        { t: 'mcq', q: '¿Qué valores son "falsos" en un <code>if</code>?', opts: ['Solo False', 'False, None, 0, "", [], {} y colecciones vacías', 'Solo None', 'Todo lo que no sea True'], a: 1, why: 'Idiomático: <code>if lista:</code> en vez de <code>if len(lista) &gt; 0:</code>.' }
      ] },
      { id: 'py-2', title: 'Listas, diccionarios y comprehensions', steps: [
        { t: 'learn', h: 'Las cuatro colecciones', body: '<ul><li><code>list</code> <code>[1, 2, 3]</code>: ordenada, mutable (como ArrayList).</li><li><code>tuple</code> <code>(1, 2)</code>: inmutable.</li><li><code>dict</code> <code>{"Alonso": 2}</code>: clave → valor (como HashMap, mantiene orden de inserción).</li><li><code>set</code> <code>{1, 2}</code>: sin repetidos.</li></ul><pre class="code">cuadrados = [x * x for x in range(5)]            # [0, 1, 4, 9, 16]\npares = {x for x in datos if x % 2 == 0}\nlongitud = {p: len(p) for p in ["Ana", "Bruno"]}</pre>' },
        { t: 'py', h: 'Comprehension', q: 'Imprime la lista de apellidos en <b>mayúsculas</b> de los pilotos con más de 1 victoria.', start: 'victorias = {"Alonso": 2, "Sainz": 0, "Hamilton": 3, "Kubica": 0, "Vettel": 2}\nres = [...]\nprint(res)', sol: 'victorias = {"Alonso": 2, "Sainz": 0, "Hamilton": 3, "Kubica": 0, "Vettel": 2}\nres = [p.upper() for p, v in victorias.items() if v > 1]\nprint(res)', expect: "['ALONSO', 'HAMILTON', 'VETTEL']", why: '<code>.items()</code> da pares (clave, valor) que desempaquetas en el for.' },
        { t: 'py', h: 'Contar con un diccionario', q: 'Cuenta cuántas veces aparece cada nacionalidad e imprime el diccionario.', start: 'nac = ["Spanish", "British", "Spanish", "German", "British", "Spanish"]\ncuenta = {}\nfor n in nac:\n    ...\nprint(cuenta)', sol: 'nac = ["Spanish", "British", "Spanish", "German", "British", "Spanish"]\ncuenta = {}\nfor n in nac:\n    cuenta[n] = cuenta.get(n, 0) + 1\nprint(cuenta)', expect: "{'Spanish': 3, 'British': 2, 'German': 1}", why: 'Atajo de la librería estándar: <code>from collections import Counter; Counter(nac)</code>.' },
        { t: 'mcq', q: '¿Qué da <code>[1, 2, 3, 4, 5][1:4]</code>?', opts: ['[1, 2, 3, 4]', '[2, 3, 4]', '[2, 3, 4, 5]', '[1, 4]'], a: 1, why: 'Slicing [inicio:fin) — el fin no se incluye. <code>[::-1]</code> invierte.' },
        { t: 'fill', q: 'Desempaqueta y ordena por puntos de mayor a menor:', code: 'pilotos = [("Alonso", 86), ("Hamilton", 188)]\nfor nombre, pts in sorted(pilotos, key=[[0]] p: p[1], reverse=[[1]]):\n    print(nombre, pts)', blanks: [['lambda'], ['True']], cs: true }
      ] },
      { id: 'py-3', title: 'Funciones a fondo', steps: [
        { t: 'learn', h: 'Argumentos flexibles', body: '<pre class="code">def informe(titulo, *valores, sep=", ", **opciones):\n    print(titulo, sep.join(map(str, valores)), opciones)\n\ninforme("Top", 1, 2, 3, sep=" | ", color="rojo")\n# Top 1 | 2 | 3 {\'color\': \'rojo\'}</pre><p><code>*args</code> recoge posicionales en una tupla, <code>**kwargs</code> los nombrados en un dict.</p>' },
        { t: 'py', h: 'La trampa del argumento por defecto', q: 'Ejecuta el código y observa. Luego arréglalo para que imprima <code>[1]</code> y <code>[2]</code> en dos líneas.', start: 'def añade(x, lista=[]):\n    lista.append(x)\n    return lista\n\nprint(añade(1))\nprint(añade(2))', sol: 'def añade(x, lista=None):\n    if lista is None:\n        lista = []\n    lista.append(x)\n    return lista\n\nprint(añade(1))\nprint(añade(2))', expect: '[1]\n[2]', hint: 'Usa None como valor por defecto y crea la lista dentro.', why: 'El valor por defecto se evalúa <b>una vez</b>, al definir la función. Con objetos mutables se comparte entre llamadas.' },
        { t: 'py', h: 'Funciones como valores', q: 'Escribe <code>aplicar(f, datos)</code> que devuelva la lista con f aplicada a cada elemento, e imprime <code>aplicar(lambda x: x ** 2, [1, 2, 3])</code>.', start: 'def aplicar(f, datos):\n    ...\n\nprint(aplicar(lambda x: x ** 2, [1, 2, 3]))', sol: 'def aplicar(f, datos):\n    return [f(x) for x in datos]\n\nprint(aplicar(lambda x: x ** 2, [1, 2, 3]))', expect: '[1, 4, 9]' },
        { t: 'mcq', q: '¿Qué es un <b>decorador</b> como <code>@lru_cache</code>?', opts: ['Un comentario especial', 'Una función que recibe una función y devuelve otra que la envuelve', 'Un tipo de clase', 'Una anotación de tipos'], a: 1, why: '<code>@d</code> sobre <code>def f</code> equivale a <code>f = d(f)</code>. Lo usamos en Prisma para no recargar modelos.' }
      ] },
      { id: 'py-4', title: 'Nombres, objetos y mutabilidad', steps: [
        { t: 'learn', h: 'Las variables son etiquetas', body: '<p>En Python una variable no es una caja: es un <b>nombre que apunta a un objeto</b>. Asignar no copia.</p>', w: 'trace', o: { left: 'Nombres', right: 'Objetos', code: 'a = [1, 2]\nb = a\nb.append(3)\nprint(a)\nc = a.copy()\nc.append(4)', states: [
          { line: 0, stack: [{ n: 'a', to: 'L1', hot: true }], heap: [{ id: 'L1', v: 'list [1, 2]' }], msg: 'Se crea una lista y el nombre <code>a</code> la apunta.' },
          { line: 1, stack: [{ n: 'a', to: 'L1' }, { n: 'b', to: 'L1', hot: true }], heap: [{ id: 'L1', v: 'list [1, 2]' }], msg: '<code>b = a</code> no copia: ahora hay dos nombres para el <b>mismo</b> objeto.' },
          { line: 2, stack: [{ n: 'a', to: 'L1' }, { n: 'b', to: 'L1', hot: true }], heap: [{ id: 'L1', v: 'list [1, 2, 3]' }], msg: 'Mutas el objeto a través de b…' },
          { line: 3, stack: [{ n: 'a', to: 'L1', hot: true }, { n: 'b', to: 'L1' }], heap: [{ id: 'L1', v: 'list [1, 2, 3]' }], msg: '…y a lo ve: imprime <code>[1, 2, 3]</code>. <code>a is b</code> es True.' },
          { line: 4, stack: [{ n: 'a', to: 'L1' }, { n: 'b', to: 'L1' }, { n: 'c', to: 'L2', hot: true }], heap: [{ id: 'L1', v: 'list [1, 2, 3]' }, { id: 'L2', v: 'list [1, 2, 3]' }], msg: '<code>.copy()</code> crea un objeto nuevo (copia superficial).' },
          { line: 5, stack: [{ n: 'a', to: 'L1' }, { n: 'b', to: 'L1' }, { n: 'c', to: 'L2', hot: true }], heap: [{ id: 'L1', v: 'list [1, 2, 3]' }, { id: 'L2', v: 'list [1, 2, 3, 4]' }], msg: 'c cambia sin afectar a a. Para estructuras anidadas: <code>copy.deepcopy</code>.' }] }, goal: true },
        { t: 'mcq', q: '<code>x = 5; y = x; y += 1</code>. ¿Cuánto vale x?', opts: ['6', '5', 'Error', 'None'], a: 1, why: 'Los int son <b>inmutables</b>: <code>y += 1</code> crea un objeto nuevo y mueve la etiqueta y. Con listas, <code>+=</code> sí muta.' },
        { t: 'py', h: 'Predice y comprueba', q: 'Sin ejecutar, piensa qué imprime. Luego escribe en <code>respuesta</code> la salida exacta como texto e imprímela.', start: 'm = [[0] * 2] * 2\nm[0][0] = 9\n# print(m) imprimiría…\nrespuesta = "..."\nprint(respuesta)', sol: 'respuesta = "[[9, 0], [9, 0]]"\nprint(respuesta)', expect: '[[9, 0], [9, 0]]', why: '<code>[fila] * 2</code> repite la <b>misma</b> fila dos veces. Bien hecho: <code>[[0] * 2 for _ in range(2)]</code>.' },
        { t: 'mcq', q: '¿Diferencia entre <code>==</code> e <code>is</code>?', opts: ['Ninguna', '== compara valor; is compara identidad (mismo objeto)', 'is es más rápido y equivalente', '== compara tipos'], a: 1, why: 'Usa <code>is</code> solo con <code>None</code>: <code>if x is None</code>.' }
      ] }
    ] },
    { title: 'Python idiomático', desc: 'Clases, errores, generadores, tooling', lessons: [
      { id: 'py-5', title: 'Clases y dataclasses', steps: [
        { t: 'learn', h: 'Clases sin boilerplate', body: '<pre class="code">from dataclasses import dataclass\n\n@dataclass\nclass Piloto:\n    nombre: str\n    puntos: float = 0\n\n    def suma(self, p: float) -&gt; None:\n        self.puntos += p</pre><p><code>@dataclass</code> genera <code>__init__</code>, <code>__repr__</code> y <code>__eq__</code>. <code>self</code> es explícito (el <code>this</code> de Java).</p>' },
        { t: 'py', h: 'Métodos especiales', q: 'Completa <code>__lt__</code> para que <code>sorted</code> ordene pilotos por puntos y se imprima <code>[\'Sainz\', \'Alonso\', \'Hamilton\']</code>.', start: 'from dataclasses import dataclass\n\n@dataclass\nclass Piloto:\n    nombre: str\n    puntos: float\n\n    def __lt__(self, otro):\n        ...\n\nps = [Piloto("Hamilton", 188), Piloto("Sainz", 52), Piloto("Alonso", 86)]\nprint([p.nombre for p in sorted(ps)])', sol: 'from dataclasses import dataclass\n\n@dataclass\nclass Piloto:\n    nombre: str\n    puntos: float\n\n    def __lt__(self, otro):\n        return self.puntos < otro.puntos\n\nps = [Piloto("Hamilton", 188), Piloto("Sainz", 52), Piloto("Alonso", 86)]\nprint([p.nombre for p in sorted(ps)])', expect: "['Sainz', 'Alonso', 'Hamilton']", why: 'Los "dunder" (<code>__len__</code>, <code>__iter__</code>, <code>__add__</code>…) integran tus clases con el lenguaje. También: <code>@dataclass(order=True)</code>.' },
        { t: 'mcq', q: '¿Cómo se marca un atributo como "privado" en Python?', opts: ['private', 'Por convención con guion bajo: _interno', 'Con final', 'No se puede de ninguna forma'], a: 1, why: 'Python confía en convenciones ("somos adultos"). Para controlar el acceso: <code>@property</code>.' }
      ] },
      { id: 'py-6', title: 'Errores y archivos', steps: [
        { t: 'learn', h: 'EAFP: pide perdón, no permiso', body: '<pre class="code">try:\n    edad = int(texto)\nexcept ValueError:\n    edad = 0\nelse:\n    print("ok")\nfinally:\n    print("siempre")\n\nwith open("datos.txt", encoding="utf-8") as f:   # cierra solo\n    for linea in f:\n        ...</pre>' },
        { t: 'py', h: 'Escribe y lee un archivo', q: 'Escribe tres líneas en <code>notas.txt</code> y luego imprime cuántas líneas contienen la palabra "SQL".', start: 'with open("notas.txt", "w", encoding="utf-8") as f:\n    f.write("Repasar SQL\\nEntrenar la red\\nExamen de SQL\\n")\n\nwith open("notas.txt", encoding="utf-8") as f:\n    n = ...\nprint(n)', sol: 'with open("notas.txt", "w", encoding="utf-8") as f:\n    f.write("Repasar SQL\\nEntrenar la red\\nExamen de SQL\\n")\n\nwith open("notas.txt", encoding="utf-8") as f:\n    n = sum(1 for linea in f if "SQL" in linea)\nprint(n)', expect: '2', why: 'El archivo vive en el sistema de archivos virtual de Pyodide, igual que lo haría en tu disco.' },
        { t: 'py', h: 'Lanza tus propios errores', q: 'Haz que <code>dividir(a, b)</code> lance <code>ValueError("b no puede ser 0")</code> si b es 0. El código captura el error e imprime su mensaje.', start: 'def dividir(a, b):\n    ...\n    return a / b\n\ntry:\n    dividir(1, 0)\nexcept ValueError as e:\n    print(e)', sol: 'def dividir(a, b):\n    if b == 0:\n        raise ValueError("b no puede ser 0")\n    return a / b\n\ntry:\n    dividir(1, 0)\nexcept ValueError as e:\n    print(e)', expect: 'b no puede ser 0' },
        { t: 'mcq', q: '¿Por qué <code>except Exception:</code> a secas (o <code>except:</code>) suele ser mala idea?', opts: ['Es más lento', 'Oculta errores que no esperabas, incluidos bugs reales', 'No es sintaxis válida', 'No captura nada'], a: 1 }
      ] },
      { id: 'py-7', title: 'Generadores e iteración perezosa', steps: [
        { t: 'learn', h: 'yield: producir valores bajo demanda', body: '<pre class="code">def lineas_largas(ruta, n):\n    with open(ruta) as f:\n        for linea in f:\n            if len(linea) &gt; n:\n                yield linea</pre><p>Un generador no construye la lista entera: va entregando valores. Procesa un archivo de 10 GB con memoria constante.</p>' },
        { t: 'py', h: 'Fibonacci infinito', q: 'Completa el generador y usa <code>itertools.islice</code> para imprimir los 10 primeros números de Fibonacci como lista.', start: 'from itertools import islice\n\ndef fib():\n    a, b = 0, 1\n    while True:\n        ...\n\nprint(list(islice(fib(), 10)))', sol: 'from itertools import islice\n\ndef fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nprint(list(islice(fib(), 10)))', expect: '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]', why: 'Un bucle infinito es seguro porque solo se calcula lo que se pide.' },
        { t: 'mcq', q: '¿Diferencia entre <code>[x*x for x in r]</code> y <code>(x*x for x in r)</code>?', opts: ['Ninguna', 'La primera crea la lista entera; la segunda es un generador perezoso', 'La segunda es una tupla', 'La primera es más lenta siempre'], a: 1 }
      ] },
      { id: 'py-8', title: 'Tipos, módulos, entornos y tests', steps: [
        { t: 'learn', h: 'El kit de un proyecto profesional', body: '<pre class="code">mi_proyecto/\n├─ pyproject.toml        # dependencias y metadatos\n├─ src/mi_proyecto/__init__.py\n├─ src/mi_proyecto/core.py\n└─ tests/test_core.py</pre><ul><li>Entorno aislado: <code>python -m venv .venv</code> (o <code>uv</code>, mucho más rápido).</li><li>Anotaciones de tipo + <code>mypy</code> o <code>pyright</code>: errores antes de ejecutar.</li><li>Formato y lint: <code>ruff</code>. Tests: <code>pytest</code>.</li></ul>' },
        { t: 'fill', q: 'Anota los tipos:', code: 'def media(valores: [[0]][float]) -> [[1]]:\n    return sum(valores) / len(valores)', blanks: [['list'], ['float']], cs: true, why: 'Desde Python 3.9 puedes usar <code>list[float]</code> directamente. Las anotaciones no se comprueban en ejecución: las usa mypy y tu editor.' },
        { t: 'code', h: 'Un test con pytest', file: 'tests/test_core.py', code: 'import pytest\nfrom mi_proyecto.core import media\n\ndef test_media():\n    assert media([1, 2, 3]) == 2\n\ndef test_media_vacia():\n    with pytest.raises(ZeroDivisionError):\n        media([])', after: '<p>Ejecuta <code>pytest -q</code>. Las funciones que empiezan por <code>test_</code> se descubren solas.</p>' },
        { t: 'mcq', q: '¿Para qué sirve <code>if __name__ == "__main__":</code>?', opts: ['Para declarar la clase principal', 'Para ejecutar código solo cuando el archivo se lanza directamente, no al importarlo', 'Para definir main obligatorio', 'Para tests'], a: 1 }
      ] }
    ] },
    { title: 'Datos', desc: 'NumPy y pandas', lessons: [
      { id: 'py-9', title: 'pandas con la BD de F1', steps: [
        { t: 'learn', h: 'Un DataFrame es una tabla con superpoderes', body: '<p>Todo lo que hiciste en SQL tiene equivalente en pandas:</p><pre class="code">SQL                         pandas\nWHERE year = 2017           df[df.year == 2017]\nGROUP BY team SUM(points)   df.groupby("team")["points"].sum()\nORDER BY x DESC LIMIT 3     df.nlargest(3, "x")\nJOIN … ON id                a.merge(b, on="id")</pre><div class="note">La primera vez que importas pandas aquí tarda unos segundos en descargarse.</div>' },
        { t: 'py', h: 'Agrupar como en SQL', q: 'Imprime el total de puntos por equipo, de mayor a menor, como diccionario.', start: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "piloto": ["Hamilton", "Bottas", "Vettel", "Räikkönen", "Verstappen", "Ricciardo"],\n    "equipo": ["Mercedes", "Mercedes", "Ferrari", "Ferrari", "Red Bull", "Red Bull"],\n    "puntos": [25, 18, 15, 12, 10, 8],\n})\nres = ...\nprint(res.to_dict())', sol: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "piloto": ["Hamilton", "Bottas", "Vettel", "Räikkönen", "Verstappen", "Ricciardo"],\n    "equipo": ["Mercedes", "Mercedes", "Ferrari", "Ferrari", "Red Bull", "Red Bull"],\n    "puntos": [25, 18, 15, 12, 10, 8],\n})\nres = df.groupby("equipo")["puntos"].sum().sort_values(ascending=False)\nprint(res.to_dict())', expect: "{'Mercedes': 43, 'Ferrari': 27, 'Red Bull': 18}", why: 'groupby + agregado + sort_values = GROUP BY + SUM + ORDER BY.' },
        { t: 'py', h: 'Filtrar y operar en columnas', q: 'Con NumPy, calcula la media de las velocidades mayores que 200 y imprímela redondeada a 2 decimales.', start: 'import numpy as np\nv = np.array([198.5, 205.2, 210.9, 199.1, 222.4])\nprint(round(float(...), 2))', sol: 'import numpy as np\nv = np.array([198.5, 205.2, 210.9, 199.1, 222.4])\nprint(round(float(v[v > 200].mean()), 2))', expect: '212.83', why: 'Las máscaras booleanas (<code>v[v &gt; 200]</code>) y las operaciones vectorizadas evitan bucles y son ~100× más rápidas.' },
        { t: 'mcq', q: 'Para leer la BD de F1 real en pandas usarías…', opts: ['pd.read_sql("SELECT …", conexion)', 'pd.open_db()', 'Solo CSV', 'No es posible'], a: 0, why: 'Con <code>sqlite3.connect("f1.db")</code> o SQLAlchemy para MySQL. SQL para extraer, pandas para analizar.' }
      ] }
    ] },
    { title: 'Proyectos', desc: 'Para tu GitHub', lessons: [
      { id: 'py-10', title: 'Proyecto: gastos (CLI)', proj: true, sub: 'argparse · JSON · pytest', steps: [
        { t: 'code', h: 'Una CLI útil de verdad', file: 'gastos.py', code: `import argparse
import json
from collections import defaultdict
from datetime import date
from pathlib import Path

DB = Path.home() / ".gastos.json"


def cargar(db: Path = DB) -> list[dict]:
    return json.loads(db.read_text(encoding="utf-8")) if db.exists() else []


def guardar(gastos: list[dict], db: Path = DB) -> None:
    db.write_text(json.dumps(gastos, ensure_ascii=False, indent=2), encoding="utf-8")


def resumen(gastos: list[dict]) -> dict[str, float]:
    total = defaultdict(float)
    for g in gastos:
        total[g["categoria"]] += g["importe"]
    return dict(sorted(total.items(), key=lambda kv: -kv[1]))


def main() -> None:
    p = argparse.ArgumentParser(description="Registro de gastos")
    sub = p.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("add", help="añadir un gasto")
    a.add_argument("importe", type=float)
    a.add_argument("categoria")
    a.add_argument("-n", "--nota", default="")
    sub.add_parser("resumen", help="total por categoría")
    args = p.parse_args()

    gastos = cargar()
    if args.cmd == "add":
        gastos.append({"fecha": date.today().isoformat(), "importe": args.importe,
                       "categoria": args.categoria, "nota": args.nota})
        guardar(gastos)
        print(f"Añadido: {args.importe:.2f} € en {args.categoria}")
    else:
        for cat, tot in resumen(gastos).items():
            print(f"{cat:<15}{tot:>10.2f} €")


if __name__ == "__main__":
    main()`, after: '<p>Prueba: <code>python gastos.py add 12.5 comida -n "menú"</code> y <code>python gastos.py resumen</code>.</p>', checks: ['Funciona añadir y resumir', 'Tests con pytest para <code>resumen</code> y para cargar/guardar usando <code>tmp_path</code>', 'Extra: subcomando <code>mes 2026-11</code> que filtre por mes', 'Extra: empaquetado con pyproject.toml para instalar como comando <code>gastos</code>'] },
        { t: 'mcq', q: '¿Por qué <code>cargar(db: Path = DB)</code> recibe la ruta como parámetro?', opts: ['Por estilo', 'Para poder testear con un archivo temporal sin tocar tus datos reales (inyección de dependencias)', 'Porque Path lo exige', 'Para que sea más rápido'], a: 1 }
      ] },
      { id: 'py-11', title: 'Proyecto: pitwall-api (FastAPI)', proj: true, sub: 'API + SQLite + tests', steps: [
        { t: 'code', h: 'Una API documentada sola', blocks: [
          { file: 'terminal', code: 'pip install "fastapi[standard]" pytest' },
          { file: 'main.py', code: `import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Pitwall API")
DB = "f1.db"  # la misma BD del curso de SQL


class Piloto(BaseModel):
    id: int
    nombre: str
    apellido: str
    nacionalidad: str


def consulta(sql: str, *params):
    with sqlite3.connect(DB) as con:
        con.row_factory = sqlite3.Row
        return con.execute(sql, params).fetchall()


@app.get("/pilotos", response_model=list[Piloto])
def pilotos(nacionalidad: str | None = None):
    sql = "SELECT driverId id, forename nombre, surname apellido, nationality nacionalidad FROM drivers"
    filas = consulta(sql + " WHERE nationality = ?", nacionalidad) if nacionalidad else consulta(sql)
    return [dict(f) for f in filas]


@app.get("/pilotos/{pid}/victorias")
def victorias(pid: int):
    fila = consulta("SELECT COUNT(*) n FROM results WHERE driverId = ? AND positionOrder = 1", pid)[0]
    if not consulta("SELECT 1 FROM drivers WHERE driverId = ?", pid):
        raise HTTPException(404, "Piloto no encontrado")
    return {"piloto": pid, "victorias": fila["n"]}` },
          { file: 'tests/test_api.py', code: `from fastapi.testclient import TestClient
from main import app

c = TestClient(app)

def test_filtra_por_nacionalidad():
    r = c.get("/pilotos", params={"nacionalidad": "Spanish"})
    assert r.status_code == 200
    assert {p["apellido"] for p in r.json()} >= {"Alonso", "Sainz"}

def test_404():
    assert c.get("/pilotos/9999/victorias").status_code == 404` }
        ], after: '<p>Arranca con <code>fastapi dev main.py</code> y abre <code>http://127.0.0.1:8000/docs</code>: documentación interactiva generada sola.</p>', checks: ['Los endpoints funcionan y /docs se ve', 'Tests en verde con <code>pytest</code>', 'Extra: endpoint <code>/clasificacion/{anio}</code> con la consulta GROUP BY del curso de SQL', 'Extra: desplegado (Render o Fly.io) con la URL en el README'] },
        { t: 'mcq', q: '¿Qué aporta <code>response_model=list[Piloto]</code>?', opts: ['Nada', 'Valida y filtra la respuesta con Pydantic y la documenta en OpenAPI', 'Hace la consulta SQL', 'Cachea el resultado'], a: 1 }
      ] },
      { id: 'py-12', title: 'Evaluación final', cert: true, sub: 'Validación de la ruta', steps: [
        { t: 'mcq', q: '¿Qué imprime <code>print({1, 2, 2, 3} | {3, 4})</code>?', opts: ['{1, 2, 2, 3, 3, 4}', '{1, 2, 3, 4}', '{3}', 'Error'], a: 1 },
        { t: 'py', h: 'Reto', q: 'Imprime la palabra más frecuente del texto (en minúsculas).', start: 'texto = "SQL y Python y Rust: SQL para datos, Python para IA, Rust para sistemas. SQL"\n', sol: 'from collections import Counter\nimport re\ntexto = "SQL y Python y Rust: SQL para datos, Python para IA, Rust para sistemas. SQL"\npalabras = re.findall(r"\\w+", texto.lower())\nprint(Counter(palabras).most_common(1)[0][0])', expect: '^(para|sql)$', re: true, why: 'Hay empate entre "sql" y "para" (3 cada una): cualquiera de las dos vale. <code>re.findall</code> + <code>Counter.most_common</code> resuelve el 90 % de los conteos.' },
        { t: 'mcq', q: '<code>def f(*, x): …</code> — ¿qué obliga el asterisco suelto?', opts: ['x es opcional', 'x solo se puede pasar por nombre: f(x=1)', 'x es una tupla', 'Nada'], a: 1 },
        { t: 'mcq', q: 'Tu script procesa un CSV de 20 GB y se queda sin memoria. ¿Primera solución?', opts: ['Más RAM', 'Leer por trozos/streaming (generadores o pd.read_csv(chunksize=…))', 'Convertir a JSON', 'Usar listas'], a: 1 },
        { t: 'clickline', q: '¿Qué línea tiene el bug?', code: 'def promedio(notas):\n    total = 0\n    for n in notas:\n        total += n\n        return total / len(notas)', a: 4, why: 'El <code>return</code> está dentro del bucle (indentación): sale en la primera iteración.' }
      ] }
    ] }
  ]
});
