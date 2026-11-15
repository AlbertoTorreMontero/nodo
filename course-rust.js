(window.COURSES = window.COURSES || []).push({
  id: 'rust', color: 'rust', tag: 'Sistemas · Portfolio', title: 'Rust para portfolio',
  tagline: 'Propiedad y préstamos explicados con la memoria a la vista, y cuatro proyectos que demuestran que sabes Rust.',
  desc: 'Primero el modelo mental (ownership, borrowing, lifetimes) con visualizaciones de pila y montón. Después, proyectos de portfolio con tests, CI y publicación: la prueba que de verdad convence a un entrevistador.',
  time: '≈ 5 h de lecciones + 4 proyectos',
  builds: ['<b>rgrep</b>: un grep en CLI con clap, errores con anyhow y tests', '<b>f1-api</b>: API REST con axum + sqlx sobre la BD de F1 del curso de SQL', '<b>pulse</b>: comprobador concurrente de URLs con tokio', '<b>chip8</b>: emulador CHIP-8 que corre en el navegador con WebAssembly', 'CI en GitHub Actions (fmt, clippy, test) y un crate publicado'],
  cert: 'No existe un título oficial individual de Rust: la Rust Foundation acredita a <i>formadores</i> (programa RFTT, junio 2026), no a personas. Validación real = examen final de esta ruta + 4 repos con CI en verde + un crate en crates.io. Si quieres un certificado externo, Ardan Labs ofrece un examen supervisado de Rust (100 preguntas, 90 min).',
  certDone: 'Ruta completada. Pon los 4 repos fijados en tu GitHub con README, CI y capturas. Ese conjunto vale más que cualquier diploma.',
  sources: ['<i>The Rust Programming Language</i> ("el libro") y <i>Rust by Example</i>', 'Rustlings y la pista de Rust de Exercism (práctica con feedback)', '<i>Command Line Applications in Rust</i>, tutorial de Tokio, documentación de axum y sqlx', 'Rust Foundation Trusted Training (RFTT, 2026) · examen de Rust de Ardan Labs'],
  units: [
    { title: 'El modelo mental', desc: 'Propiedad, préstamos y lifetimes', lessons: [
      { id: 'rs-1', title: 'Variables, tipos y mutabilidad', steps: [
        { t: 'learn', k: 'Empieza aquí', h: 'Rust te obliga a decir lo que quieres', body: '<p>Rust da velocidad de C++ sin recolector de basura y sin fallos de memoria. El precio: el compilador comprueba tus intenciones. Primera regla: <b>todo es inmutable por defecto</b>.</p><pre class="code">let x = 5;        // inmutable\nlet mut y = 5;    // mutable\ny += 1;\nlet z: u8 = 255;  // tipos explícitos cuando hace falta</pre><div class="note">Instala con <code>rustup</code> (rustup.rs) y crea proyectos con <code>cargo new nombre</code>.</div>' },
        { t: 'clickline', q: '¿Qué línea no compila?', code: 'fn main() {\n    let puntos = 10;\n    let mut vidas = 3;\n    vidas -= 1;\n    puntos += 5;\n    println!("{puntos} {vidas}");\n}', a: 4, why: 'error[E0384]: cannot assign twice to immutable variable `puntos`. Solución: <code>let mut puntos</code>.' },
        { t: 'mcq', q: '¿Qué pasa con <code>let n: u8 = 255; let m = n + 1;</code> en modo debug?', opts: ['m vale 256', 'Pánico por desbordamiento (overflow)', 'm vale 0 sin avisar', 'No compila nunca'], a: 1, why: 'En debug, el desbordamiento entero provoca pánico. En release se envuelve. Si lo quieres explícito: <code>wrapping_add</code>, <code>checked_add</code>, <code>saturating_add</code>.' },
        { t: 'fill', q: 'Shadowing: redeclara <code>texto</code> como número.', code: 'let texto = "42";\n[[0]] texto: i32 = texto.parse().unwrap();', blanks: [['let']], why: 'Con <code>let</code> creas una variable nueva con el mismo nombre (incluso de otro tipo). No es mutabilidad.' },
        { t: 'mcq', q: 'En Rust, <code>if</code> es una expresión. ¿Qué vale <code>let a = if 3 &gt; 2 { "sí" } else { "no" };</code>?', opts: ['"sí"', '"no"', 'No compila', '()'], a: 0, why: 'Casi todo es una expresión: bloques, if, match. La última expresión sin <code>;</code> es el valor.' }
      ] },
      { id: 'rs-2', title: 'Ownership: cada valor tiene un dueño', steps: [
        { t: 'learn', h: 'Tres reglas', body: '<ol><li>Cada valor tiene un único <b>dueño</b>.</li><li>Cuando el dueño sale de ámbito, el valor se libera (<code>drop</code>).</li><li>Asignar o pasar a una función <b>mueve</b> la propiedad (salvo tipos <code>Copy</code> como enteros).</li></ol><p>Avanza línea a línea y mira la memoria:</p>', w: 'trace', o: { code: 'let s1 = String::from("hola");\nlet s2 = s1;\nprintln!("{}", s1);', states: [
          { line: 0, stack: [{ n: 's1', v: 'ptr · len 4 · cap 4', to: 'h1', hot: true }], heap: [{ id: 'h1', v: '"hola"' }], msg: '<code>String</code> guarda en la pila un puntero, la longitud y la capacidad. Las letras viven en el montón.' },
          { line: 1, stack: [{ n: 's1', v: 'movido', dead: true }, { n: 's2', v: 'ptr · len 4 · cap 4', to: 'h1', hot: true }], heap: [{ id: 'h1', v: '"hola"' }], msg: 'Se copian los 3 campos de la pila, <b>no</b> el texto. Para evitar liberar dos veces la misma memoria, Rust invalida <code>s1</code>.' },
          { line: 2, stack: [{ n: 's1', v: 'movido', dead: true }, { n: 's2', v: 'ptr · len 4 · cap 4', to: 'h1' }], heap: [{ id: 'h1', v: '"hola"' }], err: true, msg: 'error[E0382]: borrow of moved value: `s1`. El compilador lo detecta antes de ejecutar nada.' }] }, goal: true, goalWhy: 'Un move es barato (copia 24 bytes) y seguro (un solo dueño libera).' },
        { t: 'mcq', q: '¿Cómo arreglas el error si de verdad necesitas dos copias del texto?', opts: ['let s2 = s1.clone();', 'let s2 = *s1;', 'let s2 = s1.copy();', 'No se puede'], a: 0, why: '<code>clone()</code> copia también los datos del montón. Es explícito porque cuesta: Rust no hace copias caras a escondidas.' },
        { t: 'mcq', q: 'Con <code>let a = 5; let b = a;</code> ¿sigue siendo válido <code>a</code>?', opts: ['No, se ha movido', 'Sí: i32 es Copy, se copia entero en la pila', 'Solo si es mut', 'Depende del sistema operativo'], a: 1, why: 'Enteros, floats, bool, char y tuplas de tipos Copy se copian; String, Vec y Box se mueven.' },
        { t: 'clickline', q: '¿Dónde está el error?', code: 'fn saluda(nombre: String) {\n    println!("Hola, {nombre}");\n}\n\nfn main() {\n    let n = String::from("Alberto");\n    saluda(n);\n    saluda(n);\n}', a: 7, why: 'La primera llamada mueve <code>n</code> dentro de <code>saluda</code>, que lo libera al terminar. Solución idiomática: <code>fn saluda(nombre: &amp;str)</code> y llamar con <code>saluda(&amp;n)</code>.' }
      ] },
      { id: 'rs-3', title: 'Borrowing: prestar sin regalar', steps: [
        { t: 'learn', h: 'Muchos lectores o un escritor', body: '<p>Una referencia <code>&amp;T</code> presta acceso sin mover. La regla del borrow checker: en cada momento puedes tener <b>muchas referencias compartidas</b> (<code>&amp;T</code>) <b>o una exclusiva</b> (<code>&amp;mut T</code>), nunca ambas.</p>', w: 'trace', o: { code: 'let mut v = vec![1, 2, 3];\nlet r = &v;\nprintln!("{}", r[0]);\nlet m = &mut v;\nm.push(4);\nprintln!("{:?}", v);', states: [
          { line: 0, stack: [{ n: 'v', v: 'ptr · len 3', to: 'h', hot: true }], heap: [{ id: 'h', v: '[1, 2, 3]' }], msg: 'v es dueño del vector.' },
          { line: 1, stack: [{ n: 'v', v: 'ptr · len 3', to: 'h' }, { n: 'r', v: '&v', to: 'v', hot: true }], heap: [{ id: 'h', v: '[1, 2, 3]' }], msg: 'r es un préstamo compartido: solo lectura.' },
          { line: 2, stack: [{ n: 'v', v: 'ptr · len 3', to: 'h' }, { n: 'r', v: '&v', to: 'v' }], heap: [{ id: 'h', v: '[1, 2, 3]' }], msg: 'Último uso de r. Gracias a los <b>non-lexical lifetimes</b>, el préstamo termina aquí, no al final del bloque.' },
          { line: 3, stack: [{ n: 'v', v: 'ptr · len 3', to: 'h' }, { n: 'r', v: 'préstamo terminado', dead: true }, { n: 'm', v: '&mut v', to: 'v', hot: true }], heap: [{ id: 'h', v: '[1, 2, 3]' }], msg: 'Ya no hay lectores vivos, así que se permite un préstamo exclusivo.' },
          { line: 4, stack: [{ n: 'v', v: 'ptr · len 4', to: 'h' }, { n: 'm', v: '&mut v', to: 'v', hot: true }], heap: [{ id: 'h', v: '[1, 2, 3, 4]' }], msg: 'push puede reubicar el vector en el montón. Si r siguiera vivo apuntaría a memoria liberada: eso es justo lo que Rust impide.' },
          { line: 5, stack: [{ n: 'v', v: 'ptr · len 4', to: 'h', hot: true }, { n: 'm', v: 'préstamo terminado', dead: true }], heap: [{ id: 'h', v: '[1, 2, 3, 4]' }], msg: 'Compila. Si movieras la línea 3 (println de r) debajo de m.push, obtendrías error[E0502].' }] }, goal: true },
        { t: 'clickline', q: '¿Qué línea produce <code>error[E0502]: cannot borrow `v` as mutable because it is also borrowed as immutable</code>?', code: 'let mut v = vec![10, 20, 30];\nlet primero = &v[0];\nv.push(40);\nprintln!("{primero}");', a: 2, why: '<code>primero</code> sigue vivo (se usa en la línea 4) cuando <code>push</code> pide un préstamo exclusivo.' },
        { t: 'fill', q: 'Haz que la función modifique el vector sin quedarse con él:', code: 'fn duplicar(v: [[0]] Vec<i32>) {\n    for x in v.iter_mut() { *x *= 2; }\n}\nlet mut datos = vec![1, 2, 3];\nduplicar([[1]] datos);', blanks: [['&mut'], ['&mut']], cs: true, why: 'Tanto la firma como la llamada indican el préstamo mutable: se ve en el código quién puede cambiar qué.' },
        { t: 'mcq', q: '¿Qué problema clásico de C/C++ eliminan estas reglas en tiempo de compilación?', opts: ['Bucles infinitos', 'Data races y punteros colgantes (use-after-free)', 'Errores lógicos', 'Código lento'], a: 1 }
      ] },
      { id: 'rs-4', title: 'Lifetimes sin miedo', steps: [
        { t: 'learn', h: 'Un lifetime es una promesa sobre cuánto vive una referencia', body: '<p>Casi siempre se infieren. Solo tienes que escribirlos cuando una función devuelve una referencia y el compilador no sabe de cuál de las entradas sale.</p><pre class="code">fn mas_larga&lt;\'a&gt;(x: &amp;\'a str, y: &amp;\'a str) -&gt; &amp;\'a str {\n    if x.len() &gt;= y.len() { x } else { y }\n}</pre><p>Se lee: "el resultado vive como mucho lo que viva la más corta de las dos entradas".</p>' },
        { t: 'mcq', q: '¿Por qué no compila esto?<pre class="code">fn crea() -&gt; &amp;String {\n    let s = String::from("hola");\n    &amp;s\n}</pre>', opts: ['Falta mut', 'Devuelve una referencia a s, que se libera al terminar la función (referencia colgante)', 'String no admite referencias', 'Falta un lifetime y con él compilaría'], a: 1, why: 'Ningún lifetime lo arregla: devuelve el <code>String</code> por valor (<code>-&gt; String</code>) y mueves la propiedad al llamador.' },
        { t: 'fill', q: 'Una struct que guarda una referencia necesita lifetime:', code: 'struct Extracto<[[0]]> {\n    parte: &[[1]] str,\n}', blanks: [["'a"], ["'a"]], cs: true, why: 'Garantiza que el Extracto no sobreviva al texto del que toma la referencia.' },
        { t: 'mcq', q: '¿Qué significa <code>&amp;\'static str</code>?', opts: ['Un texto que no se puede leer', 'Una referencia válida durante todo el programa, como los literales de texto', 'Una variable global mutable', 'Un texto en el montón'], a: 1 }
      ] }
    ] },
    { title: 'Modelar con tipos', desc: 'structs, enums, errores, traits, iteradores', lessons: [
      { id: 'rs-5', title: 'Structs, enums y match', steps: [
        { t: 'learn', h: 'Los enums de Rust llevan datos', body: '<pre class="code">enum Comando {\n    Mover { x: i32, y: i32 },\n    Escribir(String),\n    Salir,\n}\n\nfn ejecutar(c: Comando) {\n    match c {\n        Comando::Mover { x, y } =&gt; println!("a {x},{y}"),\n        Comando::Escribir(t) =&gt; println!("{t}"),\n        Comando::Salir =&gt; std::process::exit(0),\n    }\n}</pre><p>Modela estados posibles de forma que los imposibles no se puedan escribir.</p>' },
        { t: 'mcq', q: 'Añades la variante <code>Comando::Saltar</code> y no tocas el <code>match</code>. ¿Qué pasa?', opts: ['Se ignora en tiempo de ejecución', 'Error de compilación: match no exhaustivo', 'Pánico al ejecutarse', 'Un warning sin más'], a: 1, why: 'La exhaustividad es una red de seguridad enorme al refactorizar.' },
        { t: 'order', q: 'Ordena una struct con un método constructor y otro de instancia:', lines: ['struct Jugador { nombre: String, vida: u32 }', 'impl Jugador {', '    fn nuevo(nombre: &str) -> Self {', '        Self { nombre: nombre.to_string(), vida: 100 }', '    }', '    fn herir(&mut self, d: u32) { self.vida = self.vida.saturating_sub(d); }', '}'], why: '<code>fn nuevo</code> no recibe <code>self</code> (función asociada: <code>Jugador::nuevo("Ki")</code>); <code>herir</code> pide <code>&amp;mut self</code> porque cambia el estado.' },
        { t: 'fill', q: 'Desestructura con <code>if let</code> cuando solo te interesa un caso:', code: '[[0]] Comando::Escribir(texto) = cmd {\n    println!("{texto}");\n}', blanks: [['if let']], why: 'if let = match de un solo brazo.' }
      ] },
      { id: 'rs-6', title: 'Option, Result y el operador ?', steps: [
        { t: 'learn', h: 'No hay null ni excepciones', body: '<p><code>Option&lt;T&gt;</code> = <code>Some(T)</code> o <code>None</code>. <code>Result&lt;T, E&gt;</code> = <code>Ok(T)</code> o <code>Err(E)</code>. El tipo te obliga a manejar el caso malo.</p><pre class="code">fn leer_config(ruta: &amp;str) -&gt; Result&lt;u16, Box&lt;dyn std::error::Error&gt;&gt; {\n    let texto = std::fs::read_to_string(ruta)?;   // si falla, devuelve el Err\n    let puerto: u16 = texto.trim().parse()?;\n    Ok(puerto)\n}</pre>' },
        { t: 'fill', q: 'Propaga el error con el operador adecuado:', code: 'fn edad(s: &str) -> Result<u8, std::num::ParseIntError> {\n    let n: u8 = s.parse()[[0]];\n    Ok(n)\n}', blanks: [['?']], why: '<code>?</code> desenvuelve el Ok o hace <code>return Err(e.into())</code>.' },
        { t: 'mcq', q: '¿Cuándo es aceptable <code>.unwrap()</code>?', opts: ['Siempre, es más corto', 'En prototipos, tests o cuando un fallo es un bug imposible (mejor <code>.expect("motivo")</code>)', 'Nunca, no compila', 'Solo con Option'], a: 1, why: 'En código de librería o servidores, propaga con <code>?</code>. En apps, <code>anyhow</code>; en librerías, errores propios con <code>thiserror</code>.' },
        { t: 'mcq', q: '<code>vec![3, 8].iter().find(|&amp;&amp;x| x &gt; 5)</code> devuelve…', opts: ['8', 'Some(&amp;8)', 'Ok(8)', 'true'], a: 1, why: 'find devuelve Option con una referencia al elemento encontrado.' },
        { t: 'clickline', q: 'Esta función no compila. ¿Qué línea?', code: 'fn main() {\n    let n: i32 = "12".parse()?;\n    println!("{n}");\n}', a: 1, why: '<code>?</code> solo se puede usar en funciones que devuelven Result u Option. Arreglo: <code>fn main() -&gt; Result&lt;(), Box&lt;dyn Error&gt;&gt;</code> y <code>Ok(())</code> al final.' }
      ] },
      { id: 'rs-7', title: 'Traits y genéricos', steps: [
        { t: 'learn', h: 'Un trait es un contrato de comportamiento', body: '<pre class="code">trait Describir {\n    fn describir(&amp;self) -&gt; String;\n}\n\nimpl Describir for Jugador {\n    fn describir(&amp;self) -&gt; String { format!("{} ({} PV)", self.nombre, self.vida) }\n}\n\nfn imprimir&lt;T: Describir&gt;(x: &amp;T) { println!("{}", x.describir()); }</pre><p>Los genéricos se <b>monomorfizan</b>: el compilador genera una versión por tipo, sin coste en ejecución.</p>' },
        { t: 'fill', q: 'Implementa <code>Display</code> para poder usar <code>{}</code>:', code: 'use std::fmt;\nimpl fmt::[[0]] for Jugador {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        [[1]]!(f, "{} ({})", self.nombre, self.vida)\n    }\n}', blanks: [['Display'], ['write']], cs: true },
        { t: 'mcq', q: 'Quieres un <code>Vec</code> con enemigos de tipos distintos que implementan <code>Describir</code>. Usas…', opts: ['Vec&lt;Describir&gt;', 'Vec&lt;Box&lt;dyn Describir&gt;&gt;', 'Vec&lt;impl Describir&gt;', 'No se puede'], a: 1, why: '<code>dyn</code> = despacho dinámico (vtable). Genéricos/<code>impl Trait</code> = estático, un solo tipo concreto.' },
        { t: 'mcq', q: '¿Qué hace <code>#[derive(Debug, Clone, PartialEq)]</code>?', opts: ['Hereda de una clase', 'Genera automáticamente implementaciones de esos traits', 'Importa librerías', 'Activa optimizaciones'], a: 1 }
      ] },
      { id: 'rs-8', title: 'Iteradores y closures', steps: [
        { t: 'learn', h: 'Cadenas perezosas y tan rápidas como un for', body: '<pre class="code">let pilotos = vec![("Alonso", 2), ("Sainz", 0), ("Hamilton", 3)];\nlet ganadores: Vec&lt;&amp;str&gt; = pilotos.iter()\n    .filter(|(_, v)| *v &gt; 0)\n    .map(|(n, _)| *n)\n    .collect();</pre><p>Nada se ejecuta hasta <code>collect</code>, <code>sum</code>, <code>for</code>… (son <b>perezosos</b>). El compilador los optimiza como un bucle escrito a mano.</p>' },
        { t: 'mcq', q: '¿Qué imprime?<pre class="code">let s: i32 = (1..=4).map(|x| x * x).filter(|x| x % 2 == 0).sum();\nprintln!("{s}");</pre>', opts: ['30', '20', '4', '10'], a: 1, why: 'Cuadrados 1, 4, 9, 16 → pares 4 y 16 → 20.' },
        { t: 'fill', q: 'Cuenta palabras de más de 3 letras:', code: 'let n = texto.split_whitespace()\n    .[[0]](|p| p.len() > 3)\n    .[[1]]();', blanks: [['filter'], ['count']], cs: true },
        { t: 'mcq', q: 'Diferencia entre <code>iter()</code>, <code>iter_mut()</code> e <code>into_iter()</code> sobre un Vec:', opts: ['Ninguna', '&amp;T, &amp;mut T y T (consume el vector)', 'Velocidad', 'Orden de recorrido'], a: 1 },
        { t: 'mcq', q: 'Una closure que modifica una variable capturada implementa…', opts: ['Fn', 'FnMut', 'FnOnce siempre', 'Ninguna'], a: 1, why: 'Fn: solo lee. FnMut: modifica lo capturado. FnOnce: consume lo capturado (solo se puede llamar una vez).' }
      ] }
    ] },
    { title: 'Proyectos de portfolio', desc: 'Lo que enseñarás en una entrevista', lessons: [
      { id: 'rs-9', title: 'Proyecto 1: rgrep (CLI)', proj: true, sub: 'clap · anyhow · tests', steps: [
        { t: 'code', h: 'Tu primer binario serio', blocks: [
          { text: '<p>Un grep minimalista. Enseña: parseo de argumentos, lectura de archivos, errores con contexto, lifetimes en la función de búsqueda y tests.</p>', file: 'terminal', code: 'cargo new rgrep && cd rgrep\ncargo add clap --features derive\ncargo add anyhow' },
          { file: 'src/main.rs', code: `use anyhow::{Context, Result};
use clap::Parser;
use std::{fs, path::PathBuf};

/// Busca un patrón en un archivo, como grep
#[derive(Parser)]
#[command(version, about)]
struct Args {
    /// Texto a buscar
    pattern: String,
    /// Archivo donde buscar
    path: PathBuf,
    /// Ignorar mayúsculas y minúsculas
    #[arg(short, long)]
    ignore_case: bool,
}

fn main() -> Result<()> {
    let args = Args::parse();
    let content = fs::read_to_string(&args.path)
        .with_context(|| format!("no se pudo leer {}", args.path.display()))?;
    for (n, line) in search(&args.pattern, &content, args.ignore_case) {
        println!("{n}: {line}");
    }
    Ok(())
}

pub fn search<'a>(pattern: &str, text: &'a str, ignore_case: bool) -> Vec<(usize, &'a str)> {
    let pat = if ignore_case { pattern.to_lowercase() } else { pattern.to_string() };
    text.lines()
        .enumerate()
        .filter(|(_, l)| if ignore_case { l.to_lowercase().contains(&pat) } else { l.contains(&pat) })
        .map(|(i, l)| (i + 1, l))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn distingue_mayusculas() {
        let t = "Rust es rápido\\nPython es cómodo\\nrust es seguro";
        assert_eq!(search("Rust", t, false), vec![(1, "Rust es rápido")]);
    }

    #[test]
    fn ignora_mayusculas() {
        let t = "Rust es rápido\\nPython es cómodo\\nrust es seguro";
        assert_eq!(search("RUST", t, true).len(), 2);
    }
}` }
        ], after: '<p>Prueba: <code>cargo run -- Rust README.md -i</code> y <code>cargo test</code>.</p>', checks: ['Compila, los 2 tests pasan', 'Extra 1: búsqueda recursiva en carpetas con el crate <code>walkdir</code>', 'Extra 2: soporte de expresiones regulares con <code>regex</code> y resaltado en color', 'Extra 3: medir con <code>hyperfine</code> contra <code>grep</code> y poner la tabla en el README'] },
        { t: 'mcq', q: '¿Por qué <code>search</code> necesita <code>\'a</code> en <code>text</code> y en el resultado?', opts: ['Por estilo', 'Devuelve trozos (&amp;str) del texto de entrada: el resultado no puede vivir más que text', 'Porque pattern es String', 'Lo exige clap'], a: 1, why: 'Fíjate en que <code>pattern</code> no lleva <code>\'a</code>: el resultado no toma nada prestado de él.' }
      ] },
      { id: 'rs-10', title: 'Proyecto 2: f1-api (axum + sqlx)', proj: true, sub: 'API REST con tu BD de F1', steps: [
        { t: 'code', h: 'Una API real sobre datos reales', blocks: [
          { text: '<p>Reutiliza la base de datos del curso de SQL. Crea <code>f1.db</code> con el script de abajo: <code>sqlite3 f1.db &lt; f1.sql</code>.</p>', file: 'terminal', code: 'cargo new f1-api && cd f1-api\ncargo add axum@0.7\ncargo add tokio --features full\ncargo add serde --features derive\ncargo add sqlx@0.8 --features runtime-tokio,sqlite' },
          { file: 'f1.sql (BD del curso)', code: (window.F1_SQL || '').trim() },
          { file: 'src/main.rs', code: `use axum::{extract::{Path, State}, http::StatusCode, routing::get, Json, Router};
use serde::Serialize;
use sqlx::{sqlite::SqlitePoolOptions, FromRow, SqlitePool};

#[derive(Serialize, FromRow)]
struct Driver {
    driver_id: i64,
    forename: String,
    surname: String,
    nationality: String,
}

const SELECT_DRIVER: &str =
    "SELECT driverId AS driver_id, forename, surname, nationality FROM drivers";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pool = SqlitePoolOptions::new().connect("sqlite://f1.db").await?;
    let app = Router::new()
        .route("/drivers", get(list_drivers))
        .route("/drivers/:id", get(get_driver))
        .with_state(pool);
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await?;
    println!("Escuchando en http://127.0.0.1:3000");
    axum::serve(listener, app).await?;
    Ok(())
}

async fn list_drivers(State(pool): State<SqlitePool>) -> Result<Json<Vec<Driver>>, StatusCode> {
    sqlx::query_as::<_, Driver>(&format!("{SELECT_DRIVER} ORDER BY surname"))
        .fetch_all(&pool)
        .await
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn get_driver(
    State(pool): State<SqlitePool>,
    Path(id): Path<i64>,
) -> Result<Json<Driver>, StatusCode> {
    sqlx::query_as::<_, Driver>(&format!("{SELECT_DRIVER} WHERE driverId = ?"))
        .bind(id)
        .fetch_optional(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}` }
        ], after: '<p>Prueba <code>curl localhost:3000/drivers/1</code>. Con axum 0.8 la ruta se escribe <code>/drivers/{id}</code>.</p>', checks: ['/drivers y /drivers/:id funcionan; un id inexistente da 404', 'Añadido <code>/standings/:year</code> con la consulta de puntos por piloto (GROUP BY) del curso de SQL', 'Tests de integración con <code>tower::ServiceExt::oneshot</code>', 'Dockerfile multi-stage y despliegue (Fly.io o Shuttle) con URL en el README'] },
        { t: 'mcq', q: '¿Por qué <code>.bind(id)</code> en lugar de meter el id en el texto con <code>format!</code>?', opts: ['Es más corto', 'Evita inyección SQL: el valor viaja separado de la consulta', 'Es obligatorio en SQLite', 'Para que sea async'], a: 1, why: 'El <code>format!</code> de arriba solo concatena SQL fijo escrito por ti, nunca datos del usuario.' },
        { t: 'mcq', q: '¿Qué aporta <code>State(pool)</code>?', opts: ['Crea una conexión por petición', 'Comparte el pool de conexiones entre todos los handlers (es barato de clonar)', 'Guarda sesiones de usuario', 'Nada'], a: 1 }
      ] },
      { id: 'rs-11', title: 'Concurrencia sin miedo', steps: [
        { t: 'learn', h: 'Send, Sync, Arc y Mutex', body: '<pre class="code">use std::sync::{Arc, Mutex};\nuse std::thread;\n\nlet contador = Arc::new(Mutex::new(0));\nlet mut hilos = vec![];\nfor _ in 0..8 {\n    let c = Arc::clone(&amp;contador);\n    hilos.push(thread::spawn(move || {\n        *c.lock().unwrap() += 1;\n    }));\n}\nfor h in hilos { h.join().unwrap(); }\nprintln!("{}", *contador.lock().unwrap()); // 8</pre><ul><li><b>Arc</b>: varios dueños entre hilos (conteo atómico).</li><li><b>Mutex</b>: un solo hilo modifica a la vez.</li><li>El compilador rechaza compartir <code>Rc</code> o <code>RefCell</code> entre hilos: no son <code>Send</code>/<code>Sync</code>.</li></ul>' },
        { t: 'mcq', q: 'Usas <code>Rc&lt;Mutex&lt;i32&gt;&gt;</code> en lugar de <code>Arc</code> con <code>thread::spawn</code>. ¿Qué pasa?', opts: ['Funciona más rápido', 'No compila: Rc no es Send', 'Data race en ejecución', 'Funciona igual'], a: 1, why: 'El famoso "fearless concurrency": la data race se convierte en un error de compilación.' },
        { t: 'fill', q: 'Comunicar hilos con un canal:', code: 'let (tx, rx) = std::sync::mpsc::[[0]]();\nstd::thread::spawn([[1]] || tx.send("hecho").unwrap());\nprintln!("{}", rx.recv().unwrap());', blanks: [['channel'], ['move']], cs: true, why: '<code>move</code> transfiere <code>tx</code> al hilo.' },
        { t: 'mcq', q: 'Para miles de conexiones de red que esperan E/S, ¿qué escala mejor?', opts: ['Un hilo del sistema por conexión', 'async/await con un runtime como Tokio', 'Un solo hilo bloqueante', 'Procesos separados'], a: 1 }
      ] },
      { id: 'rs-12', title: 'Proyecto 3: pulse (tokio)', proj: true, sub: 'Concurrencia asíncrona', steps: [
        { t: 'code', h: 'Comprueba 100 URLs a la vez', blocks: [
          { file: 'terminal', code: 'cargo new pulse && cd pulse\ncargo add tokio --features full\ncargo add reqwest@0.12 --no-default-features --features rustls-tls\ncargo add futures' },
          { file: 'src/main.rs', code: `use futures::stream::{self, StreamExt};
use std::time::{Duration, Instant};

#[tokio::main]
async fn main() {
    let urls: Vec<String> = std::env::args().skip(1).collect();
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(5))
        .build()
        .expect("cliente HTTP");

    let results = stream::iter(urls)
        .map(|url| {
            let client = client.clone();
            async move {
                let t = Instant::now();
                let res = client.get(&url).send().await;
                (url, res.map(|r| r.status()), t.elapsed())
            }
        })
        .buffer_unordered(8) // como mucho 8 peticiones simultáneas
        .collect::<Vec<_>>()
        .await;

    for (url, status, dt) in results {
        match status {
            Ok(s) => println!("{:>4} {:>6} ms  {url}", s.as_u16(), dt.as_millis()),
            Err(e) => println!(" ERR {:>6} ms  {url}  ({e})", dt.as_millis()),
        }
    }
}` }
        ], after: '<p>Prueba: <code>cargo run -- https://www.rust-lang.org https://crates.io https://no-existe.invalid</code></p>', checks: ['Funciona con 3 URLs y muestra errores sin hacer pánico', 'Lee las URLs de un archivo y acepta <code>--concurrency N</code> con clap', 'Benchmark: 100 URLs con concurrencia 1 frente a 16, resultados en el README', 'Modo vigilancia: repetir cada 30 s con <code>tokio::time::interval</code>'] },
        { t: 'mcq', q: '¿Qué controla <code>buffer_unordered(8)</code>?', opts: ['El tamaño de cada respuesta', 'Cuántos futuros se ejecutan a la vez; los resultados llegan en orden de finalización', 'El número de hilos del sistema', 'El timeout'], a: 1 }
      ] },
      { id: 'rs-13', title: 'Proyecto 4: emulador CHIP-8 en WASM', proj: true, sub: 'El proyecto que destaca', steps: [
        { t: 'learn', h: 'Por qué este proyecto', body: '<p>Un emulador demuestra lo que piden en sistemas: bits, memoria, tipos bien modelados, tests y rendimiento. CHIP-8 tiene solo 35 instrucciones, pantalla de 64×32 y cabe en un fin de semana largo. Compilado a WebAssembly, cualquiera lo prueba desde tu portfolio.</p><pre class="code">struct Chip8 {\n    mem: [u8; 4096],\n    v: [u8; 16],        // registros V0..VF\n    i: u16, pc: u16,\n    stack: Vec&lt;u16&gt;,\n    pantalla: [bool; 64 * 32],\n    teclas: [bool; 16],\n    delay: u8, sonido: u8,\n}</pre>' },
        { t: 'fill', q: 'Decodificar un opcode de 2 bytes leído en <code>pc</code>:', code: 'let op = (self.mem[pc] as u16) [[0]] 8 | self.mem[pc + 1] as u16;\nlet x = ((op & 0x0F00) >> 8) as usize;\nlet nn = (op & [[1]]) as u8;', blanks: [['<<'], ['0x00FF', '0xFF', '0x00ff', '0xff']], cs: true, why: 'Desplazas el byte alto y haces OR con el bajo; luego extraes los "nibbles" con máscaras.' },
        { t: 'code', h: 'Hitos', body: '<p>Sigue la especificación de Cowgod\'s Chip-8 Technical Reference.</p>', checks: ['Núcleo: fetch–decode–execute con <code>match</code> sobre nibbles, tests por instrucción', 'Pasa una ROM de test (p. ej. la suite de Timendus)', 'Frontend nativo con <code>minifb</code> o <code>macroquad</code>', 'Compilado con <code>wasm-pack</code> y jugable en una página de GitHub Pages enlazada en tu README'] },
        { t: 'mcq', q: 'La instrucción <code>8XY4</code> suma VY a VX y pone VF = 1 si hay acarreo. ¿Qué método de u8 lo hace limpio?', opts: ['wrapping_add', 'overflowing_add (devuelve resultado y bool de acarreo)', 'checked_add', 'saturating_add'], a: 1 }
      ] }
    ] },
    { title: 'Validación', desc: 'Calidad profesional y examen', lessons: [
      { id: 'rs-14', title: 'Calidad profesional: tests, clippy y CI', proj: true, sub: 'Para los 4 repos', steps: [
        { t: 'code', h: 'El listón de un repo serio', blocks: [
          { file: 'terminal', code: 'cargo fmt                               # formato estándar\ncargo clippy --all-targets -- -D warnings  # linter: cero warnings\ncargo test                              # unit + integración + doctests\ncargo doc --open                        # documentación desde /// comentarios' },
          { file: '.github/workflows/ci.yml', code: `name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: clippy, rustfmt
      - run: cargo fmt --check
      - run: cargo clippy --all-targets -- -D warnings
      - run: cargo test` }
        ], checks: ['CI en verde en los 4 proyectos (badge en el README)', 'Al menos un doctest en una función pública', 'He publicado un crate pequeño en crates.io (por ejemplo, el núcleo de rgrep o de chip8 como librería)', 'He resuelto 20 ejercicios de la pista de Rust de Exercism con revisión de mentor'] },
        { t: 'mcq', q: '¿Dónde van los tests de integración en un proyecto Cargo?', opts: ['En src/tests.rs', 'En la carpeta tests/ en la raíz; cada archivo es un crate que usa tu API pública', 'En Cargo.toml', 'No existen en Rust'], a: 1 }
      ] },
      { id: 'rs-15', title: 'Examen final de Rust', cert: true, sub: 'Validación de la ruta', steps: [
        { t: 'mcq', q: '¿Qué imprime?<pre class="code">let mut v = vec![1, 2, 3];\nfor x in &amp;mut v { *x += 10; }\nprintln!("{:?}", v);</pre>', opts: ['[1, 2, 3]', '[11, 12, 13]', 'No compila', '[10, 10, 10]'], a: 1 },
        { t: 'clickline', q: '¿Qué línea no compila?', code: 'let s = String::from("hola");\nlet t = &s;\nlet u = s;\nprintln!("{t}");', a: 2, why: 'No puedes mover <code>s</code> mientras el préstamo <code>t</code> sigue vivo (se usa en la línea 4).' },
        { t: 'mcq', q: 'Necesitas varios dueños de un nodo de un grafo en <b>un solo hilo</b> y poder mutarlo:', opts: ['Box&lt;T&gt;', 'Rc&lt;RefCell&lt;T&gt;&gt;', 'Arc&lt;Mutex&lt;T&gt;&gt;', '&amp;mut T'], a: 1, why: 'Rc = varios dueños (un hilo); RefCell = mutabilidad interior comprobada en ejecución. En multihilo: Arc&lt;Mutex&lt;T&gt;&gt;.' },
        { t: 'mcq', q: '¿Cuál es el tipo de <code>"hola"</code>?', opts: ['String', '&amp;\'static str', 'char[]', 'Box&lt;str&gt;'], a: 1 },
        { t: 'mcq', q: 'Para errores en una <b>librería</b> que otros usarán:', opts: ['anyhow::Error', 'Un enum de error propio (p. ej. con thiserror)', 'panic!', 'String'], a: 1, why: 'Los usuarios de tu librería necesitan poder hacer match sobre las causas. anyhow es para aplicaciones.' },
        { t: 'mcq', q: '<code>fn f(x: impl Iterator&lt;Item = u32&gt;)</code> es azúcar sintáctico de…', opts: ['Despacho dinámico', 'Un genérico con trait bound: fn f&lt;I: Iterator&lt;Item = u32&gt;&gt;(x: I)', 'Una macro', 'Un Box'], a: 1 },
        { t: 'mcq', q: '¿Qué garantiza un bloque <code>unsafe</code>?', opts: ['Que el código es inseguro y fallará', 'Nada automáticamente: tú prometes mantener las invariantes que el compilador no puede comprobar (punteros crudos, FFI…)', 'Que se desactiva el borrow checker en todo el archivo', 'Mayor velocidad'], a: 1, why: 'El borrow checker sigue activo dentro de unsafe; solo se habilitan 5 superpoderes concretos.' },
        { t: 'mcq', q: 'Un <code>async fn</code> que nunca se <code>.await</code>a…', opts: ['Se ejecuta en segundo plano', 'No hace nada: los futuros son perezosos', 'Lanza un hilo', 'Da pánico'], a: 1 }
      ] }
    ] }
  ]
});
