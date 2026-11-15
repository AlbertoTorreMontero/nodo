(window.COURSES = window.COURSES || []).push({
  id: 'ia', color: 'ia', tag: 'Inteligencia artificial', title: 'IA de cero a multimodal',
  tagline: 'Entiende cómo aprende una red y construye "Prisma", una IA que analiza imagen, audio y texto.',
  desc: 'Ruta rápida: intuición visual primero, después PyTorch y, a partir de la mitad, un proyecto que crece contigo hasta ser una app multimodal desplegada en internet.',
  time: '≈ 6 h de lecciones + proyecto',
  builds: ['Una neurona y una red entrenadas a mano (sin librerías)', 'Un clasificador de dígitos en PyTorch (&gt; 97 %)', 'Un clasificador de tus propias fotos con transfer learning', '<b>Prisma</b>: describe imágenes, transcribe y clasifica audio, analiza texto y comprueba si todo encaja; con interfaz Gradio publicada en Hugging Face Spaces'],
  cert: 'Supera la evaluación final y publica Prisma en un Space público: esa URL es tu prueba de portfolio.',
  certDone: 'Ruta completada. Enlaza tu Space de Prisma en GitHub y LinkedIn y escribe un README con capturas y métricas.',
  sources: ['fast.ai, <i>Practical Deep Learning for Coders</i> (enfoque "de arriba abajo")', 'Andrej Karpathy, <i>Neural Networks: Zero to Hero</i> (micrograd, makemore)', 'Curso de Hugging Face (LLM y Audio) y documentación de <code>transformers</code>', '3Blue1Brown, serie de redes neuronales · <i>Dive into Deep Learning</i> (d2l.ai)', 'Radford et al., 2021 — CLIP · documentación de Sentence-Transformers'],
  units: [
    { title: 'Intuición', desc: 'Sin código: aprender = ajustar números', lessons: [
      { id: 'ia-1', title: 'Aprender es ajustar una función', steps: [
        { t: 'learn', k: 'Empieza aquí', h: 'Toda IA es una función con perillas', body: '<p>Un modelo recibe una entrada (píxeles, sonido, palabras) y devuelve una salida. Dentro tiene <b>parámetros</b>: números que ajustamos hasta que acierta.</p><p>El caso más simple: una recta <code>ŷ = w·x + b</code>. Prueba a entrenarla tú.</p>', w: 'neuron', goal: true, goalWhy: 'Has minimizado el error medio cuadrático (MSE). Entrenar es hacer esto mismo, pero automático y con millones de perillas.' },
        { t: 'mcq', q: 'En la actividad, ¿qué medía el <b>MSE</b>?', opts: ['La pendiente de la recta', 'La media de los errores al cuadrado entre predicción y realidad', 'Cuántos puntos hay', 'La velocidad de entrenamiento'], a: 1, why: 'La función de pérdida resume "cuánto te equivocas" en un solo número. Entrenar = hacerla pequeña.' },
        { t: 'mcq', q: 'Tu modelo acierta el 99 % con los datos de entrenamiento y el 60 % con datos nuevos. ¿Qué pasa?', opts: ['Le faltan datos de test', 'Sobreajuste: ha memorizado en vez de generalizar', 'Subajuste', 'Está perfecto'], a: 1, why: 'Por eso siempre separas datos de <b>entrenamiento</b>, <b>validación</b> y <b>test</b>.' },
        { t: 'mcq', q: 'Clasificar fotos de gatos y perros es un problema de…', opts: ['Regresión', 'Clasificación supervisada', 'Clustering no supervisado', 'Aprendizaje por refuerzo'], a: 1, why: 'Supervisado: tienes ejemplos con su etiqueta. Clasificación: la salida es una categoría, no un número continuo.' }
      ] },
      { id: 'ia-2', title: 'Descenso de gradiente', steps: [
        { t: 'learn', h: 'Bajar la montaña a ciegas', body: '<p>Con millones de parámetros no puedes mover deslizadores a mano. El truco: calcular la <b>pendiente</b> (gradiente) de la pérdida y dar un pasito cuesta abajo.</p><pre class="code">w = w - η · ∂pérdida/∂w</pre><p><code>η</code> es la <b>tasa de aprendizaje</b>.</p>', w: 'gd', goal: true, goalWhy: 'Has encontrado un buen η. Prueba también 1,6 para ver cómo diverge.' },
        { t: 'fill', q: 'Completa la regla de actualización:', code: 'w = w [[0]] lr * grad', blanks: [['-']], why: 'Restas porque el gradiente apunta cuesta <i>arriba</i>.' },
        { t: 'py', h: 'Hazlo en Python', q: 'Minimiza <code>f(w) = (w − 3)²</code>. Su derivada es <code>2·(w − 3)</code>. Haz 100 pasos con <code>lr = 0.1</code> desde <code>w = 0</code> e imprime <code>round(w, 3)</code>.', start: 'w = 0.0\nlr = 0.1\nfor paso in range(100):\n    grad = ...\n    w = ...\nprint(round(w, 3))', sol: 'w = 0.0\nlr = 0.1\nfor paso in range(100):\n    grad = 2 * (w - 3)\n    w = w - lr * grad\nprint(round(w, 3))', expect: '3.0', why: 'Esto es literalmente lo que hace <code>optimizer.step()</code> en PyTorch, para cada parámetro.' },
        { t: 'mcq', q: 'Con una tasa de aprendizaje <b>demasiado grande</b>…', opts: ['Converge más rápido siempre', 'Puede rebotar de lado a lado y divergir', 'El modelo tiene más parámetros', 'No cambia nada'], a: 1, why: 'Por eso existen los schedulers y optimizadores como Adam que adaptan el paso.' },
        { t: 'mcq', h: 'Backpropagation', q: '¿Qué hace la <b>retropropagación</b>?', opts: ['Inicializa los pesos', 'Calcula eficientemente el gradiente de la pérdida respecto a cada peso usando la regla de la cadena', 'Elige la arquitectura', 'Mezcla los datos'], a: 1, why: 'Recorre la red hacia atrás multiplicando derivadas locales. PyTorch lo hace solo con <code>loss.backward()</code>.' }
      ] },
      { id: 'ia-3', title: 'Redes neuronales', steps: [
        { t: 'learn', h: 'Una neurona = suma ponderada + activación', body: '<pre class="code">salida = activación(w₁·x₁ + w₂·x₂ + b)</pre><p>Sin la función de activación (ReLU, tanh, sigmoide), apilar capas no sirve de nada: todo seguiría siendo una recta.</p>', w: 'classify', goal: true, goalWhy: 'Con 0 neuronas ocultas el XOR es imposible. Con 3–4 lo resuelve. Esa es la razón de ser del deep learning.' },
        { t: 'py', h: 'Una neurona a mano', q: 'Calcula la salida de una neurona con entradas <code>[0.5, -1.0, 2.0]</code>, pesos <code>[0.4, 0.3, 0.1]</code>, sesgo <code>0.1</code> y sigmoide. Imprime <code>round(salida, 4)</code>.', start: 'import math\nx = [0.5, -1.0, 2.0]\nw = [0.4, 0.3, 0.1]\nb = 0.1\nz = ...\nsalida = 1 / (1 + math.exp(-z))\nprint(round(salida, 4))', sol: 'import math\nx = [0.5, -1.0, 2.0]\nw = [0.4, 0.3, 0.1]\nb = 0.1\nz = sum(xi * wi for xi, wi in zip(x, w)) + b\nsalida = 1 / (1 + math.exp(-z))\nprint(round(salida, 4))', expect: '0.5498', why: 'z = 0.2 − 0.3 + 0.2 + 0.1 = 0.2 → σ(0.2) ≈ 0.5498.' },
        { t: 'mcq', q: '¿Por qué la ReLU (<code>max(0, x)</code>) es la activación por defecto en capas ocultas?', opts: ['Es lineal', 'Es barata y su gradiente no se desvanece para x &gt; 0', 'Siempre da probabilidades', 'Evita el sobreajuste'], a: 1, why: 'Sigmoide y tanh se saturan y su gradiente tiende a 0 en redes profundas.' },
        { t: 'mcq', q: 'Para la capa de salida de un clasificador de 10 clases, usas…', opts: ['ReLU', 'Softmax (convierte 10 números en probabilidades que suman 1)', 'Ninguna', 'tanh'], a: 1, why: 'En PyTorch, <code>nn.CrossEntropyLoss</code> ya incluye el softmax: la red devuelve logits.' }
      ] }
    ] },
    { title: 'PyTorch esencial', desc: 'Tensores, autograd y bucle de entrenamiento', lessons: [
      { id: 'ia-4', title: 'Tensores y autograd', steps: [
        { t: 'learn', h: 'Un tensor es un array con superpoderes', body: '<p>Un tensor es como un array de NumPy que puede vivir en la GPU y recordar cómo se calculó para obtener gradientes.</p><ul><li>Imagen RGB: <code>[3, 224, 224]</code> · lote de 32: <code>[32, 3, 224, 224]</code></li><li>Audio 1 s a 16 kHz: <code>[16000]</code></li><li>Frase tokenizada: <code>[n_tokens]</code> → embeddings <code>[n_tokens, 768]</code></li></ul>', code: 'import torch\nx = torch.tensor(2.0, requires_grad=True)\ny = x**2 + 3*x       # y = 10\ny.backward()         # dy/dx = 2x + 3\nprint(x.grad)        # tensor(7.)', file: 'autograd.py' },
        { t: 'mcq', q: 'Un lote de 16 espectrogramas de 1 canal, 128 bandas mel y 300 frames tiene forma…', opts: ['[128, 300]', '[16, 1, 128, 300]', '[16, 300]', '[1, 16, 128]'], a: 1, why: 'Convención de PyTorch: [lote, canales, alto, ancho]. ¡Un espectrograma se trata como una imagen!' },
        { t: 'fill', q: 'Calcula el gradiente de la pérdida:', code: 'w = torch.randn(3, requires_grad=[[0]])\nloss = ((x @ w - y) ** 2).mean()\nloss.[[1]]()\nprint(w.[[2]])', blanks: [['True'], ['backward'], ['grad']], cs: true, why: 'requires_grad=True le dice a PyTorch que registre las operaciones para luego derivar.' },
        { t: 'py', h: 'Gradiente numérico', q: 'Comprueba la derivada sin cálculo: aproxima <code>f\'(2)</code> de <code>f(x) = x² + 3x</code> con <code>(f(x+h) − f(x−h)) / (2h)</code>, <code>h = 1e-5</code>. Imprime <code>round(d, 3)</code>.', start: 'def f(x):\n    return x**2 + 3*x\nh = 1e-5\nd = ...\nprint(round(d, 3))', sol: 'def f(x):\n    return x**2 + 3*x\nh = 1e-5\nd = (f(2 + h) - f(2 - h)) / (2 * h)\nprint(round(d, 3))', expect: '7.0', why: 'Mismo 7 que autograd. Así se testea a mano que una implementación de backprop es correcta (gradient checking).' }
      ] },
      { id: 'ia-5', title: 'Tu primera red: dígitos MNIST', proj: true, sub: 'Mini-proyecto', steps: [
        { t: 'order', h: 'El bucle de entrenamiento', q: 'Ordena un paso de entrenamiento en PyTorch:', lines: ['for x, y in loader:', '    optimizer.zero_grad()', '    logits = model(x)', '    loss = loss_fn(logits, y)', '    loss.backward()', '    optimizer.step()'], why: 'zero_grad primero: PyTorch <b>acumula</b> gradientes. Olvidarlo es el bug más común.' },
        { t: 'code', h: 'El script completo', body: '<p>Ábrelo en <b>Google Colab</b> (GPU gratis) o en tu portátil con <code>pip install torch torchvision</code>.</p>', file: 'mnist.py', code: `import torch, torch.nn as nn
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

tf = transforms.ToTensor()
train = DataLoader(datasets.MNIST("data", train=True, download=True, transform=tf), batch_size=64, shuffle=True)
test = DataLoader(datasets.MNIST("data", train=False, download=True, transform=tf), batch_size=256)

model = nn.Sequential(
    nn.Flatten(),                 # [B,1,28,28] -> [B,784]
    nn.Linear(784, 128), nn.ReLU(),
    nn.Linear(128, 10)            # logits de 10 clases
)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

for epoch in range(3):
    model.train()
    for x, y in train:
        opt.zero_grad()
        loss = loss_fn(model(x), y)
        loss.backward()
        opt.step()
    model.eval(); ok = 0
    with torch.no_grad():
        for x, y in test:
            ok += (model(x).argmax(1) == y).sum().item()
    print(f"época {epoch}: acierto {ok / len(test.dataset):.3f}")

torch.save(model.state_dict(), "mnist.pt")`, checks: ['Lo he ejecutado y supera el 97 % de acierto en test', 'He cambiado 128 por 32 neuronas y anotado cómo cambia el acierto', 'He subido el notebook a mi GitHub (carpeta <code>ia-ruta/</code>)'] },
        { t: 'mcq', q: '¿Para qué sirve <code>with torch.no_grad():</code> al evaluar?', opts: ['Para que la red aprenda más rápido', 'Para no guardar el grafo de gradientes: menos memoria y más velocidad', 'Para congelar la red para siempre', 'Es obligatorio para usar argmax'], a: 1 },
        { t: 'mcq', q: '¿Qué hace <code>model.eval()</code>?', opts: ['Calcula el acierto', 'Cambia capas como Dropout y BatchNorm a modo inferencia', 'Borra los gradientes', 'Guarda el modelo'], a: 1, why: 'Y <code>model.train()</code> las devuelve a modo entrenamiento.' }
      ] }
    ] },
    { title: 'Visión', desc: 'Convoluciones y transfer learning', lessons: [
      { id: 'ia-6', title: 'Convoluciones: cómo "ve" una red', steps: [
        { t: 'learn', h: 'Un filtro que se desliza', body: '<p>Una capa convolucional pasa pequeños filtros (3×3) por toda la imagen. Cada filtro detecta un patrón: bordes, texturas… y en capas profundas, ojos o ruedas. La red <b>aprende</b> los números de los filtros.</p>', w: 'conv', after: '<div class="note">Dibuja una línea vertical y cambia entre "Bordes verticales" y "Bordes horizontales": uno se enciende, el otro casi no.</div>' },
        { t: 'mcq', q: 'Ventaja clave de la convolución frente a una capa densa sobre píxeles:', opts: ['Usa más parámetros', 'Comparte los mismos pesos en toda la imagen: detecta un patrón esté donde esté', 'No necesita entrenamiento', 'Solo funciona en blanco y negro'], a: 1, why: 'Una densa sobre 224×224×3 necesitaría 150.000 pesos <i>por neurona</i>.' },
        { t: 'mcq', q: 'Un <b>MaxPool 2×2</b> sobre un mapa 32×32 da…', opts: ['64×64', '16×16', '32×32', '30×30'], a: 1, why: 'Reduce resolución quedándose con el máximo de cada bloque: más campo de visión por neurona y menos cómputo.' },
        { t: 'fill', q: 'Primera capa para imágenes RGB con 16 filtros 3×3:', code: 'nn.Conv2d(in_channels=[[0]], out_channels=[[1]], kernel_size=[[2]], padding=1)', blanks: [['3'], ['16'], ['3']], why: 'padding=1 mantiene el tamaño espacial con kernel 3.' }
      ] },
      { id: 'ia-7', title: 'Transfer learning con tus fotos', proj: true, sub: 'Mini-proyecto', steps: [
        { t: 'learn', h: 'No empieces de cero', body: '<p>Un modelo como ResNet ya aprendió a ver con 1,2 millones de imágenes (ImageNet). Reutilizas todo y solo cambias la última capa para tus clases. Es la idea central de fast.ai: resultados buenos con pocas imágenes y minutos de GPU.</p>' },
        { t: 'code', file: 'finetune.py', body: '<p>Crea <code>datos/train/&lt;clase&gt;/*.jpg</code> y <code>datos/val/&lt;clase&gt;/*.jpg</code> con 2–4 clases tuyas (por ejemplo, sprites de tu pixel art por personaje) y unas 30 fotos por clase.</p>', code: `import torch, torch.nn as nn
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader

weights = models.ResNet18_Weights.DEFAULT
tf = weights.transforms()                       # mismo preprocesado que en el preentrenamiento
train = datasets.ImageFolder("datos/train", tf)
val = datasets.ImageFolder("datos/val", tf)
dl, dv = DataLoader(train, 16, shuffle=True), DataLoader(val, 32)

model = models.resnet18(weights=weights)
for p in model.parameters():
    p.requires_grad = False                     # congelamos el "cuerpo"
model.fc = nn.Linear(model.fc.in_features, len(train.classes))  # cabeza nueva

dev = "cuda" if torch.cuda.is_available() else "cpu"
model.to(dev)
opt = torch.optim.Adam(model.fc.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

for epoch in range(5):
    model.train()
    for x, y in dl:
        x, y = x.to(dev), y.to(dev)
        opt.zero_grad(); loss_fn(model(x), y).backward(); opt.step()
    model.eval(); ok = 0
    with torch.no_grad():
        for x, y in dv:
            ok += (model(x.to(dev)).argmax(1).cpu() == y).sum().item()
    print(epoch, ok / len(val))

torch.save({"state": model.state_dict(), "classes": train.classes}, "mi_clasificador.pt")`, checks: ['He creado mi dataset con al menos 2 clases', 'Supera el 85 % en validación', 'He probado a descongelar todo con lr=1e-4 dos épocas más (fine-tuning completo)'] },
        { t: 'mcq', q: '¿Por qué congelar el cuerpo al principio?', opts: ['Para que el modelo pese menos en disco', 'Con pocos datos, entrenar todo destruiría lo aprendido y sobreajustaría; la cabeza nueva aprende primero', 'Porque ResNet no se puede entrenar', 'Para usar menos clases'], a: 1 }
      ] }
    ] },
    { title: 'Lenguaje', desc: 'Tokens, embeddings y atención', lessons: [
      { id: 'ia-8', title: 'Tokens y embeddings', steps: [
        { t: 'learn', h: 'El texto se convierte en números', body: '<p>Un modelo de lenguaje no ve letras: trocea el texto en <b>tokens</b> (palabras o trozos de palabras) y cada uno tiene un número.</p>', w: 'tokens', after: '<p>Escribe palabras inventadas o muy largas: se parten en más trozos. Por eso los modelos cobran y limitan por tokens, no por palabras.</p>' },
        { t: 'learn', h: 'Cada token es un punto en el espacio', body: '<p>Después, cada token se convierte en un <b>vector</b> (embedding). Palabras con significado parecido acaban cerca, y las relaciones se vuelven direcciones.</p>', w: 'embed', goal: true, goalWhy: 'Este mapa es 2D por claridad; los reales tienen cientos o miles de dimensiones.' },
        { t: 'mcq', q: '¿Cómo se mide normalmente la similitud entre dos embeddings?', opts: ['Contando letras iguales', 'Similitud coseno (ángulo entre vectores)', 'Comparando el id del token', 'Por orden alfabético'], a: 1, why: 'Es la base de los buscadores semánticos y del RAG.' },
        { t: 'mcq', q: 'Un buscador semántico encuentra "coche barato" al buscar "auto económico" porque…', opts: ['Usa un diccionario de sinónimos escrito a mano', 'Sus embeddings están cerca en el espacio vectorial', 'Busca por letras', 'Es casualidad'], a: 1 }
      ] },
      { id: 'ia-9', title: 'Atención y transformers', steps: [
        { t: 'learn', h: 'Cada palabra mira a las demás', body: '<p>La <b>autoatención</b> deja que cada token reparta su "atención" entre todos los demás para construir su significado en contexto.</p>', w: 'attention', goal: true, goalWhy: 'Esos pesos se aprenden. Un transformer apila decenas de capas así, con varias "cabezas" en paralelo.' },
        { t: 'fill', q: 'La fórmula de la atención (Vaswani et al., 2017):', code: 'Atención(Q, K, V) = [[0]]( Q·Kᵀ / √d ) · [[1]]', blanks: [['softmax'], ['V']], why: 'Q·Kᵀ puntúa cuánto encaja cada consulta con cada clave; softmax lo vuelve pesos; con ellos se mezclan los valores V.' },
        { t: 'learn', h: 'Generar = predecir el siguiente token', body: '<p>Un LLM devuelve una probabilidad para cada token posible y se elige uno. La <b>temperatura</b> controla cuánto se arriesga.</p>', w: 'temperature' },
        { t: 'mcq', q: 'Para extraer datos de una factura sin inventar nada, ¿qué temperatura?', opts: ['Alta (≈ 1,5)', 'Baja (≈ 0–0,2)', 'Da igual', 'Negativa'], a: 1, why: 'Baja = casi determinista. Alta = más variado y creativo, pero más propenso a desvaríos.' },
        { t: 'mcq', q: '¿Qué tipo de transformer es GPT?', opts: ['Solo codificador (como BERT)', 'Solo decodificador, autoregresivo', 'Codificador-decodificador (como T5 o Whisper)', 'Una CNN'], a: 1, why: 'BERT entiende (clasificar, embeddings), GPT genera, Whisper traduce audio→texto con codificador-decodificador.' }
      ] }
    ] },
    { title: 'Audio', desc: 'Ondas, espectrogramas y Whisper', lessons: [
      { id: 'ia-10', title: 'Del sonido al espectrograma', steps: [
        { t: 'learn', h: 'El audio es una lista de números', body: '<p>Un micrófono mide la presión del aire miles de veces por segundo (16.000 en voz = 16 kHz). Esa onda es difícil de leer; su <b>espectro</b>, en cambio, muestra qué frecuencias suenan.</p>', w: 'wave', goal: true, goalWhy: 'Los modelos de audio convierten la onda en un espectrograma mel y lo procesan como una imagen o una secuencia.' },
        { t: 'mcq', q: 'Whisper espera audio a 16 kHz. Tu archivo está a 44,1 kHz. ¿Qué haces?', opts: ['Nada, da igual', 'Remuestrear a 16 kHz (librosa.load(..., sr=16000))', 'Recortarlo', 'Convertirlo a imagen JPG'], a: 1, why: 'Si no, el modelo "oye" la voz más lenta y grave y transcribe peor.' },
        { t: 'mcq', q: '¿Por qué la escala <b>mel</b>?', opts: ['Es más bonita', 'Imita el oído: distinguimos mejor tonos graves que agudos, así que comprime las altas frecuencias', 'Es obligatoria en WAV', 'Reduce el volumen'], a: 1 },
        { t: 'mcq', q: 'Quieres saber si en un audio hay <b>perros ladrando, música o lluvia</b>. Tarea:', opts: ['Reconocimiento de voz (ASR)', 'Clasificación de audio (p. ej. AST entrenado en AudioSet)', 'Traducción', 'Síntesis de voz'], a: 1, why: 'ASR (Whisper) transcribe palabras; la clasificación de audio etiqueta sonidos.' }
      ] }
    ] },
    { title: 'Multimodal: proyecto Prisma', desc: 'Imagen + audio + texto en una sola app', lessons: [
      { id: 'ia-11', title: 'Un espacio para todo', steps: [
        { t: 'learn', h: 'Imagen y texto en el mismo mapa', body: '<p>CLIP entrena dos codificadores a la vez con 400 millones de pares imagen-texto: los de la misma pareja deben acabar cerca y los demás lejos (aprendizaje <b>contrastivo</b>).</p>', w: 'clip', goal: true },
        { t: 'mcq', q: 'Gracias a ese espacio compartido puedes clasificar imágenes en categorías que el modelo nunca vio etiquetadas. Se llama…', opts: ['Transfer learning', 'Zero-shot: comparas la imagen con textos como "una foto de un {etiqueta}"', 'Data augmentation', 'Fine-tuning'], a: 1 },
        { t: 'mcq', h: 'Fusión', q: 'Prisma analiza cada modalidad con su modelo y luego combina las conclusiones. Eso es…', opts: ['Fusión temprana (juntar datos crudos)', 'Fusión tardía (combinar salidas de modelos especializados)', 'Un solo modelo gigante', 'Ensemble de árboles'], a: 1, why: 'La fusión tardía es la forma más rápida de construir algo multimodal que funciona. Los modelos nativamente multimodales (como los LLM con visión) hacen fusión dentro de la red.' },
        { t: 'learn', h: 'La arquitectura de Prisma', body: '<pre class="code">imagen ─► CLIP zero-shot + BLIP (descripción)      ┐\naudio  ─► Whisper (transcripción) + AST (sonidos)  ├─► fusión ─► informe + ¿coinciden?\ntexto  ─► sentimiento + temas zero-shot            ┘\n                       └─ embeddings CLIP multilingües para comparar modalidades</pre><p>Cuatro hitos: entorno e imagen → audio → texto y fusión → interfaz y despliegue.</p>' }
      ] },
      { id: 'ia-12', title: 'Prisma 1: entorno e imagen', proj: true, sub: 'Hito 1 de 4', steps: [
        { t: 'code', h: 'Prepara el proyecto', blocks: [
          { text: '<p>En tu portátil (Windows): instala Python 3.11 y crea un entorno. Si no tienes GPU NVIDIA funciona igual en CPU, solo más lento.</p>', file: 'terminal', code: 'mkdir prisma && cd prisma\npython -m venv .venv\n.venv\\Scripts\\activate\npip install -r requirements.txt' },
          { file: 'requirements.txt', code: 'torch\ntransformers>=4.44,<5\nsentence-transformers>=3.0\npillow\nlibrosa\ngradio>=4.44' }
        ], checks: ['Entorno creado y dependencias instaladas', 'Repositorio <code>prisma</code> creado en GitHub con <code>.gitignore</code> de Python'] },
        { t: 'code', h: 'El módulo de visión', file: 'prisma/vision.py', code: `from functools import lru_cache
from PIL import Image
from transformers import pipeline

ETIQUETAS = ["una persona", "un animal", "comida", "un paisaje", "una ciudad",
             "un documento", "un videojuego", "pixel art"]

@lru_cache
def _clip():
    return pipeline("zero-shot-image-classification", model="openai/clip-vit-base-patch32")

@lru_cache
def _captioner():
    return pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")

def analizar_imagen(ruta: str, etiquetas=ETIQUETAS) -> dict:
    img = Image.open(ruta).convert("RGB")
    top = _clip()(img, candidate_labels=etiquetas)[:3]
    descripcion = _captioner()(img)[0]["generated_text"]
    return {"descripcion": descripcion,
            "categorias": [(r["label"], round(r["score"], 3)) for r in top]}

if __name__ == "__main__":
    import sys
    print(analizar_imagen(sys.argv[1]))`, after: '<p>Prueba: <code>python -m prisma.vision foto.jpg</code>. La primera vez descarga los modelos (~1 GB). <code>lru_cache</code> evita recargarlos en cada llamada.</p>', checks: ['Funciona con 3 fotos distintas', 'He añadido 2 etiquetas propias y comprobado que las detecta'] },
        { t: 'mcq', q: 'BLIP genera la descripción en inglés. ¿Cómo la tendrías en español sin entrenar nada?', opts: ['Imposible', 'Encadenar un modelo de traducción (pipeline "translation" con Helsinki-NLP/opus-mt-en-es)', 'Cambiar el idioma del sistema', 'Usar otra foto'], a: 1, why: 'Componer modelos especializados es la idea clave de este proyecto.' }
      ] },
      { id: 'ia-13', title: 'Prisma 2: audio', proj: true, sub: 'Hito 2 de 4', steps: [
        { t: 'code', h: 'El módulo de audio', file: 'prisma/audio.py', code: `from functools import lru_cache
import librosa
from transformers import pipeline

SR = 16_000

@lru_cache
def _asr():
    return pipeline("automatic-speech-recognition", model="openai/whisper-small", chunk_length_s=30)

@lru_cache
def _sonidos():
    return pipeline("audio-classification", model="MIT/ast-finetuned-audioset-10-10-0.4593")

def analizar_audio(ruta: str) -> dict:
    onda, _ = librosa.load(ruta, sr=SR, mono=True)        # remuestrea a 16 kHz
    texto = _asr()({"raw": onda, "sampling_rate": SR},
                   generate_kwargs={"language": "spanish", "task": "transcribe"})["text"]
    sonidos = _sonidos()({"raw": onda, "sampling_rate": SR}, top_k=3)
    return {"transcripcion": texto.strip(),
            "sonidos": [(s["label"], round(s["score"], 3)) for s in sonidos],
            "duracion_s": round(len(onda) / SR, 1)}`, checks: ['Transcribe una nota de voz mía de 20 s', 'Detecta "Music" en un trozo de canción', 'He medido cuánto tarda en CPU y lo he apuntado en el README'] },
        { t: 'mcq', q: '¿Por qué <code>chunk_length_s=30</code>?', opts: ['Para que suene mejor', 'Whisper procesa ventanas de 30 s; así se pueden transcribir audios largos troceándolos', 'Para limitar a 30 s', 'Lo exige librosa'], a: 1 },
        { t: 'mcq', q: 'Whisper-small va lento en tu portátil. Primera optimización razonable:', opts: ['Usar whisper-large', 'Probar whisper-base o distil-whisper, o usar GPU / faster-whisper', 'Subir la temperatura', 'Grabar a 44,1 kHz'], a: 1, why: 'Siempre hay un compromiso entre tamaño, calidad y latencia.' }
      ] },
      { id: 'ia-14', title: 'Prisma 3: texto y fusión', proj: true, sub: 'Hito 3 de 4', steps: [
        { t: 'code', h: 'Texto y comparación entre modalidades', blocks: [
          { file: 'prisma/texto.py', code: `from functools import lru_cache
from transformers import pipeline

TEMAS = ["deporte", "tecnología", "comida", "viajes", "música", "trabajo", "videojuegos"]

@lru_cache
def _sent():
    return pipeline("text-classification", model="cardiffnlp/twitter-xlm-roberta-base-sentiment")

@lru_cache
def _zs():
    return pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli")

def analizar_texto(texto: str) -> dict:
    s = _sent()(texto[:2000])[0]
    t = _zs()(texto, candidate_labels=TEMAS, hypothesis_template="Este texto trata sobre {}.")
    return {"sentimiento": (s["label"], round(s["score"], 3)),
            "temas": list(zip(t["labels"][:3], [round(x, 3) for x in t["scores"][:3]]))}` },
          { file: 'prisma/fusion.py', code: `from functools import lru_cache
from PIL import Image
from sentence_transformers import SentenceTransformer, util

@lru_cache
def _modelos():
    img = SentenceTransformer("clip-ViT-B-32")                                   # imágenes
    txt = SentenceTransformer("sentence-transformers/clip-ViT-B-32-multilingual-v1")  # textos (50+ idiomas), mismo espacio
    return img, txt

def coherencia(ruta_img: str, textos: list[str]) -> list[tuple[str, float]]:
    """¿Encaja la imagen con lo que se dice? Similitud coseno en el espacio CLIP."""
    m_img, m_txt = _modelos()
    e_img = m_img.encode(Image.open(ruta_img).convert("RGB"), convert_to_tensor=True)
    e_txt = m_txt.encode(textos, convert_to_tensor=True)
    sims = util.cos_sim(e_img, e_txt)[0].tolist()
    return sorted(zip(textos, [round(s, 3) for s in sims]), key=lambda x: -x[1])

def informe(img=None, audio=None, texto=None) -> dict:
    from .vision import analizar_imagen
    from .audio import analizar_audio
    from .texto import analizar_texto
    r = {}
    if img: r["imagen"] = analizar_imagen(img)
    if audio: r["audio"] = analizar_audio(audio)
    if texto: r["texto"] = analizar_texto(texto)
    frases = [x for x in [texto, r.get("audio", {}).get("transcripcion")] if x]
    if img and frases:
        r["coherencia"] = coherencia(img, frases)
    return r` }
        ], checks: ['<code>informe(img=..., audio=..., texto=...)</code> devuelve las tres secciones', 'La coherencia es alta con una foto de comida + "qué buena pinta tiene esta pizza" y baja con un texto que no encaja', 'He añadido tests con pytest para <code>analizar_texto</code>'] },
        { t: 'mcq', q: '¿Por qué dos modelos (<code>clip-ViT-B-32</code> y su versión multilingüe)?', opts: ['Por velocidad', 'El codificador de texto multilingüe fue entrenado para imitar al de CLIP, así que sus vectores caen en el mismo espacio que las imágenes, pero entiende español', 'Uno es para audio', 'Es un error'], a: 1, why: 'Destilación: el modelo multilingüe aprendió a producir los mismos vectores que el original para frases traducidas.' }
      ] },
      { id: 'ia-15', title: 'Prisma 4: interfaz y despliegue', proj: true, sub: 'Hito 4 de 4', steps: [
        { t: 'code', h: 'Interfaz con Gradio', file: 'app.py', code: `import gradio as gr
from prisma.fusion import informe

def analizar(img, audio, texto):
    if not (img or audio or (texto and texto.strip())):
        raise gr.Error("Sube al menos una imagen, un audio o un texto.")
    return informe(img=img, audio=audio, texto=texto or None)

demo = gr.Interface(
    fn=analizar,
    inputs=[gr.Image(type="filepath", label="Imagen"),
            gr.Audio(type="filepath", label="Audio (voz, música, ruido…)"),
            gr.Textbox(lines=3, label="Texto")],
    outputs=gr.JSON(label="Informe de Prisma"),
    title="Prisma — IA multimodal",
    description="Describe imágenes, transcribe y clasifica audio, analiza texto y comprueba si todo encaja.",
)

if __name__ == "__main__":
    demo.launch()`, checks: ['<code>python app.py</code> abre la interfaz en localhost:7860', 'He probado las tres entradas a la vez'] },
        { t: 'code', h: 'Publícalo gratis en Hugging Face Spaces', blocks: [
          { text: '<ol><li>Crea una cuenta en huggingface.co → <b>New Space</b> → SDK <b>Gradio</b>, hardware CPU básico (gratis).</li><li>Sube <code>app.py</code>, la carpeta <code>prisma/</code> y <code>requirements.txt</code> (o enlaza tu repo de GitHub).</li><li>Espera a que construya y comparte la URL.</li></ol><div class="note">En CPU gratuita usa <code>whisper-base</code> para que no tarde demasiado.</div>' }
        ], checks: ['Mi Space es público y funciona', 'El README de GitHub tiene: demo (URL), arquitectura, modelos usados, limitaciones y capturas'] },
        { t: 'mcq', q: 'Siguiente mejora con más impacto para tu portfolio:', opts: ['Cambiar el color de la interfaz', 'Medir: un pequeño conjunto de prueba propio y una tabla de aciertos por módulo', 'Añadir más emojis', 'Usar modelos más grandes sin medir'], a: 1, why: 'Lo que distingue un proyecto serio de un tutorial copiado es la evaluación.' }
      ] },
      { id: 'ia-16', title: 'Evaluación final', cert: true, sub: 'Validación de la ruta', steps: [
        { t: 'mcq', q: 'Tu pérdida de entrenamiento baja y la de validación empieza a subir. ¿Qué haces?', opts: ['Entrenar más épocas', 'Parar antes (early stopping), más datos/augmentation o regularización', 'Subir la tasa de aprendizaje', 'Quitar el conjunto de validación'], a: 1 },
        { t: 'mcq', q: 'Clasificar 3 tipos de tornillo con 40 fotos por clase:', opts: ['Entrenar un transformer desde cero', 'Transfer learning desde un modelo preentrenado', 'Regresión lineal sobre píxeles', 'Un LLM de texto'], a: 1 },
        { t: 'clickline', q: 'Este bucle no aprende nada: la pérdida no baja. ¿Qué línea es el problema?', code: 'for x, y in loader:\n    logits = model(x)\n    loss = loss_fn(logits, y)\n    loss.backward()\n    optimizer.zero_grad()\n    optimizer.step()', a: 4, why: '<code>zero_grad()</code> después de <code>backward()</code> borra los gradientes recién calculados, así que <code>step()</code> no mueve nada. Va al principio del bucle.' },
        { t: 'mcq', q: 'Buscar en tu galería "atardecer en la playa" sin etiquetas previas. Herramienta:', opts: ['Whisper', 'Embeddings de CLIP + similitud coseno', 'Sentimiento', 'MNIST'], a: 1 },
        { t: 'mcq', q: 'Entrada de Whisper:', opts: ['Texto', 'Espectrograma log-mel de audio a 16 kHz', 'Imagen RGB 224×224', 'Tokens BPE'], a: 1 },
        { t: 'mcq', q: 'Softmax de los logits <code>[2, 2, 2]</code>:', opts: ['[1, 0, 0]', '[0.33, 0.33, 0.33]', '[2, 2, 2]', '[0.5, 0.25, 0.25]'], a: 1, why: 'Logits iguales → probabilidades iguales.' }
      ] }
    ] }
  ]
});
